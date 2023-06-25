//standard resolution
const sWidth = 1920
const sHeight = 1080
//size of the canvas
const cWidth = 1560
const cHeight = 975

const canvas = document.querySelector('#canvas-background') as HTMLCanvasElement
const body = document.querySelector('body') as HTMLBodyElement
canvas.setAttribute('width', `${cWidth}`)
canvas.setAttribute('height', `${cHeight}`)
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

let pendingUpdate = false;
function viewportHandler() {
  if (pendingUpdate) return;
  pendingUpdate = true;
  requestAnimationFrame(() => {
      pendingUpdate = false
      let scaleFactor : number
      let widthXOffset : number
      if (window.innerWidth / window.innerHeight <= 16/9) {
          scaleFactor = window.innerWidth / sWidth
          widthXOffset = 0
      } else {
          scaleFactor = window.innerHeight / sHeight
          widthXOffset = (window.innerWidth - sWidth * scaleFactor) / 2
      }
      body.style.transform = `scale(${scaleFactor})`
      body.style.left = `${-(sWidth - scaleFactor * sWidth)/2 + widthXOffset}px`
      body.style.top = `${-(sHeight - scaleFactor * sHeight)/2}px`
  })
}
viewportHandler()
window.visualViewport?.addEventListener('scroll', viewportHandler)
window.visualViewport?.addEventListener('resize', viewportHandler)




function createnArr(n = 0, x = 20, y = 20): number[][] {
  return Array.from({length: x}).map(e => e = Array.from({length: y}).map(ee => ee = n))
}
function arrFromString(str: string): number[][] {
  str = str.trim()
  const strs = str.split(`\n`)
  const x = strs.length
  const y = strs[0].length
  const arr = createnArr(0,x,y)
  for (let i = 0; i < x; i++) {
      for (let j = 0; j < y && j < strs[i].length; j++) {
          arr[i][j] = parseInt(strs[i].at(j) ?? '0')//it's probably not undefined
      }
  }
  return arr
}

function strFromArray(arr: number[][]): string {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
      str = str.concat(arr[i].join(' ')) + '\n'
  }
  return str
}

const test = `
000330000000
333033331000
000330000000
000000000000
`
console.log(test)
console.table(arrFromString(test))
/*
let arr = createnArr(3)
arr[0][0] = 2
arr[0][19] = 2
console.log(arr.at(0)?.at(0))
*/
let arr = arrFromString(test)
console.table(arr)

//0: wall; 1: will be 2; 2:will be 3; 3:will be 1 if 1|2 1 around else stays the same
function nextNum(x: number, y: number, arr: number[][]): number {
  let num = arr[x][y]
  if (num === 0) {} //do nothing
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

function update(arr: number[][]): number[][] {
  const newArr = createnArr(0,arr.length, arr[0].length)
  for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[0].length; j++) {
          let next = nextNum(i,j,arr)
          newArr[i][j] = next
      }
  }
  return newArr
}

console.log(nextNum(0,0,arr))
arr = update(arr)
console.table(arr)
function anum() {
  arr = update(arr)
  console.log(strFromArray(arr))
  setTimeout(anum, 250)
}
anum()