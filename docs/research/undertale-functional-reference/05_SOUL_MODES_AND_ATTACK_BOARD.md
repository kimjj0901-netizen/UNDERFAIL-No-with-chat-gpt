# 05 — SOUL 모드와 공격 영역(Bullet Board)

## 1. SOUL의 기능

[원작 게임 기능 — 2차 확인] 전투에서 플레이어는 오버월드 캐릭터의 몸이 아니라 SOUL로 표현되는 중심 아이콘을 직접 조작한다. SOUL의 색과 모드는 특정 적이 전투의 이동 규칙을 바꾸는 방식으로 사용된다.

핵심은 적이 공격 모양만 바꾸는 것이 아니라, 플레이어가 공간에서 움직이는 규칙 자체를 바꿀 수 있다는 점이다.

## 2. 모드 목록

| 모드 | 색 | 기본 조작 규칙 | 대표 역할 |
|---|---|---|---|
| Normal | 빨강 | 자유 이동. 방향 입력으로 보드 안을 움직인다. Cancel/Shift를 누르면 느리게 움직일 수 있다. | 기본 회피 |
| Jump | 파랑 | 중력 방향의 영향을 받으며, 반대 방향 입력으로 점프한다. 누르는 시간에 따라 점프 높이가 달라질 수 있다. | 점프/중력 |
| Shield | 초록 | SOUL 자체는 이동하지 않고 방향 입력으로 방패 방향을 전환해 여러 방향의 공격을 막는다. 도망이 불가능한 모드로 설명된다. | 방향 방어 |
| Trap | 보라 | 한 줄 위에서 좌우로 이동하고 위/아래로 다른 줄을 이동한다. Cancel/Shift 감속이 적용되지 않는 것으로 설명된다. | 레일/경로 회피 |
| Shooter | 노랑 | SOUL의 방향이 바뀌며 Confirm으로 가상의 탄환을 발사해 특정 물체와 상호작용한다. | 사격형 미니게임 |
| Dual | 파랑/빨강 | Nintendo Switch의 특정 전투에 한정된 두 개의 SOUL 분리 조작 | 플랫폼 특수 모드 |

중요: 이전 답변에서 다섯 가지 모드만 나열하고 "여섯 번째 모드는 Switch 한정" 설명을 덧붙였다. 이를 정식판 모든 플랫폼에 공통인 기능처럼 취급하면 안 된다.

이 문서는 SOUL 모드의 구조만 설명한다. 실제 무기 제작, 현실 무기 사용, 공격 재현을 설명하지 않는다.

## 3. 모드가 공격 설계와 결합하는 방식

~~~text
ENEMY TURN
  ↓
SOUL MODE 변경 여부 결정
  ↓
BOARD geometry 설정
  ↓
ATTACK PATTERN 실행
  ↓
SOUL 입력 해석
  ↓
충돌/막기/회피 판정
  ↓
피해/상태 갱신
~~~

이 구조를 통해 같은 방향키라도 모드에 따라 다른 판단을 요구할 수 있다.

## 4. 공격 보드

Bullet Board는 SOUL의 이동이 제한되는 전투 공간이다. 전투 UI 안에 독립된 영역을 만들고, SOUL은 그 영역 안에서 이동한다.

[검증 한계] 보드가 특정 전투에서 크기나 위치를 변화시키는 장면이 알려져 있으나, 모든 전투에서의 변형 목록과 정확한 수치·애니메이션 타이밍을 이번 조사에서 모두 확인하지 않았다. 보드 크기를 모든 전투에서 고정된 박스라고 단정하지 않는다.

[UNDERFAIL 제안] 공격 보드는 별도 컴포넌트로 두고, 패턴마다 크기·위치·경계 모양을 선언할 수 있도록 설계한다.

~~~ts
interface ArenaDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  boundaryStyle: string;
  transformSequence?: ArenaTransform[];
}

interface ArenaTransform {
  atMs: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  easing?: "LINEAR" | "EASE_IN" | "EASE_OUT";
}
~~~

## 5. 패턴 정의

~~~ts
interface AttackPattern {
  id: string;
  durationMs: number;
  soulMode: "NORMAL" | "JUMP" | "SHIELD" | "TRAP" | "SHOOTER";
  arenaId: string;
  spawnEvents: SpawnEvent[];
  endCondition: "TIME" | "ALL_RESOLVED" | "SCRIPTED";
}

interface SpawnEvent {
  atMs: number;
  kind: string;
  x: number;
  y: number;
  velocityX?: number;
  velocityY?: number;
  lifetimeMs?: number;
  collisionGroup?: string;
}
~~~

이 코드는 구조 예시다. 원작 함수명이나 원본 코드가 아니다.

## 6. 피격 판정과 무적 상태

피격은 아래 흐름으로 분리하는 것이 안전하다.

~~~text
공격 오브젝트와 SOUL 충돌 후보 발생
  ↓
현재 무적 상태/특수 방어 규칙 확인
  ↓
피격 인정 여부 결정
  ↓
피해 적용
  ↓
피격 후 무적 타이머 설정
  ↓
시각·음향 피드백
~~~

세부 수치와 INV 처리 예외는 06_STATS_DAMAGE_AND_VARIABLES.md에서 다룬다.

## 7. 공격 패턴은 캐릭터 성격의 표현

[설계 해석] 패턴의 움직임·속도·방향·공간 제한은 캐릭터가 중요하게 여기는 규칙, 감정, 목표를 나타낼 수 있다.

예를 들어:
- 보호하려는 인물은 위험 영역을 좁히거나 안전한 구역을 제공할 수 있다.
- 규칙을 강요하는 인물은 움직일 수 있는 길을 제한할 수 있다.
- 관심을 끌고 싶어 하는 인물은 패턴을 무대 연출과 결합할 수 있다.
- 두 인물의 조우는 두 패턴이 하나의 리듬을 만들 수 있다.

이는 [UNDERFAIL 제안]이다. Undertale의 특정 공격 모양을 복제하지 않는다.

## 8. 색상 공격과 시각 구분

SOUL 모드와 별개로 공격 자체가 특정 행동 상태에서만 위험하거나, 특정 행동을 취해야 처리되는 패턴이 존재한다는 점도 분석 가치가 있다. 대표적으로 움직임/정지에 따라 반응이 달라지는 색상 기반 공격 규칙이 알려져 있다.

[UNDERFAIL 제안] 색상만으로 위험 여부를 전달하지 말고, 움직임/정지와 같은 행동 규칙을 텍스트·형태·애니메이션으로 함께 설명한다. 색각 차이를 고려해 형태나 움직임의 차이를 추가한다.

## 9. UNDERFAIL에 필요한 안전한 독자 해석

주인공이 학교에서 교사와 맞서는 상황을 현실 폭력으로 표현하는 대신, 회피 영역을 교실 규칙·책상 배치·빛·종이·선·리듬 같은 판타지적이고 비현실적인 상징으로 구성할 수 있다. 실제 무기나 현실 공격 동작을 재현할 필요가 없다.

## 10. 검증 필요 사항

- PC 원본 게임에서 Normal SOUL 대각선 이동 여부.
- 각 모드의 키 입력 우선순위.
- 각 모드가 시작/끝날 때의 애니메이션.
- 보드 크기/위치가 바뀌는 전투 목록.
- 특정 모드의 특수 취소/감속 규칙.
- SOUL 충돌 상자와 Sprite의 실제 비율.
- 프레임별 피격 무적 동작.
