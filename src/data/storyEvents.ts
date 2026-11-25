export const WELFARE_EVENTS = {
  firstPuzzle: {
    hint: "세 표식의 빛이 아주 짧게 순서대로 깜빡였다.",
    sequence: [0, 2, 1],
  },
  proggithub: {
    tutorial: [
      "프로깃허브가 조심스럽게 메뉴를 가리킨다.",
      "공격하지 않고도 상대의 태도를 바꿀 수 있다.",
      "ACT, ITEM, MERCY는 각각 다른 방식으로 상황을 바꾼다.",
    ],
  },
  secondRankSeen(): void {
    // The encounter is intentionally recorded as a story fact without
    // defining the later HP-0 or route consequences.
  },
} as const;
