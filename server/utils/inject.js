/**
 * Created by galen on 16/11/14.
 */

import is from 'is-type-of';

/**
 * 在对象注入属性
 * @param obj
 * @param properties
 * @param result
 * @returns {Error}
 */
export default function inject(obj, properties, result) {

    if (!is.object(obj)) {
        return new Error('obj is required and should be object');
    }

    if (!properties || properties.length === 0) {
        return;
    }

    const property = properties.shift();

    if (properties.length === 0) {
        obj[property] = result;
        return;
    }

    is.object(obj[property]) || (obj[property] = {});

    inject(obj[property], properties, result);
}
