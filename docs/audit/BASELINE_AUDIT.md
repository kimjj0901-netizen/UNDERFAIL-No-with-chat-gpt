# UNDERFAIL 기준선 감사 — 2026-11-26

## 조사 범위와 제한

- 대상 저장소: `kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt`
- 조사 기준 브랜치/커밋: `main` / `f0a8cd6a4e5280d75f8efb552710de3386610048`
- 스택: Phaser 4.2.1 + TypeScript + Vite.
- 읽은 코드: TitleScene, NameEntryScene, PrologueScene, FlowerFieldScene, BullyBattleScene, RoomScene, WelfareCorridorScene, BattleScene, SecondRankEncounterScene, RegularEncounterScene, NerdstablookEncounterScene, GameSession, openingContent, BootScene, main.ts.
- 검토한 문서: 창작 원본과 정사 기준, 시간순 스토리 색인, 마스터 프롬프트, 기술 아키텍처, 기존 디자인·이벤트 그래프, Undertale 기능 참조 자료집.
- [검증 한계] 이 감사는 저장소 코드와 에셋의 정적 검토다. 현재 브라우저에서 실제 실행·조작·시각 캡처를 수행하지 않았다. 플레이 감각에 대한 최종 평가는 실제 플레이테스트가 필요하다.

## 확인된 기준

| ID | 항목 | 확인 결과 | 증거 파일 | 영향 |
|---|---|---|---|---|
| A-01 | 논리 해상도 | 960×540, 16:9 | `src/main.ts`, `docs/TECH_ARCHITECTURE.md` | 모든 기존 SVG 및 UI 좌표가 이 기준에 의존한다. |
| A-02 | 스케일 | FIT / 중앙 정렬 | `src/main.ts` | 비율 유지형 맞춤. 화면이 좁아지면 여백이 생길 수 있다. |
| A-03 | 입력 구조 | 다수 Scene이 각자 키를 생성한다. | 개별 Scene의 `create` | 키 정책이 변경될 때 씬별 누락·불일치가 발생하기 쉽다. |
| A-04 | Confirm | 기존에는 주로 Enter / Space | Scene별 입력부 | 원작 PC판의 Z/Enter를 포함하지 않았다. |
| A-05 | Cancel | 기존에는 Escape 중심 | BattleScene 및 조우 Scene | X/Shift 별칭은 없었다. |
| A-06 | 상호작용 | E가 조사 입력으로 사용됨 | RoomScene / WelfareCorridorScene | E는 기존 사용자가 익힌 조작이므로 호환이 필요하다. |
| A-07 | 전화 | C가 도미토리엘 전화 단축키 | RoomScene / WelfareCorridorScene | C를 단순히 메뉴 키로 덮어쓰면 기존 전화가 깨진다. |
| A-08 | 대화 | 각 방/Scene의 자체 대화 데이터와 렌더링 | RoomScene / WelfareCorridorScene | 공통 입력은 가능하지만 대화 시스템 전체 통합은 별도 과제다. |
| A-09 | 전투 | 공통 개념은 있으나 Scene별 구현이 나뉘어 있다. | BullyBattleScene / BattleScene / RegularEncounterScene / NerdstablookEncounterScene / SecondRankEncounterScene | 입력 통일 이후 전투 상태머신과 UI를 공통화할 필요가 있다. |
| A-10 | 캐릭터 아트 | SVG 에셋이 이미 존재한다. | `public/assets/characters` | 일부 화면에서 같은 캐릭터를 임시 도형으로 다시 그리는 불일치가 있다. |
| A-11 | 배경 아트 | 960×540 SVG 배경 다수 | `public/assets/rooms`, `opening`, `title` | 전체 교체보다 장면별 역할·가독성 감사가 우선이다. |
| A-12 | 이름 입력 | 별도 DOM input 사용 | NameEntryScene | 글로벌 키 핸들러가 이름 입력을 가로채면 안 된다. |
| A-13 | 저장/루트 | 세션 상태 중심, SAVE/RESET 의미 보류 | GameSession / Canon docs | 세계관 의미를 임의 확정하지 않는다. |

## 정적 코드에서 발견한 구체적 문제

### A-14 — 교육복지실 출구 대화의 분기 문자열 불일치
- 호출 지점: `RoomScene.interact()`의 문 타겟이 화자를 `복도로 이어지는 문`으로 설정한다.
- 분기 지점: `RoomScene.handleDialogue()`는 `복도에서 이어지는 문`을 비교하고 있었다.
- 결과: 선택 후 복도로 이동하는 분기가 실행되지 않을 가능성이 있다.
- 처리: 이번 리빌드 브랜치에서 비교 문자열을 호출부와 일치시켰다.
- 상태: [코드 수정 반영 예정 — CI 및 브라우저 테스트 필요]

### A-15 — 도미토리엘 전투 아트의 표현 불일치
- 다른 Scene은 이미 등록된 `character-domitoriell` SVG를 사용한다.
- `BattleScene.drawDomitoriellPortrait()`는 별도의 Graphics 도형으로 머리·몸·눈을 다시 그린다.
- 결과: 동일 인물이 장면마다 다른 디자인 언어로 보인다.
- 처리: 기존 SVG 에셋을 재사용하도록 수정했다. 새 외부 이미지나 원작 이미지를 사용하지 않았다.
- 상태: [코드 변경 준비 — 시각 확인 필요]

## 우선순위 진단

### P0 — 입력 일관성과 기본 진행
- 공통 Input Layer.
- Confirm/Cancel 및 이동의 공통 의미.
- 입력 중복 소비 방지.
- NameEntry DOM 입력 보호.
- 전화 C와 조사 E의 기존 기능 보존.
- 출구 분기 결함 수정.

### P1 — 화면·아트 일관성
- 같은 캐릭터의 표현은 같은 원본 에셋을 사용.
- 대화창/전투 메뉴/상태 정보의 공통 레이아웃 규칙.
- 작은 화면에서 글자와 선택 표시 가독성.
- 960×540 유지안과 4:3 실험안을 비교한 뒤 화면비 결정.

### P2 — 플레이 깊이
- 공통 전투 상태머신과 적별 데이터 분리.
- ACT 결과와 캐릭터 태도·공격 패턴 연결.
- 패턴 예고 및 회피 판독성.
- 방마다 탐험·대화·퍼즐·전투의 밀도 조정.

### P3 — 제작/출시
- 캐릭터 방향·표정·동작 시트.
- 배경 타일셋과 장면별 연출.
- 오리지널 음악/효과음.
- 접근성·브라우저 호환성·라이선스 감사.

## 아직 확인하지 못한 것
- 실제 브라우저에서 키 입력 반응과 중복 여부.
- 실제 이동 속도·대각선 반응·충돌 박스.
- 대화/전투에서 글자 잘림 및 겹침.
- SVG의 브라우저 렌더링과 작은 크기에서의 식별력.
- 실제 사운드 믹스 청취.
- 실제 플레이어가 느끼는 재미와 난이도.

## 결론
현재 가장 명확하게 검증된 구조적 결함은 Scene마다 다른 키 처리를 직접 구현하는 입력 분산이다. 그러므로 전체 화면비와 아트 방향을 성급히 바꾸기보다, 공통 입력 체계를 먼저 적용하고, 기존 아트의 불일치를 같은 에셋 재사용으로 줄이는 것이 위험이 낮다. 이 감사는 전체 게임의 플레이 품질 평가가 아니며, 브라우저 플레이 검수가 뒤따라야 한다.
