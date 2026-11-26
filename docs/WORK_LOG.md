# UNDERFAIL 작업 로그

## 2026-11-26 — 스토리 중심 오프닝 리빌드

### 목표
스토리 색인의 시간순 진행을 기존 프로토타입보다 우선하여, 첫 번째 짧은 플레이 구간을 실제 게임 흐름으로 재구성한다.

### 이번 실행에서 확인
- 대상 저장소: `kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt`
- 작업 브랜치: `feature/milestone-1-vertical-slice`
- Draft PR: #1
- 보호 원본: `CREATIVE_DECISION_WORKBOOK.md`, 스토리 색인 0~1.7
- 기술 스택: Phaser 4.2.1 + TypeScript + Vite

### 실제 구현
1. 이름 입력 이후의 프롤로그를 단순 학교 정문 설명에서 시간순 몽타주 구조로 교체.
2. 합주곡 혼합고등학교의 과거 → 폐교 문서/도장/사진 → 현재 배정 통지서의 흐름을 별도 비주얼 비트로 구현.
3. 꽃밭 장면을 새 Scene으로 분리.
4. 불리의 첫 조우를 별도 튜토리얼 전투 Scene으로 분리.
5. 튜토리얼 전투는 실제 위해 행위를 재현하지 않고 추상적 '유혹 표식'과 회피 패턴으로 표현.
6. ACT 행동을 반복하면 도미토리엘의 개입 및 구출 장면으로 연결.
7. 구출 뒤 교육복지실(RoomScene)로 진입하도록 실제 Scene 흐름을 연결.
8. 세션 상태에 불리 구출 여부와 튜토리얼 피격 횟수를 기록.
9. 첫 구간의 입력 처리 중 매 프레임 Key 객체를 새로 생성하던 문제를 제거.

### 검증 상태 (현재 최신 커밋 기준으로 갱신)
- Phaser 4.2.1 + TypeScript + Vite: 원격 package/architecture 설정에서 확인
- 최신 커밋 `3e308e55e84aa85c3ad6c8e09ba5ad793dfce540` GitHub Actions push run `45725638154`: PASS
- 최신 커밋 동일 SHA GitHub Actions PR run `45725644918`: PASS
- 두 workflow 모두 "TypeScript and production build" step: PASS
- 로컬 TypeScript / Vite 실행: NOT RUN (현재 작업 환경에서 로컬 npm 실행 미확보)
- 브라우저 직접 플레이: NOT RUN
- 시각 검토: REVIEW NEEDED
- 오디오 청취 검수: REVIEW NEEDED
- CI 통과는 타입 검사와 프로덕션 빌드를 의미하며, 브라우저 플레이·화면 품질 검수를 의미하지 않는다.

### 주의
- Phaser Graphics 기반 절차형 시각 자산은 이번 구간의 독립적인 게임 화면을 구성하기 위한 구현물이며, 최종 아트 패스 완료를 의미하지 않는다.
- 기존 교육복지실·도미토리엘 보스 구현은 보존되어 있으며, 이번 실행의 다음 품질 패스에서 스토리 색인 0~1.7의 세부 이벤트와 함께 재구성해야 한다.
- HP 0, SAVE/RESET, 루트 결말, 불리의 최종 정체는 확정하지 않았다.

### 다음 한 가지 실행 작업
**현재 진행: 교육복지반의 첫 방을 방 단위 탐험 구조로 교체했고, 첫 퍼즐·프로깃허브 튜토리얼·전교 2등 첫 상호작용의 골격을 데이터 파일과 Scene 로직으로 분리했다. 다음은 1.3 일반 조우와 1.7 너드스타블룩, 이후 생활 공간/출구 대립을 순서대로 연결한다.**


## 2026-11-26 — 오프닝 시각 자산 및 교육복지반 첫 방 통합 패스

### 브랜치 및 기준
- 대상 저장소: kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt
- 작업 브랜치: feature/milestone-1-vertical-slice
- 작업 시작 시 기준점: e4fcca76226a0c6179ce1f58f3a11dd65eb0e3bc
- Draft PR #1은 open 상태이며 main에 병합하지 않는다.
- 기술 스택은 Phaser 4.2.1 + TypeScript + Vite로 유지한다.
- CREATIVE_DECISION_WORKBOOK.md와 스토리 색인 0~1.7 원문은 수정하지 않았다.

