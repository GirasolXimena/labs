import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';


const audioEl = document.getElementById('audio')
const audioMotion = new AudioMotionAnalyzer(
  document.getElementById('container'), {
    canvas: document.getElementById('canvas'),
    source: document.getElementById('audio'),
    showScaleX: false,
    mode: 10,
    // reflexRatio: 0.1,
    // reflaxAlpha: 1,
    // reflexBright: 1,
    gradient: 'orangered'
  }
)

const onClick = (e) => {
  console.log('click', audioEl.paused, audioEl.currentTime)
  if (audioEl.paused && !audioEl.ended) {
    audioEl.play();
} else {
    audioEl.pause();
}
}

document.addEventListener('click', onClick, false)