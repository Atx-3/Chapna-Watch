let mode = 'timer'; // or 'stopwatch'
let totalSeconds = 0;
let interval = null;
let running = false;
let muted = false;

const timeDisplay = document.getElementById('time');
const modeDisplay = document.getElementById('mode');
const tickSound = document.getElementById('tickSound');
const doneSound = document.getElementById('doneSound');

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(totalSeconds);
}

function playTick() {
  if (!muted) {
    tickSound.pause();
    tickSound.currentTime = 0;
    tickSound.play().catch(() => {});
  }
}

function playDone() {
  if (!muted) {
    doneSound.pause();
    doneSound.currentTime = 0;
    doneSound.play().catch(() => {});
  }
}

function startStop() {
  document.documentElement.requestFullscreen().catch(() => {});
  if (!running) {
    if (mode === 'timer') {
      if (totalSeconds <= 0) return;
      interval = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          playTick();
          updateDisplay();
        } else {
          clearInterval(interval);
          running = false;
          playDone();
        }
      }, 1000);
    } else {
      interval = setInterval(() => {
        totalSeconds++;
        playTick();
        updateDisplay();
      }, 1000);
    }
    running = true;
  } else {
    clearInterval(interval);
    running = false;
  }
}

function reset() {
  if (running) return; // ⛔ Prevent reset while running
  totalSeconds = 0;
  updateDisplay();
}

function switchMode() {
  if (running) return; // ⛔ Prevent switching while running
  mode = mode === 'timer' ? 'stopwatch' : 'timer';
  modeDisplay.textContent = mode.toUpperCase();
  reset();
}

function toggleMute() {
  muted = !muted;
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === ' ') startStop();
  else if (key === 'r') reset();
  else if (key === 's') switchMode();
  else if (key === 'm') toggleMute();
  else if (!running && mode === 'timer') {
    if (key === 'arrowup') totalSeconds += 60;
    else if (key === 'arrowdown') totalSeconds = Math.max(0, totalSeconds - 60);
    else if (key === 'arrowright') totalSeconds += 1;
    else if (key === 'arrowleft') totalSeconds = Math.max(0, totalSeconds - 1);
    updateDisplay();
  }
});

document.addEventListener('wheel', (e) => {
  if (!running && mode === 'timer') {
    if (e.deltaY < 0) totalSeconds += 10;
    else totalSeconds = Math.max(0, totalSeconds - 10);
    updateDisplay();
  }
});

updateDisplay();
