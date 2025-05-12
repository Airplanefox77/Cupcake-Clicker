let unlockedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];

const achievementsList = [
  { id: "first_cupcake", title: "First Cupcake!", message: "You've baked your first cupcake! 🎉", condition: () => cupcakeCount === 1 },
  { id: "9000_cupcakes", title: "It's Over 9000!", message: "You've reached 9,000 cupcakes!", condition: () => cupcakeCount >= 9000 },
  { id: "100_purchases", title: "Master Baker!", message: "You've bought 100 products!", condition: () => bakers.some(b => b.level >= 100) },
];

const errorsList = [
  { title: "Negative Balance!", message: "Something went wrong with your finances!", condition: () => money < 0 },
];

let insufficientFundsTrigger = false;
const infoList = [
  { title: "Not Enough Money", message: "You need more money to buy this item.", condition: () => insufficientFundsTrigger },
];

// Function to trigger achievements
function triggerAchievement(id, title, message) {
  if (!unlockedAchievements.includes(id)) {
    unlockedAchievements.push(id);
    localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
    notifyAchievement(title, message);
    renderAchievements();
  }
}

// Function to check notifications
function checkNotifications() {
  achievementsList.forEach(achievement => {
    if (achievement.condition()) {
      triggerAchievement(achievement.id, achievement.title, achievement.message);
    }
  });

  errorsList.forEach(error => {
    if (error.condition()) {
      notifyError(error.title, error.message);
    }
  });

  infoList.forEach(info => {
    if (info.condition()) {
      notifyInfo(info.title, info.message);
    }
  });
}

// Function to reset achievements
function resetAchievements() {
  unlockedAchievements = [];
  localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
  renderAchievements();
}

// Update the achievements window dynamically
function renderAchievements() {
  const achievementsListContainer = document.getElementById("achievements-list");
  achievementsListContainer.innerHTML = "";

  unlockedAchievements.forEach(id => {
    const achievement = achievementsList.find(a => a.id === id);
    if (achievement) {
      const achievementDiv = document.createElement("div");
      achievementDiv.className = "achievement-entry";
      achievementDiv.innerHTML = `<strong>${achievement.title}</strong><br>${achievement.message}`;
      achievementsListContainer.appendChild(achievementDiv);
    }
  });
}

// Open & close achievements window
document.getElementById("view-achievements").addEventListener("click", () => {
  document.getElementById("achievements-window").classList.add("active");
  renderAchievements();
});

document.getElementById("close-achievements").addEventListener("click", () => {
  document.getElementById("achievements-window").classList.remove("active");
});

// Run notification checks periodically
setInterval(checkNotifications, 2000);
