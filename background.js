chrome.alarms.create({
  periodInMinutes: 1 / 60, // 1 second
});

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
        });
      }
    }
  });
});
