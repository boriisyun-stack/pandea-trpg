const STORAGE_KEY = "pandea-agm-page-v1";
const THEME_STORAGE_KEY = "pandea-mini-sheet-theme";

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

const dagmUltraSceneForms = [
  {
    label: "감각 선행",
    build: ({ place, seed, closeUp, npc, world, question }) => ultraSentence([
      `${place}에서 ${seed.sensory}`,
      seed.focus,
      seed.pressureLine,
      closeUp,
      `${npc} ${world}`,
    ], question),
  },
  {
    label: "NPC 선행",
    build: ({ place, seed, closeUp, npc, stake, question }) => ultraSentence([
      npc,
      `${place}에서 ${seed.focus}`,
      `${stake} ${seed.pressureLine}`,
      closeUp,
    ], question),
  },
  {
    label: "압력 선행",
    build: ({ place, seed, closeUp, gmMove, world, question }) => ultraSentence([
      seed.pressureLine,
      `${place}에서 ${seed.sensory}`,
      gmMove,
      `${closeUp} ${world}`,
    ], question),
  },
  {
    label: "단서 선행",
    build: ({ place, seed, closeUp, npc, stake, question }) => ultraSentence([
      closeUp,
      `${place}에서 ${seed.sensory}`,
      npc,
      stake,
    ], question),
  },
  {
    label: "질문 선행",
    build: ({ place, seed, closeUp, world, gmMove, question }) => ultraSentence([
      `먼저 "${cleanUltraClause(question)}"라는 질문이 선다`,
      `${place}에서 ${seed.focus}`,
      seed.pressureLine,
      gmMove,
      `${closeUp} ${world}`,
    ], "무엇을 하나"),
  },
  {
    label: "침묵 선행",
    build: ({ place, seed, closeUp, npc, stake, question }) => ultraSentence([
      `잠깐 조용해지고 ${place}에는 ${seed.pressure}의 무게가 내려앉는다`,
      closeUp,
      npc,
      `${stake} ${seed.questionLine}`,
    ], question),
  },
];

const dagmUltraActionForms = [
  {
    label: "판정 선행",
    build: ({ action, verdict, memory, next, judge }) => ultraSentence([
      `${action} 행동은 ${judge}`,
      verdict,
      memory,
    ], next),
  },
  {
    label: "결과 선행",
    build: ({ profile, verdict, closeUp, npc, next }) => ultraSentence([
      verdict,
      profile.pressure,
      closeUp,
      npc,
    ], next),
  },
  {
    label: "대가 선행",
    build: ({ action, profile, verdict, cost, gmMove, memory, next }) => ultraSentence([
      cost,
      `${action} 행동은 ${profile.label}로 읽힌다`,
      gmMove,
      verdict,
      `${profile.memory} ${memory}`,
    ], next),
  },
  {
    label: "반응 선행",
    build: ({ action, profile, verdict, npc, world, next }) => ultraSentence([
      `${npc} ${world}`,
      `${action} 행동은 ${profile.label}로 읽히며 ${profile.roll} 판정이 맞다`,
      verdict,
    ], next),
  },
  {
    label: "단서 선행",
    build: ({ action, profile, verdict, closeUp, memory, next }) => ultraSentence([
      closeUp,
      `${action} 행동은 ${profile.label}로 읽히며 ${profile.roll} 판정이 맞다`,
      verdict,
      memory,
    ], next),
  },
];

const dagmUltraCloseUps = [
  "손목 번호 끝의 잉크가 땀에 번져 다른 숫자처럼 보인다.",
  "바닥의 먼지가 한쪽으로만 밀려 있어 누군가 방금 지나간 흔적을 남긴다.",
  "말하는 사람의 손가락이 말과 다른 박자로 탁자를 두드린다.",
  "문서 모서리에 접힌 자국이 있고, 그 안쪽만 색이 덜 바랬다.",
  "낡은 장비의 흠집이 이번 장면의 소리와 같은 방향으로 나 있다.",
  "냄새가 먼저 바뀐다. 사람보다 물건이 먼저 거짓말을 한다.",
];

