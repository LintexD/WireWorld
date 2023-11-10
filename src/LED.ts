
/* Steine.W = 1; Steine[1] = 'W'; Steine['W'] = 1;*/

import { Board, SteinT, Vec2 } from "./bausteine"

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


