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
  secondRankEncounter: {
    intro: [
      "전교 2등은 책을 꼭 끌어안은 채 당신을 바라본다.",
      "당신이 가까이 다가가자, 그는 책장을 급히 넘기며 뒷걸음질 친다.",
    ],
    actOptions: [
      "책에 적힌 제목을 물어본다.",
      "좋아하는 과목을 물어본다.",
      "조용히 인사한다.",
    ],
    fightResponse: "당신이 한 걸음 다가서려는 순간, 도미토리엘이 사이를 막아선다.",
    actResponse: "당신이 말을 건네려 하자, 전교 2등은 대답 대신 책을 품에 안는다.",
    mercyResponse: "당신은 손을 내리고 거리를 둔다. 하지만 학생은 이미 돌아설 준비를 하고 있었다.",
    itemResponse: "지금 이 조우에서 사용할 수 있는 물건은 없다.",
    departure: "전교 2등은 공부를 하러 갔다.",
    domitoriellAfter: [
      "미안하구나. 원래 저런 아이라서...",
      "책을 좋아하는 마음만큼은 누구보다 진지하단다.",
      "자, 다시 가 보자꾸나.",
    ],
  },
} as const;
