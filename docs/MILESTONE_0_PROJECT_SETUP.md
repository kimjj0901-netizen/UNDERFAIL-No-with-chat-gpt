# Milestone 0 — 프로젝트 생성

## 상태

**완료 — 사용자 환경에서 빌드와 개발 서버 실행 확인**

2026-11-25 기준 Phaser 4.2.1 + TypeScript + Vite 기반의 최소 프로젝트가 만들어졌고, 사용자가 자신의 런타임에서 실행을 확인했다.

## 채택 스택

- Phaser: **4.2.1**
- Language: **TypeScript**
- Bundler / dev server: **Vite**
- Framework: Phaser 단독
- UI 프레임워크: 없음

Phaser 버전은 `package.json`에서 정확히 `4.2.1`로 고정한다.

## 생성된 구조

```text
.
├── CREATIVE_DECISION_WORKBOOK.md
├── .github/
│   └── copilot-instructions.md
├── docs/
│   ├── CANON_BASELINE.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   ├── MILESTONE_0_PROJECT_SETUP.md
│   ├── MILESTONE_1_VERTICAL_SLICE.md
│   ├── PRODUCTION_START_PLAN.md
│   └── TECH_ARCHITECTURE.md
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

- `src/main.ts`에서 Phaser Game 인스턴스를 생성한다.
- `src/scenes/BootScene.ts`가 초기 Scene이다.
- 현재 Scene은 프로젝트 부팅을 확인하기 위한 임시 화면만 표시한다.

## 완료 확인

- [x] Phaser 4.2.1 의존성 선언
- [x] TypeScript 설정
- [x] Vite 설정
- [x] 브라우저 진입 HTML 생성
- [x] Phaser Game 생성 코드 작성
- [x] 첫 Scene 생성
- [x] 전역 스타일 연결
- [x] 프로젝트 의존성이 설치된 환경에서 명령 실행 가능 확인
- [x] `npm run build` 성공
- [x] 개발 서버 실행 성공

## 사용자 실행 결과

사용자가 전달한 빌드 로그 기준:

- TypeScript 빌드: 통과
- Vite 프로덕션 빌드: 통과
- Vite 출력 파일 생성: 성공
- JavaScript 번들: 약 1,388.55 kB, gzip 약 370.46 kB
- 500 kB 초과 청크 경고: 표시되었으나 빌드 실패가 아닌 비차단 경고

초기 `--host 0.0.0.0` 실행에서는 포트 충돌과 네트워크 인터페이스 조회 오류가 발생했다. 이후 로컬 루프백 주소와 별도 포트로 바꾸는 방법을 안내했고, 사용자가 개발 서버 실행에 성공했다고 확인했다.

## 번들 경고 처리

현재 청크 크기 경고는 오류가 아니다. 지금은 게임 기능 구현을 우선하고, Vertical Slice 이후 필요성을 확인해 동적 import 또는 manualChunks 등 코드 분할을 검토한다. 경고만 없애기 위해 불필요한 프레임워크나 복잡한 구조를 추가하지 않는다.

## 다음 단계

Milestone 1은 `docs/MILESTONE_1_VERTICAL_SLICE.md`를 기준으로 교육복지실 Vertical Slice를 구현한다.