### 이번 통합 변경
1. 타이틀 배경, 과거 학교, 폐교 확인서/사진/도장, 현재 학교/배정 통지서, 꽃밭의 오리지널 SVG 자산을 추가한다.
2. 플레이어, 불리, 도미토리엘, 프로깃허브, 전교 2등의 분리된 SVG 캐릭터 자산을 추가한다.
3. 교육복지반 첫 방의 교실 배경을 독립 SVG 레이어로 교체하고, 주요 가구 및 퍼즐/캐릭터 충돌 영역을 별도로 정의한다.
4. 도미토리엘·프로깃허브·전교 2등에 절제된 유휴 모션을 추가한다.
5. 꽃잎 형태의 추상 문양을 불리의 공격 표식으로 사용하고, 플레이어 표식은 하트가 아닌 독립 나침반 씨앗 SVG로 교체한다. 피격 기록은 700ms 쿨다운으로 제한한다.
6. 도미토리엘 구출 시 독립 아크 효과와 캐릭터가 등장하도록 연출한다.
7. Web Audio로 낮은 음량의 단순 합성 분위기 톤/짧은 효과음을 제공한다. 이는 완성 음악이나 최종 사운드 디자인이 아니다.
8. 대화·이벤트 배열의 readonly 타입 호환성을 반영한다.

### 정사/미정 관리
- 202X년 풍화양상 중학교와 풍화양상 고등학교 표기는 충돌로 기록하고 어느 쪽도 임의 확정하지 않는다.
- 아스도어는 과거 폐교 문서에서 손·소매·도장 정도만 보이며 얼굴을 공개하지 않는다.
- 불리 ACT 2회 조건, 패턴 속도, 충돌 크기, 대사, 시각 자산은 [제안]/[PROTOTYPE]이며 루트 정사로 일반화하지 않는다.
- HP 0, SAVE/RESET, 루트 엔딩, 불리의 최종 목적/정체는 변경하지 않는다.
- 위험 소비물 모티프는 현실적 제품/사용 행위로 표현하지 않고 추상 문양으로 대체했다.

### 검증 상태
| 항목 | 상태 | 비고 |
|---|---|---|
| 원격 브랜치/PR 재확인 | PASS | PR #1 open Draft, 미병합 |
| 기술 스택 확인 | PASS | Phaser 4.2.1, TypeScript, Vite |
| 정사 문서 보호 확인 | PASS | workbook 및 index 원문 파일 변경 없음 |
| 이전 HEAD TypeScript/build | FAIL | e4fcca7 Actions에서 BullyBattleScene.ts 따옴표 문법 오류(TS1005) 확인 |
| 문법 오류 수정 | PENDING CI | 인용부호와 관련 로직 수정 후 Actions 대기 |
| 새 커밋의 CI | NOT RUN | 푸시 후 workflow run 확인 필요 |
| 브라우저 직접 플레이 | NOT RUN | 직접 브라우저 플레이 환경 미확보 |
| 시각 검토 | REVIEW NEEDED | SVG 제작만으로 실제 크기/가독성 승인 불가 |
| 사운드 최종 검수 | REVIEW NEEDED | 저음량 합성음 연결, 브라우저 청취 확인 불가 |

### 다음 실행 작업
**교육복지반 보존 구간 1.1~1.7을 원문과 대조하여, 첫 방의 퍼즐·프로깃허브·전교 2등·일반 조우·너드스타블룩이 사건 순서대로 실제 상호작용을 하도록 확장하고, 브라우저 전체 플레이 검증을 확보한다.**


## 2026-11-26 — 교육복지반 1.2 특수 조우 구현

### 구현
- SecondRankEncounterScene을 추가하고 main.ts의 Scene 목록에 등록했다.
- 프로깃허브 튜토리얼 완료 플래그 이후에만 전교 2등의 상호작용 타겟/캐릭터가 보이도록 RoomScene과 GameSession을 연결했다.
- 전교 2등 조우에 FIGHT / ACT / ITEM / MERCY 메뉴와 ACT 하위 선택 3개를 추가했다.
- FIGHT에서는 도미토리엘이 개입해 막아서고, ACT/MERCY에서는 학생이 대답을 피하고 떠난다.
- 모든 해결 경로 뒤 전교 2등 퇴장 문구와 도미토리엘 후속 대화가 이어지도록 조건부 상태를 연결했다.
- 퍼즐 정답 표식의 시각 반응을 별도 오버레이 원형 조명으로 추가했다.

