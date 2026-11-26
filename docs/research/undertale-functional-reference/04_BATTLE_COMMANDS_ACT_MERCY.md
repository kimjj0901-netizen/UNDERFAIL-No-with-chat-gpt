# 04 — FIGHT / ACT / ITEM / MERCY 설계 분석

## 1. FIGHT

FIGHT는 전투에서 물리적/행동적 공격을 시도하는 메뉴다. 타이밍 막대에서 Confirm 입력으로 공격 결과를 결정하는 구조가 기본이다.

확인 가능한 특징:

- 플레이어가 공격 대상을 선택한다.
- 타이밍 판정이 있다.
- 중심에 가까운 입력이 더 큰 피해로 이어진다.
- 무기가 타이밍 미니게임과 공격 표현을 바꿀 수 있다.
- 타이밍을 놓치면 MISS가 된다.
- 피해량은 공격자 AT, 방어자 DF 등 수치와 타이밍에 영향을 받는다.

[UNDERFAIL 제안] 무기/도구는 단순히 공격력만 올리는 장비가 아니라 FIGHT의 시각적 리듬과 조작 감각도 바꿀 수 있다. 단, 실제로 어떤 종류의 장비를 둘지는 사용자가 확정한 예체능 물품 중심 기획에 맞춰 별도로 결정한다.

## 2. ACT

ACT의 핵심은 적마다 선택 가능한 행동이 달라진다는 점이다. ACT는 대화 선택지가 아니라 전투 중 캐릭터의 상태와 전투 해결 조건에 영향을 줄 수 있는 전용 행동 시스템이다.

ACT가 바꿀 수 있는 항목의 예:
- 적의 기분/태도.
- 적이 플레이어를 이해하거나 오해하는 정도.
- 적이 반복하는 대사.
- 다음 적 공격 패턴의 구성.
- 특정 비폭력 해결 조건.
- 전투 후 NPC 대사나 관계 플래그.
- 특정 아이템/환경 정보가 있을 때만 열리는 행동.

이 목록은 기능의 예시이지 Undertale의 모든 ACT가 이 값들을 모두 수정한다는 뜻은 아니다.

## 3. ACT 데이터 구조

~~~ts
interface ActOption {
  id: string;
  label: string;
  description?: string;
  availability: ActAvailabilityRule[];
  result: ActResult;
  repeatResult?: ActResult;
}

interface ActAvailabilityRule {
  type: "FLAG" | "TURN" | "ENEMY_STATE" | "ITEM" | "STORY";
  key: string;
  expected?: string | number | boolean;
}

interface ActResult {
  dialogueId: string;
  stateChanges?: {
    enemyMood?: string;
    mercyReady?: boolean;
    attackPatternOverride?: string;
    flagsToSet?: string[];
    flagsToClear?: string[];
  };
  nextPhase: "ENEMY_TURN" | "PLAYER_COMMAND" | "END_CHECK";
}
~~~

ACT의 결과 데이터는 대화 문구와 상태 변화로 나누는 것이 중요하다. 결과 텍스트만 바뀌고 실제 상태가 바뀌지 않는 ACT도 존재할 수 있으므로, 모든 ACT가 강제로 패턴을 변경하도록 만들지 않는다.

## 4. 반복 행동의 반응

동일 행동을 반복했을 때 매번 첫 반응을 보여주면 세계가 플레이어의 과거 입력을 기억하지 않는 것처럼 보인다.

따라서 다음과 같이 반응 층을 구분할 수 있다.

~~~text
첫 실행
  → 첫 반응

같은 행동 반복
  → 반복 대사 또는 변화 없음 표시

다른 행동 실행
  → 별도 반응

해결 조건 충족
  → Mercy 또는 스토리 종료 조건 개방
~~~

[UNDERFAIL 제안] 반복 횟수나 Mercy 조건은 개별 적 데이터에 두고, 공통 시스템 코드 안에 적별 숫자를 직접 하드코딩하지 않는다.

## 5. ITEM

ITEM은 현재 보유 아이템을 선택해 사용하는 메뉴다. 아이템은 전투 밖에서도 사용될 수 있으나, 전투 중에는 HP 회복, 상태 변화, 적의 반응, 특별한 대사나 분기 등 다양한 목적을 가질 수 있다.