const dagmUltraNpcReactions = [
  "이름 없는 NPC 하나가 모른 척하지만, 네가 움직일 때만 숨을 멈춘다.",
  "상대는 대답을 늦춘다. 늦춘 시간이 대답보다 솔직하다.",
  "누군가 네 편인 척 가까워지지만, 시선은 출구가 아니라 장부에 붙어 있다.",
  "경비 하나가 규칙대로 움직이지 않고, 개인적인 짜증으로 한 걸음 먼저 나온다.",
  "구경꾼은 웃지 않는다. 웃지 않는 사람이 이 장면의 값을 알고 있다.",
  "동료나 목격자는 말 대신 물건을 옮겨 너에게 짧은 길을 만들어 준다.",
];

const dagmUltraWorldReactions = [
  "세계는 이 일을 즉시 처벌하지 않고 소문으로 저장한다.",
  "도시나 콜로세움의 작은 시계 하나가 조용히 1칸 움직인다.",
  "지금은 아무도 막지 않지만, 다음 문에서 같은 흔적이 값을 요구한다.",
  "주변 사람들은 사건을 보지 못한 척하며 각자 다른 이유로 기억한다.",
  "이 장면은 보상보다 관계와 의심을 먼저 남긴다.",
  "좋은 길과 나쁜 길이 갈라지는 게 아니라, 안전해 보이는 길에 이름표가 붙는다.",
];

const dagmUltraStakes = [
  "지금 고르면 작게 잃고, 미루면 크게 들킨다.",
  "성공해도 누가 봤는지는 남는다.",
  "이득은 가까운데, 그 이득의 주인이 아직 보이지 않는다.",
  "시간을 벌 수는 있지만 기회 하나가 닫힌다.",
  "힘으로 밀면 통과는 가능하다. 대신 이름이 먼저 퍼진다.",
  "말로 넘기면 싸움은 피한다. 대신 다음 질문이 더 날카로워진다.",
];

const dagmUltraQuestions = [
  "숨기나, 먼저 말하나, 아니면 상대가 착각하게 두나?",
  "물건을 잡나, 사람을 잡나, 아니면 흔적을 지우나?",
  "지금 판정을 걸고 들어가나, 단서 하나를 더 모으나?",
  "작게 잃고 지나가나, 크게 걸고 장면을 뒤집나?",
  "누구에게 보이게 움직이나, 누구에게만 숨기나?",
  "이 장면에서 원하는 것은 정보인가, 안전인가, 이름인가?",
];

const dagmUltraSoftMoves = [
  "위험을 먼저 보여주고 선택권을 남긴다.",
  "대가를 예고하되 아직 터뜨리지 않는다.",
  "NPC가 원하는 것을 행동으로 보여준다.",
  "닫히는 문과 열리는 틈을 동시에 둔다.",
  "단서를 하나 주고 해석은 플레이어에게 맡긴다.",
  "다음 판정의 위험을 장면 안에 보이게 둔다.",
];

const dagmUltraHardMoves = [
  "대가를 바로 장면 안에 떨어뜨린다.",
  "숨은 압력 하나를 공개 단서로 끌어올린다.",
  "NPC가 먼저 움직여 선택지를 좁힌다.",
  "시간, 자원, 의심 중 하나를 즉시 깎는다.",
  "성공해도 흔적이 남는 방식으로 장면을 닫는다.",
  "기다리던 위험이 지금 도착한다.",
];

