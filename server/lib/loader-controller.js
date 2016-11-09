/**
 * Created by galen on 16/11/9.
 */

import path from 'path';
import Debug from 'debug';


const debug = new Debug('memo:lib:loader-controller');

export default function () {
    debug('========== loading controller: start ===========');

    const ctrlPath = path.resolve(__dirname, '../controllers');
}
