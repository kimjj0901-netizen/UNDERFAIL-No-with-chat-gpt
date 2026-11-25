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

**다음 작업.**

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

## 4. 통합 자율 제작 프롬프트

ChatGPT가 저장소를 직접 조사하고 기획·설계·구현·검토·개선까지 수행할 때는 다음 문서를 기준으로 한다.

- `docs/CHATGPT_AUTONOMOUS_PRODUCTION_MASTER_PROMPT.md` — ChatGPT용 통합 자율 제작 지침. 저장소 접근, 정사 보호, 조사, 구현, 검증, 작업 지속성 및 최종 보고 규칙을 정의한다.
- 이 문서는 창작 워크북이나 Milestone 명세를 대체하지 않는다. 실행 범위와 현재 완료 기준은 각 Milestone 문서를 따른다.

## 4. 다음 단계에 사용할 Copilot 컨텍스트

첫 구현 요청에는 다음 다섯 파일을 사용한다.

```text
#file: CREATIVE_DECISION_WORKBOOK.md
#file: docs/CANON_BASELINE.md
#file: docs/TECH_ARCHITECTURE.md
#file: docs/IMPLEMENTATION_ROADMAP.md
#file: docs/MILESTONE_1_VERTICAL_SLICE.md
```

Copilot은 먼저 현재 브랜치·파일·코드를 확인하고 명세와 충돌하는 점을 보고한 뒤 구현한다. 사용자 승인 없이 정사나 보류 항목을 수정하지 않는다.

## 5. 진행 원칙

1. 한 번에 하나의 Milestone을 완성한다.
2. 전체 게임을 한꺼번에 만들지 않는다.
3. 대량의 최종 아트를 만들기 전에 플레이 루프와 시스템을 검증한다.
4. TypeScript 검사와 빌드, 브라우저 직접 테스트를 구분해 기록한다.
5. 실행하지 않은 테스트를 성공했다고 보고하지 않는다.
