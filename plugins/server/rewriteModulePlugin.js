const {readBody,rewriteImports}=require('./utils');
const {parse} =require('es-module-lexer');
const MagicString=require('magic-string');


module.exports=function({app,root}){
    app.use(async (ctx,next)=>{
        await next();

        // const moduleReg=/^\/__module\//;
        // if(moduleReg.test(ctx.path)){

        // }
        if(ctx.body&&ctx.response.is('js')){
            const content=await readBody(ctx.body);
            ctx.body=rewriteImports(content,ctx.path);
        }
    });
}