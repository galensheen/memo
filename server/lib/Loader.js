/**
 * Created by galen on 16/11/9.
 */

import path from 'path';

const pkg = require('../../package.json');
import loaderConfig from './loader-config';
import loaderMdw from './loader-middleware';

export default class Loader {

    /**
     * @constructor
     */
    constructor() {

        this.appDir = path.resolve(__dirname, '../../');
        this.config = {};
        this.appInfo = {};
        this.middleware = [];

        this.loadAppInfo();
        this.loadConfig();
        this.loadMiddleware();
    }

    /**
     * 载入app信息
     */
    loadAppInfo() {
        this.appInfo = {
            name: pkg.name,
            description: pkg.description,
            appDir: path.resolve(__dirname, '../../'),
            version: pkg.version,
            keywords: pkg.keywords ? pkg.keywords.join(',') : ''
        }
    }

    /**
     * 加载配置文件
     */
    loadConfig() {
        this.config = loaderConfig(this.appInfo);
    }

    /**
     * 加载中间件
     */
    loadMiddleware() {
        this.middleware = [].concat(loaderMdw(this.config));
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