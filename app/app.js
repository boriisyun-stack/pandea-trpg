const STORAGE_KEY = "pandea-mini-sheet-v1";
const PORTRAIT_STORAGE_KEY = "pandea-mini-sheet-portrait-v1";
const THEME_STORAGE_KEY = "pandea-mini-sheet-theme";

const statDefs = [
  ["str", "근력"],
  ["agi", "민첩"],
  ["end", "체력"],
  ["int", "지성"],
  ["wil", "정신"],
  ["mana", "마나"],
  ["cha", "매력"],
];

const pairResourceDefs = [
  ["hp", "HP", 10, 10],
  ["fatigue", "피로", 0, 6],
  ["mp", "MP", 6, 6],
  ["hunger", "배고픔", 0, 7],
];

const singleResourceDefs = [
  ["armor", "방호", 0],
  ["audience", "관중", 0],
  ["freedom", "자유", 0],
  ["suspicion", "의심", 0],
];

const agmFollowUps = [
  "누가 봤나?",
  "누가 잘못 이해했나?",
  "어떤 흔적이 남았나?",
  "무엇이 다음 장면까지 따라오나?",
  "언제 이 대가가 터지나?",
  "이 일로 누가 이득을 보나?",
];

const dagmSeeds = [
  {
    impression: "냄새",
    pressure: "굶주림",
    question: "누가 먹지 못했나?",
    sensory: "식은 죽 냄새가 바닥의 쇠 냄새와 섞인다.",
    focus: "비어 있는 그릇 하나가 발치까지 굴러온다.",
    pressureLine: "배식 담당은 부족한 몫을 실수라고 부르지 않는다.",
    questionLine: "누군가가 자기 몫 대신 네 손목 번호를 보고 있다.",
    hook: "죽그릇, 배식통 바닥, 굶주린 시선이 모두 닿을 듯 가깝다.",
  },
  {
    impression: "소리",
    pressure: "추적",
    question: "누가 먼저 도착하나?",
    sensory: "사슬 끌리는 소리가 한 박자 늦게 따라온다.",
    focus: "모퉁이 안쪽에서 이미 발소리가 멈춰 있다.",
    pressureLine: "경비는 네 이름 대신 별명을 부르며 가까워진다.",
    questionLine: "네가 움직이기 전에 도주로 하나가 조용히 닫힌다.",
    hook: "그림자, 벽 틈, 발자국 하나가 아직 남아 있다.",
  },
  {
    impression: "사람",
    pressure: "거래",
    question: "누가 값을 올리나?",
    sensory: "낮은 흥정 소리가 사람들의 숨소리 사이를 지난다.",
    focus: "깨끗한 장갑을 낀 손이 낡은 장부 위에 동전을 올린다.",
    pressureLine: "누군가 너를 사람과 물건이 같은 줄에 적는다.",
    questionLine: "어둠 속 다른 손이 네 이름도 모른 채 한 닢을 더 얹는다.",
    hook: "장부 귀퉁이, 동전, 하인의 흔들리는 손목이 보인다.",
  },
  {
    impression: "물건",
    pressure: "비밀",
    question: "무엇이 기록과 다르나?",
    sensory: "마른 종이가 접히는 소리가 이상하게 크게 들린다.",
    focus: "문서에는 네 이름이 없는데 낙인 번호만 붉은 줄로 표시되어 있다.",
    pressureLine: "기록을 쥔 사람은 틀린 부분을 읽지 않고 손으로 가린다.",
    questionLine: "가린 문장 끝에 네가 모르는 이름 하나가 삐져나온다.",
    hook: "문서 모서리, 잉크 얼룩, 낙인의 붉은 줄을 건드릴 수 있다.",
  },
  {
    impression: "장소",
    pressure: "시간",
    question: "무엇이 곧 닫히나?",
    sensory: "좁은 통로의 열기가 갑자기 빠져나간다.",
    focus: "철문 위 쇠고리가 천천히 내려가기 시작한다.",
    pressureLine: "교대 직전의 경비가 마지막 확인을 서두른다.",
    questionLine: "닫히면 오늘 밤까지 열리지 않을 틈이 아직 손가락 하나만큼 남았다.",
    hook: "문고리, 경비의 시선, 바닥의 쐐기가 모두 선택지가 된다.",
  },
  {
    impression: "이상함",
    pressure: "세계반응",
    question: "어떤 소문으로 남나?",
    sensory: "방금까지 시끄럽던 곳이 너무 깨끗하게 조용하다.",
    focus: "먼지가 없는 바닥에 네 발자국만 또렷하다.",
    pressureLine: "누군가 이 장면을 이미 이야기처럼 외우고 있다.",
    questionLine: "경비 하나가 네 행동을 보고 웃으며 새 별명을 중얼거린다.",
    hook: "목격자, 발자국, 아직 퍼지지 않은 첫 문장이 남아 있다.",
  },
];

const dagmCosts = [
  "시간이 든다.",
  "소리가 난다.",
  "자원을 쓴다.",
  "누가 오해한다.",
  "일부만 된다.",
  "더 큰 문제의 단서가 보인다.",
];

const dagmOpportunities = [
  "지금 잡으면 값이 싸지만, 장면이 지나면 비싸진다.",
  "작은 사람 하나가 도움을 줄 마음이 생긴다.",
  "위험한 길 하나와 안전한 척하는 길 하나가 동시에 보인다.",
  "NPC 하나가 이 일을 기억한다.",
  "도감에 적을 만한 특징이 드러난다.",
  "다음 판정에 쓸 수 있는 단서가 생긴다.",
];

const el = {};
let state = loadState();
const portrait = {
  width: 512,
  height: 512,
  background: "#f8faf9",
  activeTool: "brush",
  activeLayerId: null,
  layers: [],
  undo: [],
  redo: [],
  isDrawing: false,
  startPoint: null,
  lastPoint: null,
  hoverPoint: null,
  pointerInside: false,
  backgroundChanging: false,
};

document.addEventListener("DOMContentLoaded", async () => {
  bindElements();
  normalizeState();
  initThemeMode();
  await initPortraitEditor();
  renderSheet();
  renderDicePanel();
  renderOraclePanel();
  renderHistory();
  bindEvents();
  setSaveStatus("자동 저장됨");
});

