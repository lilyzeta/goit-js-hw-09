const back = document.querySelector("body");

const start = document.querySelector("[data-start");
const stop = document.querySelector("[data-stop]");

let timerID = 1;

start.addEventListener("click", startColors);
stop.addEventListener("click", stopColors);

function startColors() {
  document.body.style.backgroundColor = getRandomHexColor();
  timerID = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}


// How do we make the function stop when we click stop?