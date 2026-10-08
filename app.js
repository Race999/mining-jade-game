/* =========================================================
   《挖矿暴富：开石出玉》
   app.js  v2 优化版

   关键改进：
   - 事件委托（不再重复绑定监听器）
   - Pointer Events 优先，彻底避免 touch / mouse 双触发
   - 返回按钮接通，刷新可恢复状态
   - Toast 代替 alert
   - 图鉴 / 结果页稀有度配色
========================================================= */


/* =========================================================
   一、原石配置
========================================================= */

const STONE_CONFIG = {

  common_stone: {
    id: "stone_001",
    name: "普通石料",
    icon: "🪨",
    description: "随处可见的普通石料。",
    baseValue: { min: 5, max: 20 },
    results: [
      { id: "waste",       name: "废石",     icon: "🪨", rarity: "common",   probability: 80, value: { min: 1,  max: 10  }, collectionId: null },
      { id: "white_jade",  name: "普通玉",   icon: "⚪", rarity: "uncommon", probability: 18, value: { min: 20, max: 80  }, collectionId: 1 },
      { id: "qing_jade",   name: "青玉",     icon: "🟢", rarity: "rare",     probability: 2,  value: { min: 80, max: 300 }, collectionId: 2 }
    ]
  },

  yellow_brown_stone: {
    id: "stone_002",
    name: "黄褐原石",
    icon: "🟤",
    description: "黄褐色外皮的神秘原石。",
    baseValue: { min: 20, max: 80 },
    results: [
      { id: "waste",       name: "废石",     icon: "🪨", rarity: "common",   probability: 60, value: { min: 5,   max: 20  }, collectionId: null },
      { id: "white_jade",  name: "普通玉",   icon: "⚪", rarity: "uncommon", probability: 25, value: { min: 30,  max: 100 }, collectionId: 1 },
      { id: "qing_jade",   name: "青玉",     icon: "🟢", rarity: "rare",     probability: 10, value: { min: 100, max: 350 }, collectionId: 2 },
      { id: "yellow_jade", name: "黄玉",     icon: "🟡", rarity: "rare",     probability: 5,  value: { min: 200, max: 800 }, collectionId: 3 }
    ]
  },

  green_skin_stone: {
    id: "stone_003",
    name: "青皮原石",
    icon: "🟢",
    description: "青绿色外皮的原石。",
    baseValue: { min: 50, max: 200 },
    results: [
      { id: "waste",       name: "废石",     icon: "🪨", rarity: "common",   probability: 40, value: { min: 10,  max: 40   }, collectionId: null },
      { id: "white_jade",  name: "普通玉",   icon: "⚪", rarity: "uncommon", probability: 25, value: { min: 50,  max: 150  }, collectionId: 1 },
      { id: "qing_jade",   name: "青玉",     icon: "🟢", rarity: "rare",     probability: 20, value: { min: 150, max: 500  }, collectionId: 2 },
      { id: "yellow_jade", name: "黄玉",     icon: "🟡", rarity: "rare",     probability: 10, value: { min: 300, max: 1000 }, collectionId: 3 },
      { id: "jadeite",     name: "翡翠",     icon: "💚", rarity: "epic",     probability: 5,  value: { min: 500, max: 3000 }, collectionId: 4 }
    ]
  },

  black_wusa_stone: {
    id: "stone_004",
    name: "黑乌砂原石",
    icon: "⚫",
    description: "黑色砂皮原石，内部充满未知。",
    baseValue: { min: 100, max: 500 },
    results: [
      { id: "waste",       name: "废石",     icon: "🪨", rarity: "common",    probability: 30,   value: { min: 20,   max: 80    }, collectionId: null },
      { id: "white_jade",  name: "普通玉",   icon: "⚪", rarity: "uncommon",  probability: 20,   value: { min: 50,   max: 200   }, collectionId: 1 },
      { id: "qing_jade",   name: "青玉",     icon: "🟢", rarity: "rare",      probability: 20,   value: { min: 150,  max: 600   }, collectionId: 2 },
      { id: "yellow_jade", name: "黄玉",     icon: "🟡", rarity: "rare",      probability: 15,   value: { min: 300,  max: 1200  }, collectionId: 3 },
      { id: "jadeite",     name: "翡翠",     icon: "💚", rarity: "epic",      probability: 12,   value: { min: 500,  max: 3000  }, collectionId: 4 },
      { id: "violet",      name: "紫罗兰",   icon: "💜", rarity: "epic",      probability: 2.8,  value: { min: 1500, max: 8000  }, collectionId: 5 },
      { id: "ice_jadeite", name: "冰种翡翠", icon: "💎", rarity: "legendary", probability: 0.2,  value: { min: 8000, max: 50000 }, collectionId: 6 }
    ]
  },

  purple_skin_stone: {
    id: "stone_005",
    name: "紫皮原石",
    icon: "🟣",
    description: "稀有紫色表皮原石。",
    baseValue: { min: 300, max: 1500 },
    results: [
      { id: "waste",         name: "废石",     icon: "🪨", rarity: "common",    probability: 20,   value: { min: 30,    max: 100   }, collectionId: null },
      { id: "white_jade",    name: "普通玉",   icon: "⚪", rarity: "uncommon",  probability: 15,   value: { min: 80,    max: 250   }, collectionId: 1 },
      { id: "qing_jade",     name: "青玉",     icon: "🟢", rarity: "rare",      probability: 15,   value: { min: 200,   max: 700   }, collectionId: 2 },
      { id: "yellow_jade",   name: "黄玉",     icon: "🟡", rarity: "rare",      probability: 15,   value: { min: 400,   max: 1500  }, collectionId: 3 },
      { id: "jadeite",       name: "翡翠",     icon: "💚", rarity: "epic",      probability: 20,   value: { min: 800,   max: 5000  }, collectionId: 4 },
      { id: "violet",        name: "紫罗兰",   icon: "💜", rarity: "epic",      probability: 13,   value: { min: 1500,  max: 8000  }, collectionId: 5 },
      { id: "ice_jadeite",   name: "冰种翡翠", icon: "💎", rarity: "legendary", probability: 1.9,  value: { min: 8000,  max: 50000 }, collectionId: 6 },
      { id: "imperial_green",name: "帝王绿",   icon: "👑", rarity: "mythic",    probability: 0.1,  value: { min: 50000, max: 300000}, collectionId: 7 }
    ]
  },

  mysterious_stone: {
    id: "stone_006",
    name: "神秘原石",
    icon: "👑",
    description: "极其罕见的神秘原石。",
    baseValue: { min: 1000, max: 5000 },
    results: [
      { id: "waste",         name: "废石",     icon: "🪨", rarity: "common",    probability: 10,   value: { min: 50,    max: 200   }, collectionId: null },
      { id: "white_jade",    name: "普通玉",   icon: "⚪", rarity: "uncommon",  probability: 10,   value: { min: 100,   max: 400   }, collectionId: 1 },
      { id: "qing_jade",     name: "青玉",     icon: "🟢", rarity: "rare",      probability: 10,   value: { min: 300,   max: 1000  }, collectionId: 2 },
      { id: "yellow_jade",   name: "黄玉",     icon: "🟡", rarity: "rare",      probability: 10,   value: { min: 500,   max: 2000  }, collectionId: 3 },
      { id: "jadeite",       name: "翡翠",     icon: "💚", rarity: "epic",      probability: 25,   value: { min: 1000,  max: 8000  }, collectionId: 4 },
      { id: "violet",        name: "紫罗兰",   icon: "💜", rarity: "epic",      probability: 25,   value: { min: 2000,  max: 10000 }, collectionId: 5 },
      { id: "ice_jadeite",   name: "冰种翡翠", icon: "💎", rarity: "legendary", probability: 9.5,  value: { min: 10000, max: 80000 }, collectionId: 6 },
      { id: "imperial_green",name: "帝王绿",   icon: "👑", rarity: "mythic",    probability: 0.5,  value: { min: 50000, max: 300000}, collectionId: 7 }
    ]
  }
};


