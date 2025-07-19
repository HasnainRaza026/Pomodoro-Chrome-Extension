chrome.alarms.create({
  periodInMinutes: 1 / 60, // 1 second
});

// Function to create offscreen document if it doesn't exist
async function createOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [chrome.runtime.getURL("offscreen.html")],
  });

  if (existingContexts.length === 0) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play notification sound when timer completes",
    });
  }
}

// Function to play notification sound via offscreen document
async function playNotificationSound() {
  try {
    await createOffscreenDocument();
    chrome.runtime.sendMessage({ action: "playSound" });
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
}

chrome.alarms.onAlarm.addListener(() => {
  chrome.storage.local.get(["timerInterval", "isRunning"], (data) => {
    const timerInterval = data?.timerInterval || 10;
    const isRunning = data?.isRunning || false;

    if (isRunning) {
      if (timerInterval > 0) {
        chrome.storage.local.set({ timerInterval: timerInterval - 1 });
      }
      if (timerInterval === 1) {
        chrome.storage.local.set({ isRunning: false, timerInterval: 0 }, () => {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Pomodoro Timer",
            message: "Time's up!",
          });
          // Play notification sound using offscreen document
          playNotificationSound();
        });
      }
    }
  });
});
