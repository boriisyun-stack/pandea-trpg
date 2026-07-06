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
    questionLine: "누군가가 자기 몫 대신 당신의 손목 번호를 보고 있다.",
    hook: "죽그릇, 배식통 바닥, 굶주린 시선이 모두 닿을 듯 가깝다.",
  },
  {
    impression: "소리",
    pressure: "추적",
    question: "누가 먼저 도착하나?",
    sensory: "사슬 끌리는 소리가 한 박자 늦게 따라온다.",
    focus: "모퉁이 안쪽에서 이미 발소리가 멈춰 있다.",
    pressureLine: "경비는 당신의 이름 대신 별명을 부르며 가까워진다.",
    questionLine: "당신이 움직이기 전에 도주로 하나가 조용히 닫힌다.",
    hook: "그림자, 벽 틈, 발자국 하나가 아직 남아 있다.",
  },
  {
    impression: "사람",
    pressure: "거래",
    question: "누가 값을 올리나?",
    sensory: "낮은 흥정 소리가 사람들의 숨소리 사이를 지난다.",
    focus: "깨끗한 장갑을 낀 손이 낡은 장부 위에 동전을 올린다.",
    pressureLine: "누군가 당신을 사람과 물건이 같은 줄에 적는다.",
    questionLine: "어둠 속 다른 손이 당신의 이름도 모른 채 한 닢을 더 얹는다.",
    hook: "장부 귀퉁이, 동전, 하인의 흔들리는 손목이 보인다.",
  },
  {
    impression: "물건",
    pressure: "비밀",
    question: "무엇이 기록과 다르나?",
    sensory: "마른 종이가 접히는 소리가 이상하게 크게 들린다.",
    focus: "문서에는 당신의 이름이 없는데 낙인 번호만 붉은 줄로 표시되어 있다.",
    pressureLine: "기록을 쥔 사람은 틀린 부분을 읽지 않고 손으로 가린다.",
    questionLine: "가린 문장 끝에 당신이 모르는 이름 하나가 삐져나온다.",
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
    focus: "먼지가 없는 바닥에 당신의 발자국만 또렷하다.",
    pressureLine: "누군가 이 장면을 이미 이야기처럼 외우고 있다.",
    questionLine: "경비 하나가 당신의 행동을 보고 웃으며 새 별명을 중얼거린다.",
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
    build: ({ place, seed, actionIntro, closeUp, npc, world, question }) => ultraSentence([
      actionIntro,
      `${place}에서 ${seed.sensory}`,
      seed.focus,
      seed.pressureLine,
      closeUp,
      `${npc} ${world}`,
    ], question),
  },
  {
    label: "NPC 선행",
    build: ({ place, seed, actionIntro, closeUp, npc, stake, question }) => ultraSentence([
      actionIntro,
      npc,
      `${place}에서 ${seed.focus}`,
      `${stake} ${seed.pressureLine}`,
      closeUp,
    ], question),
  },
  {
    label: "압력 선행",
    build: ({ place, seed, actionIntro, closeUp, gmMove, world, question }) => ultraSentence([
      actionIntro,
      seed.pressureLine,
      `${place}에서 ${seed.sensory}`,
      gmMove,
      `${closeUp} ${world}`,
    ], question),
  },
  {
    label: "단서 선행",
    build: ({ place, seed, actionIntro, closeUp, npc, stake, question }) => ultraSentence([
      actionIntro,
      closeUp,
      `${place}에서 ${seed.sensory}`,
      npc,
      stake,
    ], question),
  },
  {
    label: "질문 선행",
    build: ({ place, seed, actionIntro, closeUp, world, gmMove, question }) => ultraSentence([
      actionIntro,
      `${place}에서 ${seed.focus}`,
      seed.pressureLine,
      gmMove,
      `${closeUp} ${world}`,
    ], question),
  },
  {
    label: "침묵 선행",
    build: ({ place, seed, actionIntro, closeUp, npc, stake, question }) => ultraSentence([
      actionIntro,
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
    build: ({ verdict, memory, next, judge }) => ultraSentence([
      judge,
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
    build: ({ profile, verdict, cost, gmMove, memory, next, judge }) => ultraSentence([
      cost,
      judge,
      gmMove,
      verdict,
      `${profile.memory} ${memory}`,
    ], next),
  },
  {
    label: "반응 선행",
    build: ({ verdict, npc, world, next, judge }) => ultraSentence([
      `${npc} ${world}`,
      judge,
      verdict,
    ], next),
  },
  {
    label: "단서 선행",
    build: ({ verdict, closeUp, memory, next, judge }) => ultraSentence([
      closeUp,
      judge,
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

const dagmActionCloseUps = {
  "대화": [
    "상대의 입보다 손가락이 먼저 반응하고, 대답의 빈틈이 짧게 열린다.",
    "말이 끝나기 전에 주변 시선이 둘 사이의 거리를 재기 시작한다.",
    "상대가 당신의 말을 듣는 척하지만, 시선은 당신이 숨긴 물건 쪽으로 먼저 간다.",
  ],
  "전투": [
    "칼끝이 먼저 빛나고, 경비의 손이 허리춤으로 내려간다.",
    "발소리가 바닥을 치자 가장 가까운 목격자가 한 걸음 물러난다.",
    "경비의 시선이 당신의 칼보다 발목과 손목의 움직임을 먼저 본다.",
  ],
  "이동/돌파": [
    "벽 윗부분의 먼지가 흔들리고, 발을 디딜 만한 홈 하나가 보인다.",
    "넘어갈 길은 보이지만, 착지할 곳의 소리와 시선이 먼저 계산된다.",
    "몸을 띄우는 순간 손목의 사슬이나 장비 하나가 걸릴 수 있는 위치가 드러난다.",
  ],
  "회피/추적": [
    "도망칠 틈은 보이지만, 당신 발밑의 흔적도 동시에 선명해진다.",
    "모퉁이의 그림자가 길을 열고, 뒤쪽 발소리는 한 박자 빨라진다.",
    "닫힌 줄 알았던 틈 하나가 열리지만, 그 틈은 너무 많은 시선을 지나간다.",
  ],
  "조사": [
    "문서보다 얼룩이 먼저 말하고, 냄새가 방향을 가리킨다.",
    "작은 흠집 하나가 다른 흔적들과 맞지 않게 삐져나와 있다.",
    "보려던 것 옆에서 더 오래 숨겨진 흔적이 드러난다.",
  ],
  "마법/율법": [
    "마나의 흐름이 당신의 손끝보다 먼저 주변 먼지를 끌어당긴다.",
    "보이지 않는 선 하나가 장면의 공기를 가르고, 누군가 그 변화를 느낀다.",
    "힘은 모이지만, 그 힘이 남길 냄새와 소문도 함께 짙어진다.",
  ],
  "정체/휴식": [
    "멈춘 사이에도 문밖의 발소리는 한 번 더 가까워진다.",
    "쉬는 숨은 고르지만, 장면의 시간은 당신 편이 아니다.",
    "기다림은 피해를 줄여도 기회를 그대로 보존해주지는 않는다.",
  ],
};

const dagmActionOpenings = {
  "대화": [
    "상대의 표정과 주변의 침묵이 먼저 흔들린다",
    "말이 닿기 전에 시선들이 둘 사이의 거리를 재기 시작한다",
  ],
  "전투": [
    "거리와 손목과 무기 끝이 한꺼번에 좁아진다",
    "가장 가까운 발소리가 먼저 반응하고, 주변 시선이 뒤늦게 따라붙는다",
  ],
  "이동/돌파": [
    "벽 위의 틈, 발판, 착지 지점이 한꺼번에 눈에 들어온다",
    "몸이 뜨기 전에 먼저 소리 날 곳과 걸릴 곳이 드러난다",
  ],
  "회피/추적": [
    "발소리와 그림자가 서로 다른 길을 가리킨다",
    "열린 틈과 남을 흔적이 동시에 보인다",
  ],
  "조사": [
    "가장 먼저 틀린 흔적 하나가 시야에 걸린다",
    "보려던 것보다 어긋난 부분이 먼저 말을 건다",
  ],
  "마법/율법": [
    "공기와 먼지가 힘의 방향으로 먼저 기울어진다",
    "보이지 않는 선 하나가 당신의 손끝보다 먼저 움직인다",
  ],
  "정체/휴식": [
    "멈춘 숨 사이로 시간의 압박이 먼저 다가온다",
    "기다림이 만든 침묵이 문밖의 소리를 더 크게 만든다",
  ],
  "일반 행동": [
    "주변의 시선과 사물의 위치가 먼저 반응한다",
    "작은 움직임 하나가 장면의 압력을 다른 곳으로 밀어낸다",
  ],
};

const dagmActionReadies = {
  "대화": "당신이 말을 꺼내려는 순간",
  "전투": "당신이 거리를 좁히려는 순간",
  "이동/돌파": "당신이 몸을 띄우려는 순간",
  "회피/추적": "당신이 움직일 틈을 잡는 순간",
  "조사": "당신이 자세히 확인하려는 순간",
  "마법/율법": "당신이 힘을 끌어올리려는 순간",
  "정체/휴식": "당신이 숨을 고르려는 순간",
  "일반 행동": "당신이 행동에 들어가려는 순간",
};

const dagmUltraNpcReactions = [
  "이름 없는 NPC 하나가 모른 척하지만, 당신이 움직일 때만 숨을 멈춘다.",
  "상대는 대답을 늦춘다. 늦춘 시간이 대답보다 솔직하다.",
  "누군가 당신 편인 척 가까워지지만, 시선은 출구가 아니라 장부에 붙어 있다.",
  "경비 하나가 규칙대로 움직이지 않고, 개인적인 짜증으로 한 걸음 먼저 나온다.",
  "구경꾼은 웃지 않는다. 웃지 않는 사람이 이 장면의 값을 알고 있다.",
  "동료나 목격자는 말 대신 물건을 옮겨 당신에게 짧은 길을 만들어 준다.",
];

const dagmActionNpcReactions = {
  "이동/돌파": [
    "가까운 경비가 고개를 돌리기 직전, 발판이 한 번 삐걱인다.",
    "목격자 하나가 숨을 삼키지만 아직 소리를 내지는 않는다.",
    "반대편의 누군가가 착지 지점에서 반 걸음 물러난다.",
  ],
};

const dagmUltraWorldReactions = [
  "세계는 이 일을 즉시 처벌하지 않고 소문으로 저장한다.",
  "도시나 콜로세움의 작은 시계 하나가 조용히 1칸 움직인다.",
  "지금은 아무도 막지 않지만, 다음 문에서 같은 흔적이 값을 요구한다.",
  "주변 사람들은 사건을 보지 못한 척하며 각자 다른 이유로 기억한다.",
  "이 장면은 보상보다 관계와 의심을 먼저 남긴다.",
  "좋은 길과 나쁜 길이 갈라지는 게 아니라, 안전해 보이는 길에 이름표가 붙는다.",
];

const dagmActionWorldReactions = {
  "이동/돌파": [
    "장면은 높이보다 소리, 착지 위치, 목격자의 시야를 먼저 기록한다.",
    "벽 너머의 공간은 안전을 보장하지 않고 다음 위치를 요구한다.",
    "통과한 뒤에도 흔들린 먼지와 발자국이 뒤쪽에 남는다.",
  ],
};

const dagmUltraStakes = [
  "지금 고르면 작게 잃고, 미루면 크게 들킨다.",
  "시도하는 순간 누가 봤는지는 남는다.",
  "이득은 가까운데, 그 이득의 주인이 아직 보이지 않는다.",
  "시간을 벌 수는 있지만 기회 하나가 닫힌다.",
  "힘으로 밀려는 순간 이름이 먼저 퍼질 수 있다.",
  "말로 넘기려면 다음 질문이 더 날카로워진다.",
];

const dagmActionStakes = {
  "이동/돌파": [
    "넘으려면 소리와 시간을 먼저 저울질해야 한다.",
    "착지 위치가 다음 위험을 정할 수 있다.",
    "장비를 챙길수록 늦고, 몸만 움직이면 하나를 떨어뜨릴 수 있다.",
  ],
};

const dagmPreRollQuestions = {
  "대화": [
    "부드럽게 꺼내나, 약점을 먼저 찌르나, 이름을 숨긴 채 떠보나?",
    "호의를 노리나, 시간을 벌나, 상대의 반응부터 보나?",
  ],
  "전투": [
    "바로 치나, 위협으로 멈춰 세우나, 손목이나 발목을 먼저 노리나?",
    "먼저 붙나, 거리를 재나, 목격자의 시선을 끊나?",
  ],
  "이동/돌파": [
    "바로 뛰나, 발판을 먼저 확인하나, 장비를 버리고 가볍게 움직이나?",
    "소리를 감수하고 단숨에 가나, 시간을 들여 낮게 붙나, 누가 보는지 먼저 확인하나?",
  ],
  "회피/추적": [
    "지금 빠지나, 흔적을 지우나, 따라오는 자를 다른 길로 유도하나?",
    "가장 가까운 틈을 타나, 안전해 보이는 길을 고르나, 위험한 지름길을 보나?",
  ],
  "조사": [
    "눈앞의 단서를 잡나, 냄새나 소리를 따라가나, 사람의 표정을 먼저 보나?",
    "확실한 것 하나를 확인하나, 위험한 추론을 세우나, 누군가에게 먼저 묻나?",
  ],
  "마법/율법": [
    "작게 쓰나, 크게 뒤집나, 대가를 먼저 정하나?",
    "흔적을 숨기나, 힘을 드러내나, 반동을 감수하나?",
  ],
  "정체/휴식": [
    "더 기다리나, 지금 움직이나, 누군가를 먼저 보내나?",
    "피해를 줄이나, 기회를 지키나, 위험을 늦추나?",
  ],
  "일반 행동": [
    "바로 시도하나, 조건을 하나 더 만들나, 위험을 먼저 줄이나?",
    "작게 움직이나, 크게 걸나, 누가 보는지 먼저 확인하나?",
  ],
};

const dagmUltraQuestions = [
  "숨기나, 먼저 말하나, 아니면 상대가 착각하게 두나?",
  "물건을 잡나, 사람을 잡나, 아니면 흔적을 지우나?",
  "지금 판정을 걸고 들어가나, 단서 하나를 더 모으나?",
  "작게 잃고 지나가나, 크게 걸고 장면을 뒤집나?",
  "누구에게 보이게 움직이나, 누구에게만 숨기나?",
  "이 장면에서 원하는 것은 정보인가, 안전인가, 이름인가?",
];

const dagmActionQuestions = {
  "대화": [
    "부드럽게 설득하나, 거짓말로 밀어붙이나, 상대의 약점을 찌르나?",
    "호의를 얻나, 정보를 얻나, 아니면 시간을 버나?",
    "지금 이름을 밝히나, 숨기나, 다른 이름을 던지나?",
  ],
  "전투": [
    "끝까지 들이받나, 위협으로 멈추나, 경비의 손을 먼저 치나?",
    "피를 보나, 제압하나, 길만 열고 빠지나?",
    "칼을 높이 드나, 낮게 파고드나, 목격자를 먼저 의식하나?",
  ],
  "이동/돌파": [
    "단숨에 넘나, 낮게 붙어 오르나, 소리를 줄이나?",
    "넘고 숨나, 넘고 달리나, 남은 사람을 먼저 확인하나?",
    "손을 먼저 쓰나, 발을 먼저 올리나, 장비를 버리고 가볍게 움직이나?",
  ],
  "회피/추적": [
    "빠르게 빠지나, 흔적을 지우나, 따라오는 자를 유인하나?",
    "가장 가까운 틈으로 가나, 안전해 보이는 길로 가나, 위험한 지름길을 타나?",
    "지금 달리나, 숨나, 누군가를 방패로 삼나?",
  ],
  "조사": [
    "보이는 단서를 잡나, 냄새를 따라가나, 사람의 표정을 먼저 보나?",
    "확실한 것 하나를 얻나, 위험한 추론을 하나 세우나, 다음 판정까지 기다리나?",
    "문서, 물건, 사람 중 무엇을 먼저 확인하나?",
  ],
  "마법/율법": [
    "작게 쓰나, 크게 뒤집나, 대가를 먼저 정하나?",
    "마나의 흔적을 숨기나, 힘을 드러내나, 반동을 감수하나?",
    "주문을 완성하나, 멈추나, 다른 대가로 바꾸나?",
  ],
  "정체/휴식": [
    "더 쉬나, 지금 움직이나, 누군가를 먼저 보내나?",
    "피해를 줄이나, 기회를 지키나, 위험을 늦추나?",
    "기다림을 선택하나, 작은 행동 하나로 시간을 사나?",
  ],
};

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
    sceneLabel: "대화로",
    actionLabel: "대화 행동으로",
    keys: ["말", "설득", "속", "거짓", "흥정", "위협", "도발", "대화", "묻"],
    roll: "매력+설득/공연, 거짓이면 지성+기만",
    pressure: "상대의 성격, 현재 감정, 플레이어 기억이 먼저 반응한다.",
    memory: "말은 사라지지 않고 호칭이나 소문으로 남는다.",
  },
  {
    label: "전투",
    sceneLabel: "전투로",
    actionLabel: "전투 행동으로",
    keys: ["공격", "때", "벤", "찌르", "쏜", "막", "피하", "붙잡", "제압", "칼", "검", "무기", "달려", "돌진", "경비에게"],
    roll: "근력/민첩+무기, 방어는 회피/막기/버티기",
    pressure: "피해보다 위치, 시선, 소리가 먼저 전장을 바꾼다.",
    memory: "폭력은 끝나도 누가 먼저 손댔는지는 남는다.",
  },
  {
    label: "이동/돌파",
    sceneLabel: "이동/돌파로",
    actionLabel: "이동/돌파 행동으로",
    keys: ["점프", "뛰어넘", "넘어", "넘", "오르", "기어오", "벽", "담", "울타리", "통과", "건너", "돌파", "빠져나"],
    roll: "민첩+운동. 힘으로 밀면 근력+운동",
    pressure: "목표보다 발판, 착지 위치, 소리와 목격자가 먼저 장면을 바꾼다.",
    memory: "넘어간 자리는 발자국, 흔들린 먼지, 부딪힌 장비 중 하나를 남긴다.",
  },
  {
    label: "회피/추적",
    sceneLabel: "회피/추적으로",
    actionLabel: "회피/추적 행동으로",
    keys: ["숨", "도망", "빠져", "피해", "달리", "기어", "잠입", "몰래"],
    roll: "민첩+은신/운동 또는 지성+판단",
    pressure: "길은 열리지만 뒤따라오는 흔적도 같이 생긴다.",
    memory: "놓친 사람은 사라지는 게 아니라 다른 문으로 돌아온다.",
  },
  {
    label: "조사",
    sceneLabel: "조사로",
    actionLabel: "조사 행동으로",
    keys: ["살피", "살핀", "조사", "찾", "냄새", "듣", "본", "확인", "도감", "표정", "흔적"],
    roll: "지성+감각/도감, 냄새나 흔적이면 체력/지성 중 맞는 것",
    pressure: "정답 대신 확인 가능한 단서가 먼저 나온다.",
    memory: "발견한 단서는 다음 장면에서 정보 슬롯 후보가 된다.",
  },
  {
    label: "마법/율법",
    sceneLabel: "마법/율법으로",
    actionLabel: "마법/율법 행동으로",
    keys: ["마법", "마나", "그라듀", "율법", "주문", "권능", "화신"],
    roll: "마나+마법학 또는 율법 대가",
    pressure: "힘이 장면을 바꾸면 장면도 힘의 흔적을 되돌려 준다.",
    memory: "신비한 해결은 소문, 반동, 오해 중 하나를 남긴다.",
  },
  {
    label: "정체/휴식",
    sceneLabel: "정체/휴식으로",
    actionLabel: "정체/휴식 행동으로",
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

  if (isStaleDagmResult(state.dagmResult)) {
    state.dagmResult = null;
  }
}

function isStaleDagmResult(result) {
  if (!result) return false;
  const text = JSON.stringify(result);
  return [
    "네가",
    "너를",
    "너에게",
    "네 이름",
    "네 행동",
    "네 발자국",
    "장면 행동",
    "선언하는 순간 이 장면은",
    "당신의 선언은",
    "행동으로 읽히",
    "초고도화 · 감각 선행",
    "초고도화 · NPC 선행",
    "초고도화 · 압력 선행",
    "초고도화 · 단서 선행",
    "초고도화 · 질문 선행",
    "초고도화 · 침묵 선행",
    "DAGM 행동 처리",
    "DAGM 초고도화 행동 처리",
  ].some((marker) => text.includes(marker));
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
  renderOracleResult(el.dagmOutput, state.dagmResult, "장면 시작이나 행동 판정을 선택한다.");
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
  const action = state.dagmAction.trim();
  const seed = pickDagmSceneSeed(action);
  const profile = action ? classifyDagmAction(action) : null;
  const place = state.dagmPlace.trim() || "지금 있는 곳";
  const density = densityLabel(state.dagmDensity);

  if (state.dagmDensity === "ultra") {
    state.dagmResult = makeUltraDagmScene(place, seed, action);
    saveState();
    renderOracleResult(el.dagmOutput, state.dagmResult, "장면 시작이나 행동 판정을 선택한다.");
    setSaveStatus("DAGM 저장됨");
    return;
  }

  const opportunity = pick(dagmOpportunities);
  const lines = [
    action ? `도입 행동: ${action}` : null,
    `${place}. ${seed.sensory}`,
    seed.focus,
    seed.pressureLine,
    `${seed.questionLine} ${seed.hook}`,
    "무엇을 하나?",
  ].filter(Boolean);

  if (state.dagmDensity !== "short") {
    lines.splice(4, 0, `닫히는 기회: ${opportunity}`);
    lines.push(`기억 1줄: 이 장면은 ${seed.pressure} 때문에 다시 돌아온다.`);
  }

  if (state.dagmDensity === "deep") {
    lines.push(`숨은 압력 후보: ${pick(agmFollowUps)}`);
  }

  state.dagmResult = {
    title: profile ? "DAGM 장면 (판정 전)" : "DAGM 장면",
    meta: makeDagmSceneMeta(density, seed, profile),
    lines,
  };

  saveState();
  renderOracleResult(el.dagmOutput, state.dagmResult, "장면 시작이나 행동 판정을 선택한다.");
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
    renderOracleResult(el.dagmOutput, state.dagmResult, "장면 시작이나 행동 판정을 선택한다.");
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
    title: "DAGM 행동 판정",
    meta: `${density} · 2d6 ${dice[0]}+${dice[1]} = ${total} · ${resolved.answer}`,
    lines,
  };

  saveState();
  renderOracleResult(el.dagmOutput, state.dagmResult, "장면 시작이나 행동 판정을 선택한다.");
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

function cleanDisplayClause(value) {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.?!]+$/g, "");
}

function pickDagmSceneSeed(action) {
  const text = action.replace(/\s+/g, "");
  if (!text) return pick(dagmSeeds);

  const profile = classifyDagmAction(action);
  const candidates = dagmSeeds.filter((seed) => {
    if (profile.label === "전투") return ["소리", "장소", "이상함"].includes(seed.impression);
    if (profile.label === "이동/돌파") return ["장소", "소리"].includes(seed.impression);
    if (profile.label === "회피/추적") return ["소리", "장소", "이상함"].includes(seed.impression);
    if (profile.label === "대화") return ["사람", "물건", "이상함"].includes(seed.impression);
    if (profile.label === "조사") return ["냄새", "물건", "이상함"].includes(seed.impression);
    if (profile.label === "마법/율법") return ["물건", "이상함", "장소"].includes(seed.impression);
    if (profile.label === "정체/휴식") return ["냄새", "장소", "이상함"].includes(seed.impression);
    return true;
  });

  return pick(candidates.length ? candidates : dagmSeeds);
}

function makeUltraDagmScene(place, seed, action = "") {
  const form = pick(dagmUltraSceneForms);
  const profile = action.trim() ? classifyDagmAction(action) : null;

  if (profile) {
    return makeUltraDagmPreRollScene(place, seed, profile);
  }

  const context = {
    place,
    seed,
    actionIntro: "",
    closeUp: pickDagmCloseUp(null),
    npc: pickDagmNpcReaction(null),
    world: pickDagmWorldReaction(null),
    stake: pickDagmStake(null),
    question: pickDagmQuestion(null),
    gmMove: pick(dagmUltraSoftMoves),
  };

  return {
    title: "DAGM 초고도화 장면",
    meta: makeDagmUltraSceneMeta(form, seed, null),
    lines: form.build(context),
  };
}

function makeUltraDagmPreRollScene(place, seed, profile) {
  const ready = pickDagmActionReady(profile);
  const opening = pickDagmActionOpening(profile);
  const pressure = makePlaceLine(place, seed.focus || seed.sensory);
  const witness = pickDagmNpcReaction(profile);
  const stake = pickDagmStake(profile);
  const question = pickDagmPreRollQuestion(profile);

  return {
    title: "DAGM 초고도화 장면 (판정 전)",
    meta: makeDagmPreRollMeta(profile),
    lines: [
      `상황: ${ready}, ${cleanDisplayClause(opening)}.`,
      `압력: ${cleanDisplayClause(pressure)}. ${cleanDisplayClause(witness)}.`,
      `선택: ${cleanDisplayClause(stake)}. ${question}`,
    ],
  };
}

function makeDagmSceneMeta(density, seed, profile) {
  const base = `${density} · ${seed.impression} / ${seed.pressure} / ${seed.question}`;
  if (!profile) return base;
  return makeDagmPreRollMeta(profile);
}

function makeDagmUltraSceneMeta(form, seed, profile) {
  const base = `초고도화 · ${form.label} · ${seed.impression} / ${seed.pressure} / ${seed.question}`;
  if (!profile) return base;
  return makeDagmPreRollMeta(profile);
}

function makeDagmPreRollMeta(profile) {
  return `판정 전 · 후보: ${formatRollCandidate(profile.roll)}`;
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
    closeUp: pickDagmCloseUp(profile),
    npc: pickDagmNpcReaction(profile),
    world: pickDagmWorldReaction(profile),
    gmMove,
    verdict: dagmUltraVerdictLine(resolved.type, cost, opportunity),
    memory: dagmMemoryLine(resolved.type, cost),
    next: pickDagmQuestion(profile),
    judge: `판정 후보는 ${formatRollCandidate(profile.roll)}이다`,
  };

  return {
    title: "DAGM 초고도화 행동 판정",
    meta: `초고도화 · ${form.label} · 2d6 ${dice[0]}+${dice[1]} = ${total} · ${resolved.answer}`,
    lines: form.build(context),
  };
}

function pickDagmActionOpening(profile) {
  const openings = dagmActionOpenings[profile?.label ?? "일반 행동"];
  return pick(openings?.length ? openings : dagmActionOpenings["일반 행동"]);
}

function pickDagmActionReady(profile) {
  return dagmActionReadies[profile?.label ?? "일반 행동"] ?? dagmActionReadies["일반 행동"];
}

function pickDagmPreRollQuestion(profile) {
  const questions = dagmPreRollQuestions[profile?.label ?? "일반 행동"];
  return pick(questions?.length ? questions : dagmPreRollQuestions["일반 행동"]);
}

function makePlaceLine(place, detail) {
  const cleanPlace = cleanUltraClause(place || "지금 있는 곳");
  const cleanDetail = cleanUltraClause(detail || "상황이 조용히 움직인다");
  return `${cleanPlace}. ${cleanDetail}`;
}

function formatRollCandidate(roll) {
  return String(roll)
    .trim()
    .replace(/\.\s*/g, " / ")
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*$/g, "");
}

function pickDagmCloseUp(profile) {
  if (!profile) return pick(dagmUltraCloseUps);
  const closeUps = dagmActionCloseUps[profile.label];
  return pick(closeUps?.length ? closeUps : dagmUltraCloseUps);
}

function pickDagmNpcReaction(profile) {
  if (!profile) return pick(dagmUltraNpcReactions);
  const reactions = dagmActionNpcReactions[profile.label];
  return pick(reactions?.length ? reactions : dagmUltraNpcReactions);
}

function pickDagmWorldReaction(profile) {
  if (!profile) return pick(dagmUltraWorldReactions);
  const reactions = dagmActionWorldReactions[profile.label];
  return pick(reactions?.length ? reactions : dagmUltraWorldReactions);
}

function pickDagmStake(profile) {
  if (!profile) return pick(dagmUltraStakes);
  const stakes = dagmActionStakes[profile.label];
  return pick(stakes?.length ? stakes : dagmUltraStakes);
}

function pickDagmQuestion(profile) {
  if (!profile) return pick(dagmUltraQuestions);
  const questions = dagmActionQuestions[profile.label];
  return pick(questions?.length ? questions : dagmUltraQuestions);
}

function classifyDagmAction(action) {
  const text = action.replace(/\s+/g, "");
  const profile = dagmActionProfiles.find((item) => {
    return item.keys.some((key) => text.includes(key));
  });
  return profile ?? {
    label: "일반 행동",
    sceneLabel: "일반 행동으로",
    actionLabel: "일반 행동으로",
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
