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

**기존 코드 빌드 통과 / 스토리·아트 방향 재설계 필요.**

2026-11-26 사용자 검토에서 스토리 전개, 맵·캐릭터 디자인, UI, 원작 기능과의 비교 부족, 오프닝의 컨셉 이탈 문제가 지적되었다. 기존 프로토타입은 코드가 빌드되는 참고 구현일 뿐, 스토리 중심 Vertical Slice의 승인된 완성본으로 취급하지 않는다. 새 제작 기준은 스토리 색인과 스토리 중심 마스터 프롬프트를 따른다. GitHub Actions 빌드 통과와 실제 브라우저 플레이·시각 검토는 별개의 확인 항목이다.

목표 흐름:

```text
타이틀
→ 주인공 이름 입력
→ 짧은 도입부
→ 교육복지실 탐험
→ 조사와 도미토리엘 대화
→ 도미토리엘과의 대립/전투
→ ACT 기반 평화 해결
→ 출구 개방
→ 프로토타입 종료 지점
```

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
