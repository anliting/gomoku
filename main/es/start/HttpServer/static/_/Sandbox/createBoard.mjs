import doe from         '../lib/doe/main/doe.mjs'
import element from     './element.mjs'
function drawBoard(){
    let context=this._do.boardCanvasContext
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
        context.fillStyle=element[this._status.board[x][y][0]].color
        context.beginPath()
        context.arc(
            30*x+15,30*y+15,element[this._status.board[x][y][0]].radius,
            0,2*Math.PI
        )
        context.fill()
        if(this._status.board[x][y][1]){
            context.fillStyle=
                element[this._status.board[x][y][0]].textColor
            context.font=`15px sans-serif`
            context.textAlign='center'
            context.textBaseline='middle'
            context.fillText(this._status.board[x][y][1],30*x+15,30*y+15)
        }
    }
    if(
        this._status.mouseBoard[0]=='in'&&
        this._status.object
    ){
        let cursor
        if(this._status.mouseBoard[1]=='cursor')
            cursor=this._status.cursor
        else if(this._status.mouseBoard[1]=='put')
            cursor=this._status.previousCursor
        if(cursor){
            let[x,y]=cursor
            if(this._status.object&&!this._status.board[x][y]){
                context.fillStyle=
                    element[this._status.object].transparentColor
                context.beginPath()
                context.arc(
                    30*x+15,30*y+15,element[this._status.object].radius,
                    0,2*Math.PI
                )
                context.fill()
            }
        }
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
function coordinateEqual(a,b){
    return a&&b&&a[0]==b[0]&&a[1]==b[1]
}
function createBoard(){
    let div,canvas
    div=doe.div({className:'board'},
        canvas=doe.canvas(
            {width:450,height:450}
        )
    )
    this._do.boardCanvasContext=canvas.getContext('2d')
    drawBoard.call(this)
    canvas.oncontextmenu=e=>{
        e.preventDefault()
    }
    canvas.onmouseenter=e=>{
        if(this._status.object){
            this._status.mouseBoard=['in']
            this._status.cursor=getCoordinate(e)
            if(!this._status.text){
                this._status.mouseBoard[1]='cursor'
                drawBoard.call(this)
            }
        }
    }
    canvas.onmouseleave=e=>{
        if(this._status.object){
            this._status.mouseBoard=[]
            drawBoard.call(this)
        }
    }
    canvas.onmousemove=e=>{
        if(this._status.object){
            this._status.cursor=getCoordinate(e)
            drawBoard.call(this)
        }
    }
    canvas.onmousedown=e=>{
        if(this._status.object){
            if(this._status.mouseBoard[1]=='cursor')
                if(e.button==0){
                    this._status.previousCursor=this._status.cursor
                    this._status.mouseBoard[1]='put'
                    if(this._status.cursor){
                        let[x,y]=this._status.cursor
                        if(this._status.board[x][y])
                            this._status.mouseBoard[1]='textClick'
                    }
                    drawBoard.call(this)
                }else if(e.button==2){
                    this._status.previousCursor=this._status.cursor
                    this._status.mouseBoard[1]='cut'
                    drawBoard.call(this)
                }
        }
    }
    canvas.onmouseup=e=>{
        if(this._status.object){
            let change
            if(this._status.mouseBoard[1]=='put'&&e.button==0){
                if(coordinateEqual(
                    this._status.previousCursor,
                    this._status.cursor
                )){
                    let[x,y]=this._status.cursor
                    if(!this._status.board[x][y])
                        this._status.board[x][y]=[this._status.object]
                }
                this._status.mouseBoard.pop()
                change=1
            }
            if(this._status.mouseBoard[1]=='cut'&&e.button==2){
                if(coordinateEqual(
                    this._status.previousCursor,
                    this._status.cursor
                )){
                    let[x,y]=this._status.cursor
                    this._status.board[x][y]=0
                }
                this._status.mouseBoard.pop()
            }
            if(this._status.mouseBoard[1]=='textClick'&&e.button==0){
                if(coordinateEqual(
                    this._status.previousCursor,
                    this._status.cursor
                )){
                    let[x,y]=this._status.cursor
                    this._status.mouseBoard.pop()
                    this._status.text=1
                    let input
                    let f=()=>{
                        this._status.text=0
                        this._status.board[x][y][1]=input.value
                        doe(div,1,input)
                        if(this._status.mouseBoard[0]=='in')
                            this._status.mouseBoard[1]='cursor'
                        drawBoard.call(this)
                    }
                    doe(div,
                        input=doe.textarea({
                            className:'input',
                            maxLength:2,
                            value:this._status.board[x][y][1]||'',
                            onblur(){
                                f()
                            },
                            onkeydown(e){
                                if(e.key=='Enter')
                                    f()
                            },
                        },n=>{doe(n.style,{
                            left:`${30*x}px`,
                            top:`${30*y}px`,
                            color:element[this._status.board[x][y][0]].
                                textColor,
                        })}),
                    )
                    this._status.board[x][y][1]=''
                    input.focus()
                }
                this._status.mouseBoard.pop()
            }
            if(!this._status.mouseBoard[1]&&!this._status.text){
                this._status.mouseBoard[1]='cursor'
                change=1
            }
            if(change)
                drawBoard.call(this)
        }
    }
    return div
}
export default createBoard
