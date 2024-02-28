import p5 from 'p5';
import customFont from './fonts/Geoma.otf'

let myFont: p5.Font;

function getSize() {
  const { height, width } = document.body.getBoundingClientRect()
  return Math.min(height, width) * 0.75
}

export const sketch = (p: p5) =>{
  p.setup = () => {
    const canvasSize = getSize()
    const canvas = p.createCanvas(canvasSize, canvasSize)
    canvas.parent('body')
    p.noLoop()

  }
  p.preload = () => {
    myFont = p.loadFont(customFont)
  }

  p.draw = () => {
    const height = getSize()
    const width = height
    const margin = height / 20
    const r = margin
    p.noStroke();
    p.fill('orangered');
    p.rect(0, 0, width, height / 2)
    p.noFill();
    p.stroke('white')
    p.stroke('white')
    p.line(margin, height / 2, margin, margin + r / 2)
    p.line(margin + r / 2, margin, width - margin - r / 2, margin)
    p.arc(margin + r / 2, margin + r / 2, r, r, Math.PI, 1.5 * Math.PI)
    p.arc(width - margin - r / 2, margin + r / 2, r, r, 1.5 * Math.PI, 0)
    p.line(width - margin, height / 2, width - margin, margin + r / 2)
  
    p.noStroke()
    p.fill('black')
    p.rect(0, height / 2, width, height / 2)
    p.fill('white')
    for (let i = 0; i < 500; i++) {
      const randomY = p.random(width / 2, width)
      const randomX = p.random(width)
      const brightness = p.random(200, 1000)
      const starWidth = p.random(0, 3)
      const starHeight = p.random(0, 3)
      p.fill(255, 255, 255, brightness)
      p.arc(randomX, randomY, starWidth, starHeight, 0, 2 * p.TAU)
    }
    for (let i = 0; i <= 32; i++) {
      const beamWidth = p.random(20, 40)
      const beamHeight = p.random(height / 8, height / 2)
      p.push()
      p.translate(width / 2, height / 2)
      p.noStroke()
      p.rotate(i * p.PI / 32)
      p.fill('white')
      for (let j = 1; j <= beamWidth; j += 3) {
        const alpha = j / beamWidth * 255 / 2
        let from = p.color(255, 69, 0, alpha);
        let to = p.color(255, 255, 0, alpha);
        p.fill(from)
        p.arc(beamHeight - beamHeight / 2, 0, beamHeight - j * 2, beamWidth - j, 0, p.TAU)
      }
  
      p.pop()
  
    }
    for (let i = 0; i <= 32; i++) {
      const beamWidth = p.random(5, 10)
      const beamHeight = p.random(height / 16, height / 3)
      p.push()
      p.translate(width / 2, height / 2)
      p.noStroke()
      p.rotate(i * p.PI / 32)
      p.fill('white')
      for (let j = 1; j <= beamWidth; j += 3) {
        const alpha = j / beamWidth * 255 / 2
        let from = p.color(255, 69, 0, alpha);
        let to = p.color(255, 255, 0, alpha);
        p.fill(to)
        p.arc(0, 0, 2, beamHeight, 0, p.TAU)
  
        // }
      }
      p.pop()
  
    }
    for (let i = 10; i > 0; i--) {
      const alpha = (10 - i) / 10 * 25
      p.push()
      let from = p.color(255, 255, 0, alpha);
      let to = p.color(255, 255, 255, alpha);
      p.fill(from)
      p.arc(width / 2, height / 2, width - width / 10, i * 2, 0, p.TAU)
      p.fill(to)
      p.arc(width / 2, height / 2, width - width / 10, i * 1.5, 0, p.TAU)
      p.pop();
  
  
    }
  
    let sun = width / 12
    for (let i = sun; i > 0; i--) {
      const alpha = Math.ceil((sun - i) / (sun) * 255) + 1
      let from = p.color(255, 255, 0, alpha / 256);
      let to = p.color(255, 255, 255, alpha);
      let interA = p.lerpColor(to, from, i / sun);
      p.fill(interA)
      p.arc(width / 2, height / 2, i, i, 0, p.TAU)
    }
  
    p.textFont(myFont);
    p.textSize(width / 16);
    p.text('dawn', margin * 1.5, height / 2 - height / 16);
    p.text('FM', margin * 1.5, height / 2 - height / 64);
  }

  p.windowResized = () => {
    const canvasSize = getSize()
    p.resizeCanvas(canvasSize, canvasSize)
  }
}

export const myp5 = new p5(sketch, document.body)