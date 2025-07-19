// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playSound") {
    playNotificationSound();
    sendResponse({ success: true });
  }
});

function playNotificationSound() {
  try {
    const audio = new Audio(chrome.runtime.getURL("notification.wav"));
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  } catch (error) {
    console.error("Error creating audio:", error);
  }
}
