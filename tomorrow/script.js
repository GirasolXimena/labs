function onReady() {
  console.log("ready");
  //   start updating after it loads
  function createGradients(context) {
    const g1 = context.createLinearGradient(450, 0, 950, 0);
    const g2 = context.createLinearGradient(450, 0, 950, 0);
    g1.addColorStop(0, "blue");
    g1.addColorStop(0.4, "yellow");
    g1.addColorStop(0.6, "yellow");
    g1.addColorStop(1, "red");
    g2.addColorStop(0, "red");
    g2.addColorStop(0.4, "yellow");
    g2.addColorStop(0.6, "yellow");
    g2.addColorStop(1, "blue");
    return { g1, g2 };
  }

  function createContextBaseProperties(context) {
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "72px Arial";
    context.lineWidth = 3;
  }

  function createCanvasBaseProperties() {
    const { clientWidth, clientHeight } = document.body;
    canvas.height = clientHeight;
    canvas.width = clientWidth;
  }

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const title = document.getElementById("title");
  const titleLines = title.textContent.trim().split(" ");

  const author = document.getElementById("author");
  const authorLines = author.textContent.trim().split(" ");

  const copies = 4;

  // how close together sine waves will be
  const frequency = 1 / 400;
  // how tall sine waves will be
  const amplitude = 32;
  // how many times per second animation will run
  const fps = 24;

  let now = 0;
  createCanvasBaseProperties(canvas);
  createContextBaseProperties(context);
  const { g1, g2 } = createGradients(context);

  // number of times text is copied
  const getVal = function (offset = 0, frequency, amplitude) {
    // const now = Date.now()
    return Math.sin((now + offset) * frequency) * amplitude / 4;
  };


  const drawLetters = function (letters, yOffset = 0, xOffset = 0, comma, layer) {
    letters.forEach(function (letter, index, array) {
      //       ms
      /** 
          val is the sin of time
        */
      letter = letter.toUpperCase();
      const delay = 300;
      //       get position for now for each interval
      //       each letter is 1.5 seconds behind the next
      let time;
      // AND needs to be offset to go to middle
      if (array.length < 7) {
        time = (index + 2.75) * delay;
      } else {
        time = index * delay;
      }

      time += (120 * layer);
      // console.table({ layer, delay, letter, letters, yOffset, xOffset })
      const val = getVal(time, frequency, amplitude);
      const wordWidth = context.measureText(letters);
      const halfWordWidth = wordWidth.width / 2;
      const letterWidth = context.measureText(letter);
      const halfLetterWidth = letterWidth.width / 2;
      // console.log(halfWordWidth, wordWidth.width);
      const x = canvas.width / 2 - halfWordWidth + index * 52;
      // console.log(x)
      const baseY = 100 - yOffset;
      // const y = baseY;
      const y = baseY + val;
      // console.log({ xOffset })
      context.fillText(letter, x + xOffset, y);
      context.strokeText(letter, x + xOffset, y);
      if (comma && letter === "W") {
        context.fillText(",", x + halfLetterWidth, y);
        context.strokeText(",", x + halfLetterWidth, y);
      }
    });
  };

  const draw = function () {
    const drawWord = function (letters, yOffset = 0, xOffset = 0, comma, layer) {
      drawLetters(letters, yOffset, xOffset, comma, layer);
    };

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.rect(0, 0, canvas.width, canvas.height);
    // context.fillStyle = "purple";

    // context.fill();

    for (let i = 1; i <= copies; i++) {
      if (i % 2) {
        context.fillStyle = g1;
      } else {
        context.fillStyle = g2;
      }
      //     index * 4 pixel stagger
      //     4, 8, 12, 16 pixels respectively
      // const yOffset = i * 4;
      const yOffset = 0;
      const layer = i;
      titleLines.forEach(function (line, index) {
        let comma;
        if (index !== 4) {
          comma = true;
        }
        const lineOffset = yOffset * index * -3;
        const letters = line.split("");

        drawWord(letters, yOffset - index * 84, i * 4, comma, layer);
      });
      authorLines.forEach(function (line, index, array) {
        const letters = line.split("");
        const comma = true;
        drawWord(letters, -500 - yOffset - index * 100, i * 4, comma, layer);
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
