# 03 — 전투 상태머신과 턴 진행

## 1. 전투가 게임 전체의 핵심 루프인 이유

[원작 개발자 발언] Toby Fox는 2015년 Game Developer의 개발자 기고에서 전투 엔진을 게임의 다른 요소보다 먼저 만들었다고 설명했다. 또한 전통적인 RPG의 반복 행동 대신 짧은 탄막 패턴을 만들고, 적이 여러 명일 때는 공격 패턴을 결합해 전투를 다양하게 만들었다고 밝혔다.

이 발언은 전투가 단순히 후반에 덧붙인 전투 미니게임이 아니라 게임 설계의 근간이 되었다는 점을 보여준다.

[설계 해석] UNDERFAIL에서도 전투는 스토리 바깥의 별도 액션 게임이 되면 안 된다. 각 캐릭터의 태도, 대화, 선택, 이후 반응이 전투 루프와 이어져야 한다.

## 2. 전투의 큰 흐름

[원작 게임 기능 — 2차 확인] 일반적인 전투는 플레이어가 명령을 선택하는 단계와 적의 패턴을 회피하는 단계가 번갈아 진행되는 구조로 설명할 수 있다.

~~~text
ENCOUNTER_START
  ↓
PLAYER_COMMAND
  ├─ FIGHT
  ├─ ACT
  ├─ ITEM
  └─ MERCY
  ↓
RESOLVE_PLAYER_ACTION
  ↓
DIALOGUE / STATE_FEEDBACK
  ↓
CHECK_END_CONDITIONS
  ├─ 전투 종료
  └─ 적 턴 계속
       ↓
ENEMY_ATTACK_SETUP
  ├─ SOUL_MODE
  ├─ ARENA / BOARD
  ├─ ATTACK_PATTERN
  └─ DURATION
       ↓
SOUL_CONTROL
       ↓
HIT / BLOCK / MISS RESOLUTION
       ↓
CHECK_HP_AND_FLAGS
       ↓
PLAYER_COMMAND
~~~

주의: 이는 플레이어가 체감하는 논리적 순서 모델이다. 정식판의 실제 GML 함수 호출 순서나 모든 예외 경로를 그대로 복원한 상태머신은 아니다.

## 3. 4개 명령은 각기 다른 하위 시스템이다

| 명령 | 플레이어가 기대하는 행동 | 시스템상 효과 |
|---|---|---|
| FIGHT | 공격을 실행 | 타이밍 기반 공격 판정과 피해 처리 |
| ACT | 대상에게 특정 행동 | 대사, 상태, 패턴, 해결 조건 변화 |
| ITEM | 보유 물품 사용 | HP/능력치/전투 상태/특수 반응 변화 |
| MERCY | 비폭력 해결 또는 이탈 | SPARE / FLEE 등 종료 가능 조건 검사 |

전투 선택은 단순히 버튼 하나를 누르는 동작으로 끝나지 않는다. 각 명령이 실행된 뒤 결과를 텍스트와 화면으로 알려주고, 가능한 경우 적의 반응과 다음 전투 상태를 바꾼다.

## 4. FIGHT 타이밍 단계

[원작 게임 기능 — 2차 확인] FIGHT를 선택하면 타이밍 바가 표시되고, 플레이어가 Confirm을 눌러 공격을 판정한다. 중심에 가까운 타이밍일수록 큰 피해가 나며, 무기에 따라 타이밍 미니게임의 형태·속도·바 수·공격 애니메이션이 달라질 수 있다. 타이밍을 놓치면 MISS가 될 수 있다.

[검증 한계] 공개 위키의 설명에서 타이밍 정확도와 피해 관계는 파악되지만, 이번 조사에서 타이밍 배율의 완전한 수치식이나 모든 무기별 보정 공식을 확인하지 못했다. 숫자를 추정해 만들지 않는다.

## 5. 적 공격 단계

적의 공격 단계는 단일한 Sprite를 화면에 띄우는 것이 아니라 다음 조건의 조합으로 생각하는 것이 적합하다.

- 패턴을 실행할 지속 시간.
- SOUL 모드.
- 회피 영역의 크기와 좌표.
- 패턴 객체의 생성 시점과 이동.
- 패턴과 SOUL의 충돌 판정.
- 특수 패턴의 완료 조건.
- 패턴 완료 후 다음 턴으로의 복귀.