function bindElements() {
  for (const id of [
    "saveStatus",
    "themeToggleBtn",
    "saveBtn",
    "resetBtn",
    "charName",
    "charAlias",
    "charOrigin",
    "charGoal",
    "statsGrid",
    "resourcesGrid",
    "skillsNote",
    "gearNote",
    "storyNote",
    "diceMinusBtn",
    "dicePlusBtn",
    "diceCount",
    "useDifficulty",
    "difficulty",
    "rollBtn",
    "rollResult",
    "rollHistory",
    "clearHistoryBtn",
    "agmQuestion",
    "agmChance",
    "agmRollBtn",
    "agmOutput",
    "dagmPlace",
    "dagmDensity",
    "dagmSceneBtn",
    "dagmActionBtn",
    "dagmAction",
    "dagmOutput",
    "portraitEditor",
    "portraitCanvas",
    "portraitPreviewCanvas",
    "paintColor",
    "backgroundColor",
    "brushSize",
    "brushSizeValue",
    "shapeFill",
    "undoPaintBtn",
    "redoPaintBtn",
    "portraitUpload",
    "downloadPortraitBtn",
    "focusPortraitBtn",
    "portraitSize",
    "resizePortraitBtn",
    "addLayerBtn",
    "deleteLayerBtn",
    "layerList",
  ]) {
    el[id] = document.getElementById(id);
  }
}

function defaultState() {
  const stats = {};
  for (const [id] of statDefs) {
    stats[id] = id === "cha" ? 2 : 1;
  }

  const resources = {};
  for (const [id, label, value, max] of pairResourceDefs) {
    resources[id] = { label, value, max };
  }
  for (const [id, label, value] of singleResourceDefs) {
    resources[id] = { label, value };
  }

  return {
    character: {
      name: "미라",
      alias: "비참한 아이",
      origin: "빚 노예",
      goal: "첫 도감 카드로 이름 되찾기",
      stats,
      resources,
      skillsNote: "초급: 회피, 생존, 감각\n숙련표식:",
      gearNote: "낡은 단검, 찢어진 옷, 말린 고기 1끼",
      storyNote: "흉터:\n도감:\n메모:",
    },
    dice: {
      count: 4,
      useDifficulty: true,
      difficulty: 2,
      history: [],
    },
    oracle: {
      agmQuestion: "이 NPC는 지금 나를 이용하려 하나?",
      agmChance: 0,
      agmResult: null,
      dagmPlace: "콜로세움 우리",
      dagmDensity: "short",
      dagmAction: "손목 번호를 가리고 배식 담당의 표정을 살핀다.",
      dagmResult: null,
    },
  };
}

function normalizeState() {
  const defaults = defaultState();
  state.character ??= defaults.character;
  state.character.stats ??= defaults.character.stats;
  state.character.resources ??= defaults.character.resources;

  for (const [id] of statDefs) {
    if (!Number.isFinite(Number(state.character.stats[id]))) {
      state.character.stats[id] = defaults.character.stats[id];
    }
  }

  for (const [id, label, value, max] of pairResourceDefs) {
    state.character.resources[id] ??= { label, value, max };
    state.character.resources[id].label = label;
    state.character.resources[id].value = cleanNumber(state.character.resources[id].value, value, -99, 99);
    state.character.resources[id].max = cleanNumber(state.character.resources[id].max, max, 0, 99);
  }

  for (const [id, label, value] of singleResourceDefs) {
    state.character.resources[id] ??= { label, value };
    state.character.resources[id].label = label;
    state.character.resources[id].value = cleanNumber(state.character.resources[id].value, value, -99, 99);
  }

  state.character.name ??= defaults.character.name;
  state.character.alias ??= defaults.character.alias;
  state.character.origin ??= defaults.character.origin;
  state.character.goal ??= defaults.character.goal;
  state.character.skillsNote ??= defaults.character.skillsNote;
  state.character.gearNote ??= defaults.character.gearNote;
  state.character.storyNote ??= defaults.character.storyNote;

  state.dice ??= defaults.dice;
  state.dice.count = cleanNumber(state.dice.count, defaults.dice.count, 1, 10);
  state.dice.difficulty = cleanNumber(state.dice.difficulty, defaults.dice.difficulty, 0, 12);
  state.dice.useDifficulty = Boolean(state.dice.useDifficulty);
  state.dice.history = Array.isArray(state.dice.history) ? state.dice.history.slice(0, 12) : [];

  state.oracle ??= defaults.oracle;
  state.oracle.agmQuestion ??= defaults.oracle.agmQuestion;
  state.oracle.agmChance = cleanNumber(state.oracle.agmChance, defaults.oracle.agmChance, -2, 2);
  state.oracle.agmResult = normalizeOracleResult(state.oracle.agmResult);
  state.oracle.dagmPlace ??= defaults.oracle.dagmPlace;
  state.oracle.dagmDensity = ["short", "normal", "deep"].includes(state.oracle.dagmDensity)
    ? state.oracle.dagmDensity
    : defaults.oracle.dagmDensity;
  state.oracle.dagmAction ??= defaults.oracle.dagmAction;
  state.oracle.dagmResult = normalizeOracleResult(state.oracle.dagmResult);
}

function renderSheet() {
  el.charName.value = state.character.name;
  el.charAlias.value = state.character.alias;
  el.charOrigin.value = state.character.origin;
  el.charGoal.value = state.character.goal;
  el.skillsNote.value = state.character.skillsNote;
  el.gearNote.value = state.character.gearNote;
  el.storyNote.value = state.character.storyNote;

  el.statsGrid.innerHTML = "";
  for (const [id, label] of statDefs) {
    const card = document.createElement("label");
    card.className = "stat-card";
    card.textContent = label;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "6";
    input.inputMode = "numeric";
    input.value = state.character.stats[id];
    input.addEventListener("input", () => {
      state.character.stats[id] = cleanNumber(input.value, 0, 0, 6);
      saveSoon();
    });

    card.append(input);
    el.statsGrid.append(card);
  }

  el.resourcesGrid.innerHTML = "";
  for (const [id] of pairResourceDefs) {
    el.resourcesGrid.append(renderPairResource(id));
  }
  for (const [id] of singleResourceDefs) {
    el.resourcesGrid.append(renderSingleResource(id));
  }
}

