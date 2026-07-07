"use strict";

const THEME_KEY = "pandea-mini-sheet-theme";

const games = {
  pandea: {
    kicker: "솔로 / 무진행자 / 생존 판타지",
    title: "판데아 TRPG",
    status: "메인 게임",
    summary:
      "캐릭터 시트, 주사위, 이미지 시트, AGM/DAGM, 룰북 문서를 한 묶음으로 쓰는 판데아 전용 플레이 도구다.",
    tags: ["d6 풀", "DAGM", "콜로세움", "도감", "생존"],
    actions: [
      {
        label: "캐릭터 시트",
        desc: "능력치, 자원, 흉터, 도감, 메모, 캐릭터 이미지를 관리한다.",
        href: "app/index.html",
      },
      {
        label: "AGM / DAGM",
        desc: "예/아니오 판단과 GM식 장면 진행을 연다.",
        href: "AGM/index.html",
      },
      {
        label: "아날로그 LLM",
        desc: "d20 두 개로 답변 뼈대를 만드는 실험용 도구다.",
        href: "LLM/index.html",
      },
      {
        label: "룰북",
        desc: "전체 규칙 문서를 Markdown 원문으로 본다.",
        href: "판데아_TRPG_룰북_v1.21.md",
      },
      {
        label: "첫 플레이 키트",
        desc: "첫 세션에 필요한 최소 절차만 확인한다.",
        href: "판데아_TRPG_첫플레이키트_v1.21.md",
      },
      {
        label: "요약",
        desc: "플레이 중 빠르게 보는 축약본이다.",
        href: "판데아_TRPG_요약_v1.21.md",
      },
    ],
    blocks: [
      {
        title: "바로 할 일",
        items: [
          "캐릭터 시트를 열고 이름, 출신, 원하는 것을 적는다.",
          "주사위 패널에서 d6 개수를 맞춰 판정을 처리한다.",
          "장면 진행이 막히면 AGM / DAGM 페이지로 이동한다.",
        ],
      },
      {
        title: "문서",
        items: [
          "룰북, 요약, 첫 플레이 키트, AGM, DAGM 문서를 모두 같은 저장소에서 볼 수 있다.",
          "처음에는 첫 플레이 키트와 캐릭터 시트만 열어도 충분하다.",
          "깊게 플레이할 때 DAGM과 룰북의 세부 절차를 붙인다.",
        ],
      },
    ],
  },
  mafia: {
    kicker: "정체 추리 / 짧은 RP / 파티 게임",
    title: "RP 마피아",
    status: "새 게임",
    summary:
      "기본 마피아에 장소, 비밀, 말투 압력을 살짝 섞은 게임이다. 역할 배정과 밤/낮/투표 진행을 컴퓨터가 정리해준다.",
    tags: ["역할 배정", "밤/낮 진행", "투표", "RP 단서", "기록"],
    actions: [
      {
        label: "RP 마피아 열기",
        desc: "플레이어를 적고 역할을 배정한 뒤 바로 시작한다.",
        href: "mafia/index.html",
      },
    ],
    blocks: [
      {
        title: "기본 흐름",
        items: [
          "각자 역할을 몰래 확인하고 밤 행동을 처리한다.",
          "낮에는 사건 묘사와 알리바이를 말하며 토론한다.",
          "투표로 한 명을 탈락시키고, 승리 조건이 아니면 다시 밤으로 간다.",
        ],
      },
      {
        title: "RP가 섞이는 지점",
        items: [
          "매 라운드 장소, 압력, 단서가 바뀐다.",
          "플레이어는 직업이나 말투를 붙여 짧게 변명할 수 있다.",
          "RP는 정답을 강제하지 않고, 토론할 재료만 만든다.",
        ],
      },
    ],
  },
};

const el = {
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  gameDetail: document.getElementById("gameDetail"),
  gameButtons: Array.from(document.querySelectorAll("[data-game]")),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderActions(actions) {
  return actions
    .map(
      (action) => `
        <a class="action-card" href="${escapeHtml(action.href)}">
          <strong>${escapeHtml(action.label)}</strong>
          <span>${escapeHtml(action.desc)}</span>
        </a>
      `,
    )
    .join("");
}

function renderBlockItems(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderBlocks(blocks) {
  return blocks
    .map(
      (block) => `
        <section class="detail-block">
          <h3>${escapeHtml(block.title)}</h3>
          <ul>
            ${renderBlockItems(block.items)}
          </ul>
        </section>
      `,
    )
    .join("");
}

function renderGame(gameKey) {
  const game = games[gameKey] || games.pandea;
  el.gameButtons.forEach((button) => {
    const active = button.dataset.game === gameKey;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  el.gameDetail.innerHTML = `
    <div class="detail-title-row">
      <div>
        <p class="detail-kicker">${escapeHtml(game.kicker)}</p>
        <h2>${escapeHtml(game.title)}</h2>
        <p class="detail-summary">${escapeHtml(game.summary)}</p>
        <div class="tag-row">
          ${game.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
      <span class="status-chip">${escapeHtml(game.status)}</span>
    </div>
    <div class="action-grid">
      ${renderActions(game.actions)}
    </div>
    <div class="detail-grid">
      ${renderBlocks(game.blocks)}
    </div>
  `;

  if (location.hash !== `#${gameKey}`) {
    history.replaceState(null, "", `#${gameKey}`);
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  el.themeToggleBtn.textContent = theme === "dark"
    ? "라이트 모드"
    : "다크 모드";
  el.themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
}

function initialize() {
  el.themeToggleBtn.addEventListener("click", () => {
    applyTheme(
      document.documentElement.dataset.theme === "dark" ? "light" : "dark",
    );
  });

  el.gameButtons.forEach((button) => {
    button.addEventListener("click", () => renderGame(button.dataset.game));
  });

  const initialGame = location.hash.replace("#", "");
  applyTheme(localStorage.getItem(THEME_KEY) || "light");
  renderGame(games[initialGame] ? initialGame : "pandea");
}

initialize();
