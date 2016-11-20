/**
 * Created by galen on 16/11/9.
 */

export async function index(ctx, next) {
    //ctx.body = {index: 'controller index'};
    return ctx.render('index', {engine: 'doT', pkg: 'koa2-dot'});
}