/* =========================================================
   二、图鉴
========================================================= */

const COLLECTION_CONFIG = [
  { id: 1, name: "普通玉",   icon: "⚪", rarity: "uncommon"  },
  { id: 2, name: "青玉",     icon: "🟢", rarity: "rare"      },
  { id: 3, name: "黄玉",     icon: "🟡", rarity: "rare"      },
  { id: 4, name: "翡翠",     icon: "💚", rarity: "epic"      },
  { id: 5, name: "紫罗兰",   icon: "💜", rarity: "epic"      },
  { id: 6, name: "冰种翡翠", icon: "💎", rarity: "legendary" },
  { id: 7, name: "帝王绿",   icon: "👑", rarity: "mythic"    }
];


/* =========================================================
   三、默认数据 + 存档
========================================================= */

const STORAGE_KEY = "mining_jade_game_v2";

const DEFAULT_GAME_DATA = {
  coins: 1000,
  depth: 0,
  pickaxeLevel: 1,
  totalMined: 0,
  totalOpened: 0,
  currentStone: null,
  currentResult: null,
  collection: {},
  lastAction: null
};


function loadGame() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_GAME_DATA };
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_GAME_DATA, ...parsed };
  } catch (e) {
    console.error("读取存档失败:", e);
    return { ...DEFAULT_GAME_DATA };
  }
}