### 정사 경계
- 전교 2등의 퇴장 및 FIGHT 시 도미토리엘의 제지는 [사용자 확정] 사건 기능으로 처리한다.
- ACT 문구, 아이템 부재 반응, 화면 전환과 애니메이션은 [제안]이다.
- 특수 조우는 HP를 바꾸지 않는다. HP 0/사망/제압의 의미를 새로 정하지 않는다.
- 프로깃허브 완료/전교 2등 퇴장/도미토리엘 후속 대화 플래그는 회차 저장이 아닌 현재 세션 상태다.

### CI 및 검증
- 코드 커밋: 0651516d740f266f0f15a2a36cbbf420a0ab5bd7
- GitHub Actions push run 45725475793: PASS
- GitHub Actions PR run 45725482042: PASS
- CI workflow는 TypeScript 검사 및 Vite production build를 실행했다.
- 브라우저 직접 플레이: NOT RUN
- 시각 검수: REVIEW NEEDED
- 오디오 청취: REVIEW NEEDED

### 미완료
- 교육복지반 나머지 1.3~1.7 전체의 오브젝트·NPC·아이템·전화·너드스타블룩 상호작용
- 전교 2등 조우 외 일반 조우와 후속 분기
- 실제 브라우저에서 키보드/마우스/취소/반복 선택 검수
- 캐릭터 방향별 이동 프레임, 감정별 표정, 사운드 레벨 설정


## 2026-11-26 — 최신 커밋 검증 상태 확정

- 최신 HEAD: `3e308e55e84aa85c3ad6c8e09ba5ad793dfce540`
- GitHub Actions push run `45725638154`: completed / success
- GitHub Actions PR run `45725644918`: completed / success
- 두 run 모두 dependency install 및 `TypeScript and production build` 단계 성공.
- PR #1은 open Draft 상태, base는 main이며 병합되지 않았다.
- 변경 파일은 총 43개.
- `CREATIVE_DECISION_WORKBOOK.md`는 PR 변경 파일에 포함되지 않아 수정되지 않았다.
- 사용자 스토리 색인 파일은 이전 작업에서 저장소에 추가된 원본 사본이며, 이번 수정에서 내용/0~1.7 보존구간을 고치지 않았다.
- 브라우저 플레이, 실제 시각 크기 검수, 소리 청취는 이 세션에서 수행하지 않았으므로 각각 NOT RUN / REVIEW NEEDED다.

### 이어서 실행할 작업
**스토리 색인 1.3부터 1.7까지의 NPC·일반 조우·아이템·전화·너드스타블룩·생활 공간·출구 대립을 한 구역씩 원문 대조하고 구현한다. 특히 현재 RoomScene은 첫 퍼즐·프로깃허브·전교 2등 특수 조우의 첫 통합 패스까지이며 1.3~1.7 전체 구현이 완료된 상태가 아니다.**


## 2026-11-26 — 교육복지반 1.3~1.7 플레이 구간 구현

### 구현 파일
- src/data/welfareEncounterContent.ts: 일반 조우 데이터, 적별 ACT·반복 반응, 패턴 구성, 전화 대화, 프로깃허브별 설명, 복도 퍼즐, 너드스타블룩 반응 데이터.
- src/scenes/WelfareCorridorScene.ts: 탐험 복도, 상호작용 타겟, 여러 프로깃허브의 분리 배치, 전화, 대기 알림, 퍼즐, 너드스타블룩 길막/통로 해제.
- src/scenes/RegularEncounterScene.ts: 일반 조우 공통 엔진, 적별 ACT와 공격 패턴, FIGHT/ITEM/MERCY 흐름.
- src/scenes/NerdstablookEncounterScene.ts: 취향별 ACT와 부정 반응, 추상 종이 문양 회피, FIGHT 시 아픈 척했던 이유를 설명하는 특수 결말.
- src/scenes/RoomScene.ts: 전화와 복도 출입 연결, 안내 프로깃허브의 대사 건너뛰기 처리.
- src/state/GameSession.ts: 일반 조우 결과·복도 퍼즐·전화·프로깃허브 숨김·너드스타블룩 통로 해제 플래그.
- src/scenes/BootScene.ts, src/main.ts: SVG 자산 적재 및 신규 Scene 등록.
- public/assets/rooms/welfare_corridor.svg: 복도 배경.
- public/assets/items/welfare_phone.svg: 전화기.
- public/assets/characters/nerdstablook.svg: 너드스타블룩.
- public/assets/characters/welfare_timid.svg, welfare_rhythm.svg, welfare_prism.svg, welfare_sprout.svg, welfare_echo.svg: 일반 조우 캐릭터 5종.
- docs/design/WELFARE_1_3_TO_1_7_EVENT_GRAPH.md: 이벤트 그래프·분기·플래그·수동 QA.