여러 적이 함께 등장하는 전투에서는 적들의 패턴이 결합되어 하나의 조우 전용 공격이 될 수 있다. 이는 Toby Fox의 개발자 기고에서 직접 언급된 설계 원리다.

## 6. 공통 상태 정의

~~~ts
type BattlePhase =
  | "INTRO"
  | "PLAYER_COMMAND"
  | "PLAYER_ACTION_SUBMENU"
  | "FIGHT_TIMING"
  | "ACTION_RESOLUTION"
  | "ENEMY_ATTACK_SETUP"
  | "SOUL_CONTROL"
  | "DAMAGE_RESOLUTION"
  | "END_CHECK"
  | "VICTORY"
  | "SPARED"
  | "FLED"
  | "DEFEAT";

interface BattleRuntimeState {
  phase: BattlePhase;
  turnIndex: number;
  activeEnemyIds: string[];
  selectedCommand?: "FIGHT" | "ACT" | "ITEM" | "MERCY";
  selectedTargetId?: string;
  pendingDialogueId?: string;
  currentPatternId?: string;
  elapsedPhaseMs: number;
}
~~~

이 모델은 UNDERFAIL에서 전투 단계가 서로 엉키지 않도록 하기 위한 [UNDERFAIL 제안]이다. 기존 코드에 맞춰 실제 파일/타입 이름은 변경할 수 있다.

## 7. 종료 조건

전투 종료는 단순히 적의 HP가 0이 되는 경우만을 의미하지 않는다. 스페어, 도망, 스토리상 대화 종료, 보호자 개입 등 별도 해결 조건이 존재할 수 있다.

UNDERFAIL에서는 특히 교사·학생을 상대할 때 전투 종료 의미를 별도로 정해야 한다.

- [미정/보류] HP 0이 사망인지, 제압인지, 수업/대립이 끝난 상태인지.
- [미정/보류] 교사가 어떤 상황에서 전투를 중단하는지.
- [미정/보류] 패배 후 어떤 장소/상태로 돌아오는지.
- [사용자 결정 필요] 불살과 기본 루트에서 각 상대가 어떤 방식으로 퇴장하는지.

이 의미를 정하지 않은 채 HP 0을 실제 사망으로 해석하는 기능을 만들지 않는다.

## 8. 전투 데이터와 씬을 분리하는 구조

~~~ts
interface EncounterDefinition {
  id: string;
  participantIds: string[];
  openingDialogueId: string;
  commands: {
    fight: boolean;
    act: boolean;
    item: boolean;
    mercy: boolean;
  };
  enemyTurnSequence: string[];
  endRules: EndRule[];
}

interface EndRule {
  id: string;
  condition: string;
  result: "SPARED" | "FLED" | "STORY_EXIT" | "CONTINUE";
  dialogueId?: string;
}
~~~

실제 조건식은 문자열 eval 등으로 실행하지 말고, 안전하고 명시적인 데이터/함수로 관리한다.

## 9. 오류 방지

- 적 턴이 끝나기 전에 플레이어 명령을 받지 않는다.
- 플레이어 메뉴가 열린 상태에서 적 공격 판정을 동시에 진행하지 않는다.
- 씬 이동 후 이전 공격의 타이머/입력 이벤트가 남지 않게 한다.
- 전투 대사 종료와 적 턴 시작을 하나의 Confirm 입력이 중복 실행하지 않도록 한다.
- 적이 여러 명일 때 공격 패턴 조합 순서가 결정적으로 재현 가능해야 한다.
- 패턴 도중 전투가 종료되면 공격 인스턴스와 타이머를 정리한다.

## 10. 원작 분석에서 더 조사해야 할 항목

- 각 명령 종료 시 적 턴으로 넘어가지 않는 예외.
- 복수 적 조우에서 ACT 대상과 FIGHT 대상 지정 규칙.
- 한 번의 행동으로 전투가 끝나는 조건.
- 적의 대사와 공격 패턴 분기 관계.
- FIGHT의 무기별 타이밍 표시 차이.
- 도망이 막히는 전투와 그 이유.
- 전투 도중 보스 연출이 보드 크기나 위치를 변경하는 경우.

이번 자료는 이 모든 예외를 완전하게 목록화했다고 주장하지 않는다.
