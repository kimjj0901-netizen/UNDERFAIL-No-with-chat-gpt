 

## 2026-11-26 — 공통 전투/조우 패널 프레임

- `drawEncounterPanel()`을 `src/ui/EncounterMenu.ts`에 추가.
- BattleScene, BullyBattleScene, SecondRankEncounterScene, RegularEncounterScene, NerdstablookEncounterScene에 적용.
- 짙은 청록 배경, 금색 외곽선, 낮은 대비 내부선을 공통 패널 규칙으로 사용.
- Scene별 위치와 크기는 캐릭터/보드/텍스트 배치를 고려해 개별 지정.
- 패널은 배경 역할이며 적별 내용 및 게임 로직은 Scene에 유지.
- 브라우저 실제 화면/긴 한국어/보드 전환 검수는 NOT RUN.

### 빌드 검증
- ACT Choice List 최초 커밋에서 readonly tuple -> string[] 타입 불일치가 발생해 CI 실패(run 45830548971).
- 입력 타입을 `readonly string[]`으로 변경.
- 수정 커밋 `09434ce5e6fb4a56d8f679f80180e0dcb4e0e634`, CI run 45830752017: success.
- 패널 UI는 다음 코드 커밋에서 CI 검증 예정.


## 2026-11-26 — 타이틀 선택 UI 및 시각 스타일 바이블

### 구현
- TitleScene의 시작 항목을 어두운 청록 선택 프레임 + 금색 테두리 + 선택 마커로 표현.
- Z/Enter/Space Confirm과 프레임/텍스트 클릭은 동일한 시작 콜백을 사용.
- 기존 단일 시작 기능만 시각적으로 강조했으며 가짜 Continue/Settings 항목은 추가하지 않음.

### 디자인 문서
- `docs/design/VISUAL_STYLE_BIBLE.md`: 현재 SVG에서 추출한 색상/장면 역할/시각 위계.
- `docs/design/UI_DESIGN_SYSTEM.md`: 타이틀, 패널, 전투 명령, 하위 선택 목록의 규칙.
- `docs/design/ASSET_PRODUCTION_SPEC.md`: 960×540 배경 및 캐릭터 에셋 시트 제작 규격 초안.
- [검증 한계] 이 규격은 현재 코드/에셋을 토대로 한 1차 제안이다. 브라우저 화면 캡처로 최종 승인하지 않았다.


## 2026-11-26 — Confirm/Interact 중복 소비 방지
- `INTERACT`는 E 전용 액션으로 분리.
- RoomScene/WelfareCorridorScene/FlowerFieldScene은 탐험 상태에서 E 또는 Confirm으로 상호작용.
- 대화가 활성화되면 Scene이 탐험 업데이트를 중단하고 Confirm은 대화 처리기에서만 사용.
- MENU는 Ctrl만 예약 입력으로 두고, C는 기존 전화 단축키로 유지.
- 이 변경으로 Confirm 키 별칭이 두 개의 액션 배열에서 동시에 소비되는 문제를 제거.


### 최신 입력 및 CI 기록 — 2026-11-26
- `GameInput.INTERACT`를 E-only로 분리해 Confirm과 같은 key object가 두 action에서 소비되는 위험 제거.
- RoomScene/WelfareCorridorScene/FlowerFieldScene은 탐험 상태에서 E 또는 Confirm으로 상호작용.
- 대화가 열리면 Scene 업데이트가 handleDialogue로 조기 반환하므로 Confirm은 대화만 진행.
- `MENU`는 Ctrl 예약, C는 전화 단축키.
- 최신 커밋: `a4ec9b21c5bfc20408bcfac48c24b8a03a93609c`.
- GitHub Actions run `45832181281`: completed / success; Install dependencies PASS; TypeScript and production build PASS.
- 브라우저 직접 입력/레이아웃 QA는 NOT RUN.
