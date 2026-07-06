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

const docsDefs = [
  ["rulebook", "룰북", "../판데아_TRPG_룰북_v1.21.md"],
  ["summary", "요약", "../판데아_TRPG_요약_v1.21.md"],
  ["starter", "첫 플레이 키트", "../판데아_TRPG_첫플레이키트_v1.21.md"],
  ["agm", "AGM", "../판데아_TRPG_AGM_v1.21.md"],
  ["dagm", "DAGM", "../판데아_TRPG_DAGM_v1.21.md"],
];

const el = {};
let state = loadState();
let activeDocLoad = 0;
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
  renderHistory();
  renderDocsPanel();
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
    "scarNote",
    "bestiaryNote",
    "memoNote",
    "diceMinusBtn",
    "dicePlusBtn",
    "diceCount",
    "useDifficulty",
    "difficulty",
    "rollBtn",
    "rollResult",
    "rollHistory",
    "clearHistoryBtn",
    "docsList",
    "docsFrame",
    "docsSourceFrame",
    "docsOpenLink",
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
      scarNote: "",
      bestiaryNote: "",
      memoNote: "",
    },
    dice: {
      count: 4,
      useDifficulty: true,
      difficulty: 2,
      history: [],
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
  migrateStoryNoteFields(defaults);

  state.dice ??= defaults.dice;
  state.dice.count = cleanNumber(state.dice.count, defaults.dice.count, 1, 10);
  state.dice.difficulty = cleanNumber(state.dice.difficulty, defaults.dice.difficulty, 0, 12);
  state.dice.useDifficulty = Boolean(state.dice.useDifficulty);
  state.dice.history = Array.isArray(state.dice.history) ? state.dice.history.slice(0, 12) : [];

}

function migrateStoryNoteFields(defaults) {
  const hasNewFields = ["scarNote", "bestiaryNote", "memoNote"].some((field) => {
    return typeof state.character[field] === "string";
  });

  if (!hasNewFields && typeof state.character.storyNote === "string") {
    const migrated = splitLegacyStoryNote(state.character.storyNote);
    state.character.scarNote = migrated.scarNote;
    state.character.bestiaryNote = migrated.bestiaryNote;
    state.character.memoNote = migrated.memoNote;
  }

  state.character.scarNote ??= defaults.character.scarNote;
  state.character.bestiaryNote ??= defaults.character.bestiaryNote;
  state.character.memoNote ??= defaults.character.memoNote;
  delete state.character.storyNote;
}

function splitLegacyStoryNote(value) {
  const lines = String(value).replaceAll("\r\n", "\n").split("\n");
  const result = {
    scarNote: "",
    bestiaryNote: "",
    memoNote: "",
  };
  let current = "memoNote";

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^흉터\s*:?\s*$/.test(trimmed)) {
      current = "scarNote";
      continue;
    }
    if (/^도감\s*:?\s*$/.test(trimmed)) {
      current = "bestiaryNote";
      continue;
    }
    if (/^메모\s*:?\s*$/.test(trimmed)) {
      current = "memoNote";
      continue;
    }
    result[current] += `${line}\n`;
  }

  return {
    scarNote: result.scarNote.trim(),
    bestiaryNote: result.bestiaryNote.trim(),
    memoNote: result.memoNote.trim(),
  };
}

function renderSheet() {
  el.charName.value = state.character.name;
  el.charAlias.value = state.character.alias;
  el.charOrigin.value = state.character.origin;
  el.charGoal.value = state.character.goal;
  el.skillsNote.value = state.character.skillsNote;
  el.gearNote.value = state.character.gearNote;
  el.scarNote.value = state.character.scarNote;
  el.bestiaryNote.value = state.character.bestiaryNote;
  el.memoNote.value = state.character.memoNote;

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

function renderDocsPanel() {
  el.docsList.innerHTML = "";

  for (const [id, label] of docsDefs) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.docId = id;
    button.addEventListener("click", () => selectDoc(id));
    el.docsList.append(button);
  }

  selectDoc("rulebook");
}

function selectDoc(id) {
  const doc = docsDefs.find(([docId]) => docId === id) ?? docsDefs[0];
  const [, , path] = doc;
  el.docsOpenLink.href = path;
  const loadId = ++activeDocLoad;

  el.docsFrame.innerHTML = '<p class="muted">문서를 불러오는 중...</p>';

  el.docsList.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.docId === doc[0]);
  });

  loadMarkdownDoc(path)
    .then((text) => {
      if (loadId !== activeDocLoad) return;
      el.docsFrame.innerHTML = renderMarkdown(text);
      el.docsFrame.scrollTop = 0;
    })
    .catch(() => {
      if (loadId !== activeDocLoad) return;
      el.docsFrame.innerHTML = `
        <p class="muted">문서를 렌더링하지 못했다. 새 탭으로 원문을 열 수 있다.</p>
      `;
    });
}