function renderPairResource(id) {
  const resource = state.character.resources[id];
  const card = document.createElement("label");
  card.className = "resource-card";
  card.append(document.createTextNode(resource.label));

  const row = document.createElement("div");
  row.className = "resource-pair";

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.inputMode = "numeric";
  valueInput.value = resource.value;
  valueInput.addEventListener("input", () => {
    resource.value = cleanNumber(valueInput.value, 0, -99, 99);
    saveSoon();
  });

  const slash = document.createElement("span");
  slash.textContent = "/";

  const maxInput = document.createElement("input");
  maxInput.type = "number";
  maxInput.inputMode = "numeric";
  maxInput.value = resource.max;
  maxInput.addEventListener("input", () => {
    resource.max = cleanNumber(maxInput.value, 0, 0, 99);
    saveSoon();
  });

  row.append(valueInput, slash, maxInput);
  card.append(row);
  return card;
}

function renderSingleResource(id) {
  const resource = state.character.resources[id];
  const card = document.createElement("label");
  card.className = "resource-card";
  card.append(document.createTextNode(resource.label));

  const input = document.createElement("input");
  input.type = "number";
  input.inputMode = "numeric";
  input.value = resource.value;
  input.addEventListener("input", () => {
    resource.value = cleanNumber(input.value, 0, -99, 99);
    saveSoon();
  });

  card.append(input);
  return card;
}

function renderDicePanel() {
  el.diceCount.value = state.dice.count;
  el.useDifficulty.checked = state.dice.useDifficulty;
  el.difficulty.value = state.dice.difficulty;
  el.difficulty.disabled = !state.dice.useDifficulty;
}

function initThemeMode() {
  const theme = getThemeMode();
  applyThemeMode(theme);
  el.themeToggleBtn.addEventListener("click", () => {
    const nextTheme = getThemeMode() === "dark" ? "light" : "dark";
    applyThemeMode(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });
}

function getThemeMode() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function applyThemeMode(theme) {
  document.documentElement.dataset.theme = theme;
  el.themeToggleBtn.textContent = theme === "dark" ? "라이트 모드" : "다크 모드";
  el.themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

function renderOraclePanel() {
  el.agmQuestion.value = state.oracle.agmQuestion;
  el.agmChance.value = String(state.oracle.agmChance);
  el.dagmPlace.value = state.oracle.dagmPlace;
  el.dagmDensity.value = state.oracle.dagmDensity;
  el.dagmAction.value = state.oracle.dagmAction;
  renderOracleResult(el.agmOutput, state.oracle.agmResult, "질문을 적고 굴린다.");
  renderOracleResult(el.dagmOutput, state.oracle.dagmResult, "장면을 열거나 행동을 처리한다.");
}

function bindEvents() {
  el.saveBtn.addEventListener("click", () => {
    saveState();
    savePortraitState();
    setSaveStatus("저장됨");
  });

  el.resetBtn.addEventListener("click", () => {
    if (!globalThis.confirm("미니 시트를 초기화할까?")) return;
    state = defaultState();
    resetPortraitEditor();
    saveState();
    renderSheet();
    renderDicePanel();
    renderOraclePanel();
    renderResult(null);
    renderHistory();
    setSaveStatus("초기화됨");
  });

  const sheetInputs = [
    [el.charName, "name"],
    [el.charAlias, "alias"],
    [el.charOrigin, "origin"],
    [el.charGoal, "goal"],
    [el.skillsNote, "skillsNote"],
    [el.gearNote, "gearNote"],
    [el.storyNote, "storyNote"],
  ];

  for (const [input, field] of sheetInputs) {
    input.addEventListener("input", () => {
      state.character[field] = input.value;
      saveSoon();
    });
  }

  el.diceMinusBtn.addEventListener("click", () => setDiceCount(state.dice.count - 1));
  el.dicePlusBtn.addEventListener("click", () => setDiceCount(state.dice.count + 1));

  el.diceCount.addEventListener("input", () => {
    setDiceCount(el.diceCount.value);
  });

  document.querySelectorAll("[data-count]").forEach((button) => {
    button.addEventListener("click", () => setDiceCount(button.dataset.count));
  });

  el.useDifficulty.addEventListener("change", () => {
    state.dice.useDifficulty = el.useDifficulty.checked;
    el.difficulty.disabled = !state.dice.useDifficulty;
    saveSoon();
  });

  el.difficulty.addEventListener("input", () => {
    state.dice.difficulty = cleanNumber(el.difficulty.value, 0, 0, 12);
    saveSoon();
  });

  el.rollBtn.addEventListener("click", rollCurrentPool);

  el.clearHistoryBtn.addEventListener("click", () => {
    state.dice.history = [];
    saveState();
    renderHistory();
    setSaveStatus("기록 비움");
  });

  for (const [input, field] of [
    [el.agmQuestion, "agmQuestion"],
    [el.dagmPlace, "dagmPlace"],
    [el.dagmAction, "dagmAction"],
  ]) {
    input.addEventListener("input", () => {
      state.oracle[field] = input.value;
      saveSoon();
    });
  }

  el.agmChance.addEventListener("change", () => {
    state.oracle.agmChance = cleanNumber(el.agmChance.value, 0, -2, 2);
    saveSoon();
  });

  el.dagmDensity.addEventListener("change", () => {
    state.oracle.dagmDensity = el.dagmDensity.value;
    saveSoon();
  });

  el.agmRollBtn.addEventListener("click", rollAgmQuestion);
  el.dagmSceneBtn.addEventListener("click", openDagmScene);
  el.dagmActionBtn.addEventListener("click", resolveDagmAction);
  bindPortraitEvents();
}

async function initPortraitEditor() {
  const saved = loadPortraitState();
  if (saved) {
    try {
      await restoreSerializedPortrait(saved);
    } catch {
      createDefaultPortrait();
    }
  } else {
    createDefaultPortrait();
  }

  syncPortraitCanvasSize();
  updatePortraitControls();
  renderPortrait();
}

function createDefaultPortrait() {
  portrait.width = 512;
  portrait.height = 512;
  portrait.background = "#f8faf9";
  portrait.activeTool = "brush";
  portrait.layers = [createPortraitLayer("레이어 1")];
  portrait.activeLayerId = portrait.layers[0].id;
  portrait.undo = [];
  portrait.redo = [];
}

function resetPortraitEditor() {
  localStorage.removeItem(PORTRAIT_STORAGE_KEY);
  createDefaultPortrait();
  syncPortraitCanvasSize();
  updatePortraitControls();
  renderPortrait();
}

function bindPortraitEvents() {
  document.querySelectorAll("[data-paint-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      portrait.activeTool = button.dataset.paintTool;
      updatePaintToolButtons();
      renderPortraitOverlay();
    });
  });

  el.paintColor.addEventListener("input", savePortraitToolPrefs);
  el.shapeFill.addEventListener("change", savePortraitToolPrefs);
  el.brushSize.addEventListener("input", () => {
    el.brushSizeValue.textContent = el.brushSize.value;
    savePortraitToolPrefs();
    renderPortraitOverlay();
  });

  el.backgroundColor.addEventListener("input", () => {
    if (!portrait.backgroundChanging) {
      pushPortraitUndo();
      portrait.backgroundChanging = true;
    }
    portrait.background = el.backgroundColor.value;
    renderPortrait();
  });

  el.backgroundColor.addEventListener("change", () => {
    portrait.backgroundChanging = false;
    savePortraitState();
    setSaveStatus("이미지 저장됨");
  });

  el.portraitPreviewCanvas.addEventListener("pointerdown", beginPortraitPointer);
  el.portraitPreviewCanvas.addEventListener("pointerenter", enterPortraitPointer);
  el.portraitPreviewCanvas.addEventListener("pointermove", movePortraitPointer);
  el.portraitPreviewCanvas.addEventListener("pointerup", endPortraitPointer);
  el.portraitPreviewCanvas.addEventListener("pointercancel", cancelPortraitPointer);
  el.portraitPreviewCanvas.addEventListener("pointerleave", leavePortraitPointer);

  el.undoPaintBtn.addEventListener("click", undoPortrait);
  el.redoPaintBtn.addEventListener("click", redoPortrait);
  el.portraitUpload.addEventListener("change", uploadPortraitImage);
  el.downloadPortraitBtn.addEventListener("click", downloadPortraitImage);
  el.focusPortraitBtn.addEventListener("click", togglePortraitFocusMode);
  el.resizePortraitBtn.addEventListener("click", resizePortraitCanvas);
  el.addLayerBtn.addEventListener("click", addPortraitLayer);
  el.deleteLayerBtn.addEventListener("click", deleteActivePortraitLayer);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && el.portraitEditor.classList.contains("focus-mode")) {
      togglePortraitFocusMode(false);
    }
  });
}

