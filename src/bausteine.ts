import { drawGrid } from "./renderer"

export class Vec2 {
    constructor(public x: number, public y: number) {}
}

export enum SteinT {
    X,//empty
    Q,//one field, not changing
    L,//one field
    B,//basically one field
    W,//two fields
    R,
    r,
}

const steinColors = [
    '#0000',
    '#79C753',
    '#006E51',
    '#0072B5',
    '#EDF1FF',
    '#CD212A',
    '#af1d24'
]
const stateColors = ['#343148', '#FFD662']
const outlineCol = '#282D3C'

export class Board {
    stateField: boolean[][]
    Lamps: Vec2[] = []
    LEDs: Vec2[] = []

    
    //asserts that typeField is correct/valid
    constructor(
        public typeField: SteinT[][]
    ) {
        this.stateField = Array.from({ length: typeField.length }).map(e => e = Array.from({ length: typeField[0].length }).map(ee => ee = false))
        for (let i = 0; i < typeField.length; i++) {
            for (let j = 0; j < typeField[0].length; j++) {
                const e = typeField[i][j]
                if (e == SteinT.Q) this.Lamps.push(new Vec2(i, j))
                if (e == SteinT.L) this.LEDs.push(new Vec2(i, j))
            }
        }
        this.process()
    }

    isEmpty(c: Vec2) : boolean {return this.typeField[c.x][c.y] == SteinT.X}

    draw(ctx: CanvasRenderingContext2D, cW: number, cH: number) {
        ctx.clearRect(0, 0, cW, cH)
        //const xS = cW / this.typeField[0].length
        //const yS = cH / this.typeField.length
        const size = Math.min(cW / this.typeField[0].length, cH / this.typeField.length) //always fits, alway quad
        drawGrid(ctx, size * this.typeField[0].length, size * this.typeField.length, this.typeField[0].length, this.typeField.length)
        //cells
        for (let i = 0; i < this.typeField.length; i++) {
            for (let j = 0; j < this.typeField[i].length; j++) {
                //test
                const t = this.typeField[i][j]
                if (t == SteinT.X) continue

                ctx.fillStyle = steinColors[t]
                ctx.fillRect(size * j, size * i, size, size)

                //states
                if (t >= SteinT.L && t <= SteinT.R) {
                    //draw in
                    let color = stateColors[0]
                    if (this.stateField[i - 1][j]) color = stateColors[1]
                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.arc(size * (j + 0.5), size * i, size * 0.25, 0, Math.PI)
                    ctx.fill()
                }
                if (t == SteinT.Q || t >= SteinT.B) {
                    //draw out
                    let color = stateColors[0]
                    if (this.stateField[i][j]) color = stateColors[1]
                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.moveTo(size * (j + 0.25), size * (i + 1))
                    ctx.lineTo(size * (j + 0.5), size * (i + 0.6))
                    ctx.lineTo(size * (j + 0.75), size * (i + 1))
                    ctx.closePath()
                    ctx.fill()
                }
            }
        }
        
        //outlines, we need to do another iteration for these lol
        for (let i = 0; i < this.typeField.length; i++) {
            let skip = false
            for (let j = 0; j < this.typeField[i].length; j++) {
                //test
                const t = this.typeField[i][j]
                if (t == SteinT.X) continue
                if (skip) {
                    skip = false
                    continue
                }
                ctx.lineWidth = 3
                ctx.strokeStyle = outlineCol
                ctx.beginPath()
                if (t <= SteinT.L) {
                    ctx.rect(size * j, size * i, size, size)
                } else {
                    ctx.rect(size * j, size * i, size * 2, size)
                    skip = true
                }
                ctx.stroke()
            }
        }
    }

    //asserts that c is in bounds
    place(t: SteinT, c: Vec2) : boolean {
        if (!this.isEmpty(c) || (c.x == 0 && t <= SteinT.Q) || (c.x >= this.typeField.length && t !== SteinT.L)) return false
        if (t >= SteinT.B && (c.y === this.typeField[0].length - 1 || !this.isEmpty(new Vec2(c.x, c.y + 1)))) return false
        this.typeField[c.x][c.y] = t
        if (t >= SteinT.B) {
            let w = t
            if (t == SteinT.r) w = SteinT.R
            if (t == SteinT.R) w = SteinT.r
            this.typeField[c.x][c.y + 1] = w
        }
        this.process()
        return true
    }

    del(c: Vec2) : void {
        const e = this.typeField[c.x][c.y]
        this.typeField[c.x][c.y] = SteinT.X
        this.stateField[c.x][c.y] = false
        if (e > SteinT.L) {
            //TODO: Make traceback and look if even to the left so this really works
            this.typeField[c.x][c.y + 1] = SteinT.X
            this.stateField[c.x][c.y + 1] = false
        }
        this.process()
    }

    toggle(c: Vec2) : void {
        const e = this.typeField[c.x][c.y]
        if (e === SteinT.Q) this.stateField[c.x][c.y] = !this.stateField[c.x][c.y]
        this.process()
    }

    getStateArr() : [string[], boolean[][]] {
        let strings: string[] = []
        let states: boolean[][] = []
        const n = this.Lamps.length
        const m = this.LEDs.length
        const max = 1 << n
        //init strings
        this.Lamps.forEach((_,i) => strings.push("Q" + (i + 1).toString()))
        this.LEDs.forEach((_,i) => strings.push("L" + (i + 1).toString()))
        //init states
        for (let i = 0; i < max; i++) {
            //init lamps
            states.push([])
            let ii = i
            for (let j = 0; j < n; j++) {
                const b = ii % 2 != 0
                ii >>= 1
                states[i].push(b)
                const c = this.Lamps[n - j - 1]
                this.stateField[c.x][c.y] = b
            }
            states[i].reverse()
            this.process()
            //write down led states
            for (let j = 0; j < m; j++) {
                const c = this.LEDs[j]
                states[i].push(this.stateField[c.x][c.y])
            }
        }
        return [strings, states]
    }

    process() {
        for (let i = 0; i < this.typeField.length; i++) {
            for (let j = 0; j < this.typeField[0].length; j++) {
                const e = this.typeField[i][j]
                if (e <= SteinT.Q) continue
                if (e <= SteinT.B) {
                    this.stateField[i][j] = this.stateField[i - 1][j]
                    continue
                }
                if (e == SteinT.W) {
                    let q = false
                    if (!this.stateField[i - 1][j] || !this.stateField[i - 1][j + 1]) q = true
                    this.stateField[i][j] = q
                    this.stateField[i][j + 1] = q
                } else {
                    let ri = false
                    if (e == SteinT.R) ri = !this.stateField[i - 1][j]; else ri = !this.stateField[i - 1][j + 1]
                    this.stateField[i][j] = ri
                    this.stateField[i][j + 1] = ri
                }
                j++
            }
        }
    }
}