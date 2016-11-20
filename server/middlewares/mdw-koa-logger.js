/**
 * Created by galen on 16/11/20.
 */

import logger from 'koa-logger';

/**
 * 封装koa-logger，仅在dev环境使用
 * @param options
 * @returns {*}
 */
export default function mdw_koa_logger(options = {}) {

    return logger(options);
}
