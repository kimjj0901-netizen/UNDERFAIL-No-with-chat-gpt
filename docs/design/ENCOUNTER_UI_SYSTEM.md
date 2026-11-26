# 조우 UI 공통 시스템 — 1차 명세

상태: 공통 명령 행 구현됨 / 브라우저 실기 검수 전

## 목적
모든 조우에서 FIGHT / ACT / ITEM / MERCY의 화면 위치, 선택 강조, 타이포그래피, 포인터 보조 입력을 공통 규칙으로 제공한다. 적의 개성과 스토리는 각 명령의 부제, 대사, 전투 배경, ACT 데이터, 공격 패턴에서 표현한다.

## 공통 4명령 행
공유 모듈: `src/ui/EncounterMenu.ts`

- 기본 4개 카드.
- 균일한 폭과 간격.
- 선택된 카드는 채도 높은 청록 배경과 낡은 금색 테두리.
- 선택되지 않은 카드는 짙은 청록 배경과 낮은 대비의 선.
- 제목은 serif 계열, 설명은 한국어 sans-serif 계열.
- 키보드 방향키 선택은 각 Scene의 입력 루프가 관리한다.
- 포인터 클릭은 동일한 선택/확정 콜백을 호출한다.
- 항목별 부제는 조우의 상황과 의미를 전달한다.

## 공통 모듈이 담당하지 않는 것
- 각 명령의 실제 게임 로직.
- ACT의 세부 항목과 반응.
- 아이템 효과.
- Mercy 조건.
- 적의 턴/공격 패턴.
- HP/상태 변경.
각 Scene은 자신의 정사 및 프로토타입 데이터를 통해 이를 관리한다.

## 현재 적용 범위
- BattleScene.
- BullyBattleScene.
- SecondRankEncounterScene.
- RegularEncounterScene.
- NerdstablookEncounterScene.

## 아직 공통화하지 않은 요소
ACT/ITEM 선택 목록, 적 대사 패널, 상태 정보, SOUL 회피 보드의 형식은 Scene별로 남아 있다. 다음 시각 리빌드에서 공통 선택 리스트와 대화 패널 규칙을 별도 검토한다.

## 디자인 원칙
- 동일한 역할의 명령은 같은 시각 언어를 사용한다.
- 각 적의 개성은 카드 형태를 매번 바꾸기보다 부제, 적 이미지, 표정, 대사, 회피 패턴에서 드러낸다.
- 선택 강조는 색상만이 아니라 테두리와 위치/커서로도 표현한다.
- 긴 한국어 라벨이 카드 경계를 넘지 않는지 실제 화면에서 검사한다.
- 960×540 기준의 첫 실험이다. 화면비를 확정하는 근거로 삼지 않는다.

## 테스트
- 다섯 Scene에서 카드의 중심 위치/폭/높이 일치 여부.
- 4개 항목이 작은 창에서도 구분되는지.
- 선택 인덱스와 강조 카드가 일치하는지.
- 포인터/키보드가 동일한 명령을 실행하는지.
- Mercy 비활성 설명과 클릭 결과가 서로 모순되지 않는지.
- Scene 전환/재진입 후 중복 카드가 남지 않는지.


## 구현 현황 — 2026-11-26
- 공통 4명령 카드 행을 `src/ui/EncounterMenu.ts`로 구현했다.
- 적용 Scene: BattleScene, BullyBattleScene, SecondRankEncounterScene, RegularEncounterScene, NerdstablookEncounterScene.
- TypeScript/Vite production build: GitHub Actions run 45829690229 PASS.
- 브라우저 화면 검수: NOT RUN.
