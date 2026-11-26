# UNDERFAIL 기술 구조

> 상태: Milestone 1 구현을 위한 기술 설계 기준
>
> 확정 스택: Phaser 4.2.1 + TypeScript + Vite
>
> 기술 구조는 창작 정사를 결정하지 않는다. 콘텐츠·대사·수치는 가능한 한 코드와 분리하며 미승인 값은 프로토타입으로 표시한다.

## 1. 현재 기반

- Phaser: 정확히 `4.2.1`
- TypeScript
- Vite
- Phaser 단독. React와 Three.js를 추가하지 않는다.
- 현재 진입점: `src/main.ts`
- 현재 씬: `src/scenes/BootScene.ts`
- 현재 논리 해상도: `960 × 540`
- 현재 스케일: `Phaser.Scale.FIT`, 화면 중앙 정렬
- 현재 `BootScene`은 부트 확인용 임시 화면이다.

## 2. 설계 원칙

1. Scene은 화면·게임 흐름의 경계를 나타낸다.
2. 대사, 조사 대상, 선택 결과, 전투 조건을 Scene 내부에 전부 하드코딩하지 않는다.
3. 사용자 정사와 임시 프로토타입 값을 구분한다.
4. 한 파일에 모든 게임 로직을 넣지 않는다.
5. Milestone에서 필요하지 않은 범용 프레임워크를 미리 만들지 않는다.
6. 기존 프로젝트 구조를 먼저 확인하고, 템플릿 파일을 불필요하게 갈아엎지 않는다.

## 3. 권장 Scene 흐름

Milestone 1에서 필요한 범위만 구현한다.

```text
BootScene
  → TitleScene
  → NameEntryScene
  → PrologueScene
  → RoomScene
  → BattleScene
  → RoomScene (peaceful exit state)
  → PrototypeEnd state
```

- 실제 Scene 개수와 전환 방식은 현재 코드에 맞춰 간결하게 조정할 수 있다.
- 모든 대화 페이지마다 별도 Scene을 만들지 않는다.
- `BootScene`은 초기 설정과 리소스 준비 용도로 남긴다.

## 4. 핵심 시스템 경계

### Game State

주인공 이름, 현재 HP, 현재 장면, 방문/상호작용 플래그 등 장면을 넘어 유지할 최소 상태를 가진다.

- Milestone 1에서는 앱 실행 세션 안의 메모리 상태를 우선한다.
- 저장 파일/브라우저 영속 저장은 이번 목표에 필수로 넣지 않는다.
- 저장·재시작의 세계관적 의미는 보류한다.
- 상태 객체는 Scene마다 중복 생성하지 않고 한 곳에서 전달·관리한다.

### Exploration / Room

- 한 개의 작은 교육복지실을 구현한다.
- 플레이어 이동과 벽·가구 충돌을 지원한다.
- 키보드 방향키와 WASD를 기본 입력으로 지원한다.
- 조사 대상과 NPC는 데이터 식별자를 가진다.
- 근접한 조사 대상이 있을 때 상호작용 키를 눌러 조사한다.
- 이동 속도·충돌 크기·상호작용 거리 등 수치는 프로토타입 설정으로 분리한다.

### Dialogue

- 화자 이름, 본문, 선택지, 선택 후 반응을 분리한다.
- 한 번에 한 대화 UI만 열리도록 한다.
- 대화 중에는 플레이어 이동이 잠겨야 한다.
- 키보드로 다음 문장, 선택지 이동, 선택 확정, 닫기를 조작할 수 있어야 한다.
- 실제 대사는 별도 데이터 파일에 두고 임시 문구임을 표시한다.

### Battle

- 메뉴: 공격 / 행동(ACT) / 아이템 / 자비.
- 적 턴에는 제한된 전투 영역과 회피 대상이 표시된다.
- 첫 프로토타입은 단순한 추상형 탄막 패턴 하나만 구현한다.
- 전투 로직은 상태 전환(메뉴 선택 → 적 턴 → 결과/다음 메뉴)으로 관리한다.
- 도미토리엘의 평화 해결 조건은 숫자를 코드 곳곳에 하드코딩하지 않고 설정값으로 둔다.
- 정확한 요구 횟수는 사용자가 정하지 않았다. 임시 테스트 수치를 사용하면 `PROTOTYPE ONLY`로 표시한다.

### Content Data

- 방 정보, 조사 대상, 대화, ACT 응답을 가능한 한 TypeScript 데이터 객체로 분리한다.
- 사용자 정사 문장과 임시 문구를 혼합해 확정 대사처럼 취급하지 않는다.
- 이후 JSON 또는 외부 편집기 도입은 현재 Milestone에서 필요하지 않으면 미룬다.

