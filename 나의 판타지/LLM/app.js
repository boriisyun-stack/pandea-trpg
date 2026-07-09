const THEME_STORAGE_KEY = "pandea-mini-sheet-theme";
const STORAGE_KEY = "pandea-analog-llm-v2";

const readTable = [
  "질문을 정의 요청으로 읽는다",
  "절차 요청으로 읽는다",
  "판정/수치 요청으로 읽는다",
  "장면 묘사 요청으로 읽는다",
  "NPC 반응 요청으로 읽는다",
  "위험/대가 요청으로 읽는다",
  "선택지 요청으로 읽는다",
  "요약 요청으로 읽는다",
  "오류 수정 요청으로 읽는다",
  "밸런스 점검 요청으로 읽는다",
  "초심자 안내 요청으로 읽는다",
  "세계관 해석 요청으로 읽는다",
  "전투 처리 요청으로 읽는다",
  "생활/도시 처리 요청으로 읽는다",
  "보스/캠페인 요청으로 읽는다",
  "문서 구조 요청으로 읽는다",
  "반복/꼼수 방지 요청으로 읽는다",
  "마법/율법 처리 요청으로 읽는다",
  "도감/흉터 성장 요청으로 읽는다",
  "질문 자체를 다시 정리하라는 요청으로 읽는다",
];

const writeTable = [
  "한 줄 결론부터 답한다",
  "3단계 절차로 답한다",
  "표로 정리한다",
  "짧은 장면 문장으로 답한다",
  "예시 하나를 붙인다",
  "대가와 위험을 먼저 붙인다",
  "선택지 3개로 답한다",
  "초심자용 말로 낮춘다",
  "기존 규칙과 충돌을 짚는다",
  "수치 기준을 제안한다",
  "이번 세션에 쓸 것만 남긴다",
  "세계관 이유를 붙인다",
  "전투 흐름으로 바꾼다",
  "생활 디테일로 바꾼다",
  "페이즈/장기 여파로 바꾼다",
  "문서에 넣을 문장으로 쓴다",
  "반복 방지 카드로 바꾼다",
  "마법적 대가를 붙인다",
  "기록/성장 보상으로 바꾼다",
  "질문을 더 좋은 질문으로 변환한다",
];

const colorTable = [
  "굶주림",
  "낙인",
  "사슬 소리",
  "죽그릇",
  "검투장 모래",
  "장부",
  "거래 동전",
  "흉터",
  "도감 기록",
  "마나 잔광",
  "율법의 대가",
  "비 오는 골목",
  "목욕탕의 소문",
  "장비 수리 흔적",
  "문 닫히는 시간",
  "NPC의 오해",
  "관중 별명",
  "도시 검문",
  "보스가 제안하는 이름",
  "자유의 값",
];

const checkTable = [
  "모르면 가정이라고 적는다",
  "강한 효과에는 대가를 붙인다",
  "실패해도 장면은 전진시킨다",
  "같은 보상 반복이면 소스를 확인한다",
  "같은 장면 반복이면 키워드를 소진한다",
  "초심자에게는 1~2성공 중심으로 낮춘다",
  "DAGM은 짧은 답으로 줄인다",
  "AGM은 후속 질문 하나만 붙인다",
  "NPC가 기억할 일을 한 줄 남긴다",
  "세계반응 시계를 남발하지 않는다",
  "보스 페이즈 기준을 하나만 쓴다",
  "장비 방호와 버티기 보너스를 섞지 않는다",
  "음식은 회복템이 아니라 생활감으로 쓴다",
  "마법은 크기와 대가를 같이 본다",
  "율법은 MP가 아니라 대가를 본다",
  "도감 보너스는 기록 근거가 있을 때만 준다",
  "흉터는 실패 보상이 아니라 생존 기록이다",
  "장면 삭제는 작은 효과나 강함의 대가로 바꾼다",
  "결론을 먼저 말하고 긴 설명은 줄인다",
  "마지막에 다음 선택 하나를 남긴다",
];

