# UNDERFAIL 제작 시작 계획서

> 상태: **제작 진행 중**
>
> 기술 스택: **Phaser 4.2.1 + TypeScript + Vite — 사용자 승인 완료**
>
> 창작 기준 원본: `CREATIVE_DECISION_WORKBOOK.md`

이 문서는 전체 작업의 진입점이다. 세부 기준은 아래 문서를 참조하며, 이 문서가 워크북의 내용을 대체하지 않는다.

## 1. 현재 저장소

저장소: `kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt`  
기본 브랜치: `main`

주요 파일:

- `CREATIVE_DECISION_WORKBOOK.md` — 사용자가 직접 작성한 창작 원본. 수정·덮어쓰기 금지.
- `docs/CANON_BASELINE.md` — 워크북에서 확인된 정사 요약.
- `docs/TECH_ARCHITECTURE.md` — Phaser 프로젝트 기술 구조.
- `docs/IMPLEMENTATION_ROADMAP.md` — 단계별 제작 순서.
- `docs/MILESTONE_0_PROJECT_SETUP.md` — 프로젝트 생성 및 실행 확인 기록.
- `docs/MILESTONE_1_VERTICAL_SLICE.md` — 다음 구현 단계의 구체적인 명세.
- `.github/copilot-instructions.md` — Copilot 작업 규칙.

기존 파일을 정리하기 전의 상태는 `archive/pre-workbook-cleanup-2026-11-25` 브랜치에 보존되어 있다. 비슷한 이름의 `UNDERFAIL-No-with-chat-gpt2` 저장소는 이번 작업 대상이 아니다.

## 2. 프로젝트 제작 기준

- 게임은 2D 웹 기반 스토리 게임으로 제작한다.
- 핵심 엔진은 Phaser 4.2.1, 언어는 TypeScript, 개발 서버와 빌드는 Vite를 사용한다.
- React와 Three.js는 이 프로젝트에 추가하지 않는다.
- 워크북에서 사용자가 확정한 사항만 정사로 취급한다.
- 미정인 세계관, 루트, HP 0 결과, 저장/재시작 의미는 구현 편의로 확정하지 않는다.
- 임시 대사·수치·도형·맵은 `PROTOTYPE` 또는 `PROPOSAL`로 분리한다.

## 3. 현재 진행 상태

### Milestone 0 — 프로젝트 생성

**완료.** 사용자 환경에서 프로덕션 빌드가 성공했고 개발 서버 실행도 확인되었다. 초기 번들 크기 경고는 빌드 실패가 아니며, Vertical Slice 구현 이후 최적화 필요성을 다시 판단한다.

세부 기록: `docs/MILESTONE_0_PROJECT_SETUP.md`

### Milestone 1 — 교육복지실 Vertical Slice

**리빌드 진행 중.** 오프닝 몽타주·꽃밭·불리 회피 튜토리얼·구출·교육복지반 첫 방 자산을 통합하는 중이며, 수정 후 GitHub Actions 재검증과 브라우저 확인이 남아 있다.

2026-11-26 사용자 검토에서 스토리 전개, 맵·캐릭터 디자인, UI, 원작 기능과의 비교 부족, 오프닝의 컨셉 이탈 문제가 지적되었다. 기존 프로토타입은 코드가 빌드되는 참고 구현일 뿐, 스토리 중심 Vertical Slice의 승인된 완성본으로 취급하지 않는다. 새 제작 기준은 스토리 색인과 스토리 중심 마스터 프롬프트를 따른다. GitHub Actions 빌드 통과와 실제 브라우저 플레이·시각 검토는 별개의 확인 항목이다.

목표 흐름:

- 타이틀
- 이름 입력
- 합주곡 혼합고등학교 과거 몽타주
- 폐교 확인서·도장·단체사진·손만 보이는 인물
- 시간 경과·풍화양상 배정 통지서·학교 소문
- 꽃밭에서 불리와 조우
- 추상 문양 회피 튜토리얼
- 도미토리엘 개입·구출
- 교육복지반 진입
- 첫 방 조사·퍼즐·NPC 상호작용

학교 표기(202X년 풍화양상 중학교 / 풍화양상 고등학교)는 원본 문서 사이의 충돌이므로 어느 쪽도 임의로 삭제하지 않는다.

구체적 완료 조건과 범위 밖 항목은 `docs/MILESTONE_1_VERTICAL_SLICE.md`에 정리되어 있다.

## 4. 스토리 중심 제작 기준 문서

이제부터 스토리 재설계·맵·캐릭터·애니메이션·UI·전투·연출의 실제 제작에는 아래 문서를 우선 적용한다.

- `docs/CHATGPT_STORY_DRIVEN_PRODUCTION_MASTER_PROMPT.md` — 이번 사용자 요청에 따라 만든 스토리 중심 자율 제작·리빌드 지침. 기존 프로토타입 감사, Undertale 기능 비교, 시간순 스토리 준수, 아트·UI 품질, 구현·검증·지속성 규칙을 정의한다.
- `docs/story/UNDERFAIL_START_TO_CHAMBER_BATTLE_DIALOGUE_INDEX_v5.md` — 도입부부터 체임버쌤 첫 정식 보스전 개시까지의 시간순 대화·분기 색인. 0~1.7 보존 구간을 포함한다.
- `docs/CHATGPT_AUTONOMOUS_PRODUCTION_MASTER_PROMPT.md` — 이전의 일반 통합 제작 지침. 보조 참고용이며 스토리 순서·연출·품질 기준에서 새 스토리 중심 프롬프트와 충돌하면 새 프롬프트가 우선한다.

