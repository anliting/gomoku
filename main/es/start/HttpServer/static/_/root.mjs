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
    .sandbox{
        text-align:center;
    }
`))
let canvas
let sandbox=doe.div(
    {className:'sandbox'},
    canvas=doe.canvas(
        {width:450,height:450}
    )
)
let context=canvas.getContext('2d')
drawBoard(context)
function drawBoard(context){
    context.lineWidth=2
    context.fillStyle='#888'
    context.fillRect(0,0,450,450)
    for(let i=0;i<15;i++){
        context.beginPath()
        context.moveTo(i*30+15,15-1)
        context.lineTo(i*30+15,14*30+15+1)
        context.closePath()
        context.stroke()
        context.beginPath()
        context.moveTo(15-1,i*30+15)
        context.lineTo(14*30+15+1,i*30+15)
        context.closePath()
        context.stroke()
    }
}
canvas.onmousemove=e=>{
    drawBoard(context)
    let x=~~(e.offsetX/30),y=~~(e.offsetY/30)
    if(
        5<=e.offsetX%30&&e.offsetX%30<=25&&
        5<=e.offsetY%30&&e.offsetY%30<=25
    ){
        context.fillStyle='rgba(0,0,0,.5)'
        context.beginPath();
        context.arc(30*x+15,30*y+15,15,0,2*Math.PI)
        context.fill()
    }
}
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