### 스토리와 정사 경계
- [기초자료 확인] 일반 조우의 성격별 ACT, 여러 프로깃허브 NPC, 환경 퍼즐 반복/성공 반응, 도미토리엘 전화, 너드스타블룩의 길막·취향 ACT 기능을 색인 1.3~1.7에서 다시 대조했다.
- [제안] 새 적 표시 이름·캐릭터 외형·대사·패턴·복도 퍼즐 [2,0,1]·전화 60초 알림은 이번 독립 구현 제안이다.
- [제안/PROTOTYPE] 프로깃허브 대사 건너뛰기 3줄 누적 시 초기 안내 개체가 숨겨지는 규칙은 원문에 정확한 숫자가 없어 설정값 성격으로 분리했다.
- [제안/PROTOTYPE] 일반 조우는 서로 다른 ACT 2개 후 MERCY를 허용한다. FIGHT 반복은 일반 적이 물러나는 비살상 첫 패스다.
- [기초자료 확인] 너드스타블룩은 긍정 ACT에 따라 긴장이 풀리고, 취향을 무시하거나 조롱하면 공격이 강해지며, FIGHT에 대해 아픈 척했다고 설명한다. FIGHT의 세 번 선택 임계값은 연출용 제안이다.
- HP 0·사망·제압·SAVE/RESET·전 지역 처치 카운터를 새로 정의하지 않았다.
- 창작 워크북과 사용자 스토리 색인 0~1.7 원문은 수정하지 않았다.

### 코드 점검
- 새 Scene 세 개를 main.ts에 등록했다.
- 공유 SVG를 BootScene에 추가했다.
- 일반 조우의 ACT/response/dodge/ending 전환, 너드스타블룩의 finishAfterResponse 흐름, 퍼즐 분기, 안내 프로깃허브 건너뛰기, 너드스타블룩 통로 충돌을 정적 코드 수준에서 대조했다.
- 실제 브라우저 실행과 시각 검수는 수행하지 않았다.

### 테스트 상태
| 항목 | 상태 | 근거 |
|---|---|---|
| 정확한 repo/main/feature/PR 상태 확인 | PASS | GitHub ref/PR 조회 |
| 원본 문서 보호 | PASS | 이번 커밋 범위에 워크북·스토리 원문을 포함하지 않음 |
| 코드 정적 경로 점검 | PASS | Scene 등록·세션 메서드·데이터 연결 대조 |
| TypeScript 검사 | PASS | GitHub Actions run 45774025127, SHA 570c0d1 |
| Vite 프로덕션 빌드 | PASS | GitHub Actions run 45774025127, SHA 570c0d1 |
| 브라우저 전체 플레이 | NOT RUN | 직접 브라우저 플레이 도구를 사용하지 못함 |
| UI/충돌/키 입력 시각 검수 | REVIEW NEEDED | 실제 플레이 확인 필요 |
| 사운드 청취 | NOT RUN | 해당 구간의 개별 BGM/SFX 최종 믹스 미완료 |

### 이어서 할 작업
**GitHub Actions feature run 45774025127과 main run 45774399141에서 TypeScript와 Vite production build가 통과했다. main 통합은 2026-11-26에 완료했다. 브라우저 플레이는 NOT RUN이다. 다음 시간순 콘텐츠는 1.8 간식 바구니·거미 모양 과자 판매대이며, 1.9~1.14의 생활 공간과 출구 대립은 별도 구간으로 남긴다.**


## 2026-11-26 — 1.3~1.7 코드 CI 검증

