# UNDERFAIL Copilot Instructions

## 프로젝트 정체성

이 저장소는 **언더페일** 게임 프로젝트다.

핵심 창작 기준은 저장소의 `CREATIVE_DECISION_WORKBOOK.md`를 따른다.

## 우선순위

1. 사용자가 확정한 내용
2. `CREATIVE_DECISION_WORKBOOK.md`의 명시된 선택
3. 현재 구현과 문서에 이미 존재하는 구조
4. 미승인 제안

미승인 아이디어를 정사처럼 확정하지 않는다.

## 기술 스택

- Phaser 4.2.1
- TypeScript
- Vite
- Phaser 단독 구조
- React를 추가하지 않는다.
- Three.js를 추가하지 않는다.

## 작업 원칙

- 작업 전에 관련 문서를 먼저 읽는다.
- 한 번에 하나의 명확한 Milestone 단위로 구현한다.
- 기존 창작 결정을 임의로 수정하지 않는다.
- 새로운 설정이나 스토리를 추가해야 한다면 코드에 몰래 확정하지 말고 제안으로 분리한다.
- 게임의 대사, 분기, 관계, 아이템, 전투 규칙은 가능한 한 데이터 중심 구조로 발전시킨다.
- 현재 단계에서는 대량의 임시 에셋을 만들지 않는다.
- 코드가 실행 가능한지 확인할 수 있는 경우 반드시 테스트한다.
- 테스트하지 못한 것은 테스트했다고 보고하지 않는다.

## 현재 Milestone 1 목표

현재 작업은 `docs/MILESTONE_1_VERTICAL_SLICE.md`에 정의된 교육복지실 Vertical Slice다.

반드시 다음 문서를 함께 읽는다.
- `CREATIVE_DECISION_WORKBOOK.md`
- `docs/CANON_BASELINE.md`
- `docs/TECH_ARCHITECTURE.md`
- `docs/MILESTONE_1_VERTICAL_SLICE.md`

기존 Phaser 4.2.1 + TypeScript + Vite 구성을 유지한다. 워크북에 없는 스토리 설정, 사망 규칙, 루트 조건, 엔딩을 임의로 확정하지 않는다. 임시 수치는 `PROTOTYPE ONLY`로 표시한다.

## Milestone 1 범위

첫 Vertical Slice:

제목/이름 입력 → 도입부 → 교육복지반 → 첫 탐색 → 첫 상호작용 → 첫 전투 진입 → ACT 기반 평화적 해결 → 다음 공간 전환

이 흐름이 실제로 플레이 가능한 상태가 되기 전까지 시스템을 불필요하게 확장하지 않는다.
