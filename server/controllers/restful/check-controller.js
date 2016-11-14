/**
 * Created by galen on 16/11/13.
 */

export async function check(ctx, next) {
    return ctx.body = {restful: 'restful.checkController.check'};
}
