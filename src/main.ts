//standard resolution
const sWidth = 1920
const sHeight = 1080
//size of the canvas
const cWidth = 1560
const cHeight = 975
let large = false
let running = false
const speed = [50, 100, 250, 500, 1000]
let speedIdx = 2
const xSmall = cHeight / 25
const ySmall = cWidth / 25
const xLarge = cHeight / 13
const yLarge = cWidth / 13

const stepper = document.querySelector('#step') as HTMLButtonElement
const starter = document.querySelector('#starter') as HTMLButtonElement
const speeder = document.querySelector('#speed') as HTMLButtonElement
const sizer = document.querySelector('#size') as HTMLButtonElement
const canvas = document.querySelector('#cv') as HTMLCanvasElement
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
    let scaleFactor: number
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

stepper.addEventListener('click', () => {if (!running) anum()})
starter.addEventListener('click', () => {
  if (running) {
    starter.innerHTML = 'Stop'
  } else {
    starter.innerHTML = 'Start'
  }
  running = !running
})
speeder.addEventListener('click', () => {++speedIdx; speedIdx %= speed.length})
sizer.addEventListener('click', () => {large = !large})

let arr = createNArr(0, xLarge, yLarge)
let barr = createNArr(0, xLarge, yLarge)

function anum() {
  const tarr = arr
  arr = update(arr, barr)
  barr = tarr
  ctx.lineTo(800,800)
  ctx.stroke()
  draw(ctx)
  if (running) {
    setTimeout(anum, speed[speedIdx])
  }
}