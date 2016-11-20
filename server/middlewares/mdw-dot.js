/**
 * Created by galen on 16/11/20.
 */

import * as doT from 'koa2-dot';


/**
 * 封装koa2-dot中间件
 * @param {Object} options
 * @param {Object} config - Optional
 * @returns {Function}
 */
export default function mdw_dot(options, config) {

    const app = config.app || {};
    const timestamp = Date.now();

    /**
     * javascript file helper
     */
    doT.helper.jsPathHelper = function (path) {
        path = `${path}?version=${app.version}&timestamp=${timestamp}`;
        return `<script src="${path}"></script>`;
    };

    /**
     * css file helper
     */
    doT.helper.cssPathHelper = function (path) {
        path = `${path}?version=${app.version}&timestamp=${timestamp}`;
        return `<link rel="stylesheet" href="${path}" />`
    };

    return doT.views(options);
}