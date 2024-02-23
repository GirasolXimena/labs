import gsap from 'gsap';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

let audioEl: undefined | HTMLAudioElement;
let audioAnalyzer: undefined | AudioMotionAnalyzer;
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
    console.log('new audio')
    audioEl = new Audio
    audioEl.setAttribute("src", "assets/audio.mp3")
    audioAnalyzer = new AudioMotionAnalyzer(undefined, {
      source: audioEl,
      bgAlpha: 0,
      overlay: true,
      showScaleX: false,
      mode: 10,
      showPeaks: false,
      // peakLine: true,
      fillAlpha: 0,
      lineWidth: 5,
      reflexAlpha: 1,
      reflexRatio: 0.5,
      reflexBright: 1,
      smoothing: 0.5,
      height: 100
    })

    audioAnalyzer.registerGradient( 'myGradient', {
      bgColor: '#011a35', // background color (optional) - defaults to '#111'
      dir: 'h',           // add this property to create a horizontal gradient (optional)
      colorStops: [       // list your gradient colors in this array (at least one color is required)
          '#9E4244',
          '#FE7F9C',
          '#FDA4BA',
          '#FCBACB'
      ]
  });

  audioAnalyzer.gradient = 'myGradient'
  }



  const isUnplayed = isNaN(audioEl.duration)
  const isPaused = !!audioEl.duration && audioEl.paused

  if(isUnplayed || isPaused) {
    audioEl.play()
  } else {
    audioEl.pause()
  }
}

const handleMouse = ({ clientX }) => {
  const cartesianX = gsap.utils.interpolate(0.5, 1, clientX / window.innerWidth)
  const currentTimeScale = gsap.globalTimeline.timeScale()

  if(currentTimeScale < cartesianX) {
    gsap.globalTimeline.timeScale(currentTimeScale + 0.1)
  } else if (currentTimeScale > cartesianX){ 
    gsap.globalTimeline.timeScale(currentTimeScale - 0.1)

  }
  if(audioEl) {
    audioEl.playbackRate = cartesianX
  }
}

document.addEventListener('mousemove', handleMouse, false)
document.addEventListener('click', handleClick, false)