이 문서들은 CREATIVE_DECISION_WORKBOOK.md를 대체하지 않는다. 정사 우선순위는 워크북과 최신 사용자 지시를 따른다.

## 4. 다음 단계에 사용할 Copilot 컨텍스트

스토리 중심 구현을 시작할 때는 다음 파일을 우선 컨텍스트로 사용한다.

```text
#file: CREATIVE_DECISION_WORKBOOK.md
#file: docs/story/UNDERFAIL_START_TO_CHAMBER_BATTLE_DIALOGUE_INDEX_v5.md
#file: docs/CANON_BASELINE.md
#file: docs/TECH_ARCHITECTURE.md
#file: docs/CHATGPT_STORY_DRIVEN_PRODUCTION_MASTER_PROMPT.md
```

기존 MILESTONE_1_VERTICAL_SLICE.md는 이전 프로토타입의 구현 범위를 설명하는 참고 문서이며, 새 스토리 색인의 시간순 사건 구조를 덮어쓰지 않는다.

Copilot은 먼저 현재 브랜치·파일·코드를 확인하고 명세와 충돌하는 점을 보고한 뒤 구현한다. 사용자 승인 없이 정사나 보류 항목을 수정하지 않는다.

## 5. 진행 원칙

1. 스토리 시간순을 최우선으로 지키고 한 번에 하나의 구간을 완성한다.
2. 넓은 지역을 임시 도형으로 채우기보다 짧은 구간의 맵·캐릭터·UI·연출을 제대로 만든다.
3. 원작은 기능적으로 조사·비교하되 문장·아트·맵·음악·패턴을 복제하지 않는다.
4. 사용자 정사·제안·미정/보류를 분리한다.
5. TypeScript 검사와 빌드, 브라우저 직접 테스트를 구분해 기록한다.
6. 실행하지 않은 테스트를 성공했다고 보고하지 않는다.
7. 사용자 원본과 main 브랜치를 보호하고 의미 있는 커밋으로 진행 상태를 저장한다.


## 2026-11-26 시각·기술 통합 상태

- 오프닝 페이지 다섯 비트를 데이터로 분리한다.
- 오리지널 SVG 타이틀·과거 학교·폐교 문서·현재 학교·꽃밭·캐릭터·구출 효과·교육복지반 자산을 Phaser Boot Scene에서 로드하도록 준비했다.
- 꽃잎 형태의 추상 문양을 피하는 튜토리얼을 유지하며, 현실 소비물·사용 장면은 구현하지 않는다.
- 교육복지반 첫 방은 배경 SVG, 인물 SVG, 충돌·근접 조사, 반복 가능한 퍼즐 및 메뉴 학습의 골격을 사용한다.
- Web Audio 합성음은 브라우저 사용자 제스처 이후에만 시작하며 원작 음악을 사용하지 않는다.
- 현재 브라우저 직접 플레이와 시각 확인은 NOT RUN이다. SVG 파일은 첫 패스 자산이지 최종 승인 아트가 아니다.


## 2026-11-26 교육복지반 특수 조우 진행

프로깃허브의 메뉴 설명을 완료해야 전교 2등이 상호작용 가능한 상태가 된다. 상호작용하면 별도 조우 화면에서 FIGHT / ACT / ITEM / MERCY를 선택한다. FIGHT는 도미토리엘이 막아서며, ACT/MERCY도 상대가 떠나는 사용자 확정의 사건 결과를 보존한다. 모든 분기는 전교 2등이 공부하러 떠나고 도미토리엘의 후속 대화로 이어진다.

이 특수 조우는 HP나 사망 규칙을 정의하지 않으며, 전투 액션 선택이 현실의 위해 행동을 묘사하거나 보상하지 않는다. ITEM은 현재 보유 아이템이 없다는 안내만 표시한다. 자세한 플래그/테스트 조건은 docs/design/WELFARE_FIRST_ROOM_EVENT_GRAPH.md를 따른다.


## 2026-11-26 교육복지반 1.3~1.7 추가

일반 교실·파프리카 구역으로 건너뛰지 않고, 스토리 색인에서 교육복지반의 일반 조우·프로깃허브 NPC·퍼즐/환경 조사·전화·너드스타블룩 길막 이벤트를 별도 복도 Scene과 전투 Scene으로 연결했다.

- WelfareCorridorScene: RoomScene과 연결되는 탐험 복도.
- RegularEncounterScene: 5종의 성격별 일반 조우, 고유 ACT와 비살상 첫 패스.
- NerdstablookEncounterScene: 만화 취향 ACT, 긍정/부정 반응, 길막 해제.
- GameSession: 적별 결과, 퍼즐, 전화, 프로깃허브 안내 상태, 너드스타블룩 후속 상태.

자세한 이벤트 그래프와 수동 테스트는 docs/design/WELFARE_1_3_TO_1_7_EVENT_GRAPH.md를 기준으로 한다. 원문에 없는 적 이름·대사·해답·횟수는 제안이며, HP 0/사망/저장/리셋/전 지역 처치 카운터를 정의하지 않는다. 브라우저 검수는 아직 필요하다.