function saveGame() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData));
  } catch (e) {
    console.error("保存存档失败:", e);
  }
}

let gameData = loadGame();


/* =========================================================
   四、工具
========================================================= */

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatMoney(value) {
  return Number(value).toLocaleString("zh-CN");
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setProgress(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = clamp(value, 0, 100) + "%";
}

/* ---------- Toast ---------- */

let toastTimer = null;

function toast(message, duration = 1800) {
  const el = document.getElementById("toast");
  if (!el) return;

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), duration);
}


/* =========================================================
   五、概率结果
========================================================= */

function getStoneResult(stoneType) {
  const stone = STONE_CONFIG[stoneType];
  if (!stone) {
    console.error("找不到原石:", stoneType);
    return null;
  }

  const random = Math.random() * 100;
  let cumulative = 0;

  for (const result of stone.results) {
    cumulative += result.probability;
    if (random < cumulative) {
      return buildResult(stone, stoneType, result);
    }
  }

  // 防止浮点误差
  const last = stone.results[stone.results.length - 1];
  return buildResult(stone, stoneType, last);
}

function buildResult(stone, stoneType, result) {
  return {
    stoneId:     stone.id,
    stoneType,
    stoneName:   stone.name,
    resultId:    result.id,
    resultName:  result.name,
    resultIcon:  result.icon,
    rarity:      result.rarity,
    value:       randomInt(result.value.min, result.value.max),
    collectionId: result.collectionId
  };
}


/* =========================================================
   六、生成原石
========================================================= */

function generateStone() {
  let availableStones;

  if (gameData.depth < 100) {
    availableStones = ["common_stone"];
  } else if (gameData.depth < 300) {
    availableStones = ["common_stone", "yellow_brown_stone"];
  } else if (gameData.depth < 600) {
    availableStones = ["common_stone", "yellow_brown_stone", "green_skin_stone"];
  } else if (gameData.depth < 1000) {
    availableStones = ["yellow_brown_stone", "green_skin_stone", "black_wusa_stone"];
  } else if (gameData.depth < 1500) {
    availableStones = ["green_skin_stone", "black_wusa_stone", "purple_skin_stone"];
  } else {
    availableStones = ["black_wusa_stone", "purple_skin_stone", "mysterious_stone"];
  }

  const type = availableStones[randomInt(0, availableStones.length - 1)];
  const config = STONE_CONFIG[type];

  const stone = {
    uid: "stone_" + Date.now() + "_" + randomInt(1000, 9999),
    type,
    name: config.name,
    icon: config.icon,
    baseValue: randomInt(config.baseValue.min, config.baseValue.max),
    progress: 0,
    mode: null,
    result: null,
    opened: false
  };

  gameData.currentStone = stone;
  saveGame();
  return stone;
}


/* =========================================================
   七、挖矿
========================================================= */

