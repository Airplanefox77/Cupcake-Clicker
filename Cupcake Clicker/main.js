let cupcakeCount = 0;
let money = 0;
let cupcakeQueue = 0;
let baking = false;
let bakeSpeed = 5000;
let maxBatchSize = 12;
let progressPaused = false;
let ovensOwned = 0;

const img = document.getElementById("clicker-img");
const batchCount = document.getElementById("batch-count");
const progressBar = document.getElementById("progress-bar");
const bakeProgress = document.getElementById("bake-progress");
const settingsBtn = document.getElementById("settings-btn");
const settingsMenu = document.getElementById("settings-menu");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const resetBtn = document.getElementById("reset-btn");
const closeSettings = document.getElementById("close-settings");
const versionText = document.getElementById("version-number");

// 🎵 Background Music System
const bgMusic = document.getElementById("bg-music");
const volumeSlider = document.getElementById("volume-slider");

const tracks = ["audio/rose.mp3", "audio/bread.mp3", "audio/thisisforyou.mp3"];
let lastTrack = null; // Store the last played track

// Function to get a random track **that is NOT the same as the previous track**
function getRandomTrack() {
  let newTrack;
  do {
    newTrack = tracks[Math.floor(Math.random() * tracks.length)];
  } while (newTrack === lastTrack);
  lastTrack = newTrack;
  return newTrack;
}

// Load saved volume level
bgMusic.volume = localStorage.getItem("volume") ? localStorage.getItem("volume") / 100 : 0.5;
volumeSlider.value = localStorage.getItem("volume") || 50;

// Adjust volume dynamically
volumeSlider.addEventListener("input", () => {
  bgMusic.volume = volumeSlider.value / 100;
  localStorage.setItem("volume", volumeSlider.value);
});

// Start with a **random track** at game load
window.addEventListener("load", () => {
  bgMusic.src = getRandomTrack();
  bgMusic.play().catch(() => {
    document.body.addEventListener("click", () => bgMusic.play(), { once: true });
  });
});

// Ensure a **different random track** plays when the song ends
bgMusic.addEventListener("ended", () => {
  bgMusic.src = getRandomTrack();
  bgMusic.play();
});

// 🎶 **Check every second if music has stopped—if it has, play a new track**
setInterval(() => {
  if (bgMusic.paused) {
    bgMusic.src = getRandomTrack();
    bgMusic.play();
  }
}, 1000);

// 🛠 Settings Menu Functionality
settingsBtn.addEventListener("click", () => settingsMenu.classList.toggle("active"));
closeSettings.addEventListener("click", () => settingsMenu.classList.remove("active"));

fullscreenBtn.addEventListener("click", () => {
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});

// Save game progress
function saveGame() {
  localStorage.setItem("cupcakeCount", cupcakeCount);
  localStorage.setItem("money", money);
  localStorage.setItem("ovensOwned", ovensOwned);
  localStorage.setItem("bakers", JSON.stringify(bakers));
  localStorage.setItem("volume", volumeSlider.value);
  localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));
}

function loadGame() {
  cupcakeCount = parseInt(localStorage.getItem("cupcakeCount")) || 0;
  money = parseInt(localStorage.getItem("money")) || 0;
  ovensOwned = parseInt(localStorage.getItem("ovensOwned")) || 0;
  bakers = JSON.parse(localStorage.getItem("bakers")) || bakers;
  unlockedAchievements = JSON.parse(localStorage.getItem("achievements")) || [];
  volumeSlider.value = localStorage.getItem("volume") || 50;
  bgMusic.volume = volumeSlider.value / 100;
  updateCounter();
}

setInterval(saveGame, 5000);

// Reset game
resetBtn.addEventListener("click", () => {
  localStorage.clear();
  cupcakeCount = 0;
  money = 0;
  ovensOwned = 0;
  unlockedAchievements = [];
  localStorage.setItem("achievements", JSON.stringify(unlockedAchievements));

  bakers.forEach(baker => baker.level = 0);

  localStorage.setItem("volume", 50);
  volumeSlider.value = 50;
  bgMusic.volume = 0.5;

  updateCounter();
  updateBakerDisplay();
  renderAchievements();
});

window.onload = loadGame;

img.addEventListener("click", () => {
  if (cupcakeQueue < maxBatchSize) {
    cupcakeQueue++;
    batchCount.textContent = `Batch: ${cupcakeQueue} ${cupcakeQueue === 1 ? 'Cupcake' : 'Cupcakes'}`;
    renderShop();

    if (!baking) {
      baking = true;
      bakeProgress.style.display = "flex";
      startBaking();
    } else {
      pauseBaking();
    }
  }
});

function buyOven() {
  if (money >= 50) {
    money -= 50;
    ovensOwned++;
    maxBatchSize += 12 * ovensOwned;
    bakeSpeed *= 0.9;
    updateCounter();
  }
}

// Baking Progress Logic
function startBaking() {
  let progress = 0;
  let bakeInterval = setInterval(() => {
    if (progressPaused) return;
    progress += (100 / bakeSpeed) * 500;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(bakeInterval);
      finishBaking();
    }
  }, 500);
}

function pauseBaking() {
  progressPaused = true;
  setTimeout(() => progressPaused = false, 2000);
}

function finishBaking() {
  let batchSize = Math.min(maxBatchSize, cupcakeQueue);
  cupcakeQueue -= batchSize;
  cupcakeCount += batchSize;
  batchCount.textContent = "Batch: 0 Cupcakes";
  progressBar.style.width = "0%";
  bakeProgress.style.display = "none";
  baking = false;
  updateCounter();
}

versionText.textContent = "Version 1.0";
