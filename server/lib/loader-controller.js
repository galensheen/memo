/**
 * Created by galen on 16/11/9.
 */

import path from 'path';
import Debug from 'debug';
import assert from 'assert';
import * as fs from 'fs';

import globby from 'globby';

import inject from '../utils/inject';

const debug = new Debug('memo:lib:loader-controller');


export default function (appDir) {
    debug('========== loading controller: start ===========');

    // 解析controllers的绝对路径
    const controllerDir = path.resolve(appDir, 'server/controllers');
    assert(fs.existsSync(controllerDir), 'server/controllers不存在');

    let controllers = {};

    let files = globby.sync('**/*.js', {cwd: controllerDir});

    const reg = /^[a-z][\.a-z0-9_-]*$/i;

    files.forEach(name => {
        const file = path.resolve(controllerDir, name);

        debug(`LoadFiles => [${name}]: will load`);
        let result = require(file);

        let properties = name.replace(/\.js$/, '')
            .split('/')
            .map(property => {
                if (!reg.test(property)) {
                    throw new Error(`${property} does not match ${reg} in ${name}`);
                }
                return property.replace(/[_-][a-z]/ig, function (s) {
                    return s.substring(1).toUpperCase();
                });
            });

        if (properties && properties.length) {
            inject(controllers, properties, result);
        }
        debug(`LoadFiles => [${name}]: load success`);
    });


    debug('========== loading controller: end ===========');
    return controllers;
}
