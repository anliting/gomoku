import doe from             './lib/doe/main/doe.mjs'
function upload(){
    return new Promise(rs=>{
        let a=doe.input({
            type:'file',
            onchange(){
                doe.body(1,a)
                rs(a.files[0])
            }
        })
        a.click()
        a.style.display='none'
        doe.body(a)
    })
}
function download(href,download){
    let a=doe.a({
        href,
        download,
    })
    a.click()
    a.style.display='none'
    doe.body(a)
    setTimeout(()=>doe.body(1,a))
}
export default{
    upload,
    download,
}
