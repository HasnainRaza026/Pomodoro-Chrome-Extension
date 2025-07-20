const timmer = document.getElementById("time");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

startButton.addEventListener("click", () => {
  chrome.storage.local.get(["timerInterval", "isRunning"], (data) => {
    if (!(data?.isRunning || false)) {
      chrome.storage.local.set({
        timerInterval: data.timerInterval,
        isRunning: true,
      });
      startButton.textContent = "Pause";
    } else {
      chrome.storage.local.set({ isRunning: false });
      startButton.textContent = "Start";
    }
  });
});

resetButton.addEventListener("click", () => {
  chrome.storage.sync.get(["timerLength"], (data) => {
    const timerLength = data?.timerLength || 25; // default to 25 minutes
    const timerInterval = timerLength * 60; // convert minutes to seconds

    chrome.storage.local.set({
      timerInterval,
      isRunning: false,
    });
  });
  timmer.textContent = "25:00";
  startButton.textContent = "Start";
});

updateTimerDisplay(); // Initial display update to avoid delay

setInterval(() => {
  updateTimerDisplay();
}, 1000);

function updateTimerDisplay() {
  chrome.storage.local.get(["timerInterval"], (data) => {
    const timerInterval = data.timerInterval;

    const minutes = Math.floor(timerInterval / 60);
    const seconds = timerInterval % 60;
    timmer.textContent = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  });
}
