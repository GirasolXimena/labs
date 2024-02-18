let currentTime = new Date();
let pastTime = new Date("1999-12-31T18:30:00");
let timeStopped = document.documentElement.dataset.timeStopped === "true";
const timeSwapEl = document.getElementById("time-swap") as HTMLButtonElement;
const clockEl = document.getElementById("clock") as HTMLDivElement;

const swapTime = (stopTime = false) => {
  timeStopped = stopTime || !timeStopped;
  document.documentElement.dataset.timeStopped = String(timeStopped);
};

const handleClick = () => {
  swapTime();
  const buttonString = timeStopped ? "Start" : "Stop";
  timeSwapEl.innerText = buttonString;
};

timeSwapEl.addEventListener("click", handleClick, false);

const updateTime = (time) => {
  let timeString;
  if (timeStopped) {
    timeString = pastTime.toLocaleDateString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    currentTime = new Date(currentTime.getTime() + time);
    timeString = currentTime.toLocaleDateString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  clockEl.innerHTML = timeString.split(",").join("<br>");
};

const animate = (time = 0) => {
  updateTime(time / 1000);
  requestAnimationFrame(animate);
};

animate();
