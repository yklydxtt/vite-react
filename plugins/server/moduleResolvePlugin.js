const { createReadStream } = require('fs');
const { Readable } = require('stream');
const { rewriteImports, resolveModule, rewriteModlueImports } = require('./utils');


module.exports = function ({ app, root }) {
  app.use(async (ctx, next) => {
    await next();

    if (ctx.url === '/index.html') {
      const html = await readStream(ctx.body)
      ctx.body = html.replace(
        /(<script\b[^>]*>)([\s\S]*?)<\/script>/gm,
        (_, openTag, script) => {
          return `${openTag}${rewriteImports(script)}</script>`
        }
      )
    }
    if (ctx.response.is('js') && !ctx.path.startsWith(`/__`)) {
      ctx.body = rewriteImports(
        await readStream(ctx.body)
      );
    }
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

async function readStream(stream) {
  if (stream instanceof Readable) {
    return new Promise((resolve, reject) => {
      let res = ''
      stream
        .on('data', (chunk) => (res += chunk))
        .on('error', reject)
        .on('end', () => {
          resolve(res)
        })
    })
  } else {
    return stream
  }
}