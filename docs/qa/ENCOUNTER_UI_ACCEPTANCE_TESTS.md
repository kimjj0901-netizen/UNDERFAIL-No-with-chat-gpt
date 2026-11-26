# 조우 UI 수용 테스트

상태: 실행 대기

| ID | 테스트 | 기대 결과 | 상태 |
|---|---|---|---|
| BUI-01 | BattleScene의 4개 명령 | 공통 카드 행으로 표시 | NOT RUN |
| BUI-02 | BullyBattleScene의 4개 명령 | 같은 크기·테두리·선택 강조 | NOT RUN |
| BUI-03 | SecondRankEncounterScene 명령 | 공통 카드 행, 고유 부제 유지 | NOT RUN |
| BUI-04 | RegularEncounterScene 명령 | 고유 Mercy 상태 문구 유지 | NOT RUN |
| BUI-05 | Nerdstablook 명령 | 고유 ACT 목적 부제 유지 | NOT RUN |
| BUI-06 | 방향키 이동 | 선택 카드 강조가 한 칸씩 이동 | NOT RUN |
| BUI-07 | Z/Enter/Space | 선택된 명령 실행 | NOT RUN |
| BUI-08 | 포인터 클릭 | 클릭한 항목의 명령 실행 | NOT RUN |
| BUI-09 | ACT/ITEM 하위 메뉴 진입 | 기존 Scene별 데이터/로직 보존 | NOT RUN |
| BUI-10 | Scene 재시작 | 이전 메뉴 객체가 남지 않음 | NOT RUN |
| BUI-11 | 한국어 부제 | 카드 폭을 넘거나 잘리지 않음 | NOT RUN |
| BUI-12 | Mercy 미충족 상태 | 사용 가능 상태로 오인되지 않음 | NOT RUN |

자동 빌드 통과는 이 테스트의 PASS를 의미하지 않는다.


## CI 확인
- 최신 PR 커밋 `fd1300b1db4dd7e5530696ba2e13b95175afabfa`.
- GitHub Actions run `45829690229`: completed / success.
- TypeScript and Vite production build: PASS.
- BUI-01~BUI-12는 브라우저 실기 검수 전이므로 NOT RUN 유지.


## 공통 하위 선택 목록 테스트 추가
| ID | 테스트 | 기대 결과 | 상태 |
|---|---|---|---|
| BUI-13 | BattleScene ACT 하위 목록 | 3개 항목을 공통 강조 행으로 표시 | NOT RUN |
| BUI-14 | BattleScene ITEM 하위 목록 | 기존 아이템 동작/돌아가기 동작 보존 | NOT RUN |
| BUI-15 | SecondRank ACT 목록 | 3개 기존 행동 순서와 콜백 보존 | NOT RUN |
| BUI-16 | Regular ACT 목록 | 5가지 일반 조우의 행동 데이터와 반복 반응 보존 | NOT RUN |
| BUI-17 | Nerdstablook ACT 목록 | 긍정/부정 행동의 순서 및 해결 카운트 보존 | NOT RUN |
| BUI-18 | 긴 한국어 ACT 문구 | 행 폭 내에서 줄바꿈되고 다른 행과 겹치지 않음 | NOT RUN |
