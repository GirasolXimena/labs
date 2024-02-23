import gsap from 'gsap';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

let audioEl: undefined | HTMLAudioElement = undefined
gsap.to(".ofelia-running", {
  duration: 0.5,
  objectPosition: "-228px center",
  ease: "steps(3)",
  repeat: -1
})

gsap.to("body", {
  duration: 8,
  backgroundPositionX: "-788px",
  ease: "linear",
  repeat: -1
})
const handleClick = (e: Event) => {
  if(!audioEl) {
    audioEl = new Audio
  }
  audioEl.src = ""
}

const handleMouse = ({ clientX }) => {
  const cartesianX = gsap.utils.clamp(0.15, 1, clientX / window.innerWidth)
  const currentTimeScale = gsap.globalTimeline.timeScale()
  console.log({
    currentTimeScale,cartesianX
  })
  if(currentTimeScale < cartesianX) {
    console.log('going up')
    gsap.globalTimeline.timeScale(currentTimeScale + 0.1)
  } else if (currentTimeScale > cartesianX){ 
    gsap.globalTimeline.timeScale(currentTimeScale - 0.1)

  }
}

document.addEventListener('mousemove', handleMouse, false)