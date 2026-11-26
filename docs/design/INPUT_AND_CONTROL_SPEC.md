# 공통 입력 및 조작 명세

상태: 첫 구현안 / 브라우저 테스트 미실행

## 1. 기본 키 매핑

| Game Action | 기본 키 | 보조/호환 키 | 용도 |
|---|---|---|---|
| UP | ↑ | W | 탐험/선택 위 |
| DOWN | ↓ | S | 탐험/선택 아래 |
| LEFT | ← | A | 탐험/선택 왼쪽 |
| RIGHT | → | D | 탐험/선택 오른쪽 |
| CONFIRM | Z | Enter, Space | 확정·대화 진행·상호작용 |
| CANCEL | X | Shift, Escape | 허용된 상태에서 한 단계 뒤로 |
| INTERACT | E | Z, Enter, Space | 탐험 상호작용 |
| PHONE_CALL | C | 없음 | 기존 도미토리엘 전화 단축키 |
| MENU | C | Ctrl | 예약된 액션. 메뉴 화면 구현 전에는 사용자에게 기능으로 안내하지 않는다. |

PC Undertale FAQ는 Z/Enter, X/Shift, C/Ctrl을 각각 동작의 대체 입력으로 설명한다. UNDERFAIL에서는 기존 조작 호환을 위해 Space/E를 당분간 유지한다. 출처: https://undertale.com/help/

## 2. 입력 계층
`src/input/GameInput.ts`가 현재 공통 키 별칭을 관리한다.
- `isDown(action)`: 누르고 있는 상태.
- `justPressed(action)`: 눌린 첫 프레임의 동작을 한 번 소비.
- 여러 별칭을 동시에 눌러도 동작이 중복되지 않도록 별칭 묶음 전체를 검사한다.

## 3. 상태별 입력 원칙
- Title: Confirm으로 시작.
- Name Entry: DOM input이 문자를 직접 받는다. Z를 글로벌 Confirm으로 가로채지 않는다. Enter는 이름 제출.
- Prologue: Confirm으로 페이지 진행, pointer는 보조.
- Flower Field: Interact로 첫 조우 진입.
- Overworld: 방향 이동, Interact로 조사, C로 기존 전화 호출.
- Dialogue: 이동 입력 잠금, Confirm으로 진행, Cancel은 허용된 대화에서만 닫기.
- Battle Menu: 방향키로 선택, Confirm으로 실행, Cancel로 허용된 하위 메뉴에서 복귀.
- Soul Dodge: 방향키/WASD로 SOUL 이동, 메뉴 Confirm은 무시.
- Transition: 입력 잠금 또는 한 번만 소비.

## 4. 호환성 원칙
기존 플레이어가 이미 사용하던 Enter/Space/E/C 동작을 갑자기 제거하지 않는다. 새 키는 별칭으로 추가한다. 실제 플레이 테스트 뒤 사용 빈도와 브라우저 단축키 충돌을 확인하고 최종 기본값을 확정한다.

## 5. 주의 사항
- C는 현재 전화 호출에 쓰이므로 MENU와 동시에 구현하지 않는다.
- Ctrl은 브라우저 기본 단축키와 충돌할 수 있으므로 메뉴 기능 구현 전 검사한다.
- Escape는 브라우저 전체 동작/페이지 이동과 연관될 수 있으므로 게임 내 취소 동작만 수행하고 페이지를 닫는 기능으로 연결하지 않는다.
- 이름 입력 중 Z 키가 문자로 입력되어야 한다.

## 6. 구현 파일
- `src/input/GameInput.ts`
- TitleScene, PrologueScene, FlowerFieldScene, RoomScene, WelfareCorridorScene
- BattleScene, BullyBattleScene, SecondRankEncounterScene, RegularEncounterScene, NerdstablookEncounterScene