const dagmActionProfiles = [
  {
    label: "대화",
    keys: ["말", "설득", "속", "거짓", "흥정", "위협", "도발", "대화", "묻"],
    roll: "매력+설득/공연, 거짓이면 지성+기만",
    pressure: "상대의 성격, 현재 감정, 플레이어 기억이 먼저 반응한다.",
    memory: "말은 사라지지 않고 호칭이나 소문으로 남는다.",
  },
  {
    label: "전투",
    keys: ["공격", "때", "벤", "찌르", "쏜", "막", "피하", "붙잡", "제압"],
    roll: "근력/민첩+무기, 방어는 회피/막기/버티기",
    pressure: "피해보다 위치, 시선, 소리가 먼저 전장을 바꾼다.",
    memory: "폭력은 끝나도 누가 먼저 손댔는지는 남는다.",
  },
  {
    label: "회피/추적",
    keys: ["숨", "도망", "빠져", "피해", "달리", "기어", "잠입", "몰래"],
    roll: "민첩+은신/운동 또는 지성+판단",
    pressure: "길은 열리지만 뒤따라오는 흔적도 같이 생긴다.",
    memory: "놓친 사람은 사라지는 게 아니라 다른 문으로 돌아온다.",
  },
  {
    label: "조사",
    keys: ["살피", "살핀", "조사", "찾", "냄새", "듣", "본", "확인", "도감", "표정", "흔적"],
    roll: "지성+감각/도감, 냄새나 흔적이면 체력/지성 중 맞는 것",
    pressure: "정답 대신 확인 가능한 단서가 먼저 나온다.",
    memory: "발견한 단서는 다음 장면에서 정보 슬롯 후보가 된다.",
  },
  {
    label: "마법/율법",
    keys: ["마법", "마나", "그라듀", "율법", "주문", "권능", "화신"],
    roll: "마나+마법학 또는 율법 대가",
    pressure: "힘이 장면을 바꾸면 장면도 힘의 흔적을 되돌려 준다.",
    memory: "신비한 해결은 소문, 반동, 오해 중 하나를 남긴다.",
  },
  {
    label: "정체/휴식",
    keys: ["기다", "쉰", "휴식", "멈", "버틴", "자", "숨죽"],
    roll: "판정 없음 또는 체력/정신. 대신 세계 시계를 본다",
    pressure: "안전한 선택은 가능하지만 시간이 먼저 움직인다.",
    memory: "움직이지 않은 것도 누군가에게는 선택으로 보인다.",
  },
];

const el = {};
let state = loadState();
let saveTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  normalizeState();
  initThemeMode();
  renderPanel();
  bindEvents();
  setSaveStatus("자동 저장됨");
});

function bindElements() {
  for (const id of [
    "saveStatus",
    "themeToggleBtn",
    "resetBtn",
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
  ]) {
    el[id] = document.getElementById(id);
  }
}

function defaultState() {
  return {
    agmQuestion: "이 NPC는 지금 나를 이용하려 하나?",
    agmChance: 0,
    agmResult: null,
    dagmPlace: "콜로세움 우리",
    dagmDensity: "short",
    dagmAction: "손목 번호를 가리고 배식 담당의 표정을 살핀다.",
    dagmResult: null,
  };
}

function normalizeState() {
  const defaults = defaultState();
  state.agmQuestion ??= defaults.agmQuestion;
  state.agmChance = cleanNumber(state.agmChance, defaults.agmChance, -2, 2);
  state.agmResult = normalizeOracleResult(state.agmResult);
  state.dagmPlace ??= defaults.dagmPlace;
  state.dagmDensity = ["short", "normal", "deep", "ultra"].includes(state.dagmDensity)
    ? state.dagmDensity
    : defaults.dagmDensity;
  state.dagmAction ??= defaults.dagmAction;
  state.dagmResult = normalizeOracleResult(state.dagmResult);
}

function initThemeMode() {
  applyThemeMode(getThemeMode());
}

