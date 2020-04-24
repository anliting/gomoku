import doe from         './lib/doe/main/doe.mjs'
import Sandbox from     './Sandbox.mjs'
doe.body(1,document.getElementsByTagName('script')[0])
doe.head(doe.style(`
    html{
        height:100%;
    }
    body{
        background-color:#888;
        font-family:sans-serif;
        font-size:16px;
        line-height:1.2;
    }
    a{
        color:unset;
        text-decoration:unset;
    }
    #main{
        color:white;
        text-shadow:
            0 0 .05em rgba(0,0,0,.4),
            .05em .05em .05em rgba(0,0,0,.2);
        text-align:center;
    }
    #main>.sandbox{
        text-align:left;
    }
    #main>.bottom{
        text-align:right;
    }
    ${Sandbox.style}
`))
let sandbox=new Sandbox
doe.body(
    doe.div(
        {id:'main'},
        sandbox.node,
        doe.div(
            {className:'bottom'},
            doe.a(
                {href:'https://anliting.com/'},
                '丁安立 2020-04-03 沙盤'
            ),
        )
    )
)
let dpr=1,f=()=>{
    requestAnimationFrame(f)
    if(dpr!=devicePixelRatio)
        sandbox.devicePixelRatio=dpr=devicePixelRatio
}
requestAnimationFrame(f)