- Feature commit: `570c0d1f1b45793be0aeca33c359b643e92bd63d`
- GitHub Actions PR run: `45774025127` — completed / success.
- `TypeScript and production build` step: PASS.
- 세션 상태 메서드 호출과 신규 Scene의 등록·분기 연결은 정적 조회로 확인했다.
- 브라우저 직접 플레이, 실제 충돌 범위, 대화 UI 가독성, 오디오 청취는 수행하지 않았다: NOT RUN / REVIEW NEEDED.
- 이 검증은 해당 feature SHA에서 수행됐다. main 통합 뒤 main push workflow가 실행되면 그 결과도 별도로 확인한다.


## 2026-11-26 — main 직접 통합 및 최종 검증

- main 병합 커밋: `aa37f7b862db40c996b5a1c9c238a444859cf3d8`
- First parent: 기존 main `5f67e3ba474c97441fc798ef59cf5be234c43681`
- Second parent: 작업 브랜치 `a384ef3ebc3e06610ee073d33e3a9016a53a2d0a`
- main에만 존재하던 `package-lock.json` blob `0a5a0a1d312795dacda6bce35a7a4474ff6a8714`를 통합 tree에 포함했다.
- Phaser lockfile 버전: 4.2.1 확인.
- Draft PR #1: merged / closed, merge time 2026-11-26T07:19:00Z.
- GitHub Actions main push run `45774399141`: completed / success.
- main SHA `aa37f7b`의 TypeScript 검사: PASS.
- main SHA `aa37f7b`의 Vite production build: PASS.
- Feature SHA `a384ef3`의 push run `45774181390` 및 PR run `45774188958`: 모두 PASS.
- 브라우저 전체 플레이, UI/충돌 가독성 검수, 오디오 청취: NOT RUN / REVIEW NEEDED.
- main 통합 과정에서 force push 없이 expected SHA 검사를 사용했다.
- CREATIVE_DECISION_WORKBOOK.md 및 스토리 색인 0~1.7 원문은 수정하지 않았다.

### 다음 단계
**교육복지반 1.8 간식 바구니와 거미 모양 과자 판매대부터 원문 순서대로 이어서 구현한다. 브라우저 직접 플레이 검수도 그 다음 코드 변경의 승인 기준으로 남겨둔다.**


## 2026-11-26 — 심층 리서치 기반 기준선 감사 및 입력 리빌드

### 조사 및 설계
- `docs/audit/BASELINE_AUDIT.md`에 현재 Scene·입력·아트·전투 구조의 정적 기준선을 기록했다.
- `docs/research/visual-reference/`에 Undertale의 타이틀, 오프닝, 방, 캐릭터, 전투, UI, 애니메이션, 전환, 색상, 시각 격차를 분류했다.
- 이미지 참조는 분석용 링크/미리보기로만 문서화했으며 원작 이미지를 게임 자산으로 복제하지 않았다.
- `docs/design/GAMEPLAY_PILLARS.md`, `CORE_GAME_LOOP.md`, `INPUT_AND_CONTROL_SPEC.md`, `COMBAT_SYSTEM_SPEC.md`를 작성했다.
- 입력 QA 테스트 계획 및 단계적 리빌드 계획을 작성했다.

### 코드 변경 준비
- `src/input/GameInput.ts` 공통 입력 레이어.
- TitleScene / PrologueScene / FlowerFieldScene의 Confirm 입력 통합.
- RoomScene / WelfareCorridorScene의 이동·상호작용·전화 입력 통합.
- BattleScene / BullyBattleScene / SecondRankEncounterScene / RegularEncounterScene / NerdstablookEncounterScene의 메뉴·취소·회피 입력 통합.
- Z/Enter/Space Confirm, X/Shift/Escape Cancel, 방향키/WASD 이동, E 조사 호환, C 전화 호환.
- NameEntryScene의 DOM 텍스트 입력은 별도 유지.
- RoomScene의 교육복지실 출구 화자 문자열 불일치 수정.
- BattleScene의 도미토리엘 임시 Graphics 초상을 기존 공유 SVG 에셋으로 대체.

