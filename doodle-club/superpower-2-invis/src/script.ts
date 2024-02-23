// import gsap from 'gsap';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

let audioEl: undefined | HTMLAudioElement;
let audioAnalyzer: undefined | AudioMotionAnalyzer;
const canvasEl = document.getElementById('canvas') as HTMLCanvasElement


const handleClick = (e: Event) => {
  if(!audioEl) {
    console.log('new audio')
    audioEl = new Audio
    audioEl.crossOrigin = ""
    audioEl.setAttribute("src", "https://assets.codepen.io/3862739/invisible.mp3")
    audioAnalyzer = new AudioMotionAnalyzer(undefined, {
      canvas: canvasEl,
      source: audioEl,
      bgAlpha: 0,
      overlay: true,
      showScaleX: false,
      mode: 10,
      showPeaks: false,
      fillAlpha: 0,
      lineWidth: 5,
      reflexAlpha: 1,
      reflexRatio: 0.5,
      reflexBright: 1,
      smoothing: 0.5,
    })

    audioAnalyzer.registerGradient( 'myGradient', {
      bgColor: '#011a35', // background color (optional) - defaults to '#111'
      dir: 'h',           // add this property to create a horizontal gradient (optional)
      colorStops: [  
          'black',     // list your gradient colors in this array (at least one color is required)
          'cyan',
          'white',
          '#FE7F9C',
          'darkCyan',
          'cyan',
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

document.addEventListener('click', handleClick, false)