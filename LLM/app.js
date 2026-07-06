const THEME_STORAGE_KEY = "pandea-mini-sheet-theme";
const STORAGE_KEY = "pandea-analog-llm-v1";

const tables = [
  {
    id: "intent",
    title: "1. 목적",
    label: "목적",
    rows: [
      "정의한다",
      "절차로 바꾼다",
      "판정이나 수치로 본다",
      "장면으로 만든다",
      "선택지 3개로 쪼갠다",
      "위험과 대가를 찾는다",
    ],
  },
  {
    id: "frame",
    title: "2. 답변 구조",
    label: "구조",
    rows: [
      "결론 -> 근거 -> 지금 할 일",
      "문제 -> 원인 -> 처리",
      "보이는 것 -> 해석 -> 후크",
      "질문 -> 짧은 답 -> 후속 질문",
      "장점 -> 위험 -> 조정",
      "표 3행 -> 한 줄 결론",
    ],
  },
  {
    id: "tone",
    title: "3. 말투",
    label: "말투",
    rows: [
      "건조하게",
      "친절하게",
      "거칠고 짧게",
      "GM처럼",
      "도감 기록처럼",
      "농담을 조금 섞어서",
    ],
  },
  {
    id: "depth",
    title: "4. 길이",
    label: "길이",
    rows: [
      "한 문장",
      "세 줄",
      "다섯 줄",
      "표 3행",
      "예시 1개 포함",
      "반례와 대안 포함",
    ],
  },
  {
    id: "ground",
    title: "5. 근거",
    label: "근거",
    rows: [
      "캐릭터 시트",
      "룰북 원칙",
      "장면 압력",
      "자원과 대가",
      "NPC 기억",
      "플레이어 목표",
    ],
  },
  {
    id: "twist",
    title: "6. 꼬임",
    label: "꼬임",
    rows: [
      "누가 이득을 보나?",
      "무엇이 다음 장면까지 따라오나?",
      "누가 오해하나?",
      "어떤 흔적이 남나?",
      "무엇이 곧 닫히나?",
      "선택 비용은 무엇인가?",
    ],
  },
  {
    id: "color",
    title: "7. 판데아 색",
    label: "판데아 색",
    rows: [
      "굶주림",
      "낙인",
      "도감",
      "흉터",
      "거래",
      "소문",
    ],
  },
  {
    id: "check",
    title: "8. 검증",
    label: "검증",
    rows: [
      "모르면 가정이라고 적는다",
      "강한 효과에는 대가를 붙인다",
      "반복이면 소진을 건다",
      "초심자용으로 줄인다",
      "짧은 답으로 끝낸다",
      "다음 질문 하나를 남긴다",
    ],
  },
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
    dice: [1, 2, 3, 4, 5, 6, 1, 2],
    draft: "",
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyState() {
  el.promptInput.value = state.prompt;
  setManualDice(state.dice);
  if (state.draft) {
    generateFromDice(state.dice);
  } else {
    rollAllDice();
  }
}

function renderManualDice() {
  el.manualDiceGrid.innerHTML = "";

  tables.forEach((table, index) => {
    const label = document.createElement("label");
    label.textContent = table.label;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "6";
    input.inputMode = "numeric";
    input.dataset.dieIndex = String(index);
    input.value = String(state.dice[index] ?? 1);

    label.append(input);
    el.manualDiceGrid.append(label);
  });
}

function renderTables() {
  el.tableGrid.innerHTML = tables.map((table) => `
    <section class="roll-table">
      <h3>${escapeHtml(table.title)}</h3>
      <ol>
        ${table.rows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}
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
  const dice = tables.map(() => randomD6());
  setManualDice(dice);
  generateFromDice(dice);
}

function applyManualDice() {
  const dice = [...el.manualDiceGrid.querySelectorAll("input")].map((input) => {
    return clamp(Number.parseInt(input.value, 10), 1, 6);
  });
  setManualDice(dice);
  generateFromDice(dice);
}

function setManualDice(dice) {
  state.dice = dice.map((value) => clamp(value, 1, 6));
  el.manualDiceGrid.querySelectorAll("input").forEach((input, index) => {
    input.value = String(state.dice[index] ?? 1);
  });
}

function generateFromDice(dice) {
  state.prompt = el.promptInput.value;
  state.dice = dice;
  const picks = tables.map((table, index) => {
    const die = clamp(dice[index], 1, 6);
    return {
      ...table,
      die,
      pick: table.rows[die - 1],
    };
  });
  const keywords = extractKeywords(state.prompt);
  const draft = buildDraft(picks, keywords);
  state.draft = draft;
  saveState();
  renderResult(picks, draft);
}

function renderResult(picks, draft) {
  el.diceStrip.innerHTML = picks.map((pick) => `<span class="die">${pick.die}</span>`).join("");
  el.resultCards.innerHTML = picks.map((pick) => `
    <div class="result-card">
      <b>${escapeHtml(pick.label)}</b>
      <span>${escapeHtml(pick.pick)}</span>
    </div>
  `).join("");
  el.answerDraft.value = draft;
}

function buildDraft(picks, keywords) {
  const byId = Object.fromEntries(picks.map((pick) => [pick.id, pick.pick]));
  const topic = keywords[0] ?? "이 문제";
  const second = keywords[1] ?? "장면";
  const third = keywords[2] ?? "선택";

  return [
    `[아날로그 LLM 응답 카드]`,
    ``,
    `핵심: ${topic}은/는 "${byId.intent}" 방식으로 처리한다.`,
    `구조: ${byId.frame}`,
    `말투: ${byId.tone}`,
    `분량: ${byId.depth}`,
    ``,
    `1. 먼저 ${topic}에서 지금 확정된 사실 1개와 모르는 사실 1개를 나눈다.`,
    `2. 근거는 "${byId.ground}"에서 가져온다. 억지로 새 설정을 만들지 않는다.`,
    `3. ${second}에는 "${byId.twist}"를 붙여서 그냥 정답이 아니라 장면 변화로 만든다.`,
    `4. 판데아 맛은 "${byId.color}"로 넣는다. 단어를 그대로 말하지 말고 물건, 냄새, 말실수, 비용으로 바꾼다.`,
    `5. 마지막 검증: ${byId.check}.`,
    ``,
    `초안:`,
    `${topic}은 지금 ${byId.intent} 쪽으로 보는 게 맞다. ${second}의 근거는 ${byId.ground}에 있고, 바로 답을 확정하기보다 ${byId.twist}를 장면에 남긴다. ${third}에는 ${byId.color}의 흔적을 하나 붙인다. 결론을 낸 뒤에는 "${byId.check}"로 한 번 줄인다.`,
    ``,
    `다음 질문: 이 답 때문에 누가 움직이거나, 무엇이 비싸지나?`,
  ].join("\n");
}

function extractKeywords(text) {
  const cleaned = text
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2);
  return [...new Set(cleaned)].slice(0, 3);
}

function randomD6() {
  return Math.floor(Math.random() * 6) + 1;
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
