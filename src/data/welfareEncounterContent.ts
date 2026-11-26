/**
 * Education-welfare regular encounters, phases 1.3–1.7.
 * Character names/designs and ACT responses are original proposals unless
 * explicitly marked as a user-confirmed event function in the source index.
 */
export type WelfareRegularEnemyId =
  | "timidPeer"
  | "rhythmMote"
  | "watchfulPrism"
  | "lunchSprout"
  | "echoPair";

export type WelfareEnemyPattern = "drift" | "rhythm" | "sweep" | "fall" | "echo";
export type WelfareEncounterOutcome = "peaceful" | "withdrew";

export interface WelfareActOption {
  id: string;
  label: string;
  response: string;
  repeatResponse: string;
  advances: boolean;
}

export interface WelfareEnemyDefinition {
  id: WelfareRegularEnemyId;
  name: string;
  textureKey: string;
  intro: string[];
  fightResponses: string[];
  actOptions: WelfareActOption[];
  pattern: WelfareEnemyPattern;
  resolveAt: number;
  mercyReady: string;
  peacefulExit: string[];
  withdrewExit: string[];
  attackHint: string;
  patternDurationMs: number;
  patternIntervalMs: number;
}

export const WELFARE_REGULAR_ENCOUNTERS: Record<WelfareRegularEnemyId, WelfareEnemyDefinition> = {
  timidPeer: {
    id: "timidPeer",
    name: "겁 많은 친구",
    textureKey: "welfare-timid",
    intro: [
      "복도 모퉁이에 있던 친구가 당신을 보고 어깨를 움츠린다.",
      "먼저 말을 걸고 싶은 듯하지만, 목소리가 쉽게 나오지 않는 것 같다.",
    ],
    fightResponses: [
      "그 친구는 예상하지 못한 움직임에 한 걸음 물러난다.",
      "상대는 당신의 다음 행동을 살피며 더 작게 몸을 웅크린다.",
      "친구는 더 이야기하기 어렵다며 통로 가장자리로 물러난다.",
    ],
    actOptions: [
      { id: "quiet", label: "목소리를 낮춘다", response: "당신이 목소리를 낮추자 친구의 어깨가 조금 내려간다.", repeatResponse: "이미 충분히 낮은 목소리다. 이제 친구가 먼저 말할 틈을 준다.", advances: true },
      { id: "space", label: "한 걸음 물러선다", response: "당신이 거리를 두자 친구는 숨을 고른다.", repeatResponse: "친구는 더 이상 거리를 두지 않아도 된다는 듯 고개를 끄덕인다.", advances: true },
      { id: "encourage", label: "천천히 말해도 된다고 한다", response: "친구는 짧게 고맙다고 말한다. 이번에는 눈을 피하지 않는다.", repeatResponse: "친구가 스스로 말을 이어가려 한다.", advances: true },
    ],
    pattern: "drift",
    resolveAt: 2,
    mercyReady: "친구는 이제 대화를 이어갈 준비가 되었다.",
    peacefulExit: ["친구는 조심스럽게 고개를 숙인다.", "“들어줘서 고마워.”", "그는 복도 한쪽에서 천천히 걸음을 옮긴다."],
    withdrewExit: ["친구는 더는 대화하기 어렵다며 복도 끝으로 물러난다.", "당신을 적으로 여기지는 않지만, 지금은 혼자 있고 싶은 모양이다."],
    attackHint: "흩어지는 작은 빛을 피하자. 움직임은 느리지만 방향이 일정하지 않다.",
    patternDurationMs: 2600,
    patternIntervalMs: 520,
  },
  rhythmMote: {
    id: "rhythmMote",
    name: "박자 먼지",
    textureKey: "welfare-rhythm",
    intro: [
      "공중의 작은 빛무리가 일정하지 않은 박자로 흔들린다.",
      "당신이 다가가자 빛무리는 리듬을 맞춰 보라는 듯 잠깐 멈춘다.",
    ],
    fightResponses: [
      "빛무리가 박자를 놓치고 빠르게 흔들린다.",
      "리듬이 엉키자 작은 빛들이 서로 다른 방향으로 흩어진다.",
      "박자 먼지는 무리한 움직임을 멈추고 조용히 뒤로 물러난다.",
    ],
    actOptions: [
      { id: "watch", label: "먼저 박자를 관찰한다", response: "세 번의 짧은 빛과 한 번의 긴 빛이 반복된다.", repeatResponse: "같은 박자가 반복된다. 이번에는 타이밍을 맞출 수 있을 것 같다.", advances: true },
      { id: "follow", label: "박자에 맞춰 움직인다", response: "당신의 움직임이 빛무리의 리듬과 맞아떨어진다.", repeatResponse: "빛무리는 당신의 리듬을 기억한 듯 조금 더 부드럽게 흔들린다.", advances: true },
      { id: "wait", label: "마지막 박자가 끝날 때까지 기다린다", response: "마지막 빛이 꺼지고 난 뒤, 방 안이 잠시 고요해진다.", repeatResponse: "빛무리는 서두르지 않는 당신을 따라 속도를 늦춘다.", advances: true },
    ],
    pattern: "rhythm",
    resolveAt: 2,
    mercyReady: "빛무리는 당신과 같은 박자로 천천히 움직인다.",
    peacefulExit: ["박자 먼지는 작은 원을 그리며 작별 인사를 한다.", "빛무리는 벽의 장식 틈으로 스며들어 사라진다."],
    withdrewExit: ["박자 먼지는 리듬을 멈추고 천장 쪽으로 물러난다.", "복도에는 잠깐의 고요만 남는다."],
    attackHint: "빛의 박자가 바뀔 때마다 이동 방향을 살피자.",
    patternDurationMs: 2700,
    patternIntervalMs: 480,
  },
  watchfulPrism: {
    id: "watchfulPrism",
    name: "반사 결정",
    textureKey: "welfare-prism",
    intro: [
      "투명한 결정이 당신을 향해 빛을 돌린다.",
      "가까이 다가갈수록 결정의 표면에는 당신의 움직임이 여러 방향으로 비친다.",
    ],
    fightResponses: [
      "결정은 더 많은 반사면을 열어 당신을 살핀다.",
      "빛이 갈라지며 복도 바닥에 여러 겹의 그림자를 만든다.",
      "결정은 반사면을 닫고 자신의 빛을 안쪽으로 거둔다.",
    ],
    actOptions: [
      { id: "lowerGaze", label: "빛을 정면으로 바라보지 않는다", response: "결정은 반사각을 낮추며 눈부심을 줄인다.", repeatResponse: "결정은 더 이상 당신의 시선을 시험하지 않는다.", advances: true },
      { id: "slowMove", label: "천천히 움직여 본다", response: "결정의 표면이 당신의 속도에 맞춰 안정된다.", repeatResponse: "반사된 움직임이 더는 어지럽게 겹치지 않는다.", advances: true },
      { id: "namePattern", label: "반사되는 순서를 말해 준다", response: "당신이 짚은 순서대로 결정의 빛이 차례로 켜진다.", repeatResponse: "결정은 마지막 빛을 천천히 낮춘다.", advances: true },
    ],
    pattern: "sweep",
    resolveAt: 2,
    mercyReady: "결정의 빛이 부드럽게 한 방향으로 모였다.",
    peacefulExit: ["반사 결정은 은은한 빛을 남기고 통로 가장자리로 이동한다.", "이제 빛이 길을 가로막지 않는다."],
    withdrewExit: ["반사 결정은 빛을 안쪽으로 거둔다.", "통로가 조용해졌다."],
    attackHint: "가로로 지나가는 빛의 띠 사이를 살피며 움직이자.",
    patternDurationMs: 2700,
    patternIntervalMs: 560,
  },
  lunchSprout: {
    id: "lunchSprout",
    name: "급식 새싹",
    textureKey: "welfare-sprout",
    intro: [
      "작은 새싹이 화분 가장자리에서 고개를 내민다.",
      "잎 끝의 물방울이 떨어질 때마다 주변의 빛이 짧게 반짝인다.",
    ],
    fightResponses: [
      "새싹은 잎을 오므리고 물방울을 더 높이 띄운다.",
      "잎이 흔들리며 물방울의 간격이 불규칙해진다.",
      "새싹은 잎을 접고 화분 뒤로 숨는다.",
    ],
    actOptions: [
      { id: "observeLeaf", label: "잎의 상태를 살핀다", response: "잎 가장자리에 작은 갈색 자국이 보인다.", repeatResponse: "새싹은 더 이상 잎을 숨기지 않는다.", advances: true },
      { id: "shareWater", label: "주변의 물방울을 모아 둔다", response: "새싹은 물방울을 받아 잎을 조금 펼친다.", repeatResponse: "화분의 흙이 촉촉해졌다.", advances: true },
      { id: "waitSun", label: "빛이 드는 자리로 비켜 준다", response: "빛이 잎 끝에 닿자 새싹이 고개를 든다.", repeatResponse: "새싹은 햇빛을 따라 몸을 돌린다.", advances: true },
    ],
    pattern: "fall",
    resolveAt: 2,
    mercyReady: "새싹은 잎을 활짝 펴고 더는 물방울을 흩뿌리지 않는다.",
    peacefulExit: ["새싹은 작은 잎 하나를 흔들어 인사한다.", "화분 옆의 길이 드러난다."],
    withdrewExit: ["새싹은 잎을 접고 화분 안쪽으로 숨는다.", "잠시 뒤 다시 고개를 내밀지도 모른다."],
    attackHint: "위에서 떨어지는 작은 빛방울을 피하자.",
    patternDurationMs: 2700,
    patternIntervalMs: 500,
  },
  echoPair: {
    id: "echoPair",
    name: "메아리 친구들",
    textureKey: "welfare-echo",
    intro: [
      "두 개의 작은 형상이 서로의 말을 따라 하며 통로를 채운다.",
      "혼자 말할 때와 둘이 함께 말할 때, 같은 소리도 전혀 다르게 들리는 것 같다.",
    ],
    fightResponses: [
      "두 형상은 서로의 움직임을 따라 하며 리듬을 빠르게 만든다.",
      "하나가 멈추자 다른 하나도 잠깐 방향을 잃는다.",
      "두 형상은 서로를 바라보고 한 걸음씩 물러난다.",
    ],
    actOptions: [
      { id: "listenBoth", label: "두 사람의 말을 차례로 듣는다", response: "각각의 목소리는 조금씩 다르다. 둘은 처음으로 서로의 말을 듣는다.", repeatResponse: "두 형상은 서로의 차이를 조금 더 편안하게 받아들인다.", advances: true },
      { id: "askTogether", label: "함께 말할 때의 규칙을 묻는다", response: "둘은 동시에 대답하려다 멈추고, 한 명씩 이야기하기로 한다.", repeatResponse: "이번에는 서로의 말을 끊지 않는다.", advances: true },
      { id: "giveTurn", label: "한 명씩 말할 차례를 건넨다", response: "두 형상은 차례를 지키며 천천히 말한다.", repeatResponse: "둘의 메아리가 한결 고르게 이어진다.", advances: true },
    ],
    pattern: "echo",
    resolveAt: 2,
    mercyReady: "두 형상은 같은 소리를 내지 않아도 함께 있을 수 있다는 듯 고개를 끄덕인다.",
    peacefulExit: ["메아리 친구들은 서로 다른 방향으로 손을 흔든다.", "두 형상은 통로 양쪽으로 비켜선다."],
    withdrewExit: ["메아리 친구들은 더 이야기하지 않고 각자 다른 쪽으로 물러난다."],
    attackHint: "양쪽에서 번갈아 다가오는 빛무늬의 간격을 살펴보자.",
    patternDurationMs: 2900,
    patternIntervalMs: 500,
  },
};

