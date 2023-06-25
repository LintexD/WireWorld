/* eslint-disable no-empty */
/* eslint-disable space-before-blocks */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
import {Point} from './point'
import {Shape} from './shape'

export class Grid extends Shape {
	constructor(
		readonly n : number,
		readonly center : Point,
		readonly sizeX : number,
		readonly sizeY : number,
		public lineWidth : number,
	) {
		super()
	}


	draw(ctx : CanvasRenderingContext2D) : void {
		ctx.lineWidth = this.lineWidth
        const tmpX = this.sizeX * 0.5
		const tmpY = this.sizeY * 0.5
		ctx.strokeStyle = 'green'
        ctx.strokeRect(this.center.x - tmpX, this.center.y - tmpY, this.sizeX, this.sizeY)
        ctx.beginPath()
        for (let i = 1; i < this.n; i++) {
            const x = this.center.x - tmpX
            const y = this.center.y - tmpY + this.sizeY / this.n * i
            ctx.moveTo(x, y)
            ctx.lineTo(x + this.sizeX, y)
        }
        for (let i = 1; i < this.n; i++) {
            const x = this.center.x - tmpX + this.sizeX / this.n * i
            const y = this.center.y - tmpY
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + this.sizeY)
        }
        ctx.stroke()
	}

	isInside(x : number, y : number) : boolean {
		const tmpX = this.sizeX * 0.5
		const tmpY = this.sizeY * 0.5
		if (x < this.center.x - tmpX) return false
		if (x > this.center.x + tmpX) return false
		if (y < this.center.y - tmpY) return false
		if (y > this.center.y + tmpY) return false
		return true
	}
}