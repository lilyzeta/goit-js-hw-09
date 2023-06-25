/* importing the modules into the javascript files, already installed via npm */

import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';
/* constants/variables that will be referred to in the rest of the document.
days, hours, minutes, and seconds are all going to need to have their values updated by the timer.
They're written how they are because the .value indicates that we're referring to the amount written in, the brackets are used because it's not really the ID or class or anything that's otherwise announced in the HTML, it's just data-'___' and that requires special syntax.
Start button we need to identify because we don't want the button to stay active the whole time,
and we want to have an event listener on the start to help us control when the functions are deployed.
button refers to its tag, but we get more specific with the [data-start] because what if 
there were more than one button. The # in the selector for myInput is to indicate that we're referring to an ID.
*/
const daysEl = document.querySelector('.value[data-days]');
const hoursEl = document.querySelector('.value[data-hours]');
const minutesEl = document.querySelector('.value[data-minutes]');
const secondsEl = document.querySelector('.value[data-seconds]');
const startBtn = document.querySelector('button[data-start]');
const myInput = document.querySelector('#datetime-picker');

/* let is the variable declaration for when the variable will need to be changed later on.
At page loading, we don't want the timer to be running--we only want to initiate the timer
after the date is selected on the flatpickr, therefore we've set it to false.
The startBtn is also going to be disabled until we select a valid date (how can you
    start a timer if you don't know how long it's going to be for?).
*/

let timerIsStarted = false;
startBtn.disabled = true;

/* Here we are declaring our function for the flatpickr. The information for how to 
create a flatpickr instance is available on the flatpickr documentation website.
myInput represents the clickable textbox where you can enter the date, it's the
beginning target of where the flatpickr is supposed to go.
https://flatpickr.js.org/examples/ this website includes the explanations of the
selected settings, time is enabled, we want to be able to choose any time AM or PM.
minuteIncrement adjusts the step for the minut input.
*/

const fp = flatpickr(myInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  /* selectedDates is a property from flatpickr which includes the array of dates selected by the user.
  onClose is a method which will prompt the function to happen when the flatpickr is closed.
  */
  onClose(selectedDates) {
    /* dateDiff is going to calculate the difference between the date selected and the current one.
    !!? I don't know why selectedDates has "[0]" next to it. !!?
    */
    const dateDiff = selectedDates[0].getTime() - new Date().getTime();
    /* If the difference between the dates is greater than 0, and the timer is not started 
    already then we know the date is in the future and this is a new instance for the timer.
    The start button will be enabled, so the user can begin the timer, as they've selected a 
    valid input. We are adding an event listener to the newly enabled start button so the
    user may actually select the start button. We have an arrow function.
    The timer is started for a duration equal to the difference between the selected time and the
    current time. The timer status is changed to started, and the start button is disabled--
    that prevents the user from restarting the timer excessively.
This is also an else statement.
    */

    if (dateDiff > 0 && !timerIsStarted) {
      startBtn.disabled = false;
      startBtn.addEventListener('click', () => {
        startTimer(dateDiff);
        timerIsStarted = true;
        startBtn.disabled = true;
      });
    } else {
      /* If the date range entered is invalid (the difference between the date selected and
        the current date is equal to or less than zero, or the timer has already been 
        started) it is reinforced that the start button is set to disabled. */
      startBtn.disabled = true;
      /* if the timer is started, we use notiflix to notify the user of the message,
        'Timer is started' which is coded as a string. 
        
        If the issue is not that the timer is started, it must be that the date selected was invalid
        therefore we use an else statement to have notiflix notify the user that they should
        select a future time. 
        
        ***If you are going to use flatpickr in the future, it is worth noting that you can simply
        disable past dates. They display as grayed out, and the user cannot select them. It
        visually cues the user that it is not an option which can decrease the number of clicks
        to get the result and may improve the user experience.*** */
      if (timerIsStarted) {
        Notiflix.Notify.failure('Timer is started');
      } else {
        Notiflix.Notify.failure('Please choose the future time');
      }
    }
  },
});
/* we declare a function that will start the timer. The timer is set to update every one second.
if the amount of milliseconds is greater than zero, we will call the functions printTime and convertMs (explained below).
milliseconds is also adjusted down by 1000 because that equals one second.
If milliseconds is equal to or somehow less than zero, the timer stops updating as the timer
should also have hit zero.
*/
function startTimer(milliseconds) {
  let timerId = setInterval(() => {
    if (milliseconds > 0) {
      printTime(convertMs(milliseconds));
      milliseconds -= 1000;
    } else {
      clearInterval(timerId);
    }
  }, 1000);
}
/* this function converts the amount of time listed into milliseconds so that the functions
startTimer and setInterval can read it without any innaccuracies by a bad conversion. */
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  /* The Math.floor() static method always rounds down and returns the largest 
  integer less than or equal to a given number. Each of the constants below convert the input
  quantity of milliseconds into numbers of days, hours, minutes, or seconds so we can display 
  them*/
  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

/* this function converts the value to a string and if the string is not 2 characters, it
adds a 0 to the start of the string. This is how we can display 04 minutes instead of 4 minutes. */
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

/* textContent is the actual text inside the html that is displaying on the user interface.
this function makes sure that the leading zero function is allowed to try to update the numbers
if it's needed, and this function also updates the amounts to the html so we can see the work 
done. */
function printTime(t) {
  daysEl.textContent = addLeadingZero(t.days);
  hoursEl.textContent = addLeadingZero(t.hours);
  minutesEl.textContent = addLeadingZero(t.minutes);
  secondsEl.textContent = addLeadingZero(t.seconds);
}
