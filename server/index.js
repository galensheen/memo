/**
 * Created by galen on 16/11/9.
 */

import Memo from './lib/Memo';4

const app = new Memo();

app.use(async (ctx, next) => {
    ctx.body = {test: 'Just a test!'};
});

app.listen(3000, function () {
    console.log('listen on port: 3000');
});
