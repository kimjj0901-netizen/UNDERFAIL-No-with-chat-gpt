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
| IN-09 | 교실에서 E/Z/Enter/Space 근접 조사 | 대상 조사 | NOT RUN |
| IN-10 | 교실 전화에서 C | 도미토리엘 전화 | NOT RUN |
| IN-11 | 복도에서 대화 중 이동키 | 이동하지 않음 | NOT RUN |
| IN-12 | ACT 하위 메뉴에서 X/Shift/Escape | 취소/복귀 | NOT RUN |
| IN-13 | 전투 메뉴에서 Z/Enter/Space | 선택 실행 | NOT RUN |
| IN-14 | SOUL 회피 중 방향키/WASD | 회피 이동 | NOT RUN |
| IN-15 | Z와 Enter 동시 누름 | Confirm 중복 실행 금지 | NOT RUN |
| IN-16 | 전환 중 연속 입력 | 이전/다음 Scene에서 이중 실행 금지 | NOT RUN |
| IN-17 | C/Ctrl | 구현되지 않은 메뉴가 실행되지 않음. C는 전화 호출 | NOT RUN |

## 테스트 기록
브라우저 플레이 환경이 연결되면 실제 게임을 실행하고, 각 결과를 PASS/FAIL 및 재현 절차로 갱신한다. 빌드 통과는 이 표의 PASS와 다르다.
