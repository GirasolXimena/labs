let currentTime = new Date()
let timeStopped = document.documentElement.dataset.timeStopped
const timeSwapEl = document.getElementById('time-swap')
const clockEl = document.getElementById('clock')

const swapTime = (stopTime) => {
  console.log({ stopTime})
  timeStopped = stopTime || !timeStopped
  document.documentElement.dataset.timeStopped = String(timeStopped)
}

const handleClick = (e) => {
  swapTime()
  const buttonString = timeStopped ? 'Start' : 'Stop'
  timeSwapEl.innerText = buttonString
}

timeSwapEl.addEventListener('click', handleClick, false)

const updateTime = (time) => {
  console.log({ currentTime, timeStopped })
  currentTime = timeStopped === true ? new Date('1995-12-31T23:59:59') : new Date()
  const timeString = currentTime.toLocaleDateString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  clockEl.innerText = timeString
}

const animate = (time) => {
  updateTime()
  requestAnimationFrame(animate)
}
swapTime(timeStopped !== "false")
animate()