const { createReadStream } = require('fs');
const { Readable } = require('stream');
const { rewriteImports, resolveModule } = require('./utils');


module.exports = function ({ app, root }) {
  app.use(async (ctx, next) => {
    await next();
    const moduleReg = /^\/__module\//;
    if (moduleReg.test(ctx.path)) {
      const id = ctx.path.replace(moduleReg, '');
      ctx.type = 'js';
      const modulePath = resolveModule(root, id);
      if (id.endsWith('.js')) {
        ctx.body = createReadStream(modulePath);
        return;
      } else {
        ctx.body = createReadStream(modulePath);
        return;
      }
    }
  });
}