### 테스트 상태
| 항목 | 상태 | 근거 |
|---|---|---|
| 최신 main과 보호 문서 확인 | PASS | GitHub main/tree/docs 조회 |
| 주요 Scene/에셋 정적 감사 | PASS | GitHub 소스 및 에셋 확인 |
| 공통 입력 및 Scene 이관 | PASS | PR #2 최신 커밋 `fa5c1d8`의 TypeScript 및 Vite production build 성공 |
| TypeScript | PASS | GitHub Actions run 45828492421, head SHA `fa5c1d8` |
| Vite production build | PASS | GitHub Actions run 45828492421, head SHA `fa5c1d8` |
| 브라우저 조작 | NOT RUN | 사용할 수 있는 브라우저 조작 도구 미확인 |
| 시각 QA | REVIEW NEEDED | 실제 캡처/플레이 확인 필요 |
| 사운드 청취 | NOT RUN | 실제 게임 사운드 청취 미실시 |

### 다음 작업
1. 변경 blob을 브랜치 tree/commit에 통합하고 GitHub Actions를 실행한다.
2. CI 실패가 있으면 로그를 확인해 수정한다.
3. 브라우저 실행 환경이 확보되면 `docs/qa/CONTROL_INPUT_ACCEPTANCE_TESTS.md`를 실제 결과로 갱신한다.
4. 입력 검증 후 UI 규격 통일, 화면비 A/B 목업, 방향별 스프라이트/표정 시트, 공통 전투 상태머신으로 확장한다.


### CI 최종 확인 — 2026-11-26
- 작업 브랜치: `rebuild/input-and-visual-baseline`
- Draft PR: #2 — https://github.com/kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt/pull/2
- 최초 구현 커밋: `c03b893330dac7b4c39a9204567dfde95463315d`
- 누락/중복 안내 수정 커밋: `fa5c1d835b4ba618f40d6b8348808cdd4f80d3c9`
- 최종 GitHub Actions run: `45828492421` — completed / success.
- Install dependencies: PASS.
- TypeScript and production build: PASS.
- PR은 Draft 상태로 유지. 자동 빌드 성공만으로 브라우저 플레이·시각 QA·상업 출시 검증이 완료된 것으로 간주하지 않는다.


## 2026-11-26 — 공통 조우 명령 UI 적용

### 코드 변경
- `src/ui/EncounterMenu.ts` 추가.
- `BattleScene`, `BullyBattleScene`, `SecondRankEncounterScene`, `RegularEncounterScene`, `NerdstablookEncounterScene`의 FIGHT / ACT / ITEM / MERCY 명령 행을 공통 카드 렌더러로 통일.
- 카드 크기, 간격, 테두리, 선택 강조, 제목/부제 서체를 공통화.
- 조우별 부제, Mercy 상태, 명령 실행 함수는 각 Scene 데이터/로직에서 유지.
- 포인터 입력과 키보드 입력 모두 같은 명령 콜백을 사용.

### 검증
- GitHub Actions run `45829690229` — latest head `fd1300b1db4dd7e5530696ba2e13b95175afabfa`, completed / success.
- Install dependencies: PASS.
- TypeScript and production build: PASS.
- 브라우저 메뉴 조작/카드 잘림/작은 창 검수: NOT RUN.
- PR #2: Draft 유지.

### 남은 작업
- ACT 하위 목록과 대화 패널 공통화.
- 전투 보드/SOUL 영역과 적별 화면 변형 규칙.
- 실제 브라우저 캡처 및 키보드/포인터 플레이테스트.


## 2026-11-26 — 공통 ACT/아이템 선택 목록

### 구현
- `src/ui/EncounterMenu.ts`에 `drawEncounterChoiceList()` 추가.
- BattleScene ACT/ITEM, SecondRank, RegularEncounter, Nerdstablook ACT 메뉴에 사용.
- 선택된 항목에 배경·금색 테두리·화살표 커서를 함께 표시.
- 각 Scene이 선택 상태와 결과 처리를 계속 소유하므로 전투 로직은 변경하지 않음.

### 정적 확인
- 모든 변경 Scene이 공통 helper를 import하고 호출한다.
- 기존 ACT 배열 데이터와 선택 콜백은 유지했다.
- 현재 일반 조우 데이터는 적별 ACT 3개, Nerdstablook 6개(개별 ACT 목록 전체)를 포함하며 실제 렌더링은 브라우저 확인이 남아 있다.
- TypeScript/Vite build: 새 커밋 후 GitHub Actions 대기.
- 브라우저 조작/레이아웃/한국어 문구 검수: NOT RUN.