function getThemeMode() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function applyThemeMode(theme) {
  document.documentElement.dataset.theme = theme;
  el.themeToggleBtn.textContent = theme === "dark" ? "라이트 모드" : "다크 모드";
  el.themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

function renderPanel() {
  el.agmQuestion.value = state.agmQuestion;
  el.agmChance.value = String(state.agmChance);
  el.dagmPlace.value = state.dagmPlace;
  el.dagmDensity.value = state.dagmDensity;
  el.dagmAction.value = state.dagmAction;
  renderOracleResult(el.agmOutput, state.agmResult, "질문을 적고 굴린다.");
  renderOracleResult(el.dagmOutput, state.dagmResult, "장면을 열거나 행동을 처리한다.");
}

function bindEvents() {
  el.themeToggleBtn.addEventListener("click", () => {
    const nextTheme = getThemeMode() === "dark" ? "light" : "dark";
    applyThemeMode(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });

  el.resetBtn.addEventListener("click", () => {
    if (!globalThis.confirm("AGM / DAGM 기록을 초기화할까?")) return;
    state = defaultState();
    saveState();
    renderPanel();
    setSaveStatus("초기화됨");
  });

  for (const [input, field] of [
    [el.agmQuestion, "agmQuestion"],
    [el.dagmPlace, "dagmPlace"],
    [el.dagmAction, "dagmAction"],
  ]) {
    input.addEventListener("input", () => {
      state[field] = input.value;
      saveSoon();
    });
  }

  el.agmChance.addEventListener("change", () => {
    state.agmChance = cleanNumber(el.agmChance.value, 0, -2, 2);
    saveSoon();
  });

  el.dagmDensity.addEventListener("change", () => {
    state.dagmDensity = el.dagmDensity.value;
    saveSoon();
  });

  el.agmRollBtn.addEventListener("click", rollAgmQuestion);
  el.dagmSceneBtn.addEventListener("click", openDagmScene);
  el.dagmActionBtn.addEventListener("click", resolveDagmAction);
}

function syncFields() {
  state.agmQuestion = el.agmQuestion.value;
  state.agmChance = cleanNumber(el.agmChance.value, 0, -2, 2);
  state.dagmPlace = el.dagmPlace.value;
  state.dagmDensity = el.dagmDensity.value;
  state.dagmAction = el.dagmAction.value;
}

function rollAgmQuestion() {
  syncFields();
  const dice = [randomDie(), randomDie()];
  const total = dice[0] + dice[1] + state.agmChance;
  const resolved = resolveAgmTotal(total);
  const followUp = pick(agmFollowUps);
  const question = state.agmQuestion.trim() || "지금 무엇이 사실인가?";

  state.agmResult = {
    title: "AGM 답",
    meta: `2d6 ${dice[0]}+${dice[1]} ${formatMod(state.agmChance)} = ${total}`,
    lines: [
      `질문: ${question}`,
      `답: ${resolved.answer}`,
      `후속: ${followUp}`,
    ],
  };

  saveState();
  renderOracleResult(el.agmOutput, state.agmResult, "질문을 적고 굴린다.");
  setSaveStatus("AGM 저장됨");
}

function openDagmScene() {
  syncFields();
  const seed = pick(dagmSeeds);
  const place = state.dagmPlace.trim() || "지금 있는 곳";
  const density = densityLabel(state.dagmDensity);

  if (state.dagmDensity === "ultra") {
    state.dagmResult = makeUltraDagmScene(place, seed);
    saveState();
    renderOracleResult(el.dagmOutput, state.dagmResult, "장면을 열거나 행동을 처리한다.");
    setSaveStatus("DAGM 저장됨");
    return;
  }

  const opportunity = pick(dagmOpportunities);
  const lines = [
    `${place}. ${seed.sensory}`,
    seed.focus,
    seed.pressureLine,
    `${seed.questionLine} ${seed.hook}`,
    "무엇을 하나?",
  ];

  if (state.dagmDensity !== "short") {
    lines.splice(4, 0, `닫히는 기회: ${opportunity}`);
    lines.push(`기억 1줄: 이 장면은 ${seed.pressure} 때문에 다시 돌아온다.`);
  }

  if (state.dagmDensity === "deep") {
    lines.push(`숨은 압력 후보: ${pick(agmFollowUps)}`);
  }

  state.dagmResult = {
    title: "DAGM 장면",
    meta: `${density} · ${seed.impression} / ${seed.pressure} / ${seed.question}`,
    lines,
  };

  saveState();
  renderOracleResult(el.dagmOutput, state.dagmResult, "장면을 열거나 행동을 처리한다.");
  setSaveStatus("DAGM 저장됨");
}

function resolveDagmAction() {
  syncFields();
  const dice = [randomDie(), randomDie()];
  const total = dice[0] + dice[1];
  const resolved = resolveAgmTotal(total);
  const action = state.dagmAction.trim() || "상황을 살핀다.";

  if (state.dagmDensity === "ultra") {
    state.dagmResult = makeUltraDagmAction(action, dice, total, resolved);
    saveState();
    renderOracleResult(el.dagmOutput, state.dagmResult, "장면을 열거나 행동을 처리한다.");
    setSaveStatus("DAGM 저장됨");
    return;
  }

  const cost = pick(dagmCosts);
  const opportunity = pick(dagmOpportunities);
  const followUp = pick(agmFollowUps);
  const density = densityLabel(state.dagmDensity);
  const resultLine = dagmResultLine(resolved.type, cost, opportunity);
  const lines = [
    `행동: ${action}`,
    `결과: ${resultLine}`,
    `다음 선택: ${followUp} 무엇을 하나?`,
  ];

  if (state.dagmDensity !== "short") {
    lines.splice(2, 0, `대가/기억: ${dagmMemoryLine(resolved.type, cost)}`);
  }

  if (state.dagmDensity === "deep") {
    lines.push(`장부: NPC 하나는 이 행동을 ${resolved.answer}로 기억한다.`);
  }

  state.dagmResult = {
    title: "DAGM 행동 처리",
    meta: `${density} · 2d6 ${dice[0]}+${dice[1]} = ${total} · ${resolved.answer}`,
    lines,
  };

  saveState();
  renderOracleResult(el.dagmOutput, state.dagmResult, "장면을 열거나 행동을 처리한다.");
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
  return "누가 봤는지만 희미하게 남는다.";
}

function ultraSentence(clauses, question) {
  const parts = clauses.map(cleanUltraClause).filter(Boolean);
  const cleanQuestion = cleanUltraClause(question || "무엇을 하나");

  if (parts.length === 0) return [`${cleanQuestion}?`];
  return [`${parts.join(", ")}, 그러니 ${cleanQuestion}?`];
}

function cleanUltraClause(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!]\s+/g, ", ")
    .replace(/[.?!]+$/g, "");
}