const densityBands = [
  [2, 10, "초단문: 결론 한 줄과 다음 행동 하나"],
  [11, 18, "짧은 답: 결론, 근거, 대가"],
  [19, 26, "보통 답: 절차 3단계와 예시 하나"],
  [27, 34, "깊은 답: 장면, 규칙, 여파를 함께 정리"],
  [35, 40, "최심도: 반례, 장기 여파, 문서용 문장까지 포함"],
];

const twistBands = [
  [0, 0, "거울: 질문 의도를 그대로 따른다"],
  [1, 3, "작은 대가: 시간, 소리, 자원 중 하나"],
  [4, 7, "흔적: 누가 보거나 잘못 이해한다"],
  [8, 12, "압력: NPC 기억이나 세계 반응이 붙는다"],
  [13, 19, "강한 수: 안전한 길 하나가 닫힌다"],
];

const el = {};
let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  initThemeMode();
  renderManualDice();
  renderTables();
  bindEvents();
  applyState();
});

function bindElements() {
  for (const id of [
    "themeToggleBtn",
    "promptInput",
    "rollAllBtn",
    "applyManualBtn",
    "clearBtn",
    "manualDiceGrid",
    "diceStrip",
    "resultCards",
    "answerDraft",
    "copyBtn",
    "tableGrid",
  ]) {
    el[id] = document.getElementById(id);
  }
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
}

function defaultState() {
  return {
    prompt: "콜로세움 밤 장면에서 NPC가 수상하게 말을 돌린다. 어떻게 처리하지?",
    dice: [7, 14],
    draft: "",
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeLoadedState({ ...defaultState(), ...parsed });
  } catch {
    return defaultState();
  }
}

function normalizeLoadedState(loaded) {
  const dice = Array.isArray(loaded.dice) ? loaded.dice.slice(0, 2) : [7, 14];
  while (dice.length < 2) dice.push(10);
  return {
    prompt: typeof loaded.prompt === "string" ? loaded.prompt : defaultState().prompt,
    dice: dice.map((value) => clamp(Number.parseInt(value, 10), 1, 20)),
    draft: typeof loaded.draft === "string" ? loaded.draft : "",
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyState() {
  el.promptInput.value = state.prompt;
  setManualDice(state.dice);
  generateFromDice(state.dice);
}

function renderManualDice() {
  el.manualDiceGrid.innerHTML = "";

  [
    ["읽기 d20", 0],
    ["생성 d20", 1],
  ].forEach(([labelText, index]) => {
    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "20";
    input.inputMode = "numeric";
    input.dataset.dieIndex = String(index);
    input.value = String(state.dice[index] ?? 10);

    label.append(input);
    el.manualDiceGrid.append(label);
  });
}

function renderTables() {
  const tables = [
    ["읽기 d20", readTable],
    ["생성 d20", writeTable],
    ["높은 값: 판데아 색", colorTable],
    ["낮은 값: 검증", checkTable],
    ["합계: 답변 밀도", densityBands.map(([from, to, text]) => `${from}-${to}: ${text}`)],
    ["차이: 꼬임", twistBands.map(([from, to, text]) => `${from}-${to}: ${text}`)],
  ];

  el.tableGrid.innerHTML = tables.map(([title, rows]) => `
    <section class="roll-table">
      <h3>${escapeHtml(title)}</h3>
      <ol>
        ${rows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}
      </ol>
    </section>
  `).join("");
}

function bindEvents() {
  el.promptInput.addEventListener("input", () => {
    state.prompt = el.promptInput.value;
    saveState();
  });

  el.rollAllBtn.addEventListener("click", rollAllDice);
  el.applyManualBtn.addEventListener("click", applyManualDice);

  el.clearBtn.addEventListener("click", () => {
    state = defaultState();
    el.promptInput.value = state.prompt;
    setManualDice(state.dice);
    generateFromDice(state.dice);
    saveState();
  });

  el.copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(el.answerDraft.value);
    } catch {
      el.answerDraft.select();
      document.execCommand("copy");
    }
    el.copyBtn.textContent = "복사됨";
    setTimeout(() => {
      el.copyBtn.textContent = "복사";
    }, 900);
  });
}

function rollAllDice() {
  const dice = [randomD20(), randomD20()];
  setManualDice(dice);
  generateFromDice(dice);
}

