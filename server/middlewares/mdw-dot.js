/**
 * Created by galen on 16/11/20.
 */

import * as doT from 'koa2-dot';


/**
 * 封装koa2-dot中间件
 * @param options
 * @returns {Function}
 */
export default function mdw_dot(options = {}) {

    // custom def function for [[# def.jsPathHelper() ]]
    //doT.helper.jsPathHelper = function () {}

    return doT.views(options);
}