[UNDERFAIL 제안] 아이템 데이터는 사용 가능한 문맥과 사용 결과를 따로 선언한다.

~~~ts
interface ItemDefinition {
  id: string;
  name: string;
  usableIn: ("OVERWORLD" | "BATTLE")[];
  target: "PLAYER" | "ENEMY" | "FIELD" | "NONE";
  effectId: string;
  dialogueId?: string;
  uniqueReactionIds?: string[];
}
~~~

현재 UNDERFAIL의 교육복지반 프로토타입에서 아이템 반응이나 소모 규칙이 제한적이라면 이후 시스템 개선 과제로 남긴다. 단, 아이템 사용으로 캐릭터 관계나 스토리 플래그가 변하는 규칙은 사용자 승인 전까지 제안이다.

## 6. MERCY

MERCY는 비폭력 해결 또는 이탈을 시도하는 메뉴다. 흔히 SPARE와 FLEE를 포함하지만 모든 전투에서 두 옵션이 같은 조건으로 사용 가능한 것은 아니다.

[설계 해석] MERCY를 단순히 "적을 살려주는 버튼"으로 구현하면 ACT와 분리될 수 있다. 상대의 태도/상태/요구 조건을 먼저 확인하고, 그 결과 Mercy가 가능해지는 흐름이 더 강한 시스템적 의미를 만든다.

## 7. 적별 해결 조건

~~~ts
interface MercyRule {
  id: string;
  requiresFlags?: string[];
  forbiddenFlags?: string[];
  minimumTurn?: number;
  enemyMood?: string;
  actionHistory?: string[];
  result: "SPARE" | "FLEE" | "STORY_EXIT";
  dialogueId: string;
}
~~~

정확한 변수의 종류와 수량은 각 조우가 어떤 이야기를 하는지 정한 후 설계한다. 모든 적에게 같은 숫자의 ACT를 요구하거나, 단순 호감도 수치만으로 해결하지 않는다.

## 8. 캐릭터별 ACT 설계의 핵심

캐릭터의 성격은 다음 연결을 가져야 한다.

~~~text
성격 / 목표 / 오해
      ↓
ACT 목록
      ↓
ACT 결과 대사
      ↓
캐릭터 상태 변화
      ↓
공격 방식 또는 회피 규칙 변화
      ↓
해결 조건 / 전투 후 반응
~~~

예를 들어 학교 수학 교사라면 수학 퍼즐이나 규칙 감각을 활용할 수 있다. 그러나 "수학 선생님이므로 숫자 탄막"처럼 단순 표면 대응에 머무르면 안 된다. 교사의 교육관과 플레이어의 선택권이 실제 행동과 패턴에 반영되어야 한다.

## 9. UNDERFAIL에 적용할 점

- ACT는 학생/교사마다 별도 데이터로 만든다.
- 같은 행동을 반복하면 이전 기록을 반영한다.
- ACT 결과가 대화, 적의 태도, 패턴, Mercy 조건 중 무엇을 바꾸는지 명시한다.
- 공격 외 해결이 가능한 이유를 스토리 안에서 설득력 있게 만든다.
- 교사와 학생회가 왜 주인공과 맞서는지에 따라 전투를 중단하는 이유를 각각 설계한다.
- 한 개의 공통 수치로 모든 관계를 처리하지 않는다. 기존 정사 문서도 인물별 관계 요소를 별도로 두는 방향을 기록한다.

## 10. 원작과 UNDERFAIL의 차이

Undertale은 몬스터와의 전투이며, 처치/스페어/도망 결과가 해당 세계관에 연결된다. UNDERFAIL은 교사와 학생의 갈등이다. 따라서 원작의 SPARE라는 결과를 그대로 복사하는 것보다, 대립의 중단·납득·후퇴·협력·보호의 방식으로 독자적 결과를 설계해야 한다.

[미정/보류] HP 0, 사망/제압, 교사의 퇴장/전투 중단 의미는 기존 프로젝트에서 확정되지 않았다. 이 파일은 그 의미를 확정하지 않는다.
