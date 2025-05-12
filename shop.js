const cupcakeCounter = document.getElementById("counter");
const shopItemsContainer = document.getElementById("shop-items");
const bakerDisplay = document.getElementById("baker-display");

const tabs = {
  buy: document.getElementById("buy-tab"),
  sell: document.getElementById("sell-tab"),
};

let activeTab = "buy";

// 🔥 Increased base costs for items & bakers
const bakers = [
  {
    id: "grandmother",
    name: "Grandmother Baker",
    description: "Grandmothers are skilled bakers.",
    baseCost: 50, // ⬆️ Increased base price
    level: 0,
    cps: 1,
    image: "assets/bakers/grandmother_baker.png",
  },
];

const items = [
  {
    id: "oven",
    name: "Oven",
    description: "Ovens speed up baking and increase max batch size.",
    baseCost: 250, // ⬆️ Increased base price
    level: 0,
    speedBoost: 0.15, // 🔥 Bake time reduction increased slightly
    image: "assets/shop/oven.png",
  },
];

function formatNumber(num) {
  return Math.floor(num);
}

function updateCounter() {
  cupcakeCounter.innerText = `Cupcakes: ${formatNumber(cupcakeCount)} | Money: $${formatNumber(money)}`;
}

function switchTab(tabName) {
  activeTab = tabName;
  Object.entries(tabs).forEach(([name, tab]) => {
    tab.classList.toggle("active", name === tabName);
  });
  renderShop();
}

// 🔥 Updated price scaling for purchases
function buyItem(id) {
    const item = [...bakers, ...items].find(i => i.id === id);
    if (!item) return;

    const baseMultiplier = 3; // ⬆️ Increased price scaling factor

    const cost = item.baseCost * Math.pow(baseMultiplier, item.level); // Price correctly scales

    if (money >= cost) {
        money -= cost;
        item.level++;

        if (item.id === "oven") {
            ovensOwned++;
            maxBatchSize += 15 * ovensOwned; // 🔥 Bigger batch increase
            bakeSpeed *= 0.8; // 🔥 Bake time reduces more effectively
        } else {
            addBakerToDisplay(item);
        }

        updateCounter();
        renderShop();
    }
}

function sellCupcakes(amount) {
  if (cupcakeCount >= amount) {
    cupcakeCount -= amount;
    money += amount * 5;
    updateCounter();
    renderShop();
  }
}

function renderShop() {
  shopItemsContainer.innerHTML = "";

  if (activeTab === "sell") {
    let sellMultiples = Math.floor(cupcakeCount / 12);

    for (let i = 1; i <= sellMultiples; i++) {
      const sellAmount = i * 12;
      const sellDiv = document.createElement("div");
      sellDiv.className = "shop-item";
      sellDiv.innerHTML = `
        <div class="shop-info">
          <h3>Sell ${sellAmount} Cupcakes</h3>
          <div class="tooltip">Exchange your cupcakes for money.</div>
          <button class="buy-btn" onclick="sellCupcakes(${sellAmount})">Sell ${sellAmount} Cupcakes for $${sellAmount * 5}</button>
        </div>
      `;
      shopItemsContainer.appendChild(sellDiv);
    }
  } else {
    [...bakers, ...items].forEach(item => {
      const shopItem = document.createElement("div");
      shopItem.className = "shop-item";

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;

      const info = document.createElement("div");
      info.className = "shop-info";

      const name = document.createElement("h3");
      name.textContent = item.name;

      const tooltip = document.createElement("p");
      tooltip.className = "tooltip";
      tooltip.innerHTML = `${item.description}<br />
        🔥 Level: ${item.level}<br />
        ${item.id === "oven" ? `⏳ Bake Speed Boost: -${item.speedBoost * 100}%<br />` : `⚡ Speed: ${item.cps} cupcakes per second<br />`}
        💰 Cost: $${item.baseCost * Math.pow(3, item.level)}
      `; // ✅ Cost updates dynamically after each purchase

      const button = document.createElement("button");
      button.className = "buy-btn";
      button.textContent = "Buy";
      button.onclick = () => buyItem(item.id);

      info.append(name, tooltip, button);
      shopItem.append(img, info);
      shopItemsContainer.appendChild(shopItem);
    });
  }
}

// Run game updates every second WITHOUT auto-refreshing the shop
setInterval(() => {
  bakers.forEach(baker => {
    cupcakeCount += baker.cps * baker.level;
  });
  updateCounter();
}, 1000);

document.getElementById("buy-tab").addEventListener("click", () => switchTab("buy"));
document.getElementById("sell-tab").addEventListener("click", () => switchTab("sell"));
updateCounter();
renderShop();
