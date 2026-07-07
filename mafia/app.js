"use strict";

const STORAGE_KEY = "rp-mafia-state-v1";
const THEME_KEY = "pandea-mini-sheet-theme";

const DEFAULT_PLAYERS = [
  "아린",
  "보르",
  "세나",
  "이안",
  "루카",
  "미라",
  "도윤",
  "라헬",
].join("\n");

const ROLE_TEXT = {
  mafia: {
    name: "마피아",
    desc: "밤마다 한 명을 지목한다. 낮에는 시민처럼 말하며 의심을 돌린다.",
  },
  doctor: {
    name: "의사",
    desc:
      "밤마다 한 명을 보호한다. 같은 사람을 계속 보호할지는 테이블에서 정한다.",
  },
  detective: {
    name: "탐정",
    desc:
      "밤마다 한 명의 정체를 확인한다. 결과를 어떻게 말할지는 낮 토론에서 결정한다.",
  },
  citizen: {
    name: "시민",
    desc: "정보는 없지만 토론과 투표로 마피아를 찾아낸다.",
  },
};

const PHASES = {
  night: {
    title: "밤",
    steps: [
      "모두 눈을 감고, 마피아가 한 명을 지목한다.",
      "의사가 있다면 보호 대상을 정한다.",
      "탐정이 있다면 조사 대상을 정하고 결과만 확인한다.",
      "처리 결과는 기록에 남기되, 낮에 공개할 문장만 짧게 정한다.",
    ],
  },
  day: {
    title: "낮",
    steps: [
      "밤의 결과를 한 문장으로 공개한다.",
      "각자 알리바이, 말투, 의심을 짧게 말한다.",
      "RP 단서는 증거가 아니라 토론 재료로만 쓴다.",
      "토론이 늘어지면 가장 수상한 말 하나만 붙잡고 투표로 간다.",
    ],
  },
  vote: {
    title: "투표",
    steps: [
      "동시에 한 명을 지목한다.",
      "최다 득표자는 탈락한다. 동률이면 결선 투표를 한 번만 한다.",
      "탈락자의 정체 공개 여부는 시작 전에 정한 방식대로 처리한다.",
      "승리 조건을 확인하고, 끝나지 않았으면 밤으로 돌아간다.",
    ],
  },
  result: {
    title: "결과 확인",
    steps: [
      "마피아가 모두 탈락했는지 확인한다.",
      "남은 마피아 수가 시민 측 수 이상인지 확인한다.",
      "아직 끝나지 않았다면 새 RP 단서를 뽑고 다음 밤을 시작한다.",
      "끝났다면 마지막 변명이나 고백을 한 문장씩 말한다.",
    ],
  },
};

const SCENE_PARTS = {
  places: [
    "비가 새는 여관 식당",
    "항구 창고의 등불 아래",
    "왕궁 연회장의 닫힌 발코니",
    "마법학회 기록실",
    "광산 마을의 빈 목욕탕",
    "극장 뒤편 분장실",
    "성벽 검문소의 대기 줄",
    "온천 여관의 젖은 복도",
    "새벽 시장의 닫히는 가판대",
    "눈 덮인 역참 마구간",
  ],
  pressures: [
    "누군가 알리바이를 말하기 전에 잔을 먼저 내려놓는다",
    "한 사람의 신발 밑창에만 다른 흙이 묻어 있다",
    "사라진 시간보다 돌아온 말투가 더 어색하다",
    "목격자는 보았다고 말하지 않고 못 봤다고 너무 빨리 말한다",
    "방 안의 물건 하나가 원래 있던 방향과 다르다",
    "누군가의 침묵이 변명보다 오래 남는다",
    "문이 닫힌 뒤에도 안쪽에서 짧은 웃음소리가 난다",
    "같은 냄새가 두 사람의 소매에서 난다",
  ],
  questions: [
    "당신은 누구의 말을 먼저 믿는가?",
    "당신은 방금 들은 거짓말을 바로 찌르는가, 더 말하게 두는가?",
    "당신은 알리바이를 맞추는가, 표정을 흔드는가?",
    "당신은 가장 조용한 사람을 보나, 가장 빠르게 말하는 사람을 보나?",
    "당신은 증거를 공개하나, 투표 직전까지 숨기나?",
    "당신은 누군가를 구하나, 누군가를 몰아붙이나?",
  ],
};

