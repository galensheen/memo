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

        super();

        this.loader = new Loader(this);

        // 将loader的方法代理到app上
        delegate(this, 'loader')
            .method('getConfig')
            .getter('config')
            .getter('appInfo');

        this.init();
    }

    init() {
        this.loader.init();
    }
}
