/**
 * Created by galen on 16/11/17.
 */

/**
 * Cache store
 * @type {{cache: {}, get: cache.get, set: cache.set, clear: cache.clear}}
 */
const cache = {
    cache: {},
    get: function (key) {
        return this.cache[key];
    },
    set: function (key, value) {
        this.cache[key] = value;
    },
    clear: function () {
        this.cache = {};
    }
};


/**
 * Retrieves a template given a filename.
 * Uses cache for optimization of  (if options.cache is true)
 * If callback is passed, it will be called asynchronously
 * @param {String} filename - The path to the template
 * @param {Object} model - The option sent by express
 * @param {Function} [callback] - (Optional) The async node style callback
 */
export function getTemplate(filename, model, callback) {

}