function mine() {
  // 已有未处理原石
  if (gameData.currentStone && !gameData.currentStone.opened) {
    toast("先把当前原石处理掉再挖吧");
    return null;
  }

  const power = gameData.pickaxeLevel;
  gameData.depth += power * 10;
  gameData.totalMined++;
  gameData.lastAction = "mining";

  if (Math.random() < 0.3) {
    const stone = generateStone();
    gameData.lastAction = "found_stone";
    saveGame();
    return stone;
  }

  saveGame();
  return null;
}


/* =========================================================
   八、开石
========================================================= */

function startOpening() {
  const stone = gameData.currentStone;

  if (!stone) { toast("你还没有原石"); return; }
  if (stone.opened) { toast("这块原石已经开过了"); return; }

  stone.mode = "open";
  stone.progress = 0;

  // 开始时确定最终结果
  gameData.currentResult = getStoneResult(stone.type);
  saveGame();

  showScreen("opening");
  renderOpening();
}

function hitStone() {
  const stone = gameData.currentStone;
  if (!stone) return;
  if (stone.mode !== "open") return;
  if (stone.opened) return;

  stone.progress = clamp(stone.progress + 25, 0, 100);
  saveGame();
  renderOpening();

  if (stone.progress >= 100) {
    finishOpening();
  }
}

function finishOpening() {
  const stone = gameData.currentStone;
  if (!stone) return;

  stone.progress = 100;
  stone.opened = true;
  gameData.totalOpened++;
  gameData.lastAction = "opening_finished";
  saveGame();

  setTimeout(revealResult, 700);
}


/* =========================================================
   九、擦玉
========================================================= */

let isPolishing = false;
let lastPointerX = 0;
let lastPointerY = 0;
let polishStage = -1;

const SUPPORTS_POINTER = "PointerEvent" in window;


function startPolishing() {
  const stone = gameData.currentStone;

  if (!stone) { toast("你还没有原石"); return; }
  if (stone.opened) { toast("这块原石已经开过了"); return; }

  stone.mode = "polish";
  stone.progress = 0;

  polishStage = -1;
  isPolishing = false;

  gameData.currentResult = getStoneResult(stone.type);
  saveGame();

  showScreen("polishing");
  renderPolishing(true);
}


/* ---------- 指针坐标 ---------- */

function getPointerPosition(event) {
  if (
    typeof event.clientX === "number" &&
    typeof event.clientY === "number"
  ) {
    return { x: event.clientX, y: event.clientY };
  }

  const touch =
    (event.touches && event.touches[0]) ||
    (event.changedTouches && event.changedTouches[0]);

  if (touch) {
    return { x: touch.clientX, y: touch.clientY };
  }

  return { x: 0, y: 0 };
}


/* ---------- 擦玉事件 ---------- */

function onPolishStart(event) {
  const stone = gameData.currentStone;
  if (!stone) return;
  if (stone.mode !== "polish") return;
  if (stone.opened) return;
  if (isPolishing) return;

  const pos = getPointerPosition(event);
  isPolishing = true;
  lastPointerX = pos.x;
  lastPointerY = pos.y;

  // Pointer Capture：手指滑出元素后仍可继续擦
  if (
    SUPPORTS_POINTER &&
    event.pointerId !== undefined &&
    event.currentTarget.setPointerCapture
  ) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch (_) { /* ignore */ }
  }

  if (event.cancelable) event.preventDefault();
}

function onPolishMove(event) {
  if (!isPolishing) return;

  const stone = gameData.currentStone;
  if (!stone || stone.mode !== "polish" || stone.opened) {
    isPolishing = false;
    return;
  }

  const pos = getPointerPosition(event);
  const dx = pos.x - lastPointerX;
  const dy = pos.y - lastPointerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance >= 2) {
    // 单次最多涨 4%，防止快速甩动直接完成
    const increase = Math.min(distance * 0.12, 4);

    stone.progress = clamp(stone.progress + increase, 0, 100);
    lastPointerX = pos.x;
    lastPointerY = pos.y;

    renderPolishing();
    saveGame();

    if (stone.progress >= 100) {
      isPolishing = false;
      finishPolishing();
      return;
    }
  }

  if (event.cancelable) event.preventDefault();
}