function createPortraitLayer(name) {
  return {
    id: makeId(),
    name,
    visible: true,
    canvas: createWorkCanvas(portrait.width, portrait.height),
  };
}

function createWorkCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function syncPortraitCanvasSize() {
  for (const canvas of [el.portraitCanvas, el.portraitPreviewCanvas]) {
    canvas.width = portrait.width;
    canvas.height = portrait.height;
  }
}

function updatePortraitControls() {
  el.backgroundColor.value = portrait.background;
  el.brushSizeValue.textContent = el.brushSize.value;
  el.portraitSize.value = String(portrait.width);
  updatePaintToolButtons();
  updatePortraitFocusButton();
  renderLayerList();
  updateUndoRedoButtons();
}

function updatePaintToolButtons() {
  document.querySelectorAll("[data-paint-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.paintTool === portrait.activeTool);
  });
}

function renderLayerList() {
  const rows = [...portrait.layers].reverse();
  el.layerList.innerHTML = "";

  for (const layer of rows) {
    const row = document.createElement("div");
    row.className = `layer-row${layer.id === portrait.activeLayerId ? " active" : ""}`;

    const visible = document.createElement("input");
    visible.type = "checkbox";
    visible.checked = layer.visible;
    visible.title = "레이어 보이기";
    visible.addEventListener("change", () => {
      pushPortraitUndo();
      layer.visible = visible.checked;
      renderPortrait();
      renderLayerList();
      savePortraitState();
    });

    const select = document.createElement("button");
    select.type = "button";
    select.className = "layer-name";
    select.textContent = layer.name;
    select.addEventListener("click", () => {
      portrait.activeLayerId = layer.id;
      renderLayerList();
      savePortraitState();
    });

    const up = document.createElement("button");
    up.type = "button";
    up.textContent = "위";
    up.addEventListener("click", () => movePortraitLayer(layer.id, 1));

    const down = document.createElement("button");
    down.type = "button";
    down.textContent = "아래";
    down.addEventListener("click", () => movePortraitLayer(layer.id, -1));

    row.append(visible, select, up, down);
    el.layerList.append(row);
  }
}

function updateUndoRedoButtons() {
  el.undoPaintBtn.disabled = portrait.undo.length === 0;
  el.redoPaintBtn.disabled = portrait.redo.length === 0;
}

function togglePortraitFocusMode(force) {
  const next = typeof force === "boolean"
    ? force
    : !el.portraitEditor.classList.contains("focus-mode");
  el.portraitEditor.classList.toggle("focus-mode", next);
  document.body.classList.toggle("portrait-focus-mode", next);
  updatePortraitFocusButton();
  renderPortraitOverlay();
}

function updatePortraitFocusButton() {
  const focused = el.portraitEditor.classList.contains("focus-mode");
  el.focusPortraitBtn.setAttribute("aria-label", focused ? "그림 화면 작게 보기" : "그림 화면 크게 보기");
  el.focusPortraitBtn.title = focused ? "그림 화면 작게 보기" : "그림 화면 크게 보기";
}

function enterPortraitPointer(event) {
  portrait.pointerInside = true;
  portrait.hoverPoint = getPortraitPoint(event);
  renderPortraitOverlay();
}

function beginPortraitPointer(event) {
  if (event.button !== 0) return;
  event.preventDefault();

  const layer = ensureActivePortraitLayer();
  const point = getPortraitPoint(event);
  portrait.pointerInside = true;
  portrait.hoverPoint = point;

  if (portrait.activeTool === "fill") {
    pushPortraitUndo();
    floodFillLayer(layer.canvas, Math.floor(point.x), Math.floor(point.y), hexToRgba(el.paintColor.value));
    renderPortrait();
    renderPortraitOverlay();
    savePortraitState();
    setSaveStatus("이미지 저장됨");
    return;
  }

  portrait.isDrawing = true;
  portrait.startPoint = point;
  portrait.lastPoint = point;
  portrait.drawTool = portrait.activeTool;
  el.portraitPreviewCanvas.setPointerCapture?.(event.pointerId);
  pushPortraitUndo();

  if (portrait.drawTool === "brush" || portrait.drawTool === "eraser") {
    drawStroke(layer.canvas, point, point, portrait.drawTool === "eraser");
    renderPortrait();
    renderPortraitOverlay();
  } else {
    renderPortraitOverlay(point);
  }
}

