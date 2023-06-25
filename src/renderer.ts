
export function draw(ctx: CanvasRenderingContext2D, cW: number, cH: number, arr: number[][]) {
    ctx.clearRect(0, 0, cW, cH)
    const xS = cW / arr[0].length
    const yS = cH / arr.length
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 1) {
                ctx.fillStyle = '#2031F3'
                ctx.fillRect(xS * j, yS * i, xS, yS)
            } else if (arr[i][j] === 2) {
                ctx.fillStyle = '#5289FF'
                ctx.fillRect(xS * j, yS * i, xS, yS)
            } else if (arr[i][j] === 3) {
                ctx.fillStyle = '#FF4003'
                ctx.fillRect(xS * j, yS * i, xS, yS)
            }
        }
    }
    drawGrid(ctx, cW, cH, arr[0].length, arr.length)
}

function drawGrid(ctx: CanvasRenderingContext2D, cW: number, cH: number, col: number, row: number): void {
    const xS = cH / row
    const yS = cW / col
    ctx.lineWidth = 2
    ctx.strokeStyle = 'green'
    ctx.beginPath()

    for (let i = 0; i <= row; i++) {
        const y = yS * i
        ctx.moveTo(0, y)
        ctx.lineTo(cW, y)
    }
    for (let i = 0; i <= col; i++) {
        const x = xS * i
        ctx.moveTo(x, 0)
        ctx.lineTo(x, cH)
    }
    ctx.stroke()
}