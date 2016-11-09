/**
 * Created by galen on 16/11/9.
 */

const path = require('path');

console.log('=======================================');
console.log(path.resolve(__dirname, './server/server.js'));

require('runkoa')(path.resolve(__dirname, './server/server.js'));