## 5. 공통 입력 규칙

모든 플레이 가능 Scene은 `src/input/GameInput.ts`의 공통 액션을 사용한다. Scene은 물리 키 코드 대신 `CONFIRM`, `CANCEL`, `UP` 등의 액션을 조회한다.

| Game Action | 기본 입력 | 호환/보조 입력 | 의미 |
|---|---|---|---|
| UP / DOWN / LEFT / RIGHT | 방향키 | WASD | 탐험 이동 및 메뉴 선택 |
| CONFIRM | Z | Enter, Space | 확정·대화 진행 |
| CANCEL | X | Shift, Escape | 허용된 하위 메뉴/대화에서 취소 |
| INTERACT | E | Z, Enter, Space | 조사/상호작용 |
| PHONE_CALL | C | — | 기존 도미토리엘 전화 단축키 |
| MENU | C | Ctrl | 예약 액션. 실제 메뉴 UI를 구현하기 전에는 사용 안내하지 않음 |

- 이름 입력 Scene의 DOM input은 글로벌 Confirm 입력으로 가로채지 않는다. Z는 이름 문자열로 입력 가능해야 하며 Enter는 제출에 사용한다.
- C는 기존 전화 단축키로 유지한다. 일반 메뉴는 Ctrl을 예약 입력으로 두되 실제 메뉴 UI가 연결되기 전에는 사용 안내하지 않는다.
- Confirm 별칭(Z/Enter/Space)을 같은 프레임에 여러 개 눌러도 한 번의 논리 액션으로 처리한다. INTERACT(E)와 CONFIRM은 서로 다른 액션이며, 탐험 Scene에서만 CONFIRM을 상호작용 대체 입력으로 해석한다.
- 각 Scene은 대화/전투/전환 등 현재 상태에 맞지 않는 액션을 처리하지 않는다.
- 브라우저 기본 단축키와 Ctrl 조합은 메뉴 기능 구현 시 별도 검증한다.
- 포인터 입력은 접근성 및 보조 조작으로 유지할 수 있으나, 키보드만으로 주요 플레이 경로를 완료할 수 있어야 한다.

## 6. 프로토타입 시각 규칙

- 현재 저장소에는 오리지널 SVG 캐릭터·배경·오브젝트가 존재하지만, 이는 1차 프로토타입 자산이며 최종 스프라이트 시트·타일셋·UI 아트로 승인된 상태가 아니다.
- 임시 도형은 최종 아트로 간주하지 않는다.
- 화면 크기, 여백, 텍스트 가독성을 우선한다.
- 색상·폰트·캐릭터 비율을 최종 디자인으로 고정하지 않는다.
- 외부 이미지나 기존 게임 리소스를 임의로 내려받아 사용하지 않는다.

## 7. 이번 단계에서 금지할 과잉 구현

- 전체 맵과 모든 캐릭터 구현
- 몰살·다중 엔딩 전체 로직
- 범용 퀘스트 편집기 또는 복잡한 스크립트 언어
- 최종 세이브 파일 포맷
- 복잡한 장비/관계 시스템 전체 구현
- React, Three.js 등 불필요한 프레임워크 추가

## 8. 품질 기준

- TypeScript 오류 없이 빌드되어야 한다.
- 대화가 열리면 이동 입력이 차단되어야 한다.
- Scene 전환 중 중복 입력·중복 타이머·중복 이벤트가 생기지 않아야 한다.
- Scene을 재시작하거나 전환해도 필요한 세션 상태가 유지되어야 한다.
- 임시 대사·수치·도형은 찾아 바꾸기 쉬워야 한다.


## 9. 2026-11-26 Scene 및 자산 로딩 업데이트

현재 구현의 시작 구간 Scene 경계는 다음과 같다.

- BootScene: SVG 및 공유 자산 적재
- TitleScene
- NameEntryScene
- PrologueScene
- FlowerFieldScene
- BullyBattleScene
- RoomScene

논리 해상도 960×540 및 FIT/중앙 정렬은 유지한다. SVG 에셋은 BootScene의 Phaser SVG loader를 통해 공용 텍스처로 읽는다. 오프닝 페이지 메타데이터는 src/data/openingContent.ts로 분리하고, 분위기 오디오 프로토타입은 src/audio/Atmosphere.ts에 둔다. Web Audio는 브라우저 사용자 제스처 이후에만 활성화하며 실제 음악 파일이나 원작 선율을 포함하지 않는다.

