/**
 * All dialogue, room placements and numeric values in this file are PROTOTYPE ONLY.
 * They are intentionally kept separate from scene logic for easy revision.
 */
export const PROTOTYPE_SETTINGS = {
  playerSpeed: 190,
  interactionDistance: 76,
  mercyActsRequired: 3,
  battlePatternDurationMs: 5200,
  bulletIntervalMs: 690,
  bulletSpeed: 118,
  playerHitRadius: 13,
  bulletRadius: 8,
} as const;

export const PROTOTYPE_DIALOGUE = {
  prologue: [
    "풍화양상 고등학교. 오늘도 교문은 쉽게 열리지 않는다.",
    "당신은 성적표와 생활기록을 들고 교육복지실 앞에 서 있다.",
    "이곳에서 무슨 일이 기다리는지는 아직 알 수 없다.",
    "다만, 앞으로의 길을 남이 대신 정하게 두고 싶지는 않다.",
  ],
  roomWelcome: [
    "어서 오렴. 여기는 교육복지실이란다.",
    "조금 쉬어도 괜찮아. 급하게 결정할 필요는 없단다.",
  ],
  bookshelf: [
    "오래된 책들이 분야별로 정리되어 있다.",
    "교과서 사이에 미술과 음악, 운동에 관한 책도 보인다.",
    "누군가 일부러 버리지 않고 남겨 둔 것 같다.",
  ],
  noticeboard: [
    "교육복지실의 안내문이 붙어 있다.",
    "종이 아래쪽에는 '학생의 선택을 존중합니다'라는 문장이 적혀 있다.",
    "다른 안내문보다 유난히 오래된 종이다.",
  ],
  thermosFirst: [
    "작은 보온병이 놓여 있다.",
    "따뜻한 차가 조금 남아 있다. 지금 챙겨 두면 나중에 마실 수 있겠다.",
    "[PROTOTYPE] 이 아이템은 전투에서 체력을 조금 회복한다.",
  ],
  thermosAgain: ["보온병은 비어 있다. 따뜻한 온기가 희미하게 남아 있다."],
  domitoriellFirst: [
    "도미토리엘 선생님은 당신을 가만히 살핀다.",
    "걱정스러운 표정이지만, 억지로 다그치지는 않는다.",
  ],
  domitoriellConcern: [
    "네가 어떤 마음인지 조금은 알 것 같아.",
    "하지만 지금 이 문을 나서면 네가 감당해야 할 일이 많아질 거란다.",
    "나는 네가 다치지 않았으면 좋겠어.",
  ],
  domitoriellAfter: [
    "그래. 네가 몇 번이고 말한 마음을 이제는 알겠구나.",
    "내가 걱정한다는 이유로 네 선택까지 막아서는 안 되겠지.",
    "가렴. 네가 선택한 길을 걸어 보렴.",
  ],
} as const;
