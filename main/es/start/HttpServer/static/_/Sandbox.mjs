import doe from         './lib/doe/main/doe.mjs'
function Sandbox(){
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
        let
            x=~~(e.offsetX/30),y=~~(e.offsetY/30),
            xr=e.offsetX%30,yr=e.offsetY%30
        if(
            (xr-15)**2+(yr-15)**2<=15**2
        ){
            context.fillStyle='rgba(0,0,0,.5)'
            context.beginPath();
            context.arc(30*x+15,30*y+15,15,0,2*Math.PI)
            context.fill()
        }
    }
    canvas.onmouseleave=e=>{
        drawBoard(context)
    }
    this.node=canvas
}
Sandbox.style=`
    .sandbox{
        display:inline-block;
    }
`
export default Sandbox
