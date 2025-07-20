const input = document.getElementById("timer-length");
const saveButton = document.getElementById("save-options");

saveButton.addEventListener("click", () => {
  const timerLength = parseInt(input.value, 10);
  if (!isNaN(timerLength)) {
    chrome.storage.sync.set({ timerLength });
  }
  input.value = timerLength;
});
