# Milestone 0 — 프로젝트 생성

## 상태

**진행 중 / 구조 생성 완료**

2026-11-25 기준 `main`에 Phaser 4.2.1 + TypeScript + Vite 기반의 최소 실행 구조를 생성했다.

## 채택 스택

- Phaser: **4.2.1**
- Language: **TypeScript**
- Bundler / dev server: **Vite**
- Framework: Phaser 단독
- UI 프레임워크: 없음

Phaser 버전은 게임 핵심 의존성에서 정확히 `4.2.1`로 고정한다.

## 생성된 구조

```
.
├── CREATIVE_DECISION_WORKBOOK.md
├── docs/
│   ├── MILESTONE_0_PROJECT_SETUP.md
│   └── PRODUCTION_START_PLAN.md
├── src/
│   ├── main.ts
│   ├── style.css
│   ├── vite-env.d.ts
│   └── scenes/
│       └── BootScene.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── .gitignore
```

## 현재 게임 진입점

`src/main.ts`에서 Phaser Game 인스턴스를 생성한다.

현재 Scene은 `BootScene` 하나이며, 실제 게임 콘텐츠를 구현하기 위한 임시 부트 화면만 표시한다.

## 완료 기준

- [x] Phaser 4.2.1 의존성 선언
- [x] TypeScript 설정
- [x] Vite 설정
- [x] 브라우저 진입 HTML 생성
- [x] Phaser Game 생성 코드 작성
- [x] 첫 Scene 생성
- [x] 전역 스타일 연결
- [ ] `npm install` 실행
- [ ] `npm run build` 성공 확인
- [ ] `npm run dev -- --host 0.0.0.0` 실행 확인

마지막 세 항목은 GitHub 파일 조작만으로는 실제 Codespace 런타임에서 검증할 수 없으므로, Codespace에서 실행하여 확인해야 한다.

## 다음 단계

Milestone 1은 실제 게임의 첫 Vertical Slice를 만든다.

목표는 **제목/이름 입력 → 도입부 → 교육복지반 → 첫 탐색 → 첫 상호작용 → 첫 전투 진입 → ACT 기반 평화적 해결 → 다음 공간 전환**까지를 하나의 플레이 가능한 흐름으로 연결하는 것이다.

이 단계에서 그래픽 에셋을 대량 제작하지 않는다. 먼저 게임 루프와 데이터 구조를 검증한다.
