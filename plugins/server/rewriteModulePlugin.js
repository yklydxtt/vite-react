const {readBody,rewriteImports}=require('./utils');


module.exports=function({app,root}){
    app.use(async (ctx,next)=>{
        await next();

        if (ctx.url === '/index.html') {
            const html = await readBody(ctx.body)
            ctx.body = html.replace(
              /(<script\b[^>]*>)([\s\S]*?)<\/script>/gm,
              (_, openTag, script) => {
                return `${openTag}${rewriteImports(script)}</script>`
              }
            )
          }

        if(ctx.body&&ctx.response.is('js')){
            const content=await readBody(ctx.body);
            ctx.body=rewriteImports(content,ctx.path);
        }
    });
}
