// const copies = 4;
const copies = 4;

// how close together sine waves will be
const frequency = 1 / 600;
// how tall sine waves will be
const amplitude = 1.5;
// how many times per second animation will run
const fps = 60;

let now = 0;

let canvas;
/**
 *
 * @param {CanvasRenderingContext2D} context - context
 * @param {HTMLCanvasElement} canvas - canvas
 */
function createGradients(context, canvas) {
  const { height, width } = canvas;
  const root = document.querySelector(':root')
  const style = getComputedStyle(root);

  const red = style.getPropertyValue("--red");
  const blue = style.getPropertyValue("--blue");
  const yellow = style.getPropertyValue("--yellow");


  const g1 = context.createLinearGradient(0, height / 2, width, height / 2);
  const g2 = context.createLinearGradient(0, height / 2, width, height / 2);
  const stop = 0.5;
  g1.addColorStop(0, blue);
  g1.addColorStop(stop, yellow);
  g1.addColorStop(1, red);
  g2.addColorStop(0, red);
  g2.addColorStop(stop, yellow);
  g2.addColorStop(1, blue);
  return { g1, g2 };
}

function createContextBaseProperties(context) {
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.strokeStyle = "rgba(40,40,40, 1)";
}

/**
 * 
 * @param {HTMLCanvasElement} canvas - Canvas for setting base properties
 */
function createCanvasBaseProperties(canvas) {
  // mono font each char 80 px wide
  const fontWidth = 80
  // longest line in title
  const maxChars = 9
  // 1 char width
  const margin = 1
  // const { clientWidth, clientHeight } = document.body;
  canvas.height = 1000;
  canvas.width = fontWidth * (maxChars + margin);
}

/**
 * 
 * @param {Number} offset - milliseconds to delay sine wave movement
 *                          used to either sync vertical movement or
 *                          simulate wave movement
 * @param {Number} frequency - closeness of sine wave crest
 * @param {Number} amplitude - height of sine wave crest
 * @returns 
 */
function getVal(offset, frequency, amplitude) {
  // const now = Date.now()
  return Math.sin((now + offset) * frequency) * amplitude;
}

class TextBlock {
  constructor(element) {
    this.type = element.id;
    this.canvas = element;
    this.animate = this.type !== "subtitle"
  }

  get lines() {
    let lines = this.canvas.textContent.trim()
    if (this.type === "subtitle") {
      return [lines]
    }
    return lines.split(" ")
  }
}

