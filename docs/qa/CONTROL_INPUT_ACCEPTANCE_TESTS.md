# 공통 입력 수용 테스트

상태: 테스트 계획 / 자동·브라우저 실행 전

| ID | 시나리오 | 기대 동작 | 현재 결과 |
|---|---|---|---|
| IN-01 | 타이틀에서 Z | 시작 진행 | NOT RUN |
| IN-02 | 타이틀에서 Enter | 시작 진행 | NOT RUN |
| IN-03 | 타이틀에서 Space | 호환 시작 | NOT RUN |
| IN-04 | 타이틀에서 클릭 | 포인터 보조 시작 | NOT RUN |
| IN-05 | 이름 입력창에서 Z 입력 | 문자 Z 입력 | NOT RUN |
| IN-06 | 이름 입력에서 Enter | 이름 제출 | NOT RUN |
| IN-07 | 오프닝에서 Z/Enter/Space | 페이지 하나만 진행 | NOT RUN |
| IN-08 | 교실에서 방향키/WASD | 이동 | NOT RUN |
| IN-09 | 교실에서 E 근접 조사 | 대상 조사 | NOT RUN |
| IN-18 | 교실에서 Z/Enter/Space 근접 조사 | 탐험 상태에서 조사 실행 | NOT RUN |
| IN-19 | 대화 중 Z/Enter/Space | 조사 대신 대화만 진행 | NOT RUN |
| IN-10 | 교실 전화에서 C | 도미토리엘 전화 | NOT RUN |
| IN-11 | 복도에서 대화 중 이동키 | 이동하지 않음 | NOT RUN |
| IN-12 | ACT 하위 메뉴에서 X/Shift/Escape | 취소/복귀 | NOT RUN |
| IN-13 | 전투 메뉴에서 Z/Enter/Space | 선택 실행 | NOT RUN |
| IN-14 | SOUL 회피 중 방향키/WASD | 회피 이동 | NOT RUN |
| IN-15 | Z와 Enter 동시 누름 | Confirm 중복 실행 금지 | NOT RUN |
| IN-16 | 전환 중 연속 입력 | 이전/다음 Scene에서 이중 실행 금지 | NOT RUN |
| IN-17 | C/Ctrl | C는 전화 호출, Ctrl은 예약 메뉴 액션. 미구현 메뉴는 열리지 않음 | NOT RUN |
| IN-20 | 타이틀 종료 후 NameEntry에서 Z 입력 | 이전 Scene의 키 캡처가 남지 않아 문자 Z가 입력됨 | NOT RUN |
| IN-21 | NameEntry에서 Space/방향키 입력 | 공백 및 커서 이동이 DOM input 기본 동작으로 작동 | NOT RUN |
| IN-22 | 플레이 Scene 종료 후 다른 화면 진입 | 방향키/Space 브라우저 스크롤 캡처가 해제됨 | NOT RUN |

## 테스트 기록
브라우저 플레이 환경이 연결되면 실제 게임을 실행하고, 각 결과를 PASS/FAIL 및 재현 절차로 갱신한다. 빌드 통과는 이 표의 PASS와 다르다.


## 자동 빌드 상태 — 2026-11-26
- GitHub Actions run `45828492421`, head `fa5c1d835b4ba618f40d6b8348808cdd4f80d3c9`: completed / success.
- Install dependencies: PASS.
- TypeScript and Vite production build: PASS.
- 위 결과는 자동화된 코드/빌드 검사만 의미한다. 아래 조작 시나리오는 브라우저에서 직접 수행하기 전까지 NOT RUN 상태다.


## 입력 액션 중복 소비 검사
- INTERACT는 E 전용 액션.
- CONFIRM은 Z/Enter/Space.
- 탐험 상태는 E 또는 Confirm을 조사 입력으로 해석.
- 대화 상태는 탐험 업데이트를 중단하고 Confirm만 대화에 소비.
- PHONE_CALL은 C, MENU는 Ctrl만 예약.
- 실제 브라우저에서 입력 충돌/중복을 검사하기 전까지 위 시나리오는 NOT RUN.



## Phaser 4.2.1 전역 키 캡처 회귀 테스트
- `KeyboardPlugin.addKey(key, enableCapture)`의 기본값은 `enableCapture=true`다.
- 키 캡처는 KeyboardManager 전역 상태이며, Scene의 기본 `removeAllKeys()` 호출은 `removeCapture=false`로 실행된다.
- GameInput은 모든 Key 객체를 `addKey(code, false)`로 만들고, 브라우저 스크롤이 발생할 수 있는 방향키/Space만 활성 Scene 동안 캡처한다.
- Scene SHUTDOWN 시 해당 전역 캡처를 해제한다.
- 근거: Phaser v4.2.1 source `src/input/keyboard/KeyboardPlugin.js` 및 `src/input/keyboard/keys/JustDown.js`.
- 위 회귀 시나리오의 실제 브라우저 실행은 아직 NOT RUN이다.