function onPolishEnd(event) {
  isPolishing = false;

  if (
    SUPPORTS_POINTER &&
    event &&
    event.pointerId !== undefined &&
    event.currentTarget.releasePointerCapture
  ) {
    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch (_) { /* ignore */ }
  }

  if (event && event.cancelable) event.preventDefault();
}


/* ---------- 擦玉事件绑定（只执行一次） ---------- */

function bindPolishingEvents() {
  const area = document.getElementById("polishingStoneVisual");
  if (!area) return;

  // CSS 层面再加一道保险
  area.style.touchAction = "none";
  area.style.userSelect = "none";
  area.style.webkitUserSelect = "none";
  area.style.webkitTouchCallout = "none";

  if (SUPPORTS_POINTER) {
    // 现代浏览器：只绑 Pointer，不再绑 touch / mouse
    area.addEventListener("pointerdown", onPolishStart, { passive: false });
    area.addEventListener("pointermove", onPolishMove,  { passive: false });
    area.addEventListener("pointerup",   onPolishEnd,   { passive: false });
    area.addEventListener("pointercancel", onPolishEnd, { passive: false });
  } else {
    // 老浏览器：只绑 touch + mouse
    area.addEventListener("touchstart", onPolishStart, { passive: false });
    area.addEventListener("touchmove",  onPolishMove,  { passive: false });
    area.addEventListener("touchend",   onPolishEnd,   { passive: false });
    area.addEventListener("touchcancel",onPolishEnd,   { passive: false });

    area.addEventListener("mousedown",  onPolishStart);
    area.addEventListener("mousemove",  onPolishMove);
    area.addEventListener("mouseup",    onPolishEnd);
    area.addEventListener("mouseleave", onPolishEnd);
  }
}


function finishPolishing() {
  const stone = gameData.currentStone;
  if (!stone) return;

  stone.progress = 100;
  stone.opened = true;
  gameData.totalOpened++;
  gameData.lastAction = "polishing_finished";
  saveGame();

  setTimeout(revealResult, 700);
}


/* =========================================================
   十、揭晓 / 出售
========================================================= */

function revealResult() {
  const result = gameData.currentResult;
  if (!result) {
    toast("结果生成失败，请重试");
    return;
  }

  let isNewCollection = false;

  if (result.collectionId) {
    const key = String(result.collectionId);
    if (!gameData.collection[key]) {
      gameData.collection[key] = true;
      isNewCollection = true;
    }
  }

  gameData.lastAction = "revealed";
  saveGame();

  showScreen("result");
  renderResult(result, isNewCollection);
}

function sellResult() {
  const result = gameData.currentResult;
  if (!result) { toast("没有可以出售的玉石"); return; }

  gameData.coins += result.value;
  gameData.currentStone = null;
  gameData.currentResult = null;
  gameData.lastAction = "sold";
  saveGame();

  toast(`💰 出售成功，获得 ¥${formatMoney(result.value)}`);
  showScreen("game");
  renderGame();
}

function sellRawStone() {
  const stone = gameData.currentStone;
  if (!stone) return;
  if (stone.opened) { toast("这块原石已经开过了"); return; }

  gameData.coins += stone.baseValue;
  gameData.currentStone = null;
  gameData.currentResult = null;
  gameData.lastAction = "sold_raw";
  saveGame();

  toast(`💰 原石出售成功，获得 ¥${formatMoney(stone.baseValue)}`);
  showScreen("game");
  renderGame();
}


/* =========================================================
   十一、渲染
========================================================= */

