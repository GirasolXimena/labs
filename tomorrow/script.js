// const copies = 4;
const copies = 4;

// how close together sine waves will be
const frequency = 1 / 600;
// how tall sine waves will be
const amplitude = 1.5;
// how many times per second animation will run
const fps = 60;

let now = 0;

let gradientStop = 0.5;
let multiplier = 1;
let canvas;

let resetGradient = false;
let resetMultiplier = false;
/**
 *
 * @param {CanvasRenderingContext2D} context - context
 * @param {HTMLCanvasElement} canvas - canvas
 */
function createGradients(context, canvas) {
  const { height, width } = canvas;
  const root = document.querySelector(":root");
  const style = getComputedStyle(root);

  const red = style.getPropertyValue("--red");
  const blue = style.getPropertyValue("--blue");
  const yellow = style.getPropertyValue("--yellow");

  const g1 = context.createLinearGradient(0, height / 2, width, height / 2);
  const g2 = context.createLinearGradient(0, height / 2, width, height / 2);
  g1.addColorStop(0, blue);
  g1.addColorStop(gradientStop, yellow);
  g1.addColorStop(1, red);
  g2.addColorStop(0, red);
  g2.addColorStop(gradientStop, yellow);
  g2.addColorStop(1, blue);
  return { g1, g2 };
}

function createContextBaseProperties(context) {
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "bold 72px Tomorrow";

  context.strokeStyle = "rgba(40,40,40, 1)";
}

function createCanvasBaseProperties(canvas) {
  // mono font each char 80 px wide
  const fontWidth = 80;
  // longest line in title
  const maxChars = 9;
  // 1 char width
  const margin = 1;

  canvas.height = 1000;
  canvas.width = fontWidth * (maxChars + margin);
}

function getVal(offset, frequency, amplitude) {
  return Math.sin((now + offset) * frequency) * amplitude;
}

function onReady() {
  canvas = document.getElementById("canvas");
  /** @type {CanvasRenderingContext2D} */
  const context = canvas.getContext("2d");

  canvas.addEventListener("mousemove", (e) => {
    const x = Math.max(e.pageX - e.target.offsetLeft, 0);
    const y = Math.max(e.pageY - e.target.offsetTop, 0);
    let posX = x / 849;
    posX = Math.round(posX * 100) / 100;

    let posY = y / 1047;
    posY = Math.round(posY * 100) / 100;
    posY = 1 - posY;

    multiplier = Math.max(1, posY * 3);

    gradientStop = Math.round(posX * 100) / 100;
  });

  canvas.addEventListener("mouseleave", () => {
    resetGradient = true;
    resetMultiplier = true;
  });

  const title = document.getElementById("title");
  const titleLines = title.textContent.trim().split(" ");

  const author = document.getElementById("author");
  const authorLines = author.textContent.trim().split(" ");

  const subtitle = document.getElementById("subtitle");
  const subtitleLines = [subtitle.textContent.trim()];

  createCanvasBaseProperties(canvas);
  createContextBaseProperties(context);

  function drawLetters(letters, yOffset = 0, xOffset = 0, type, layer) {
    return letters.forEach((letter, index, array) => {
      index++;

      letter = letter.toUpperCase();
      //       get position for now for each interval
      //       each letter is 0.5 seconds behind the next
      const delay = 500;
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

      let letterWidth;
      if (type == "subtitle") {
        context.font = "bold 32px Tomorrow";
        letterWidth = 32;
      } else {
        val = getVal(time, frequency, amplitude) / 1.5;
        if (type === "title") {
          context.font = "bold 72px Tomorrow";
          letterWidth = 84;
        } else if (type === "author") {
          context.font = "bold 64px Tomorrow";
          letterWidth = 64;
        }
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
      const y = baseY + val * 3 * (5 - layer) * multiplier;
      if (type === "subtitle") {
        context.lineWidth = 3;
        context.fillText(letter, x + xOffset, y);
        context.strokeText(letter, x + xOffset, y);
      } else if (type === "title") {
        context.lineWidth = 4;
        context.fillText(letter, x + xOffset / 2, y);
        context.strokeText(letter, x + xOffset / 2, y);
      } else if (type === "author") {
        context.lineWidth = 4;
        context.fillText(letter, x + xOffset / 2, y);
        context.strokeText(letter, x + xOffset / 2, y);
      }
      if (type === "title" && letter === "W" && y < 300) {
        const halfLetterWidth = (letterWidth * 2) / 3;
        context.fillText(",", x + halfLetterWidth, y);
        context.strokeText(",", x + halfLetterWidth, y);
      }
    });
  }

  const draw = function () {
    const { g1, g2 } = createGradients(context, canvas);
    if (resetGradient === true) {
      const interval = 1;
      const value = Math.round(gradientStop * 100);
      if (value > 50) {
        gradientStop = (value - interval) / 100;
      } else if (value < 50) {
        gradientStop = (value + interval) / 100;
      } else if (value === 50) {
        resetGradient = false;
      }
    }

    if (resetMultiplier === true) {
      if (multiplier !== 1) {
        multiplier -= 1 / 100;

        if (multiplier < 1) {
          multiplier = 1;
          resetMultiplier = false;
        }
      }
    }

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
      titleLines.forEach(function (line, index) {
        if (i % 2) {
          context.fillStyle = g1;
        } else {
          context.fillStyle = g2;
        }
        let type;
        if (index !== 4) {
          type = "title";
        } else {
          type = "title";
        }
        // const lineOffset = yOffset * index * -3;
        const letters = line.split("");

        drawWord(
          letters,
          yOffset - index * 84,
          (copies - 1 - i) * -12,
          type,
          layer
        );
      });
      authorLines.forEach(function (line, index, array) {
        const letters = line.split("");
        const type = "author";
        if (i % 2) {
          context.fillStyle = g2;
        } else {
          context.fillStyle = g1;
        }
        drawWord(
          letters,
          -700 - yOffset - index * 100,
          (copies - 1 - i) * -12,
          type,
          layer
        );
      });

      subtitleLines.forEach(function (line, index, array) {
        const letters = line.split("");
        const type = "subtitle";
        if (i % 2) {
          context.fillStyle = g1;
        } else {
          context.fillStyle = g2;
        }
        drawWord(
          letters,
          -550 - yOffset - index * 100,
          (copies - 1 - i) * -1,
          type,
          layer
        );
      });
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
