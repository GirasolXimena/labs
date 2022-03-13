const canvas = document.createElement("canvas");
let flip
let bandArray = []
const onReady = () => {
  const ctx = canvas.getContext("2d");
  const hero = document.getElementById('hero')

  const setWidth = () => {
    const { height, width } = document.body.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  }
  setWidth()
  const animationDuration = Number(getComputedStyle(document.documentElement).getPropertyValue('--animation-duration').replace(/[^0-9]/g, ''))
  document.body.appendChild(canvas);

  class Band {
    constructor(drawAngle) {
      this.drawAngle = drawAngle
      this.x0 = 0
      this.y0 = 0
      this.x = canvas.width / 2;
      this.y = -canvas.height / 2;
      this.cpx = canvas.width / 4;
      this.cpy = -canvas.height / 30;
      this.r = 5;
      this.lightness = 50
      this.saturation = 100
      this.alpha = 1
      this.startAngle = 0;
      this.scale = 2
      this.endAngle = Math.PI * 2
      this.colors = ['#841911', '#327655', '#b97b28', '#b74820', '#b92840']
      this.flip = undefined
      this.baseX = canvas.width / 2
    }
    get color() {
      return this.colors[this.drawAngle % this.colors.length]
    }
    draw() {
      const { drawAngle, scale, color, x0, y0, cpx, cpy, x, y } = this
      ctx.save()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'black'
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(scale, scale);
      ctx.fillStyle = color
      ctx.rotate(Math.PI * drawAngle / 15)
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cpx, cpy, x, y);
      ctx.lineTo(x + canvas.width / 8, y);
      ctx.quadraticCurveTo(cpx + canvas.width / 8, cpy + canvas.height / 8, 0, 0);
      ctx.fill()
      ctx.stroke()
      ctx.restore()
      return { x, y }
    }
    update(progress) {
      this.x = this.baseX + (50 * progress)
    }
  }

  for (let i = 0; i < 30; i++) {
    bandArray.push(new Band(i))
    bandArray[i].draw()
  }

  setInterval(() => {
    flip = !flip
  }, animationDuration);
  const animate = (t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const progress = Math.sin(t / (animationDuration / 2) * Math.PI)

    for (let i = 0; i < bandArray.length; i++) {
      x = bandArray[i].update(progress)
      bandArray[i].draw()
    }
    requestAnimationFrame(animate)
  }
  const start = () => {
    requestAnimationFrame(animate)
    hero.className = 'hero animate'
    window.removeEventListener('click', start)
  }
  console.log('listening')
  window.addEventListener('resize', setWidth, false)
  window.addEventListener('click', start, false)
}

window.addEventListener('load', onReady, false);