const RP_PARTS = {
  personas: [
    "빚 많은 여관 주인",
    "말 많은 약초상",
    "피곤한 검문관",
    "은퇴한 용병",
    "기록을 아끼는 서기",
    "소문을 파는 심부름꾼",
    "공연을 망친 배우",
    "장부를 숨긴 상인",
    "낯선 순례자",
    "밤길을 아는 마부",
  ],
  tones: [
    "질문을 질문으로 되받는다",
    "중요한 말 앞에서 웃는다",
    "상대 이름을 꼭 부른다",
    "증거보다 감정을 먼저 말한다",
    "모르는 척을 너무 정중하게 한다",
    "짧게 말하고 시선을 피한다",
    "남의 말을 자주 정리한다",
    "자기 알리바이만 지나치게 구체적이다",
  ],
  privatePressures: [
    "누군가에게 빚을 졌다",
    "사라진 물건의 위치를 안다",
    "어젯밤 몰래 밖에 나갔다",
    "한 사람을 감싸야 할 이유가 있다",
    "거짓말 하나를 이미 해버렸다",
    "사건보다 숨기고 싶은 일이 따로 있다",
    "누군가와 같은 냄새를 묻혀 왔다",
    "투표 전에 꼭 확인해야 할 이름이 있다",
  ],
};

const PHASE_ORDER = ["night", "day", "vote", "result"];