function applyManualDice() {
  const dice = [...el.manualDiceGrid.querySelectorAll("input")].map((input) => {
    return clamp(Number.parseInt(input.value, 10), 1, 20);
  });
  setManualDice(dice);
  generateFromDice(dice);
}

function setManualDice(dice) {
  state.dice = dice.slice(0, 2).map((value) => clamp(value, 1, 20));
  el.manualDiceGrid.querySelectorAll("input").forEach((input, index) => {
    input.value = String(state.dice[index] ?? 10);
  });
}

function generateFromDice(dice) {
  state.prompt = el.promptInput.value;
  state.dice = dice.slice(0, 2).map((value) => clamp(value, 1, 20));

  const [readDie, writeDie] = state.dice;
  const sum = readDie + writeDie;
  const diff = Math.abs(readDie - writeDie);
  const high = Math.max(readDie, writeDie);
  const low = Math.min(readDie, writeDie);
  const picks = [
    { label: `읽기 d20 (${readDie})`, pick: readTable[readDie - 1] },
    { label: `생성 d20 (${writeDie})`, pick: writeTable[writeDie - 1] },
    { label: `합계 ${sum}`, pick: pickBand(densityBands, sum) },
    { label: `차이 ${diff}`, pick: pickBand(twistBands, diff) },
    { label: `높은 값 ${high}`, pick: colorTable[high - 1] },
    { label: `낮은 값 ${low}`, pick: checkTable[low - 1] },
  ];

  const keywords = extractKeywords(state.prompt);
  const draft = buildDraft({ readDie, writeDie, sum, diff, high, low, picks }, keywords);
  state.draft = draft;
  saveState();
  renderResult(picks, draft);
}

function renderResult(picks, draft) {
  el.diceStrip.innerHTML = state.dice.map((value) => `<span class="die">${value}</span>`).join("");
  el.resultCards.innerHTML = picks.map((pick) => `
    <div class="result-card">
      <b>${escapeHtml(pick.label)}</b>
      <span>${escapeHtml(pick.pick)}</span>
    </div>
  `).join("");
  el.answerDraft.value = draft;
}

function buildDraft(result, keywords) {
  const byLabel = Object.fromEntries(result.picks.map((pick) => [pick.label.replace(/ .*/, ""), pick.pick]));
  const topic = keywords[0] ?? "이 문제";
  const second = keywords[1] ?? "장면";
  const third = keywords[2] ?? "선택";

  return [
    `[2d20 아날로그 LLM 응답 카드]`,
    ``,
    `주사위: 읽기 d20=${result.readDie}, 생성 d20=${result.writeDie}, 합계=${result.sum}, 차이=${result.diff}`,
    ``,
    `읽기: ${byLabel["읽기"]}`,
    `생성: ${byLabel["생성"]}`,
    `밀도: ${byLabel["합계"]}`,
    `꼬임: ${byLabel["차이"]}`,
    `판데아 색: ${byLabel["높은"]}`,
    `검증: ${byLabel["낮은"]}`,
    ``,
    `초안:`,
    `${topic}은 "${byLabel["읽기"]}"로 받아들이고, 답은 "${byLabel["생성"]}" 방식으로 낸다. ${second}에는 "${byLabel["차이"]}"를 붙여 단순한 정답이 아니라 장면 변화로 만든다. ${third}에는 "${byLabel["높은"]}"의 흔적을 넣되, 마지막에는 "${byLabel["낮은"]}"로 검증한다.`,
    ``,
    `조립 순서:`,
    `1. 결론을 먼저 쓴다.`,
    `2. 근거를 하나만 붙인다.`,
    `3. 대가나 꼬임을 장면 안의 행동으로 바꾼다.`,
    `4. 다음 선택 하나를 남긴다.`,
  ].join("\n");
}

function pickBand(bands, value) {
  const band = bands.find(([from, to]) => value >= from && value <= to) ?? bands[bands.length - 1];
  return band[2];
}

function extractKeywords(text) {
  const cleaned = text
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2);
  return [...new Set(cleaned)].slice(0, 3);
}

function randomD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
