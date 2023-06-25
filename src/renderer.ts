
function draw(ctx: CanvasRenderingContext2D) {
    drawGrid(ctx)
}

function drawGrid(ctx: CanvasRenderingContext2D) : void {
    const col = large ? xSmall : xLarge
    const row = large ? ySmall : yLarge
    const size = large ? 25 : 13
    ctx.lineWidth = 2
    ctx.strokeStyle = 'green'
    ctx.beginPath()

    for (let i = 1; i < col; i++) {
        const y = size * i
        ctx.moveTo(0, y)
        ctx.lineTo(cWidth, y)
    }
    for (let i = 1; i < row; i++) {
        const x = size * i
        ctx.moveTo(x, 0)
        ctx.lineTo(x, cHeight)
    }
    ctx.stroke()
}