export const WELFARE_PHONE_CALLS = {
  first: [
    "여보렴? 내 목소리가 들리니?",
    "복도에 들어섰다면 서두르지 말고 주변을 살펴보렴.",
    "모르는 것이 있으면 다시 연락해도 괜찮단다.",
  ],
  afterPuzzle: [
    "아, 표식의 순서를 알아냈구나.",
    "실패해도 괜찮아. 천천히 관찰하면 길이 보일 거란다.",
  ],
  afterEncounters: [
    "복도에서 여러 친구를 만났겠구나.",
    "누군가 말이 느리다고 해서 그 마음까지 느린 것은 아니란다.",
  ],
  later: [
    "아직 그곳에 있니? 괜찮다면 잠시 쉬어도 좋단다.",
    "네가 직접 살펴보고 결정하는 것을 잊지 말렴.",
  ],
} as const;

export const WELFARE_PROGGITHUB_NPCS = {
  guide: {
    speaker: "프로깃허브 안내 개체",
    lines: [
      "전투 메뉴에서 ESC를 누르면 이전 선택으로 돌아갈 수 있다.",
      "선택한 행동이 상대에게 어떤 반응을 일으키는지 살펴보렴.",
      "상대가 마음을 놓으면 MERCY 표시가 달라질 수 있다.",
    ],
  },
  cancel: {
    speaker: "벽 옆 프로깃허브",
    lines: [
      "메뉴에서 취소하는 기능을 알려주겠다.",
      "ACT 하위 메뉴에서는 ESC로 이전 메뉴에 돌아갈 수 있다.",
      "선택을 확정하기 전에는 방향키로 다시 살펴볼 수 있다.",
    ],
  },
  display: {
    speaker: "기둥 뒤 프로깃허브",
    lines: [
      "게임 화면의 테두리와 안내 위치는 화면 크기에 따라 조금 달라질 수 있다.",
      "하지만 상호작용 대상과 선택한 명령은 글자로도 표시되어야 한다.",
    ],
  },
  mercy: {
    speaker: "숨은 프로깃허브",
    lines: [
      "MERCY는 모든 상대에게 같은 조건으로 열리지 않는다.",
      "상대가 무엇을 원하는지 알아낸 뒤에야 선택할 수 있는 경우도 있다.",
    ],
  },
} as const;

