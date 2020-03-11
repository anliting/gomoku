import https from   'https'
function httpsGet(url,agent){
    return new Promise((rs,rj)=>{
        https.get(url,{agent},rs).once('error',rj).end()
    })
}
export default httpsGet
