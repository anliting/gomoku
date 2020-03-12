import doe from         './lib/doe/main/doe.mjs'
function drawBoard(context){
    context.lineWidth=2
    context.fillStyle='#888'
    context.fillRect(0,0,450,450)
    context.fillStyle='#000'
    for(let i=0;i<15;i++){
        context.fillRect(i*30+15-1,15-1,2,30*14+2)
        context.fillRect(15-1,i*30+15-1,30*14+2,2)
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
function drawPeice(context){
    context.fillStyle=this._color=='black'?
        'rgba(0,0,0,1)'
    :
        'rgba(255,255,255,1)'
    context.beginPath();
    context.arc(17,17,15,0,2*Math.PI)
    context.fill()
}
function drawHighlight(context){
    context.strokeStyle='#3bf'
    context.lineWidth=2
    context.beginPath();
    context.arc(17,17,16,0,2*Math.PI)
    context.closePath();
    context.stroke()
}
function Peice(color){
    this._color=color
    this.node=doe.canvas({width:34,height:34})
    let context=this.node.getContext('2d')
    drawPeice.call(this,context)
}
Peice.prototype.highlight=function(){
    let context=this.node.getContext('2d')
    context.clearRect(0,0,34,34)
    drawPeice.call(this,context)
    drawHighlight.call(this,context)
}
Peice.prototype.unhighlight=function(){
    let context=this.node.getContext('2d')
    context.clearRect(0,0,34,34)
    drawPeice.call(this,context)
}
function setObject(object){
    this._ui[this._status.object].unhighlight()
    this._status.object=object
    this._ui[this._status.object].highlight()
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
    this._ui={
        black:new Peice('black'),
        white:new Peice('white'),
    }
    this._ui.black.highlight()
    this._ui.black.node.onclick=e=>{
        setObject.call(this,'black')
    }
    this._ui.white.node.onclick=e=>{
        setObject.call(this,'white')
    }
    let canvas
    this.node=doe.div(
        {className:'sandbox'},
        doe.div(
            {className:'left'},
            this._ui.black.node,
            ' ',
            this._ui.white.node
        ),
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
        position:relative;
        width:850px;
        height:450px;
    }
    .sandbox>.left{
        position:absolute;
        left:0;
        width:200px;
        padding-top:40px;
    }
    .sandbox>canvas{
        position:absolute;
        left:200px;
    }
`
export default Sandbox