async function loadMarkdownDoc(path) {
  try {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error("문서 로드 실패");
    return await response.text();
  } catch {
    return await loadMarkdownDocFromFrame(path);
  }
}

function loadMarkdownDocFromFrame(path) {
  return new Promise((resolve, reject) => {
    const frame = el.docsSourceFrame;
    const timer = globalThis.setTimeout(() => {
      frame.onload = null;
      reject(new Error("문서 로드 시간 초과"));
    }, 3000);

    frame.onload = () => {
      globalThis.clearTimeout(timer);
      try {
        const text = frame.contentDocument?.body?.innerText ?? "";
        if (!text.trim()) throw new Error("빈 문서");
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    frame.src = encodeURI(path);
  });
}

function renderMarkdown(markdown) {
  const lines = String(markdown).replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let index = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushParagraph();
      const language = trimmed.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const className = language ? ` class="language-${escapeHtml(language)}"` : "";
      html.push(`<pre><code${className}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph();
      html.push("<hr>");
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      flushParagraph();
      const table = collectTable(lines, index);
      html.push(renderTable(table.rows));
      index = table.nextIndex;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote>${renderMarkdownBlocks(quote)}</blockquote>`);
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      flushParagraph();
      const items = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*+]\s+/, ""));
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      flushParagraph();
      const items = [];
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+[.)]\s+/, ""));
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph();
  return html.join("");
}

function renderMarkdownBlocks(lines) {
  return renderMarkdown(lines.join("\n"));
}

function isTableStart(lines, index) {
  if (index + 1 >= lines.length) return false;
  const current = lines[index].trim();
  const next = lines[index + 1].trim();
  return current.includes("|") && isTableDivider(next);
}

function isTableDivider(line) {
  if (!line.includes("|")) return false;
  return splitTableRow(line).every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function collectTable(lines, index) {
  const rows = [splitTableRow(lines[index])];
  index += 2;

  while (index < lines.length && lines[index].trim().includes("|") && lines[index].trim() !== "") {
    rows.push(splitTableRow(lines[index]));
    index += 1;
  }

  return { rows, nextIndex: index };
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(rows) {
  const [header, ...body] = rows;
  const head = header.map((cell) => `<th>${renderInline(cell)}</th>`).join("");
  const bodyRows = body.map((row) => {
    const cells = row.map((cell) => `<td>${renderInline(cell)}</td>`).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

function renderInline(value) {
  const codeSpans = [];
  const linkSpans = [];
  let text = escapeHtml(value).replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE${codeSpans.length}@@`;
    codeSpans.push(`<code>${code}</code>`);
    return token;
  });

  text = text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const token = `@@LINK${linkSpans.length}@@`;
      linkSpans.push(`<a href="${sanitizeHref(href)}" target="_blank" rel="noreferrer">${label}</a>`);
      return token;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>");

  for (const [index, link] of linkSpans.entries()) {
    text = text.replace(`@@LINK${index}@@`, link);
  }

  for (const [index, code] of codeSpans.entries()) {
    text = text.replace(`@@CODE${index}@@`, code);
  }

  return text;
}

function sanitizeHref(value) {
  const href = String(value).trim();
  if (/^(https?:|mailto:|#)/i.test(href)) return escapeHtml(href);
  if (href.includes("javascript:")) return "#";
  return escapeHtml(encodeURI(href));
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
    [el.scarNote, "scarNote"],
    [el.bestiaryNote, "bestiaryNote"],
    [el.memoNote, "memoNote"],
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

  el.docsFrame.addEventListener("click", handleDocsClick);
  bindPortraitEvents();
}

function handleDocsClick(event) {
  const link = event.target.closest?.("a");
  if (!link) return;

  const href = decodeURI(link.getAttribute("href") ?? "");
  const doc = docsDefs.find(([, , path]) => href.endsWith(path.replace("../", "")) || href.endsWith(path));
  if (!doc) return;

  event.preventDefault();
  selectDoc(doc[0]);
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
  const size = cleanNumber(el.brushSize.value, 6, 1, 128);

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
  const size = cleanNumber(el.brushSize.value, 6, 1, 128);
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
  const size = cleanNumber(el.brushSize.value, 6, 1, 128);
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

function syncCharacterFields() {
  state.character.name = el.charName.value;
  state.character.alias = el.charAlias.value;
  state.character.origin = el.charOrigin.value;
  state.character.goal = el.charGoal.value;
  state.character.skillsNote = el.skillsNote.value;
  state.character.gearNote = el.gearNote.value;
  state.character.scarNote = el.scarNote.value;
  state.character.bestiaryNote = el.bestiaryNote.value;
  state.character.memoNote = el.memoNote.value;
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
