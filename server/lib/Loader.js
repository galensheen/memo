/**
 * Created by galen on 16/11/9.
 */

import loaderConfig from './loader-config';
import loaderMdw from './loader-middleware';

export default class Loader {

    /**
     * @constructor
     */
    constructor() {
        this.config = {};
        this.middleware = [];

        this.loadConfig();
        this.loadMiddleware();
    }

    /**
     * 加载配置文件
     */
    loadConfig() {
        this.config = loaderConfig();
    }

    /**
     * 加载中间件
     */
    loadMiddleware() {
        this.middleware = [].concat(loaderMdw(this.config.middlewares));
    }

    /**
     *  获取配置
     * @param {string?} key - 配置参数的key
     * @returns {*}
     */
    getConfig(key) {
        if (key) {
            return this.config[key];
        }
        return this.config;
    }

    /**
     * 获取中间件list
     * @returns {Array.<*>|*|Array}
     */
    getMiddleware() {
        return this.middleware;
    }
}