function movePortraitPointer(event) {
  event.preventDefault();

  const point = getPortraitPoint(event);
  portrait.pointerInside = true;
  portrait.hoverPoint = point;

  if (!portrait.isDrawing) {
    renderPortraitOverlay(point);
    return;
  }

  const layer = ensureActivePortraitLayer();

  if (portrait.drawTool === "brush" || portrait.drawTool === "eraser") {
    drawStroke(layer.canvas, portrait.lastPoint, point, portrait.drawTool === "eraser");
    portrait.lastPoint = point;
    renderPortrait();
    renderPortraitOverlay(point);
    return;
  }

  renderPortraitOverlay(point);
}

function endPortraitPointer(event) {
  if (!portrait.isDrawing) return;
  event.preventDefault();

  const point = getPortraitPoint(event);
  const layer = ensureActivePortraitLayer();

  if (portrait.drawTool === "line" || portrait.drawTool === "rect" || portrait.drawTool === "ellipse") {
    drawShape(layer.canvas.getContext("2d"), portrait.startPoint, point, portrait.drawTool);
    clearPortraitPreview();
  }

  portrait.isDrawing = false;
  portrait.startPoint = null;
  portrait.lastPoint = null;
  portrait.hoverPoint = point;
  renderPortrait();
  renderPortraitOverlay(point);
  savePortraitState();
  setSaveStatus("이미지 저장됨");
}

function cancelPortraitPointer() {
  if (!portrait.isDrawing) return;
  portrait.isDrawing = false;
  portrait.startPoint = null;
  portrait.lastPoint = null;
  renderPortrait();
  renderPortraitOverlay();
}

function leavePortraitPointer() {
  portrait.pointerInside = false;
  portrait.hoverPoint = null;
  if (!portrait.isDrawing) clearPortraitPreview();
}

function getPortraitPoint(event) {
  const rect = el.portraitPreviewCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * portrait.width,
    y: ((event.clientY - rect.top) / rect.height) * portrait.height,
  };
}

function drawStroke(canvas, from, to, erase) {
  const ctx = canvas.getContext("2d");
  const size = cleanNumber(el.brushSize.value, 6, 1, 48);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = size;

  if (erase) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0,0,0,1)";
  } else {
    ctx.strokeStyle = el.paintColor.value;
    ctx.fillStyle = el.paintColor.value;
  }

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(to.x, to.y, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderPortraitOverlay(point = portrait.hoverPoint) {
  const ctx = el.portraitPreviewCanvas.getContext("2d");
  ctx.clearRect(0, 0, portrait.width, portrait.height);

  if (
    portrait.isDrawing
    && portrait.startPoint
    && point
    && ["line", "rect", "ellipse"].includes(portrait.drawTool)
  ) {
    drawShape(ctx, portrait.startPoint, point, portrait.drawTool);
  }

  if (portrait.pointerInside && point) {
    drawToolRange(ctx, point);
  }
}

function drawToolRange(ctx, point) {
  const tool = portrait.isDrawing ? portrait.drawTool : portrait.activeTool;
  const size = cleanNumber(el.brushSize.value, 6, 1, 48);
  const radius = tool === "fill" ? Math.max(7, size / 2) : size / 2;

  ctx.save();
  ctx.lineWidth = Math.max(1.25, portrait.width / 512);
  ctx.setLineDash([5, 4]);
  ctx.strokeStyle = tool === "eraser" ? "rgba(159, 47, 70, 0.92)" : "rgba(15, 118, 110, 0.95)";
  ctx.fillStyle = tool === "fill" ? "rgba(15, 118, 110, 0.12)" : "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = Math.max(1, portrait.width / 768);
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius + 1.5, 0, Math.PI * 2);
  ctx.stroke();

  if (tool === "fill") {
    ctx.strokeStyle = "rgba(15, 118, 110, 0.95)";
    ctx.beginPath();
    ctx.moveTo(point.x - radius * 0.75, point.y);
    ctx.lineTo(point.x + radius * 0.75, point.y);
    ctx.moveTo(point.x, point.y - radius * 0.75);
    ctx.lineTo(point.x, point.y + radius * 0.75);
    ctx.stroke();
  }

  ctx.restore();
}

function drawShape(ctx, start, end, tool) {
  const size = cleanNumber(el.brushSize.value, 6, 1, 48);
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  const filled = el.shapeFill.value === "fill";

  ctx.save();
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = el.paintColor.value;
  ctx.fillStyle = el.paintColor.value;

  if (tool === "line") {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  } else if (tool === "rect") {
    if (filled) ctx.fillRect(x, y, width, height);
    else ctx.strokeRect(x, y, width, height);
  } else if (tool === "ellipse") {
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    if (filled) ctx.fill();
    else ctx.stroke();
  }

  ctx.restore();
}

function clearPortraitPreview() {
  el.portraitPreviewCanvas.getContext("2d").clearRect(0, 0, portrait.width, portrait.height);
}

function renderPortrait() {
  const ctx = el.portraitCanvas.getContext("2d");
  ctx.clearRect(0, 0, portrait.width, portrait.height);
  ctx.fillStyle = portrait.background;
  ctx.fillRect(0, 0, portrait.width, portrait.height);

  for (const layer of portrait.layers) {
    if (layer.visible) ctx.drawImage(layer.canvas, 0, 0);
  }
}

function floodFillLayer(canvas, startX, startY, fillColor) {
  const ctx = canvas.getContext("2d");
  const image = ctx.getImageData(0, 0, portrait.width, portrait.height);
  const data = image.data;
  const target = getPixel(data, startX, startY, portrait.width);

  if (sameColor(target, fillColor)) return;

  const stack = [[startX, startY]];
  const seen = new Uint8Array(portrait.width * portrait.height);

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= portrait.width || y >= portrait.height) continue;

    const index = y * portrait.width + x;
    if (seen[index]) continue;
    seen[index] = 1;

    const current = getPixel(data, x, y, portrait.width);
    if (!sameColor(current, target)) continue;

    setPixel(data, x, y, portrait.width, fillColor);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  ctx.putImageData(image, 0, 0);
}