export const WELFARE_HALL_PUZZLE = {
  sequence: [2, 0, 1] as const,
  choices: ["왼쪽 홈", "가운데 홈", "오른쪽 홈"] as const,
  hint: "벽의 세 표식은 오른쪽에서 시작해 왼쪽으로, 마지막에는 가운데로 빛났다.",
  repeatHint: "첫 번째 빛은 오른쪽, 두 번째는 왼쪽, 마지막은 가운데다.",
} as const;

export const NERDSTABLOOK_CONTENT = {
  intro: [
    "길을 막고 있던 친구가 책을 꼭 끌어안는다.",
    "“ㅇ... 혹시 이런 만화 좋아하니? 아니면 그냥 지나가도 괜찮아...”",
    "그는 당신의 표정을 살피며 책을 조금 내민다.",
  ],
  actOptions: [
    { id: "interesting", label: "재밌어 보인다고 말한다", positive: true, response: "“정말? 표지 말고 안쪽 이야기도 재밌다능...”" },
    { id: "recommend", label: "다른 것도 추천해 달라고 한다", positive: true, response: "“그, 그럼 다음 권도 있는데... 아니, 너무 많이 말했나?”" },
    { id: "listen", label: "조용히 끝까지 들어준다", positive: true, response: "그는 조금씩 긴장을 풀고 자신이 좋아하는 장면을 설명한다." },
    { id: "notNow", label: "지금은 관심이 없다고 말한다", positive: false, response: "“아... 그렇구나. 내가 너무 갑자기 말을 걸었지...”" },
    { id: "dismiss", label: "그만 이야기해 달라고 한다", positive: false, response: "“미, 미안... 그래도 이 책 이야기는 정말 좋아하는데...”" },
    { id: "mock", label: "취향을 이상하다고 말한다", positive: false, response: "“이상한가...? 그럼 더는 말하지 않을게...”" },
  ],
  positiveEnding: [
    "그는 신이 나서 작은 굿즈를 건네려다 손을 멈춘다.",
    "“아, 이건 내가 정말 아끼는 거라서... 미안. 대신 끝까지 들어줘서 고마워.”",
    "그는 한 걸음 옆으로 비켜서며 길을 열어 준다.",
  ],
  fightResponses: [
    "너드스타블룩은 크게 휘청이는 척하며 책을 꼭 끌어안는다.",
    "그는 또 한 번 아픈 표정을 짓지만, 금세 자세를 바로잡는다.",
    "그는 잠깐 망설이다가 더는 연기하지 않기로 한 듯 고개를 든다.",
  ],
  fakeDurabilityEnding: [
    "“사실... 웬만한 움직임은 나한테 별로 아프지 않아.”",
    "“네 기분이 상할까 봐 아픈 척했던 거야. 내가 아무렇지 않으면 네가 더 민망해할까 봐...”",
    "그는 책을 품에 안고 길을 비켜 준다.",
  ],
  negativePattern: [
    "그는 책을 꼭 끌어안고 당신과 조금 더 거리를 둔다.",
    "책장 사이의 종이 모양 빛무늬가 더 빠르게 오간다.",
  ],
} as const;
