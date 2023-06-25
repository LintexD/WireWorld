import { draw } from "./renderer"
import { createNArr, update, mapArray } from './wireWorld';

//standard resolution
const sWidth = 1920
const sHeight = 1080
//size of the canvas
const cWidth = 1560
const cHeight = 975
let running = false
const speed = [1000, 500, 250, 100, 50]
let speedIdx = 2
const scale = [65, 39, 15]
let scaleIdx = 1
let state = 3
let arr = createNArr(0, cHeight / scale[scaleIdx], cWidth / scale[scaleIdx])
let barr = createNArr(0, cHeight / scale[scaleIdx], cWidth / scale[scaleIdx])
let timeoutID: number

const stepper = document.querySelector('#step') as HTMLButtonElement
const starter = document.querySelector('#starter') as HTMLButtonElement
const speeder = document.querySelector('#speed') as HTMLButtonElement
const sizer = document.querySelector('#size') as HTMLDivElement
const reset = document.querySelector('#reset') as HTMLDivElement
const filler = document.querySelector('#fill') as HTMLDivElement
const canvas = document.querySelector('#cv') as HTMLCanvasElement
const body = document.querySelector('body') as HTMLBodyElement
canvas.setAttribute('width', `${cWidth}`)
canvas.setAttribute('height', `${cHeight}`)
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
const sel = document.getElementById('sel') as HTMLButtonElement
const s0 = document.getElementById('s0') as HTMLButtonElement
const s1 = document.getElementById('s1') as HTMLButtonElement
const s2 = document.getElementById('s2') as HTMLButtonElement
const s3 = document.getElementById('s3') as HTMLButtonElement

let pendingUpdate = false;
let scaleFactor = 1
function viewportHandler() {
  if (pendingUpdate) return;
  pendingUpdate = true;
  requestAnimationFrame(() => {
    pendingUpdate = false
    let widthXOffset: number
    if (window.innerWidth / window.innerHeight <= 16 / 9) {
      scaleFactor = window.innerWidth / sWidth
      widthXOffset = 0
    } else {
      scaleFactor = window.innerHeight / sHeight
      widthXOffset = (window.innerWidth - sWidth * scaleFactor) / 2
    }
    body.style.transform = `scale(${scaleFactor})`
    body.style.left = `${-(sWidth - scaleFactor * sWidth) / 2 + widthXOffset}px`
    body.style.top = `${-(sHeight - scaleFactor * sHeight) / 2}px`
  })
}
viewportHandler()
window.visualViewport?.addEventListener('scroll', viewportHandler)
window.visualViewport?.addEventListener('resize', viewportHandler)

stepper.addEventListener('click', () => { if (!running) anum() })
function toggleStart() {
  clearTimeout(timeoutID)
  running = !running
  if (running) {
    starter.innerHTML = 'Stop'
    anum()
  } else {
    starter.innerHTML = 'Start'
  }
}
starter.addEventListener('click', toggleStart)
speeder.addEventListener('click', () => { ++speedIdx; speedIdx %= speed.length })
sizer.addEventListener('click', () => {
  ++scaleIdx
  scaleIdx %= scale.length
  arr = mapArray(arr, createNArr(0, cHeight / scale[scaleIdx], cWidth / scale[scaleIdx]))
  barr = createNArr(0, cHeight / scale[scaleIdx], cWidth / scale[scaleIdx])
  draw(ctx, cWidth, cHeight, arr)
})
reset.addEventListener('click', () => {
  clearTimeout(timeoutID)
  scaleIdx = 1
  arr = createNArr(0, cHeight / scale[scaleIdx], cWidth / scale[scaleIdx])
  barr = createNArr(0, cHeight / scale[scaleIdx], cWidth / scale[scaleIdx])
  draw(ctx, cWidth, cHeight, arr)
})
function fillAll() {arr = createNArr(state, arr.length, arr[0].length); draw(ctx, cWidth, cHeight, arr)}
filler.addEventListener('click', fillAll)
function paintEvent(ev) {
  const posX = Math.floor(ev.pageX / scaleFactor / scale[scaleIdx])
  const posY = Math.floor((ev.pageY / scaleFactor - 105) / scale[scaleIdx])
  //console.log('pos: ', posX, ' ', posY)
  paintArr(posY, posX)
}
canvas.addEventListener('mousedown', (ev) => {
paintEvent(ev)
canvas.addEventListener('mousemove', paintEvent)
})
canvas.addEventListener('mouseup', () => {canvas.removeEventListener('mousemove', paintEvent)})
canvas.addEventListener('mouseleave', () => {canvas.removeEventListener('mousemove', paintEvent)})
s0.addEventListener('click', () => {state = 0; sel.style.backgroundColor = '#fff'; sel.innerText = '0'})
s1.addEventListener('click', () => {state = 1; sel.style.backgroundColor = '#00539C'; sel.innerText = '1'})
s2.addEventListener('click', () => {state = 2; sel.style.backgroundColor = '#6F9FD8'; sel.innerText = '2'})
s3.addEventListener('click', () => {state = 3; sel.style.backgroundColor = '#DD4124'; sel.innerText = '3'})
window.addEventListener('keydown', (ev) => {
  const keyCode = ev.code
  if (keyCode === "Digit0" || keyCode === "KeyQ") {state = 0; sel.style.backgroundColor = '#fff'; sel.innerText = '0'}
  else if (keyCode === "Digit1") {state = 1; sel.style.backgroundColor = '#00539C'; sel.innerText = '1'}
  else if (keyCode === "Digit2") {state = 2; sel.style.backgroundColor = '#6F9FD8'; sel.innerText = '2'}
  else if (keyCode === "Digit3") {state = 3; sel.style.backgroundColor = '#DD4124'; sel.innerText = '3'}
  else if (keyCode === "Space") toggleStart()
  else if (keyCode === "KeyS") {if (!running) anum()}
  else if (keyCode === "KeyF") fillAll()
})

function paintArr(x: number, y: number) {
  if (x >= arr.length || x < 0 || y >= arr[0].length || y < 0) return
  arr[x][y] = state
  window.requestAnimationFrame(() => {draw(ctx, cWidth, cHeight, arr)})
}

function anum() {
  if (running) {
    timeoutID = setTimeout(anum, speed[speedIdx])
  }
  const tmp = arr
  arr = update(arr, barr)
  barr = tmp
  draw(ctx, cWidth, cHeight, arr)
}
draw(ctx, cWidth, cHeight, arr)