/**
 * Created by galen on 16/11/20.
 */

/**
 * index controller
 */
export async function tutorial(ctx, next) {
    return ctx.render('docs/rxjs/tutorial');
}


export async function overview(ctx, next) {
    return ctx.render('docs/rxjs/overview');
}