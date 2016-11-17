/**
 * Created by galen on 16/11/17.
 */

import path from 'path';
import * as _ from 'lodash';
import dot from 'dot';
import yaml from 'js-yaml';

import DotDef from './DotDef';
import settings from './setting';
import {getTemplate} from './core';


export default class Template{

    constructor(options) {
        this.options = options;

        // layout
        this.isLayout = !!options.config.layout;
        this.master = this.isLayout ? path.join(options.dirname, options.config.layout) : null;

        // build the doT templates
        this.templates = {};
        this.settings = _.clone(settings.dot);
        this.def = new DotDef(options);

        // view data
        this.viewData = [];
        if (_.has(options.express, 'settings') && _.has(options.express.settings, 'view data')) {
            this.settings.varname = _.reduce(
                options.express.settings['view data'],
                (result, value, key) => {
                    this.viewData.push(value);
                    return `${result}, ${key}`;
                },
                settings.dot.varname
            )
        }

        // view shortcut
        this.shortcuts = [];
        if (_.has(options.express, 'settings') && _.has(options.express.settings, 'view shortcut')) {
            this.shortcuts = options.express.settings['view shortcut'];
            this.settings.varname += ', ' + _.keys(this.shortcuts).join();
        }

        // doT template
        for (let key in options.sections) {
            if (!options.sections.hasOwnProperty(key)) {
                continue;
            }
            this.templates[key] = dot.template(options.sections[key], this.settings, this.def);
        }
    }

    /**
     * Partial method helper
     * @param {Object} layout - The layout to pass to the view
     * @param {Object} model - The model to pass to the view
     */
    createPatialHelper(layout, model) {

        return (partialPath, ...args) => {

            let template = getTemplate(path.join(this.options.dirname || this.options.express.settings.views, partialPath), this.options.express);

            if (args.length) {
                model = _.assign.apply(_, [{}, model].concat(args));
            }

            return template.render({layout: layout, model: model, isPartial: true});
        };
    }

    /**
     * Renders the template
     * If callback is passed, it will be called asynchronously
     * @param {Object} options - Options to pass to the view
     * @param {Object} [options.layout] - The layout key/value
     * @param {Object} options.model - The model to pass to the view
     * @param {Function} [callback]
     */
    render(options, callback) {
        let isAsync = callback && typeof callback === 'function';
        let layout = options.layout;
        let model = options.model;
        let layoutModel = _.merge({}, this.options.config, layout);

        for (let key in this.templates) {
            if (!this.templates.hasOwnProperty(key)) {
                continue;
            }

            try {
                let viewModel = _.union(
                    [
                        layoutModel,
                        this.createPatialHelper(layoutModel, model),
                        options.model._locals || {},
                        model
                    ],
                    this.viewData,
                    _.chain(this.shortcuts).keys().map(shortcut => {
                        return options.model._locals[this.shortcuts[shortcut]] || null;
                    }).valueOf()
                );

                layoutModel[key] = this.templates[key].apply(this.templates[key], viewModel);
            } catch (err) {
                let error = new Error(`Failed to render with doT (${this.options.filename}) - ${err.toString()}`);
                error.name = 'doTCompileError';

                if (isAsync) {
                    return callback(error);
                }

                throw error;
            }
        }

        // no layout
        if (!this.isLayout) {

            // append the header to the master page
            let result = (!options.isPartial ? settings.header: '') + layoutModel.body;

            if (isAsync) {
                callback(null, result);
            }

            return result;
        }

        // render the master sync
        if (!isAsync) {
            let masterTemplate = getTemplate(this.master, this.options.express);
            return masterTemplate.render({layout: layoutModel, model: model});
        }

        // render the master async
        getTemplate(this.master, this.options.express, function (err, masterTemplate) {
            if (err) {
                return callback(err);
            }
            return masterTemplate.render({layout: layoutModel, model: model}, callback);
        });
    }
}
