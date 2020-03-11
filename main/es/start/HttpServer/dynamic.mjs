import link from'./dynamic/link.mjs'
let rootMap=new WeakMap
async function root(stream){
    if(!rootMap.has(this))
        rootMap.set(this,{})
    let doc=rootMap.get(this)
    if(!doc.content)
        doc.content=(async()=>
        `<!doctype html>
<title>五子棋</title>
<body>${
    `<script type=module src=/_/root.mjs></script>`
    /*`<script type=module>${
        await link(`${this._mainDir}/start/HttpServer/static/_/root.mjs`)
    }</script>`*/
}`
    )()
    let content=await doc.content
    if(stream.closed)
        return
    stream.stream.respond({
        ':status':200,
        'content-type':'text/html;charset=utf-8'
    })
    stream.stream.end(content)
}
export default{
    '/':        root,
}