캐릭터 방향별 걷기 프레임, 감정별 얼굴 시트, 최종 픽셀 규격 및 배경 레이어 편집 체계는 아직 구현 과제다. STORY_CONTROL_PANEL.md는 현재 브랜치 트리에서 발견하지 못했다. 존재한다고 가정하지 않는다.


## 10. 추가된 특수 조우 Scene

- SecondRankEncounterScene은 교육복지반의 전교 2등 특수 조우 전용이다.
- Scene 진입/종료 시 GameSession의 secondRankFled 및 domitoriellFollowUpPending 플래그를 사용한다.
- RoomScene은 프로깃허브 튜토리얼 완료 전까지 전교 2등 상호작용 타겟을 노출하지 않는다.
- 이 Scene은 HP를 변경하지 않고, HP 0·사망·SAVE/RESET의 세계관 의미도 정의하지 않는다.


## 11. 교육복지반 1.3~1.7 Scene 및 데이터 경계

- WelfareCorridorScene: RoomScene과 연결되는 탐험 복도, 조사·전화·여러 프로깃허브·퍼즐·길막 타겟.
- RegularEncounterScene: 적 ID를 전달받아 공통 턴/메뉴 엔진을 사용하되, 적별 ACT와 공격 패턴은 데이터로 분리.
- NerdstablookEncounterScene: 캐릭터 전용 ACT와 이야기 결과를 보유하며 일반 적 시스템의 HP/사망 규칙을 변경하지 않는다.
- src/data/welfareEncounterContent.ts: 일반 적/전화/프로깃허브/복도 퍼즐/너드스타블룩의 이벤트 데이터를 소유.
- GameSession: 해당 플레이 세션 안에서만 적별 결과, 퍼즐 진행, 전화 호출, 안내 대사 건너뛰기, 길막 해제 결과를 유지.
- BootScene: 복도와 캐릭터·전화기 SVG 텍스처를 미리 적재.
- main.ts: 신규 Scene을 Phaser Scene registry에 등록.

일반 조우와 너드스타블룩의 전투 시각 요소는 추상적인 비현실적 빛/종이 문양이다. 이 구조는 HP 0, 사망/제압, SAVE/RESET, 루트 카운터 및 세계관적 저장 의미를 다루지 않는다.


## 12. 2026-11-26 공통 입력 리빌드

- `src/input/GameInput.ts`가 키 코드를 공통 액션으로 변환한다.
- 적용 대상: TitleScene, PrologueScene, FlowerFieldScene, RoomScene, WelfareCorridorScene, BattleScene, BullyBattleScene, SecondRankEncounterScene, RegularEncounterScene, NerdstablookEncounterScene.
- NameEntryScene은 DOM input이므로 글로벌 입력 객체에 연결하지 않는다.
- C는 전화 단축키를 위해 유지하며 Menu 액션은 현재 예약 상태다.
- 이 변경은 입력 구조의 일관성을 높이는 첫 단계다. 전투/대화 상태머신 전체를 공통화한 것은 아니다.
- [검증 한계] 브라우저에서 키 입력을 실제 플레이로 검증하기 전까지 완전한 조작 검수 완료로 처리하지 않는다.


## 13. 공통 전투 UI 프레젠테이션

- `src/ui/EncounterMenu.ts`가 공통 명령 행, 공통 ACT/ITEM 선택 목록, 공통 대화/명령 프레임을 제공한다.
- 적용 Scene: BattleScene, BullyBattleScene, SecondRankEncounterScene, RegularEncounterScene, NerdstablookEncounterScene.
- 각 Scene의 적별 대사·행동·해결 로직은 계속 Scene/콘텐츠 데이터가 소유한다.
- 공통 helper는 표현 계층만 공유하고, 전투 규칙을 강제로 공통화하지 않는다.
- TitleScene은 같은 짙은 청록/낡은 금색 시각 언어의 시작 선택 프레임을 사용한다.
- [검증 한계] CI 빌드 성공은 실제 화면의 한국어 잘림·패널 겹침·선택 상태를 확인한 것이 아니다.


## 14. 입력 액션 별칭 분리
- `CONFIRM`: Z / Enter / Space.
- `INTERACT`: E only.
- 탐험 Scene은 대화가 활성화되지 않은 상태에서 Confirm 또는 E를 조사에 사용.
- 대화 상태는 Scene 자체의 state branch에서 Confirm을 소비하므로 탐험 상호작용과 충돌하지 않는다.
- `PHONE_CALL`: C.
- `MENU`: Ctrl 예약. C는 기존 전화 호출 때문에 메뉴 키로 사용하지 않는다.
