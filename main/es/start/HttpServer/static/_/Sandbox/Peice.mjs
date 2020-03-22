import doe from         '../lib/doe/main/doe.mjs'
import element from     './element.mjs'
function drawPeice(){
    let context=this._context
    context.fillStyle=element[this._color].color
    context.beginPath()
    context.arc(17,17,element[this._color].radius,0,2*Math.PI)
    context.fill()
    if(this._highlighted){
        context.strokeStyle='#3bf'
        context.lineWidth=2
        context.beginPath()
        context.arc(17,17,element[this._color].radius+1,0,2*Math.PI)
        context.closePath()
        context.stroke()
    }else if(this._color=='placeholder'){
        context.strokeStyle='#666'
        context.lineWidth=2
        context.beginPath()
        context.arc(17,17,element[this._color].radius+1,0,2*Math.PI)
        context.closePath()
        context.stroke()
    }
}
function redraw(){
    let context=this.node.getContext('2d')
    context.clearRect(0,0,34,34)
    drawPeice.call(this)
}
function Peice(color){
    this._color=color
    this._highlighted=0
    this.node=doe.canvas({width:34,height:34})
    this._context=this.node.getContext('2d')
    drawPeice.call(this)
}
Peice.prototype.highlight=function(){
    this._highlighted=1
    redraw.call(this)
}
Peice.prototype.unhighlight=function(){
    this._highlighted=0
    redraw.call(this)
}
export default Peice