function onReady() {
  console.log("ready");
  /** @type {HTMLCanvasElement} */
  canvas = document.getElementById("canvas");
  /** @type {CanvasRenderingContext2D} */
  const context = canvas.getContext("2d");

  /**
   * create elements
   */
  const title = new TextBlock(document.querySelector("#title"))
  const author = new TextBlock(document.querySelector("#author"))
  const subtitle = new TextBlock(document.querySelector("#subtitle"))

  createCanvasBaseProperties(canvas);
  createContextBaseProperties(context);
  const { g1, g2 } = createGradients(context, canvas);

  function drawLetters(letters, yOffset = 0, xOffset = 0, comma, layer) {
    function guideLines() {
      context.strokeRect(canvas.width / 2, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 - 80, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 - 160, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 - 240, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 - 320, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 - 360, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 + 80, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 + 160, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 + 240, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 + 320, 0, 1, canvas.height);
      context.strokeRect(canvas.width / 2 + 360, 0, 1, canvas.height);
    }
    // guideLines()
    return letters.forEach((letter, index, array) => {
      index++;
      //       ms
      /** 
          val is the sin of time
        */
      letter = letter.toUpperCase();
      // const delay = 300;
      const delay = 450;
      //       get position for now for each interval
      //       each letter is 1.5 seconds behind the next
      let time;
      // AND needs to be offset to go to middle
      if (array.length < 7) {
        time = (index + 2.75) * delay;
      } else {
        time = index * delay;
      }
      context.stroke;
      time += 320 * layer;
      let val = 1;
      const wordWidth = context.measureText(letters);
      const halfWordWidth = wordWidth.width / 2;
      let letterWidth;
      const halfLetterWidth = letterWidth / 2;
      if (comma == 'subtitle') {
        context.font = "bold 36px Tomorrow";
        letterWidth = 40;
      } else {
        val = getVal(time, frequency, amplitude) / 1.5
        context.font = "bold 72px Tomorrow";
        letterWidth = 80
      }
      let x = canvas.width / 2;
      const halfwayIndex = array.length / 2;

      if (halfwayIndex % 2) {
        if (index <= Math.floor(halfwayIndex)) {
          x -= ((array.length - 1) / 2 - index + 1) * letterWidth;
        } else if (index >= Math.ceil(halfwayIndex)) {
          x += (index - 1 - (array.length - 1) / 2) * letterWidth;
        }
      } else {
        if (index <= halfwayIndex) {
          x -= ((array.length - 1) / 2 - index + 1) * letterWidth;
        } else {
          x += (index - 1 - (array.length - 1) / 2) * letterWidth;
        }
      }

      const baseY = 100 - yOffset;
      const y = baseY + val * 3 * (5 - layer);
      if (comma === 'subtitle') {
        context.lineWidth = 3
        context.fillText(letter, x + xOffset, y);
        context.strokeText(letter, x + xOffset, y);

      } else {
        context.lineWidth = 4;
        context.fillText(letter, x + xOffset / 2, y);
        context.strokeText(letter, x + xOffset / 2, y);
      }
      if (comma && letter === "W") {
        context.fillText(",", x + halfLetterWidth * 1.5, y);
        context.strokeText(",", x + halfLetterWidth * 1.5, y);
      }
    });
  }

  const draw = function () {
    const drawWord = function (
      letters,
      yOffset = 0,
      xOffset = 0,
      comma,
      layer
    ) {
      drawLetters(letters, yOffset, xOffset, comma, layer);
    };

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.rect(0, 0, canvas.width, canvas.height);

    // this func fills background gradient to visualize canvas size
    function fillBackgroundGradient() {
      context.fill();
    }

    // fillBackgroundGradient()

    for (let i = 1; i <= copies; i++) {
      const yOffset = 0;
      const layer = i;
      title.lines.forEach(function (line, index) {
        if (i % 2) {
          context.fillStyle = g1;
        } else {
          context.fillStyle = g2;
        }
        let comma;
        if (index !== 4) {
          comma = true;
        }
        // const lineOffset = yOffset * index * -3;
        const letters = line.split("");

        drawWord(
          letters,
          yOffset - index * 84,
          (copies - 1 - i) * -6,
          comma,
          layer
        );
      });
      author.lines.forEach(function (line, index, array) {
        const letters = line.split("");
        const comma = true;
        if (i % 2) {
          context.fillStyle = g2;
        } else {
          context.fillStyle = g1;
        }
        drawWord(
          letters,
          -700 - yOffset - index * 100,
          (copies - 1 - i) * -8,
          comma,
          layer
        );
      });

      subtitle.lines.forEach(function (line, index, array) {
        const letters = line.split("");
        const comma = "subtitle";
        if (i % 2) {
          context.fillStyle = g1;
        } else {
          context.fillStyle = g2;
        }
        drawWord(
          letters, -550 - yOffset - index * 100,
          (copies - 1 - i) * -2,
          comma,
          layer
        )
      })
    }
  };

  // run everytime requestAnimationFrame happens
  function doFramesPerSecond(fps, cb) {
    return setTimeout(() => requestAnimationFrame(cb), 1000 / fps);
  }

  const update = function () {
    now = Date.now();
    draw();
    doFramesPerSecond(fps, update);
  };
  update();
}

// event listener on load to make sure everything is loaded before animation starts
window.addEventListener("load", onReady);