import doe from         './lib/doe/main/doe.mjs'
doe.body(1,document.getElementsByTagName('script')[0])
doe.head(doe.style(`
    html{
        height:100%;
    }
    body{
        background-color:#888;
        font-family:sans-serif;
        font-size:16px;
        line-height:1.2em;
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
    }
    #main>.bottom{
        text-align:right;
    }
`))
let sandbox=doe.div(
    doe.canvas(
        {width:480,height:480}
    )
)
doe.body(
    doe.div(
        {id:'main'},
        sandbox,
        doe.div(
            {className:'bottom'},
            doe.a({href:'https://anliting.com/'},'丁安立')
        )
    )
)
