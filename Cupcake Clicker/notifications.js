const notificationContainer = document.createElement("div");
notificationContainer.id = "notification-container";
document.body.appendChild(notificationContainer);

// Function to check if the game is focused
function isGameFocused() {
  return document.hasFocus();
}

// Function to create a notification
function createNotification(type, title, message, icon) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const iconImg = document.createElement("img");
  iconImg.src = icon;
  iconImg.alt = type;

  const textContainer = document.createElement("div");
  textContainer.className = "notification-text";
  textContainer.innerHTML = `<strong>${title}</strong><br>${message}`;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✖";
  closeBtn.className = "close-btn";
  closeBtn.onclick = () => notification.remove();

  notification.append(iconImg, textContainer, closeBtn);
  notificationContainer.appendChild(notification);

  if (isGameFocused()) {
    setTimeout(() => notification.remove(), 5000); // Auto-fade if game is active
  }
}

// Functions for different notification types
function notifyAchievement(title, message) {
  createNotification("achievement", title, message, "images/achievement_icon.png");
}

function notifyError(title, message) {
  createNotification("error", title, message, "images/error_icon.png");
}

function notifyInfo(title, message) {
  createNotification("info", title, message, "images/info_icon.png");
}

// Ensure notifications don’t disappear if the game is minimized
document.addEventListener("visibilitychange", () => {
  if (!isGameFocused()) {
    setTimeout(() => {
      document.querySelectorAll(".notification").forEach(n => n.classList.add("persistent"));
    }, 3000);
  }
});
