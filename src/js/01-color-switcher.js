const back = document.querySelector("body");

const start = document.querySelector("[data-start");
const stop = document.querySelector("[data-stop]");

let timerID = null;

start.addEventListener("click", startColors);
stop.addEventListener("click", stopColors);

function startColors() {
  back.style.backgroundColor = getRandomHexColor();
  timerID = setInterval(() => {
    back.style.backgroundColor = getRandomHexColor();
  }, 1000);
  start.disabled = true;
  stop.disabled = false;
}

function stopColors() {
  clearInterval(timerID);
  start.disabled = false;
  stop.disabled = true;
}

function getRandomHexColor() {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return "#${randomColor}";
}