function getPixel(data, x, y, width) {
  const index = (y * width + x) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

function setPixel(data, x, y, width, color) {
  const index = (y * width + x) * 4;
  data[index] = color[0];
  data[index + 1] = color[1];
  data[index + 2] = color[2];
  data[index + 3] = color[3];
}

function sameColor(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function hexToRgba(hex) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
    255,
  ];
}

function ensureActivePortraitLayer() {
  let layer = portrait.layers.find((item) => item.id === portrait.activeLayerId);
  if (!layer) {
    layer = createPortraitLayer(`레이어 ${portrait.layers.length + 1}`);
    portrait.layers.push(layer);
    portrait.activeLayerId = layer.id;
    renderLayerList();
  }
  return layer;
}

function addPortraitLayer() {
  pushPortraitUndo();
  const layer = createPortraitLayer(`레이어 ${portrait.layers.length + 1}`);
  portrait.layers.push(layer);
  portrait.activeLayerId = layer.id;
  renderLayerList();
  renderPortrait();
  savePortraitState();
  setSaveStatus("레이어 추가됨");
}

function deleteActivePortraitLayer() {
  pushPortraitUndo();
  if (portrait.layers.length <= 1) {
    const ctx = ensureActivePortraitLayer().canvas.getContext("2d");
    ctx.clearRect(0, 0, portrait.width, portrait.height);
  } else {
    const index = portrait.layers.findIndex((layer) => layer.id === portrait.activeLayerId);
    portrait.layers.splice(index, 1);
    portrait.activeLayerId = portrait.layers[Math.max(0, index - 1)].id;
  }

  renderLayerList();
  renderPortrait();
  savePortraitState();
  setSaveStatus("레이어 삭제됨");
}

function movePortraitLayer(layerId, direction) {
  const index = portrait.layers.findIndex((layer) => layer.id === layerId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= portrait.layers.length) return;

  pushPortraitUndo();
  const [layer] = portrait.layers.splice(index, 1);
  portrait.layers.splice(nextIndex, 0, layer);
  renderLayerList();
  renderPortrait();
  savePortraitState();
}

async function uploadPortraitImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const image = await loadImage(dataUrl);
    const layer = ensureActivePortraitLayer();

    pushPortraitUndo();
    drawImageContain(layer.canvas.getContext("2d"), image, portrait.width, portrait.height);
    renderPortrait();
    savePortraitState();
    setSaveStatus("이미지 넣음");
  } catch {
    setSaveStatus("이미지 읽기 실패");
  } finally {
    event.target.value = "";
  }
}

