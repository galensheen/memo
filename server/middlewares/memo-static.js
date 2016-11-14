/**
 * Created by galen on 16/11/15.
 */

import serve from 'koa-static2';
import compose from 'koa-compose';
import convert from 'koa-convert';
import * as me from '../utils';

/**
 * 静态文件服务
 * @param config
 */
export default function static2(config = {}) {

    if (!me.isArray(config.serves) || config.serves.length === 0) {
        return;
    }

    let serves = [];

    config.serves.forEach(s => {
        serves.push(convert(serve(s.route, s.path)));
    });

    //return compose(serves);
}
