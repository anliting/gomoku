import doe from         './lib/doe/main/doe.mjs'
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
    for(let x=0;x<15;x++)
    for(let y=0;y<15;y++)
    if(this._status.board[x][y]){
        context.fillStyle=this._status.board[x][y]=='black'?
            'rgba(0,0,0,1)'
        :
            'rgba(255,255,255,1)'
        context.beginPath();
        context.arc(30*x+15,30*y+15,15,0,2*Math.PI)
        context.fill()
    }
}
function getCoordinate(e){
    let
        x=~~(e.offsetX/30),y=~~(e.offsetY/30),
        xr=e.offsetX%30,yr=e.offsetY%30
    if(
        (xr-15)**2+(yr-15)**2<=15**2
    )
        return[x,y]
}
function Sandbox(){
    this._status={
        board:{},
        object:'black',
    }
    for(let i=0;i<15;i++){
        this._status.board[i]={}
        for(let j=0;j<15;j++)
            this._status.board[i][j]=0
    }
    let canvas
    this.node=doe.div(
        {className:'sandbox'},
        canvas=doe.canvas(
            {width:450,height:450}
        )
    )
    let context=canvas.getContext('2d')
    drawBoard.call(this,context)
    canvas.onmousemove=e=>{
        drawBoard.call(this,context)
        let coordinate
        if(coordinate=getCoordinate(e)){
            let[x,y]=coordinate
            context.fillStyle=this._status.object=='black'?
                'rgba(0,0,0,.5)'
            :
                'rgba(255,255,255,.5)'
            context.beginPath();
            context.arc(30*x+15,30*y+15,15,0,2*Math.PI)
            context.fill()
        }
    }
    canvas.onmouseleave=e=>{
        drawBoard.call(this,context)
    }
    canvas.onclick=e=>{
        let coordinate
        if(coordinate=getCoordinate(e)){
            let[x,y]=coordinate
            this._status.board[x][y]=this._status.object
        }
        drawBoard.call(this,context)
    }
}
Sandbox.style=`
    .sandbox{
        display:inline-block;
    }
`
export default Sandbox
