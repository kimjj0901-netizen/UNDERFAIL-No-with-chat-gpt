/**
 * Opening content data.
 * Source facts are tagged; newly authored phrasing and pacing remain proposals.
 */
export type OpeningMood = "memory" | "sorrow" | "present" | "uneasy" | "rescue" | "warm";

export interface OpeningPage {
  image: string;
  kicker: string;
  body: string;
  pageLabel: string;
  mood: OpeningMood;
  status: "[기초자료 확인]" | "[제안]" | "[미정/보류]";
}

export const OPENING_PAGES: OpeningPage[] = [
  {
    image: "opening-past-school",
    kicker: "먼 옛날,",
    body: "꿈을 향해 나아가는 학생이,\n그 꿈 위에 함께하는 학교가 있었다.",
    pageLabel: "0.2 · 기억",
    mood: "memory",
    status: "[기초자료 확인]",
  },
  {
    image: "opening-past-school",
    kicker: "합주곡 혼합고등학교",
    body: "공부하고, 만들고, 연습하고, 뛰어다니며\n각자의 미래를 바라보던 학생들.",
    pageLabel: "0.2 · 서로 다른 미래",
    mood: "memory",
    status: "[제안]",
  },
  {
    image: "opening-closure",
    kicker: "그러나",
    body: "성적 부진으로 인한 폐교 확인서.\n단체사진 위에, 누군가의 손이 마지막 도장을 찍는다.",
    pageLabel: "0.2 · 폐교",
    mood: "sorrow",
    status: "[기초자료 확인]",
  },
  {
    image: "opening-present",
    kicker: "많은 시간이 흐른 뒤",
    body: "202X년 풍화양상 중학교.\n주인공의 손에는 고교 배정 통지서가 들려 있다.",
    pageLabel: "0.2 · 현재",
    mood: "present",
    status: "[미정/보류]",
  },
  {
    image: "opening-present",
    kicker: "풍화양상",
    body: "소문에 따르면, 열등생들을 모범생으로 바꿔주는\n최고의 교화소라고 한다.",
    pageLabel: "0.2 · 소문",
    mood: "uneasy",
    status: "[기초자료 확인]",
  },
];

export const FLOWER_FIELD_DIALOGUE = {
  wake: {
    speaker: "내레이션",
    lines: [
      "차가운 풀잎이 손끝에 닿는다.",
      "낯선 꽃들이 시야를 가득 채우고 있다.",
    ],
    status: "[제안] 꽃밭에서 깨어나는 장면의 연결 문구",
  },
  bullyIntro: {
    speaker: "불리",
    lines: [
      "어라? 이제야 일어났네.",
      "여긴 처음이지? 걱정 마. 내가 규칙을 알려줄게.",
      "저 빛나는 문양을 잘 따라가면 된다고. 아주 쉬워.",
    ],
    status: "[제안] 기만적인 튜토리얼 대사",
  },
  tutorialStart: {
    speaker: "안내",
    lines: [
      "불리가 말한 빛무늬가 움직이기 시작했다.",
      "방향키 또는 WASD로 몸을 움직여 꽃잎 문양을 피하자.",
    ],
    status: "[제안] 튜토리얼 안내",
  },
  bullyWaveTwo: {
    speaker: "불리",
    lines: [
      "어? 생각보다 잘 피하네?",
      "그럼 이번엔 조금 더 복잡하게 해볼까?",
    ],
    status: "[제안] 전투 템포 상승",
  },
  bullyWaveThree: {
    speaker: "불리",
    lines: [
      "잠깐, 그쪽은—",
      "하하! 아직 끝난 거 아니거든?",
    ],
    status: "[제안] 구출 직전의 압박",
  },
  rescue: {
    speaker: "도미토리엘",
    lines: [
      "거기까지 하렴.",
      "괜찮니? 다친 곳은 없니?",
      "놀랐겠구나. 이제 괜찮단다. 내가 함께 가 줄게.",
    ],
    status: "[제안] 구출 직후 대사; 보호 의도는 [사용자 확정]",
  },
} as const;