const el = {
  saveStatus: document.getElementById("saveStatus"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  resetBtn: document.getElementById("resetBtn"),
  playerNames: document.getElementById("playerNames"),
  mafiaCount: document.getElementById("mafiaCount"),
  useDoctor: document.getElementById("useDoctor"),
  useDetective: document.getElementById("useDetective"),
  dealBtn: document.getElementById("dealBtn"),
  setupHint: document.getElementById("setupHint"),
  roleList: document.getElementById("roleList"),
  phaseOutput: document.getElementById("phaseOutput"),
  phaseButtons: Array.from(document.querySelectorAll("[data-phase]")),
  newPromptBtn: document.getElementById("newPromptBtn"),
  advanceBtn: document.getElementById("advanceBtn"),
  notesInput: document.getElementById("notesInput"),
  addLogBtn: document.getElementById("addLogBtn"),
  logList: document.getElementById("logList"),
};

let state = loadState();
let saveTimer = 0;

function defaultState() {
  return {
    playersText: DEFAULT_PLAYERS,
    mafiaCount: 2,
    useDoctor: true,
    useDetective: true,
    roles: [],
    revealed: {},
    phase: "night",
    scene: drawScene(),
    notes: "",
    log: [],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveState(text = "자동 저장됨") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus(text);
}

function setStatus(text) {
  el.saveStatus.textContent = text;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    el.saveStatus.textContent = "자동 저장됨";
  }, 1600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parsePlayers() {
  return state.playersText
    .split(/\n+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function clampMafiaCount(players) {
  const max = Math.max(1, Math.floor(players.length / 3));
  return Math.max(1, Math.min(Number(state.mafiaCount) || 1, max));
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function drawScene() {
  return {
    place: randomItem(SCENE_PARTS.places),
    pressure: randomItem(SCENE_PARTS.pressures),
    question: randomItem(SCENE_PARTS.questions),
  };
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function dealRoles() {
  const players = parsePlayers();
  if (players.length < 4) {
    setStatus("4명 이상 필요");
    el.setupHint.textContent =
      "마피아는 최소 4명부터 진행하는 편이 안정적이다.";
    return;
  }

  const mafiaCount = clampMafiaCount(players);
  const rolePool = Array.from({ length: mafiaCount }, () => "mafia");
  if (state.useDoctor && rolePool.length < players.length) {
    rolePool.push("doctor");
  }
  if (state.useDetective && rolePool.length < players.length) {
    rolePool.push("detective");
  }
  while (rolePool.length < players.length) rolePool.push("citizen");

  const shuffledRoles = shuffle(rolePool);
  state.mafiaCount = mafiaCount;
  state.roles = players.map((name, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    name,
    role: shuffledRoles[index],
    persona: randomItem(RP_PARTS.personas),
    tone: randomItem(RP_PARTS.tones),
    privatePressure: randomItem(RP_PARTS.privatePressures),
  }));
  state.revealed = {};
  state.phase = "night";
  state.scene = drawScene();
  state.log = [`역할 배정 완료: ${players.length}명, 마피아 ${mafiaCount}명`];
  saveState("역할 배정됨");
  renderAll();
}

function renderSetup() {
  el.playerNames.value = state.playersText;
  el.mafiaCount.value = state.mafiaCount;
  el.useDoctor.checked = state.useDoctor;
  el.useDetective.checked = state.useDetective;

  updateSetupHint();
}

function updateSetupHint() {
  const players = parsePlayers();
  const maxMafia = Math.max(1, Math.floor(players.length / 3));
  el.mafiaCount.max = String(maxMafia);
  el.setupHint.textContent =
    `${players.length}명 참가. 권장 마피아 수는 1~${maxMafia}명이다.`;
}

function renderRoles() {
  if (!state.roles.length) {
    el.roleList.innerHTML =
      `<p class="muted">역할을 배정하면 여기에 플레이어 카드가 생긴다.</p>`;
    return;
  }

  el.roleList.innerHTML = state.roles
    .map((entry) => {
      const revealed = Boolean(state.revealed[entry.id]);
      const role = ROLE_TEXT[entry.role] || ROLE_TEXT.citizen;
      const persona = entry.persona || "사건 주변의 목격자";
      const tone = entry.tone || "말하기 전에 잠깐 멈춘다";
      const pressure = entry.privatePressure || "숨기고 싶은 사정이 있다";
      return `
        <article class="role-card">
          <div class="role-card-header">
            <div class="role-name">
              <strong>${escapeHtml(entry.name)}</strong>
              <span class="role-public">${escapeHtml(persona)} · ${
        escapeHtml(tone)
      }</span>
              <span class="role-chip">${
        revealed ? escapeHtml(role.name) : "숨김"
      }</span>
            </div>
            <button type="button" data-reveal-role="${escapeHtml(entry.id)}">
              ${revealed ? "숨기기" : "보기"}
            </button>
          </div>
          <p class="role-desc">${
        revealed
          ? `${escapeHtml(role.desc)} 개인 압력: ${escapeHtml(pressure)}.`
          : "공개 RP는 모두가 봐도 된다. 역할과 개인 압력은 자기 차례에만 확인한다."
      }</p>
        </article>
      `;
    })
    .join("");
}

function renderPhase() {
  const phase = PHASES[state.phase] || PHASES.night;
  el.phaseButtons.forEach((button) => {
    const active = button.dataset.phase === state.phase;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const scene = state.scene || drawScene();
  const sceneText =
    `${scene.place}에서 사건이 다시 움직인다. ${scene.pressure}. ${scene.question}`;

  el.phaseOutput.innerHTML = `
    <div>
      <h3>${escapeHtml(phase.title)}</h3>
      <p class="scene-text">${escapeHtml(sceneText)}</p>
    </div>
    <ol>
      ${phase.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
    </ol>
  `;
}

function renderNotes() {
  el.notesInput.value = state.notes;
  el.logList.innerHTML = state.log.length
    ? state.log.map((entry) =>
      `<div class="log-entry">${escapeHtml(entry)}</div>`
    ).join("")
    : `<p class="muted small-text">아직 기록이 없다.</p>`;
}

function renderAll() {
  renderSetup();
  renderRoles();
  renderPhase();
  renderNotes();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  el.themeToggleBtn.textContent = theme === "dark"
    ? "라이트 모드"
    : "다크 모드";
  el.themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

function advancePhase() {
  const currentIndex = PHASE_ORDER.indexOf(state.phase);
  state.phase = PHASE_ORDER[(currentIndex + 1) % PHASE_ORDER.length] || "night";
  if (state.phase === "night") state.scene = drawScene();
  saveState("단계 변경됨");
  renderPhase();
}

function addLog() {
  const text = state.notes.trim();
  if (!text) {
    setStatus("메모가 비어 있음");
    return;
  }
  state.log = [
    `${
      new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } ${text}`,
    ...state.log,
  ].slice(0, 12);
  state.notes = "";
  saveState("기록 추가됨");
  renderNotes();
}

function resetGame() {
  if (!confirm("RP 마피아 저장 내용을 초기화할까요?")) return;
  state = defaultState();
  saveState("초기화됨");
  renderAll();
}

function bindEvents() {
  el.themeToggleBtn.addEventListener("click", () => {
    applyTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    );
  });

  el.playerNames.addEventListener("input", () => {
    state.playersText = el.playerNames.value;
    saveState();
    updateSetupHint();
  });

  el.mafiaCount.addEventListener("input", () => {
    state.mafiaCount = Number(el.mafiaCount.value) || 1;
    saveState();
  });

  el.useDoctor.addEventListener("change", () => {
    state.useDoctor = el.useDoctor.checked;
    saveState();
  });

  el.useDetective.addEventListener("change", () => {
    state.useDetective = el.useDetective.checked;
    saveState();
  });

  el.dealBtn.addEventListener("click", dealRoles);

  el.roleList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reveal-role]");
    if (!button) return;
    const id = button.dataset.revealRole;
    state.revealed[id] = !state.revealed[id];
    saveState("역할 표시 변경됨");
    renderRoles();
  });

  el.phaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.phase = button.dataset.phase;
      saveState("단계 변경됨");
      renderPhase();
    });
  });

  el.newPromptBtn.addEventListener("click", () => {
    state.scene = drawScene();
    saveState("RP 단서 갱신됨");
    renderPhase();
  });

  el.advanceBtn.addEventListener("click", advancePhase);

  el.notesInput.addEventListener("input", () => {
    state.notes = el.notesInput.value;
    saveState();
  });

  el.addLogBtn.addEventListener("click", addLog);
  el.resetBtn.addEventListener("click", resetGame);
}

bindEvents();
applyTheme(localStorage.getItem(THEME_KEY) || "light");
renderAll();