function drawImageContain(ctx, image, width, height) {
  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const x = (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

function resizePortraitCanvas() {
  const nextSize = cleanNumber(el.portraitSize.value, portrait.width, 128, 2048);
  if (nextSize === portrait.width) return;

  pushPortraitUndo();
  const oldLayers = portrait.layers;
  portrait.width = nextSize;
  portrait.height = nextSize;
  portrait.layers = oldLayers.map((layer) => {
    const canvas = createWorkCanvas(portrait.width, portrait.height);
    canvas.getContext("2d").drawImage(layer.canvas, 0, 0, portrait.width, portrait.height);
    return { ...layer, canvas };
  });

  syncPortraitCanvasSize();
  clearPortraitPreview();
  renderPortrait();
  renderLayerList();
  savePortraitState();
  setSaveStatus("이미지 크기 변경됨");
}

function downloadPortraitImage() {
  syncCharacterFields();
  const canvas = composePortraitCanvas();
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${safeFileName(state.character.name || "pandea-character")}_image.png`;
  link.click();
}

function composePortraitCanvas() {
  const canvas = createWorkCanvas(portrait.width, portrait.height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = portrait.background;
  ctx.fillRect(0, 0, portrait.width, portrait.height);
  for (const layer of portrait.layers) {
    if (layer.visible) ctx.drawImage(layer.canvas, 0, 0);
  }
  return canvas;
}

function pushPortraitUndo() {
  portrait.undo.push(snapshotPortrait());
  if (portrait.undo.length > 20) portrait.undo.shift();
  portrait.redo = [];
  updateUndoRedoButtons();
}

function undoPortrait() {
  if (portrait.undo.length === 0) return;
  portrait.redo.push(snapshotPortrait());
  restorePortraitSnapshot(portrait.undo.pop());
  renderPortrait();
  updatePortraitControls();
  savePortraitState();
  setSaveStatus("언두");
}

function redoPortrait() {
  if (portrait.redo.length === 0) return;
  portrait.undo.push(snapshotPortrait());
  restorePortraitSnapshot(portrait.redo.pop());
  renderPortrait();
  updatePortraitControls();
  savePortraitState();
  setSaveStatus("리두");
}

function snapshotPortrait() {
  return {
    width: portrait.width,
    height: portrait.height,
    background: portrait.background,
    activeLayerId: portrait.activeLayerId,
    layers: portrait.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      imageData: layer.canvas.getContext("2d").getImageData(0, 0, portrait.width, portrait.height),
    })),
  };
}

function restorePortraitSnapshot(snapshot) {
  portrait.width = snapshot.width;
  portrait.height = snapshot.height;
  portrait.background = snapshot.background;
  portrait.activeLayerId = snapshot.activeLayerId;
  portrait.layers = snapshot.layers.map((layer) => {
    const canvas = createWorkCanvas(portrait.width, portrait.height);
    canvas.getContext("2d").putImageData(layer.imageData, 0, 0);
    return {
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      canvas,
    };
  });
  syncPortraitCanvasSize();
  clearPortraitPreview();
}

function serializePortrait() {
  return {
    width: portrait.width,
    height: portrait.height,
    background: portrait.background,
    activeLayerId: portrait.activeLayerId,
    layers: portrait.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      dataUrl: layer.canvas.toDataURL("image/png"),
    })),
  };
}

async function restoreSerializedPortrait(saved) {
  portrait.width = cleanNumber(saved.width, 512, 128, 2048);
  portrait.height = portrait.width;
  portrait.background = typeof saved.background === "string" ? saved.background : "#f8faf9";
  portrait.layers = [];

  const savedLayers = Array.isArray(saved.layers) ? saved.layers : [];
  for (const item of savedLayers) {
    const layer = createPortraitLayer(typeof item.name === "string" ? item.name : `레이어 ${portrait.layers.length + 1}`);
    layer.id = typeof item.id === "string" ? item.id : layer.id;
    layer.visible = item.visible !== false;
    if (typeof item.dataUrl === "string") {
      const image = await loadImage(item.dataUrl);
      layer.canvas.getContext("2d").drawImage(image, 0, 0, portrait.width, portrait.height);
    }
    portrait.layers.push(layer);
  }

  if (portrait.layers.length === 0) {
    portrait.layers.push(createPortraitLayer("레이어 1"));
  }

  portrait.activeLayerId = portrait.layers.some((layer) => layer.id === saved.activeLayerId)
    ? saved.activeLayerId
    : portrait.layers[portrait.layers.length - 1].id;
  portrait.undo = [];
  portrait.redo = [];
}

function savePortraitState() {
  try {
    localStorage.setItem(PORTRAIT_STORAGE_KEY, JSON.stringify(serializePortrait()));
    return true;
  } catch {
    setSaveStatus("이미지 저장 공간 부족");
    return false;
  }
}

function loadPortraitState() {
  try {
    const raw = localStorage.getItem(PORTRAIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePortraitToolPrefs() {
  el.brushSizeValue.textContent = el.brushSize.value;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}

function syncOracleFields() {
  state.oracle.agmQuestion = el.agmQuestion.value;
  state.oracle.agmChance = cleanNumber(el.agmChance.value, 0, -2, 2);
  state.oracle.dagmPlace = el.dagmPlace.value;
  state.oracle.dagmDensity = el.dagmDensity.value;
  state.oracle.dagmAction = el.dagmAction.value;
}

function rollAgmQuestion() {
  syncOracleFields();
  const dice = [randomDie(), randomDie()];
  const total = dice[0] + dice[1] + state.oracle.agmChance;
  const resolved = resolveAgmTotal(total);
  const followUp = pick(agmFollowUps);
  const question = state.oracle.agmQuestion.trim() || "지금 무엇이 사실인가?";

  state.oracle.agmResult = {
    title: "AGM 답",
    meta: `2d6 ${dice[0]}+${dice[1]} ${formatMod(state.oracle.agmChance)} = ${total}`,
    lines: [
      `질문: ${question}`,
      `답: ${resolved.answer}`,
      `후속: ${followUp}`,
    ],
  };

  saveState();
  renderOracleResult(el.agmOutput, state.oracle.agmResult, "질문을 적고 굴린다.");
  setSaveStatus("AGM 저장됨");
}

function openDagmScene() {
  syncOracleFields();
  const seed = pick(dagmSeeds);
  const place = state.oracle.dagmPlace.trim() || "지금 있는 곳";
  const density = densityLabel(state.oracle.dagmDensity);
  const opportunity = pick(dagmOpportunities);
  const lines = [
    `${place}. ${seed.sensory}`,
    seed.focus,
    seed.pressureLine,
    `${seed.questionLine} ${seed.hook}`,
    "무엇을 하나?",
  ];

  if (state.oracle.dagmDensity !== "short") {
    lines.splice(4, 0, `닫히는 기회: ${opportunity}`);
    lines.push(`기억 1줄: 이 장면은 ${seed.pressure} 때문에 다시 돌아온다.`);
  }

  if (state.oracle.dagmDensity === "deep") {
    lines.push(`숨은 압력 후보: ${pick(agmFollowUps)}`);
  }

  state.oracle.dagmResult = {
    title: "DAGM 장면",
    meta: `${density} · ${seed.impression} / ${seed.pressure} / ${seed.question}`,
    lines,
  };

  saveState();
  renderOracleResult(el.dagmOutput, state.oracle.dagmResult, "장면을 열거나 행동을 처리한다.");
  setSaveStatus("DAGM 저장됨");
}

function resolveDagmAction() {
  syncOracleFields();
  const dice = [randomDie(), randomDie()];
  const total = dice[0] + dice[1];
  const resolved = resolveAgmTotal(total);
  const action = state.oracle.dagmAction.trim() || "상황을 살핀다.";
  const cost = pick(dagmCosts);
  const opportunity = pick(dagmOpportunities);
  const followUp = pick(agmFollowUps);
  const density = densityLabel(state.oracle.dagmDensity);
  const resultLine = dagmResultLine(resolved.type, cost, opportunity);
  const lines = [
    `행동: ${action}`,
    `결과: ${resultLine}`,
    `다음 선택: ${followUp} 무엇을 하나?`,
  ];

  if (state.oracle.dagmDensity !== "short") {
    lines.splice(2, 0, `대가/기억: ${dagmMemoryLine(resolved.type, cost)}`);
  }

  if (state.oracle.dagmDensity === "deep") {
    lines.push(`장부: NPC 하나는 이 행동을 ${resolved.answer}로 기억한다.`);
  }

  state.oracle.dagmResult = {
    title: "DAGM 행동 처리",
    meta: `${density} · 2d6 ${dice[0]}+${dice[1]} = ${total} · ${resolved.answer}`,
    lines,
  };

  saveState();
  renderOracleResult(el.dagmOutput, state.oracle.dagmResult, "장면을 열거나 행동을 처리한다.");
  setSaveStatus("DAGM 저장됨");
}

function resolveAgmTotal(total) {
  if (total <= 3) return { type: "strongNo", answer: "아니오. 그리고 강한 수" };
  if (total <= 5) return { type: "noBut", answer: "아니오. 하지만 작은 흔적" };
  if (total <= 8) return { type: "yesBut", answer: "예. 하지만 대가, 지연, 오해" };
  if (total <= 10) return { type: "yes", answer: "예" };
  return { type: "yesAnd", answer: "예. 그리고 기회나 단서" };
}

function dagmResultLine(type, cost, opportunity) {
  if (type === "strongNo") return `뜻대로 되지 않는다. ${cost} 강한 수가 바로 장면을 밀어붙인다.`;
  if (type === "noBut") return "뜻대로 되지는 않지만 작은 단서 하나가 손에 남는다.";
  if (type === "yesBut") return `원하는 결과는 얻는다. 하지만 ${cost}`;
  if (type === "yesAnd") return `원하는 결과를 얻고, ${opportunity}`;
  return "원하는 결과를 얻는다.";
}

function dagmMemoryLine(type, cost) {
  if (type === "strongNo") return `위험이 공개되고, 누군가 이 실패를 기억한다. ${cost}`;
  if (type === "noBut") return "작은 흔적은 남지만 문제의 핵심은 아직 닫혀 있다.";
  if (type === "yesBut") return `성공은 했지만 ${cost}`;
  if (type === "yesAnd") return "성공이 다음 장면의 단서나 호의로 이어진다.";
  return "장면은 전진하고, 누가 봤는지만 남기면 된다.";
}

function renderOracleResult(target, result, emptyText) {
  if (!result) {
    target.innerHTML = `<p class="muted">${escapeHtml(emptyText)}</p>`;
    return;
  }

  const lines = Array.isArray(result.lines) ? result.lines : [];
  target.innerHTML = `
    <h4>${escapeHtml(result.title)}</h4>
    <p class="oracle-meta">${escapeHtml(result.meta)}</p>
    ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
  `;
}

function normalizeOracleResult(result) {
  if (!result || typeof result !== "object") return null;
  if (typeof result.title !== "string") return null;
  if (typeof result.meta !== "string") return null;
  if (!Array.isArray(result.lines)) return null;
  return {
    title: result.title,
    meta: result.meta,
    lines: result.lines.map((line) => String(line)).slice(0, 8),
  };
}

function syncCharacterFields() {
  state.character.name = el.charName.value;
  state.character.alias = el.charAlias.value;
  state.character.origin = el.charOrigin.value;
  state.character.goal = el.charGoal.value;
  state.character.skillsNote = el.skillsNote.value;
  state.character.gearNote = el.gearNote.value;
  state.character.storyNote = el.storyNote.value;
}

function setDiceCount(value) {
  state.dice.count = cleanNumber(value, 1, 1, 10);
  el.diceCount.value = state.dice.count;
  saveSoon();
}

function rollCurrentPool() {
  syncCharacterFields();
  state.dice.count = cleanNumber(el.diceCount.value, state.dice.count, 1, 10);
  state.dice.difficulty = cleanNumber(el.difficulty.value, state.dice.difficulty, 0, 12);
  state.dice.useDifficulty = el.useDifficulty.checked;

  const dice = Array.from({ length: state.dice.count }, () => randomDie());
  const successes = dice.filter((value) => value >= 5).length;
  const sixes = dice.filter((value) => value === 6).length;
  const ones = dice.filter((value) => value === 1).length;
  const chances = Math.floor(sixes / 2);
  const twist = ones * 2 >= dice.length;
  const passed = state.dice.useDifficulty ? successes >= state.dice.difficulty : null;

  const result = {
    id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
    time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    dice,
    count: state.dice.count,
    successes,
    sixes,
    ones,
    chances,
    twist,
    useDifficulty: state.dice.useDifficulty,
    difficulty: state.dice.difficulty,
    passed,
  };

  state.dice.history.unshift(result);
  state.dice.history = state.dice.history.slice(0, 12);
  saveState();
  renderResult(result);
  renderHistory();
  setSaveStatus("굴림 저장됨");
}

function renderResult(result) {
  if (!result) {
    el.rollResult.innerHTML = '<p class="muted">아직 굴린 결과가 없다.</p>';
    return;
  }

  const title = result.useDifficulty
    ? result.passed
      ? "성공"
      : "실패, 그래도 전진"
    : "성공 수 확인";

  const titleClass = result.useDifficulty && !result.passed ? "fail" : "success";
  const chanceText = result.chances > 0 ? `기회 ${result.chances}개` : "기회 없음";
  const twistText = result.twist ? "꼬임 후보 있음" : "꼬임 없음";
  const difficultyText = result.useDifficulty ? `난이도 ${result.difficulty}` : "난이도 비교 안 함";

  el.rollResult.innerHTML = `
    <div class="roll-summary">
      <div class="result-title ${titleClass}">${title}</div>
      <div class="dice-row">${result.dice.map(renderDie).join("")}</div>
      <div class="roll-meta">성공 ${result.successes}개 / ${difficultyText}</div>
      <div class="roll-meta">${chanceText} · ${twistText}</div>
    </div>
  `;
}

function renderDie(value) {
  const classes = ["die"];
  if (value === 6) classes.push("chance");
  else if (value >= 5) classes.push("success");
  else if (value === 1) classes.push("twist");
  return `<span class="${classes.join(" ")}">${value}</span>`;
}

function renderHistory() {
  if (state.dice.history.length === 0) {
    el.rollHistory.innerHTML = '<li><span class="history-time">-</span><span class="history-text muted">아직 기록이 없다.</span></li>';
    return;
  }

  el.rollHistory.innerHTML = state.dice.history
    .map((item) => {
      const diceText = Array.isArray(item.dice)
        ? item.dice.map((value) => cleanNumber(value, 0, 0, 6)).join(", ")
        : "";
      const successes = cleanNumber(item.successes, 0, 0, 10);
      const verdict = item.useDifficulty
        ? item.passed
          ? "성공"
          : "실패 전진"
        : "확인";
      const extras = [
        item.chances > 0 ? `기회 ${item.chances}` : null,
        item.twist ? "꼬임 후보" : null,
      ].filter(Boolean);
      const extraText = extras.length ? ` · ${extras.join(" · ")}` : "";
      return `
        <li>
          <span class="history-time">${escapeHtml(item.time)}</span>
          <span class="history-text">${cleanNumber(item.count, 0, 0, 10)}d: [${diceText}] · 성공 ${successes} · ${verdict}${extraText}</span>
        </li>
      `;
    })
    .join("");
}

function randomDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatMod(value) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return "+0";
}

function densityLabel(value) {
  if (value === "deep") return "깊게";
  if (value === "normal") return "보통";
  return "짧게";
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeFileName(value) {
  const cleaned = String(value).trim().replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_");
  return cleaned || "pandea-character";
}

function cleanNumber(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

let saveTimer = null;

function saveSoon() {
  setSaveStatus("저장 중...");
  globalThis.clearTimeout(saveTimer);
  saveTimer = globalThis.setTimeout(() => {
    saveState();
    setSaveStatus("자동 저장됨");
  }, 180);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}

function setSaveStatus(text) {
  el.saveStatus.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
