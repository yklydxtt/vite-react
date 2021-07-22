const {readBody,rewriteImports}=require('./utils');


module.exports=function({app}){
    app.use(async (ctx,next)=>{
        await next();
        if (ctx.url === '/') {
            const html = await readBody(ctx.body);
            ctx.body = html.replace(
              /(<script\b[^>]*>)([\s\S]*?)<\/script>/gm,
              (_, openTag, script) => {
                return `${openTag}import "/__hmrClient"\n${rewriteImports(script)}</script>`
              }
            )
          }

        if(ctx.body&&ctx.response.is('js')){
            const content=await readBody(ctx.body);
            ctx.body=rewriteImports(content,ctx.path);
        }

        if(ctx.type==='text/css'){
          ctx.type='js';
          const code=await readBody(ctx.body);
          ctx.body=`
          const style=document.createElement('style');
          style.type='text/css';
          style.innerHTML=${JSON.stringify(code)};
          document.head.appendChild(style)
          `
        }
    });
}
