/**
 * Created by galen on 16/11/17.
 */

import path from 'path';
import {getTemplate} from './core';

export default class DotDef {

    /**
     * @constructor
     * @param options
     */
    constructor(options) {
        this.options = options;
        this.dirname = options.dirname;
        this.model = options;
    }

    /**
     * partial函数用来include其他文件
     * @param includePath
     */
    partial(includePath) {
        let template = getTemplate(path.join(this.dirname || this.model.settings.views, includePath), this.model);
        return template.render({model: this.model, isPartial: true});
    }
}
