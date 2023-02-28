// const copies = 4;
const copies = 4;

// how close together sine waves will be
const frequency = 1 / 600;
// how tall sine waves will be
const amplitude = 1.5;
// how many times per second animation will run
const fps = 60;

let now = 0;
/**
 * 
 * @param {CanvasRenderingContext2D} context - context
 * @param {HTMLCanvasElement} canvas - canvas
 */
function createGradients(context, canvas) {
  const { height, width } = canvas;

  const g1 = context.createLinearGradient(0, height / 2, width, height / 2);
  const g2 = context.createLinearGradient(0, height / 2, width, height / 2);
  const blue = 'rgb(1, 187, 235)';
  const yellow = 'rgb(221, 206, 3)';
  const red = 'rgb(241, 126, 177)';
  const stop = 0.5
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
  context.font = "bold 72px Tomorrow";
  context.lineWidth = 4;
  context.strokeStyle = "rgba(40,40,40, 0.9)";
}

function createCanvasBaseProperties(canvas) {
  // const { clientWidth, clientHeight } = document.body;
  canvas.height = window.innerHeight - 3;
  canvas.width = window.innerWidth - 0;
}

function getVal(offset = 0, frequency, amplitude) {
  // const now = Date.now()
  return Math.sin((now + offset) * frequency) * amplitude;
};

function onReady() {
  console.log("ready");


  const canvas = document.getElementById("canvas");
  /** @type {CanvasRenderingContext2D} */
  const context = canvas.getContext("2d");

  const title = document.getElementById("title");
  const titleLines = title.textContent.trim().split(" ");

  const author = document.getElementById("author");
  const authorLines = author.textContent.trim().split(" ");

  createCanvasBaseProperties(canvas);
  createContextBaseProperties(context);
  const { g1, g2 } = createGradients(context, canvas);



  function drawLetters(letters, yOffset = 0, xOffset = 0, comma, layer) {
    function guideLines() {
      context.strokeRect(canvas.width / 2, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 - 80, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 - 160, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 - 240, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 - 320, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 + 80, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 + 160, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 + 240, 0, 1, canvas.height)
      context.strokeRect(canvas.width / 2 + 320, 0, 1, canvas.height)
    }
    // guideLines()
    return letters.forEach((letter, index, array) => {
      index++
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
      context.stroke
      time += (320 * layer);
      const val = getVal(time, frequency, amplitude);
      const wordWidth = context.measureText(letters);
      const halfWordWidth = wordWidth.width / 2;
      const letterWidth = context.measureText(letter);
      const halfLetterWidth = letterWidth.width / 2;

      let x = canvas.width / 2
      const halfwayIndex = array.length / 2;

      if (halfwayIndex % 2) {
        if (index <= Math.floor(halfwayIndex)) {
          x -= ((array.length - 1) / 2 - index + 1) * 80
        } else if (index >= Math.ceil(halfwayIndex)) {
          x += (index - 1 - ((array.length - 1) / 2)) * 80
        }
      } else {
        if (index <= halfwayIndex) {
          x -= ((array.length - 1) / 2 - index + 1) * 80
        } else {
          x += (index - 1 - ((array.length - 1) / 2)) * 80
          // console.log('[right', { letter, index, halfwayIndex })
        }
      }

      if (letter === 'T' || letter === 'G') {
        console.log({ letter, index, len: array.length })

      }
      const baseY = 100 - yOffset;
      const y = baseY + val * 3 * (5 - layer);
      context.fillText(letter, x + xOffset, y);
      context.strokeText(letter, x + xOffset, y);
      if (comma && letter === "W") {
        context.fillText(",", x + halfLetterWidth * 1.5, y);
        context.strokeText(",", x + halfLetterWidth * 1.5, y);
      }
    });
  };

  const draw = function () {
    const drawWord = function (letters, yOffset = 0, xOffset = 0, comma, layer) {
      drawLetters(letters, yOffset, xOffset, comma, layer);
    };

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.rect(0, 0, canvas.width, canvas.height);

    // context.fillStyle = g2
    context.fill();

    for (let i = 1; i <= copies; i++) {
      //     index * 4 pixel stagger
      //     4, 8, 12, 16 pixels respectively
      // const yOffset = i * 4;
      const yOffset = 0;
      const layer = i;
      titleLines.forEach(function (line, index) {
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

        drawWord(letters, yOffset - index * 84, (copies - 1 - i) * -6, comma, layer);
      });
      authorLines.forEach(function (line, index, array) {
        const letters = line.split("");
        const comma = true;
        if (i % 2) {
          context.fillStyle = g2;
        } else {
          context.fillStyle = g1;
        }
        drawWord(letters, -500 - yOffset - index * 100, ((copies - 1 - i) * -8), comma, layer);
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