function makeUltraDagmScene(place, seed) {
  const form = pick(dagmUltraSceneForms);
  const context = {
    place,
    seed,
    closeUp: pick(dagmUltraCloseUps),
    npc: pick(dagmUltraNpcReactions),
    world: pick(dagmUltraWorldReactions),
    stake: pick(dagmUltraStakes),
    question: pick(dagmUltraQuestions),
    gmMove: pick(dagmUltraSoftMoves),
  };

  return {
    title: "DAGM 초고도화 장면",
    meta: `초고도화 · ${form.label} · ${seed.impression} / ${seed.pressure} / ${seed.question}`,
    lines: form.build(context),
  };
}

function makeUltraDagmAction(action, dice, total, resolved) {
  const profile = classifyDagmAction(action);
  const form = pick(dagmUltraActionForms);
  const cost = pick(dagmCosts);
  const opportunity = pick(dagmOpportunities);
  const gmMove = ["strongNo", "noBut"].includes(resolved.type)
    ? pick(dagmUltraHardMoves)
    : pick(dagmUltraSoftMoves);
  const context = {
    action,
    profile,
    cost,
    closeUp: pick(dagmUltraCloseUps),
    npc: pick(dagmUltraNpcReactions),
    world: pick(dagmUltraWorldReactions),
    gmMove,
    verdict: dagmUltraVerdictLine(resolved.type, cost, opportunity),
    memory: dagmMemoryLine(resolved.type, cost),
    next: pick(dagmUltraQuestions),
    judge: `${profile.label}로 읽히고 판정 후보는 ${profile.roll}이다`,
  };

  return {
    title: "DAGM 초고도화 행동 처리",
    meta: `초고도화 · ${form.label} · 2d6 ${dice[0]}+${dice[1]} = ${total} · ${resolved.answer}`,
    lines: form.build(context),
  };
}

function classifyDagmAction(action) {
  const text = action.replace(/\s+/g, "");
  const profile = dagmActionProfiles.find((item) => {
    return item.keys.some((key) => text.includes(key));
  });
  return profile ?? {
    label: "장면 행동",
    roll: "가장 맞는 능력치+기술. 실패해도 장면은 전진",
    pressure: "행동의 목적보다 장면에 남는 흔적을 먼저 본다.",
    memory: "이 행동은 작은 흔적, 시선, 시간 변화 중 하나를 남긴다.",
  };
}

function dagmUltraVerdictLine(type, cost, opportunity) {
  if (type === "strongNo") return `뜻대로 되지 않고 ${cost} 위험이 먼저 움직인다.`;
  if (type === "noBut") return "뜻대로 되지는 않는다. 하지만 손에 남는 단서 하나가 다음 선택을 만든다.";
  if (type === "yesBut") return `원하는 결과는 얻지만 ${cost}`;
  if (type === "yesAnd") return `원하는 결과를 얻고, ${opportunity}`;
  return "원하는 결과를 얻고 다음 선택을 할 틈이 열린다.";
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
  if (value === "ultra") return "초고도화";
  if (value === "deep") return "깊게";
  if (value === "normal") return "보통";
  return "짧게";
}

function cleanNumber(value, fallback, min, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveSoon() {
  setSaveStatus("저장 중...");
  globalThis.clearTimeout(saveTimer);
  saveTimer = globalThis.setTimeout(() => {
    saveState();
    setSaveStatus("자동 저장됨");
  }, 180);
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
