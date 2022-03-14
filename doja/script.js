const canvas = document.createElement("canvas");
let bandArray = [];
let starArray = [];
const onReady = () => {
  const ctx = canvas.getContext("2d");
  const hero = document.getElementById("hero");
  const upload = document.getElementById("upload");
  const audio = document.getElementById("audio");
  const colors = ["#841911", "#327655", "#b97b28", "#b74820", "#b92840"];

  const setWidth = () => {
    const { height, width } = document.body.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
  };
  setWidth();
  const animationDuration = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--animation-duration")
      .replace(/[^0-9]/g, "")
  );
  document.body.appendChild(canvas);

  class Band {
    constructor(drawAngle) {
      const { width, height } = canvas;
      this.drawAngle = drawAngle;
      this.x = width / 2;
      this.y = -height / 2;
      this.cpx = width / 4;
      this.cpy = -height / 30;
      this.cpx2 = this.cpx + width / 8;
      this.cpy2 = this.cpy + height / 8;
      this.baseX = width / 2;
    }
    get color() {
      return colors[this.drawAngle % colors.length];
    }
    draw() {
      const { drawAngle, color, cpx, cpy, cpx2, cpy2, x, y } = this;
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(2, 2);
      ctx.fillStyle = color;
      ctx.rotate((Math.PI * drawAngle) / 15);
      ctx.beginPath();
      // move to the center of the canvas
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(cpx, cpy, x, y);
      ctx.lineTo(x + canvas.width / 8, y);
      ctx.quadraticCurveTo(cpx2, cpy2, 0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    update(progress) {
      this.x = this.baseX + 50 * progress;
    }
  }
  class Star {
    constructor() {
      const { width, height } = canvas;
      this.r = 25;
      this.width = width * Math.random();
      this.height = height * Math.random();
      this.angle = 0;
    }
    update(progress) {
      progress /= 2;
      this.r = 25 + progress * 5;
      this.angle = (Math.PI * progress) / 4;
    }
    draw() {
      const { r, width, height, angle } = this;
      ctx.save();
      ctx.lineWidth = 5;
      ctx.fillStyle = "white";
      ctx.translate(width, height);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 30; i++) {
    bandArray.push(new Band(i));
    bandArray[i].draw();
    if (i % 2 === 0) {
      starArray.push(new Star());
      starArray[i / 2].draw();
    }
  }

  const animate = (t) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const progress = Math.sin((t / (animationDuration / 2)) * Math.PI);

    for (let i = 0; i < bandArray.length; i++) {
      bandArray[i].update(progress);
      bandArray[i].draw();

      if (i % 2 === 0) {
        starArray[i / 2].update(progress);
        starArray[i / 2].draw();
      }
    }
    requestAnimationFrame(animate);
  };
  const start = () => {
    requestAnimationFrame(animate);
    hero.className = "hero animate";
  };
  window.addEventListener("resize", setWidth, false);
  function handleFiles(event) {
    var file = event.target.files[0];
    console.log("handleFiles", audio, file);
    if (file) {
      audio.src = URL.createObjectURL(file);
      audio.load();
      audio.play();
      start();
    }
  }

  const handleClick = () => {
    upload.click();
  };
  window.addEventListener("click", handleClick, false);
  upload.addEventListener("change", handleFiles, false);
};

window.addEventListener("load", onReady, false);
