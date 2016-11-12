/**
 * Created by galen on 16/11/9.
 */

import fs from 'fs';
import assert from 'assert';
import delegate from 'delegates';
import Koa from 'koa';
import Debug from 'debug';

import Loader from './Loader';

const debug = new Debug('memo:lib:memo');

/**
 * 扩展Koa对象，可以在此处添加订制化的功能
 */
export default class Memo extends Koa {

    /**
     * @constructor
     * @param {Object} options - 创建app的配置
     */
    constructor(options = {}) {

        options.baseDir = options.baseDir || process.cwd();
        assert(typeof options.baseDir === 'string', 'options.baseDir is required and must be a string');
        assert(fs.existsSync(options.baseDir), `options.baseDir ${options.baseDir} not exists`);
        assert(fs.statSync(options.baseDir).isDirectory(), `options.baseDir ${options.baseDir} is not a directory`);
        debug(`baseDir is: ${options.baseDir}`);

        super();

        this.loader = new Loader();

        this.middleware = [].concat(this.loader.getMiddleware());

        // 将loader的方法代理到app上
        delegate(this, 'loader')
            .method('getConfig')
            .method('getMiddleware')
            .getter('config')
            .getter('appInfo');
    }
}
