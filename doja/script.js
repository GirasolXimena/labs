const canvas = document.createElement("canvas");
let bandArray = []
const setWidth = () => {
  const { height, width } = document.body.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  return { height, width }

}
const onReady = () => {
  const ctx = canvas.getContext("2d");

  const { height, width } = setWidth();
  document.body.appendChild(canvas);

  class Band {
    constructor(drawAngle) {
      this.drawAngle = drawAngle
      this.x0 = 0
      this.y0 = 0
      this.x = width / 2;
      this.y = -height / 2;
      this.cpx = width / 4;
      this.cpy = -height / 30;
      this.r = 5;
      this.lightness = 50
      this.saturation = 100
      this.alpha = 1
      this.startAngle = 0;
      this.scale = 2
      this.endAngle = Math.PI * 2
      this.colors = ['#841911', '#327655', '#b97b28', '#b74820', '#b92840']
      this.flip = undefined
    }
    get color() {
      return this.colors[this.drawAngle % this.colors.length]
    }
    draw() {
      const { drawAngle, scale, color, x0, y0, cpx, cpy, x, y } = this
      ctx.save()
      ctx.lineWidth = 1
      ctx.strokeStyle = 'black'
      ctx.translate(width / 2, height / 2)
      ctx.scale(scale, scale);
      ctx.fillStyle = color
      ctx.rotate(Math.PI * drawAngle / 15)
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cpx, cpy, x, y);
      ctx.lineTo(x + width / 8, y);
      ctx.quadraticCurveTo(cpx + width / 8, cpy + height / 8, 0, 0);
      ctx.fill()
      ctx.stroke()
      ctx.restore()
      return { x, y }
    }
    update(val) {
      const { flip, x, y } = this
      const animationOffset = 50
      const baseX = width / 2
      if (x <= baseX + animationOffset && !flip) {
        this.x += 1
        this.y += 1
      } else if (x > baseX + animationOffset) {
        this.flip = true
      }
      if (this.x >= baseX - animationOffset && flip) {
        this.x -= 1
        this.y -= 1
      } else if (x < baseX - animationOffset) {
        this.flip = false
      }
    }
  }

  for (let i = 0; i < 30; i++) {
    bandArray.push(new Band(i))
    bandArray[i].draw()
  }
  const animate = () => {
    ctx.clearRect(0, 0, width, height)
    for (let i = 0; i < 30; i++) {
      bandArray[i].update(i)
      bandArray[i].draw()
    }
    requestAnimationFrame(animate)
  }
  // requestAnimationFrame(animate)

  // Start and end points
  // ctx.fillStyle = 'blue';
  // ctx.beginPath();
  // ctx.arc(x0, y0, r, startAngle, endAngle);   // Start point
  // ctx.arc(x, y, r, startAngle, endAngle);  // End point
  // ctx.fill();

  // Control point
  // ctx.fillStyle = 'red';
  // ctx.beginPath();
  // ctx.arc(cpx, cpy, r, startAngle, endAngle);
  // ctx.fill();
}

window.addEventListener('load', onReady, false);
window.addEventListener('resize', setWidth, false)