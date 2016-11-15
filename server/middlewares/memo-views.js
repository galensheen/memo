/**
 * Created by galen on 16/11/15.
 */

import assert from 'assert';
import views from 'koa-views';
import dot from 'dot';

/**
 * 封装koa-views中间件
 * @param config
 */
export default function memo_views(config = {}) {
    dot.templateSettings = {
        evaluate: /\[\[([\s\S]+?)]]/g,
        interpolate: /\[\[=([\s\S]+?)]]/g,
        encode: /\[\[!([\s\S]+?)]]/g,
        use: /\[\[#([\s\S]+?)]]/g,
        define: /\[\[##\s*([\w\.$]+)\s*(:|=)([\s\S]+?)#]]/g,
        conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*]]/g,
        iterate: /\[\[~\s*(?:]]|([\s\S]+?)\s*:\s*([\w$]+)\s*(?::\s*([\w$]+))?\s*]])/g,
        varname: 'layout, partial, locals, model',
        strip: false,
        append: true,
        selfcontained: false
    };
    assert(!!config.root, 'views中间参数path不能为空！');
    return views(config.root, config.options);
}
