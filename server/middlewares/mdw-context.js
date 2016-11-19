/**
 * Created by galen on 16/11/15.
 */

import extend from 'extend';

/**
 * 用来扩展上下文context
 * @param options
 */
export default function mdw_context(options = {}) {

    return async function context(ctx, next) {
        /**
         * 扩展ctx.render，默认包含appInfo的信息
         */
        const render = ctx.render;
        ctx.render = function (relPath, model = {}) {
            // 将应用信息绑定app, 方便在模板中渲染
            let app = ctx.config.app;
            return render.apply(ctx, [relPath, model, app]);
        };

        /**
         * 扩展ctx.renderString，默认包含appInfo的信息
         */
        const renderString = ctx.renderString;
        ctx.renderString = function (str, model = {}) {
            // 将应用信息绑定app, 方便在模板中渲染
            let app = ctx.config.app;
            return renderString.apply(ctx, [str, model, app]);
        };

        /**
         * 扩展ctx.getHtmlByFile，默认包含appInfo的信息
         */
        const getHtmlByFile = ctx.getHtmlByFile;
        ctx.getHtmlByFile = function (relPath, model = {}) {
            // 将应用信息绑定app, 方便在模板中渲染
            let app = ctx.config.app;
            return getHtmlByFile.apply(ctx, [relPath, model, app]);
        };

        /**
         * 扩展ctx.getHtmlByString，默认包含appInfo的信息
         */
        const getHtmlByString = ctx.getHtmlByString;
        ctx.getHtmlByString = function (str, model = {}) {
            // 将应用信息绑定app, 方便在模板中渲染
            let app = ctx.config.app;
            return getHtmlByString.apply(ctx, [str, model, app]);
        };

        /**
         * 封装restful的成功方法，返回success: true, code: 200
         */
        ctx.success = function (body = {}) {
            extend(body, {success: true, code: 200});
            return ctx.body = body;
        };

        /**
         * 封装restful的失败风发，返回success: false, code: 500
         */
        ctx.fail = function (body = {}) {
            extend(body, {success: false, code: 500});
            return ctx.body = body;
        };

        await next();
    }
}
