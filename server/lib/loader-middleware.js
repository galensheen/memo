/**
 * Created by galen on 16/11/9.
 */

import path from 'path';
import assert from 'assert';

import Debug from 'debug';
import is from 'is-type-of';

const debug = new Debug('memo:lib:loader-middleware');

/**
 * 加载中间件
 * @param mdwConfig
 * @returns {Array}
 */
export default function (mdwConfig = {}) {
    debug(`=============== loading middleware: start ===============`);

    const mdwPath = path.resolve(__dirname, '../middlewares');

    let mdws = [];
    let middlewares = [];

    // 将中间件配置推入到数组
    for (let foo of Object.keys(mdwConfig)) {
        let mdw = mdwConfig[foo];
        mdw.name = `memo-${foo}`;
        mdws.push(mdw);
    }

    // 根据中间件配置的index进行中间件排序
    mdws = mdws.sort((foo, bar) => {
        return foo.index < bar.index ? -1 : foo.index === bar.index ? 0 : 1;
    });

    for (let mdw of mdws) {
        debug(`loading middleware ${mdw.name}`);
        let derive = require(`${mdwPath}/${mdw.name}`);
        assert(is.function(derive), `failed to load middleware ${mdw.name}, which must be a function`);
        let action = derive.apply(null, mdw.config);
        assert(is.function(action), `failed to load middleware ${mdw.name}, which should return a function`);
        middlewares.push(action);
    }

    debug(`=============== loading middleware: end ===============`);
    return middlewares;
};