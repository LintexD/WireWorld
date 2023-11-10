export function createNArr(n = 0, x = 20, y = 20): number[][] {
    return Array.from({ length: x }).map(e => e = Array.from({ length: y }).map(ee => ee = n))
}
export function arrFromString(str: string): number[][] {
    str = str.trim()
    const strs = str.split(`\n`)
    const x = strs.length
    const y = strs[0].length
    const arr = createNArr(0, x, y)
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y && j < strs[i].length; j++) {
            arr[i][j] = parseInt(strs[i].at(j) ?? '0')//it's probably not undefined
            if (arr[i][j] < 0 || arr[i][j] > 3 || Number.isNaN(arr[i][j])) arr[i][j] = 0
        }
    }
    return arr
}

export function strFromArray(arr: number[][]): string {
    let str = ''
    for (let i = 0; i < arr.length; i++) {
        str = str.concat(arr[i].join('')) + '\n'
    }
    return str
}

/**maps arr onto brr and returns it*/
export function mapArray(arr: number[][], brr:number[][]) {
    for (let i = 0; i < arr.length && i < brr.length; i++) {
        for (let j = 0; j < arr[i].length && j < brr[i].length; j++) {
            brr[i][j] = arr[i][j]
        }
    }
    return brr
}

//0: wall; 1: will be 2; 2:will be 3; 3:will be 1 if 1|2 1 around else stays the same
function nextNum(x: number, y: number, arr: number[][]): number {
    let num = arr[x][y]
    if (num === 0) { } //do nothing
    else if (num === 1) num = 2
    else if (num === 2) num = 3
    else if (num === 3) {
        let n = 0
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (arr[(i + arr.length) % arr.length][(j + arr[0].length) % arr[0].length] === 1) n++
            }
        }
        if (n === 1 || n === 2) num = 1
    } else {
        console.log("oopsie")
        num = 0
    }
    return num
}

export function update(arr: number[][], barr?: number[][]): number[][] {
    barr = barr ?? createNArr(0, arr.length, arr[0].length)
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            let next = nextNum(i, j, arr)
            barr[i][j] = next
        }
    }
    return barr
}