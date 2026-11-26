 

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
