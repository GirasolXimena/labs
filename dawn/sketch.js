function getSize() {
  const { height, width } = document.body.getBoundingClientRect()
  return Math.min(height, width) * 0.75

}

function preload() {
  myFont = loadFont('fonts/Geoma.otf')
}

function setup() {
  const canvasSize = getSize()
  const canvas = createCanvas(canvasSize, canvasSize)
  canvas.parent('body')
  noLoop()
}

function draw() {
  const margin = height / 20
  const r = margin
  noStroke();
  fill('orangered');
  rect(0, 0, width, height / 2)
  noFill();
  stroke('white')
  stroke('white')
  line(margin, height / 2, margin, margin + r / 2)
  line(margin + r / 2, margin, width - margin - r / 2, margin)
  arc(margin + r / 2, margin + r / 2, r, r, Math.PI, 1.5 * Math.PI)
  arc(width - margin - r / 2, margin + r / 2, r, r, 1.5 * Math.PI, 0)
  line(width - margin, height / 2, width - margin, margin + r / 2)

  noStroke()
  fill('black')
  rect(0, height / 2, width, height / 2)
  fill('white')
  for (let i = 0; i < 500; i++) {
    const randomY = random(width / 2, width)
    const randomX = random(width)
    const brightness = random(200, 1000)
    const starWidth = random(0, 3)
    const starHeight = random(0, 3)
    fill(255, 255, 255, brightness)
    arc(randomX, randomY, starWidth, starHeight, 0, 2 * TAU)
  }
  for (let i = 0; i <= 32; i++) {
    const beamWidth = random(20, 40)
    const beamHeight = random(height / 8, height / 2)
    push()
    translate(width / 2, height / 2)
    noStroke()
    rotate(i * PI / 32)
    fill('white')
    for (let j = 1; j <= beamWidth; j += 3) {
      const alpha = j / beamWidth * 255 / 2
      console.log('a', alpha)
      let from = color(255, 69, 0, alpha);
      let to = color(255, 255, 0, alpha);
      fill(from)
      arc(beamHeight - beamHeight / 2, 0, beamHeight - j * 2, beamWidth - j, 0, TAU)
    }

    pop()

  }
  for (let i = 0; i <= 32; i++) {
    const beamWidth = random(5, 10)
    const beamHeight = random(height / 16, height / 3)
    push()
    translate(width / 2, height / 2)
    noStroke()
    rotate(i * PI / 32)
    fill('white')
    for (let j = 1; j <= beamWidth; j += 3) {
      const alpha = j / beamWidth * 255 / 2
      console.log('a', alpha)
      let from = color(255, 69, 0, alpha);
      let to = color(255, 255, 0, alpha);
      fill(to)
      arc(0, 0, 2, beamHeight, 0, TAU)

      // }
    }

    pop()

  }
  for (let i = 10; i > 0; i--) {
    const alpha = (10 - i) / 10 * 25
    // console.log(alpha)
    push()
    let from = color(255, 255, 0, alpha);
    let to = color(255, 255, 255, alpha);
    fill(from)
    arc(width / 2, height / 2, width - width / 10, i * 2, 0, TAU)
    fill(to)
    arc(width / 2, height / 2, width - width / 10, i * 1.5, 0, TAU)
    pop();


  }

  let sun = width / 12
  for (let i = sun; i > 0; i--) {
    const alpha = Math.ceil((sun - i) / (sun) * 255) + 1
    let from = color(255, 255, 0, alpha / 256);
    let to = color(255, 255, 255, alpha);
    let interA = lerpColor(to, from, i / sun);
    fill(interA)
    arc(width / 2, height / 2, i, i, 0, TAU)
  }

  textFont(myFont);
  textSize(width / 16);
  text('dawn', margin * 1.5, height / 2 - height / 16);
  text('FM', margin * 1.5, height / 2 - height / 64);
}

function windowResized() {
  const canvasSize = getSize()
  resizeCanvas(canvasSize, canvasSize)
}