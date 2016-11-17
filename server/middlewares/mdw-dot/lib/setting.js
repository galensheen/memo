/**
 * Created by galen on 16/11/17.
 */

const setting = {
    config: /^---([\s\S]+?)---/g,
    comment: /<!--([\s\S]+?)-->/g,
    header: '',

    stripComment: false,
    stripWhitespace: false, // shortcut to dot.strip

    dot: {
        evaluate: /\[\[([\s\S]+?)]]/g,
        interpolate: /\[\[=([\s\S]+?)]]/g,
        encode: /\[\[\[([\s\S]+?)]]]/g,
        use: /\[\[#([\s\S]+?)]]/g,
        define: /\[\[##\s*([\w.$]+)\s*(:|=)([\s\S]+?)##]]/g,
        conditional: /\[\[\?(\?)?\s*([\s\S]*?)\s*]]/g,
        iterate: /\[\[~\s*(?:]]|([\s\S]+?)\s*:\s*([\w$]+)\s*(?::\s*([\w$]+))?\s*]])/g,
        varname: 'layout, partial, locals, model',
        strip: false,
        append: true,
        selfcontained: false
    }
};


export default setting;