function renderGame() {
  setText("coins", formatMoney(gameData.coins));
  setText("depth", gameData.depth + "m");
  setText("pickaxeLevel", gameData.pickaxeLevel);
  setText("totalMined", gameData.totalMined);
  setText("collectionCount", getCollectionCount() + "/" + COLLECTION_CONFIG.length);

  const stone = gameData.currentStone;
  const stoneArea = document.getElementById("currentStone");
  if (!stoneArea) return;

  /* 无原石 */
  if (!stone) {
    stoneArea.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⛏️</div>
        <p>还没有原石</p>
        <small>继续挖矿寻找原石</small>
      </div>
    `;
    return;
  }

  /* 已经开过（比如刷新后） */
  if (stone.opened && gameData.currentResult) {
    stoneArea.innerHTML = `
      <div class="stone-card">
        <div class="stone-icon">${stone.icon}</div>
        <h3>${stone.name}</h3>
        <p>这块原石已经开过了</p>
        <div class="stone-actions">
          <button class="btn primary" data-action="viewResult" type="button">
            🎉 查看结果
          </button>
        </div>
      </div>
    `;
    return;
  }

  /* 普通原石 */
  stoneArea.innerHTML = `
    <div class="stone-card">
      <div class="stone-icon">${stone.icon}</div>
      <h3>${stone.name}</h3>
      <p>原石基础估值</p>
      <strong>¥${formatMoney(stone.baseValue)}</strong>

      <div class="stone-actions">
        <button class="btn secondary" data-action="sellRaw" type="button">💰 直接出售</button>
        <button class="btn primary"   data-action="open"    type="button">🔨 开石</button>
        <button class="btn special"   data-action="polish"  type="button">✨ 擦玉</button>
      </div>
    </div>
  `;
}


function renderOpening() {
  const stone = gameData.currentStone;
  if (!stone) return;

  const p = stone.progress;

  setText("openingStoneName", stone.name);
  setText("openingProgress", Math.floor(p) + "%");
  setProgress("openingProgressBar", p);

  const visual = document.getElementById("openingStoneVisual");
  if (!visual) return;

  let stage = 0;
  if (p >= 100)     stage = 4;
  else if (p >= 75) stage = 3;
  else if (p >= 50) stage = 2;
  else if (p >= 25) stage = 1;

  visual.dataset.stage = String(stage);
  visual.textContent = stage === 4 ? "💥" : "🪨";

  if (p > 0 && p < 100) {
    visual.classList.remove("hit");
    void visual.offsetWidth; // 强制重排以重启动画
    visual.classList.add("hit");
  }
}


function renderPolishing(force = false) {
  const stone = gameData.currentStone;
  if (!stone) return;

  const p = stone.progress;

  setText("polishingStoneName", stone.name);
  setText("polishingProgress", Math.floor(p) + "%");
  setProgress("polishingProgressBar", p);

  let stage;
  if (p >= 100)     stage = 5;
  else if (p >= 75) stage = 4;
  else if (p >= 50) stage = 3;
  else if (p >= 25) stage = 2;
  else              stage = 1;

  if (!force && stage === polishStage) return;
  polishStage = stage;

  const visual = document.getElementById("polishingStoneVisual");
  if (!visual) return;

  const icons = { 1: "🪨", 2: "🪨", 3: "🟢", 4: "💚", 5: "💎" };
  const tips  = {
    1: "",
    2: "好像有颜色……",
    3: "发现绿色！",
    4: "越来越明显了！",
    5: ""
  };

  visual.innerHTML = `
    <div class="stone-layer stage-${stage}">${icons[stage]}</div>
    ${tips[stage] ? `<small>${tips[stage]}</small>` : ""}
  `;
}


function renderResult(result, isNewCollection) {
  setText("resultIcon", result.resultIcon);
  setText("resultName", result.resultName);
  setText("resultValue", "¥" + formatMoney(result.value));
  setText("resultRarity", getRarityText(result.rarity));

  const rarityEl = document.getElementById("resultRarity");
  if (rarityEl) rarityEl.dataset.rarity = result.rarity;

  const badge = document.getElementById("newCollection");
  if (!badge) return;

  badge.innerHTML = isNewCollection ? "📖 新图鉴解锁！" : "已有图鉴";
  badge.style.display = "block";
}


function getRarityText(rarity) {
  const map = {
    common:    "普通",
    uncommon:  "稀有",
    rare:      "珍稀",
    epic:      "史诗",
    legendary: "传说",
    mythic:    "神话"
  };
  return map[rarity] || "未知";
}


/* =========================================================
   十二、图鉴
========================================================= */

function getCollectionCount() {
  return Object.keys(gameData.collection)
    .filter(k => gameData.collection[k]).length;
}

function isCollected(id) {
  return !!gameData.collection[String(id)];
}

function renderCollection() {
  const container = document.getElementById("collectionList");
  if (!container) return;

  container.innerHTML = COLLECTION_CONFIG.map(item => {
    const collected = isCollected(item.id);

    return `
      <div class="collection-card ${collected ? "collected" : "locked"}">
        <div class="collection-icon">
          ${collected ? item.icon : "❓"}
        </div>
        <div class="collection-info">
          <strong>${collected ? item.name : "???"}</strong>
          <small>图鉴 #${String(item.id).padStart(2, "0")}</small>
        </div>
      </div>
    `;
  }).join("");

  setText(
    "collectionProgress",
    getCollectionCount() + "/" + COLLECTION_CONFIG.length
  );
}


/* =========================================================
   十三、页面切换
========================================================= */

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

  const target = document.getElementById(name);
  if (target) target.classList.add("active");

  // 回到顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =========================================================
   十四、矿镐升级
========================================================= */

function getPickaxeUpgradeCost() {
  return Math.floor(300 * Math.pow(1.65, gameData.pickaxeLevel - 1));
}

function upgradePickaxe() {
  const cost = getPickaxeUpgradeCost();

  if (gameData.coins < cost) {
    toast(`金币不足，需要 ¥${formatMoney(cost)}`);
    return;
  }

  gameData.coins -= cost;
  gameData.pickaxeLevel++;
  saveGame();

  toast(`⚒️ 矿镐升级成功！当前等级 ${gameData.pickaxeLevel}`);
  renderGame();
}


/* =========================================================
   十五、重置
========================================================= */

function resetGame() {
  if (!confirm("确定要删除全部游戏进度吗？")) return;

  localStorage.removeItem(STORAGE_KEY);
  gameData = { ...DEFAULT_GAME_DATA };
  location.reload();
}


/* =========================================================
   十六、事件委托（统一入口）
========================================================= */

const ACTIONS = {

  mine() {
    const stone = mine();
    if (stone) {
      toast(`🎉 挖到 ${stone.icon} ${stone.name}`);
    }
    renderGame();
  },

  open()     { startOpening(); },
  polish()   { startPolishing(); },
  sellRaw()  { sellRawStone(); },
  hit()      { hitStone(); },
  sellResult() { sellResult(); },

  back() {
    showScreen("game");
    renderGame();
  },

  collection() {
    showScreen("collection");
    renderCollection();
  },

  upgrade()  { upgradePickaxe(); },
  reset()    { resetGame(); },

  viewResult() {
    if (!gameData.currentResult) return;
    showScreen("result");
    renderResult(gameData.currentResult, false);
  }
};


function bindGlobalEvents() {
  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el) return;

    const action = el.dataset.action;
    const handler = ACTIONS[action];
    if (typeof handler === "function") {
      event.preventDefault();
      handler(el);
    }
  });
}


/* =========================================================
   十七、概率测试（调试用）
========================================================= */

function testResult(stoneType, count = 10000) {
  const statistics = {};

  for (let i = 0; i < count; i++) {
    const result = getStoneResult(stoneType);
    if (!result) continue;
    statistics[result.resultName] = (statistics[result.resultName] || 0) + 1;
  }

  console.table(
    Object.entries(statistics).map(([name, value]) => ({
      result: name,
      count: value,
      percentage: ((value / count) * 100).toFixed(2) + "%"
    }))
  );
}


/* =========================================================
   十八、初始化
========================================================= */

function initGame() {
  console.log("《挖矿暴富：开石出玉》启动");
  console.log("当前游戏数据:", gameData);

  bindGlobalEvents();
  bindPolishingEvents();

  // 恢复状态
  if (
    gameData.currentStone &&
    gameData.currentStone.opened &&
    gameData.currentResult
  ) {
    // 上次已经开完但还没出售
    showScreen("result");
    renderResult(gameData.currentResult, false);
  } else {
    showScreen("game");
    renderGame();
  }

  renderCollection();
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}


/* =========================================================
   十九、调试接口
========================================================= */

window.JADE_GAME = {
  getData: () => gameData,
  mine,
  startOpening,
  startPolishing,
  hitStone,
  sellResult,
  sellRawStone,
  upgradePickaxe,
  renderCollection,
  testResult,
  resetGame,
  STONE_CONFIG,
  COLLECTION_CONFIG
};
