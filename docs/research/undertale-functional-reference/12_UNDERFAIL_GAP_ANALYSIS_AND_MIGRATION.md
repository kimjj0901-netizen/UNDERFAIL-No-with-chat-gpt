# 12 — 현재 UNDERFAIL과의 차이 및 단계적 적용 제안

## 1. 감사 범위

이번 비교는 main 브랜치의 저장소 메타데이터, 파일 트리, docs/CANON_BASELINE.md, docs/CHATGPT_STORY_DRIVEN_PRODUCTION_MASTER_PROMPT.md, docs/TECH_ARCHITECTURE.md, docs/design/OPENING_VISUAL_DIRECTION.md를 기준으로 한다.

이번 작업에서는 실제 브라우저를 실행하거나 모든 TypeScript 파일을 읽어 전수 코드를 감사하지 않았다. 따라서 코드의 모든 입력 이벤트가 어떻게 구현되어 있는지에 관한 결론은 내리지 않는다.

## 2. 현재 프로젝트에서 확인된 기준

[기존 프로젝트 사실]

- 기술 스택은 Phaser 4.2.1 + TypeScript + Vite다.
- 기술 문서가 기록한 논리 해상도는 960×540.
- 스케일은 Phaser.Scale.FIT, 중앙 정렬이다.
- 기술 문서의 탐험 기본 이동 입력은 방향키/WASD.
- 확인/상호작용 입력은 Enter/Space.
- 메뉴/선택지 이동은 방향키.
- Escape는 취소 또는 메뉴 닫기 제안.
- 조사 대상 상호작용은 E.
- 전투 메뉴는 공격/행동/아이템/자비.
- 전투 적 턴에는 제한된 전투 영역과 회피 대상을 표시하는 구조를 지향한다.
- 대화 중 주인공 이동을 잠그는 원칙이 문서에 있다.
- Scene 트리에 TitleScene, NameEntryScene, PrologueScene, FlowerFieldScene, BullyBattleScene, RoomScene, WelfareCorridorScene, RegularEncounterScene, NerdstablookEncounterScene 등이 있다.
- 콘텐츠 자료 파일 및 GameSession이 있다.

기준 문서:
- https://github.com/kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt/blob/main/docs/TECH_ARCHITECTURE.md
- https://github.com/kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt/blob/main/docs/CHATGPT_STORY_DRIVEN_PRODUCTION_MASTER_PROMPT.md
- https://github.com/kimjj0901-netizen/UNDERFAIL-No-with-chat-gpt/blob/main/docs/CANON_BASELINE.md

## 3. Undertale 연구와의 핵심 차이

| 항목 | Undertale 분석에서 참고할 구조 | 현재 UNDERFAIL 문서 기준 | 차이 및 판단 |
|---|---|---|---|
| 입력 언어 | Confirm/Cancel/방향 조작의 일관성 | 방향키/WASD, Enter/Space, Escape, E | 키 집합이 넓고 화면별 조작이 분산될 수 있다. |
| 논리 화면 | 창 모드 640×480 기준의 4:3 참조가 존재 | 960×540의 16:9 | 해상도 변경은 화면 전체 재설계가 필요하다. |
| 탐험 구조 | 작은 방 단위 진행 | RoomScene/WelfareCorridorScene 등 별도 씬 | 방의 데이터 경계와 Scene 경계가 같은 개념인지 확인 필요. |
| 대화 | 텍스트와 Confirm 진행이 플레이 리듬에 연결 | 대화 키보드 진행/선택은 문서상 제안 | 입력과 페이지 진행을 실제로 통합할 필요. |
| 전투 | 명령 선택, 행동 결과, 적 패턴, SOUL 회피가 순환 | 4개 명령과 단순 추상 패턴 중심의 첫 구현 | 공통 상태머신과 패턴 제어를 점차 강화할 수 있다. |
| ACT | 적마다 다르고 상태/대사/해결 조건과 연결 | ACT 콘텐츠 데이터와 전용 Scene 일부 존재 | 효과와 상태 변화의 공통 규격이 필요. |
| 애니메이션 | 작은 기본 포즈와 중요한 순간의 변화 | 첫 SVG 자산과 일부 트윈 | 픽셀/저프레임 방향과 비교 검수가 필요. |
| 타이틀 | 진행 상태에 따른 메뉴 변화 | 별도의 TitleScene / NameEntryScene | 세계 상태에 따라 바뀌는 메뉴는 향후 설계 가능. |
| 저장 | SAVE/RESET의 서사적 의미가 강함 | 저장·재시작의 세계관 의미 보류 | 기술 저장과 서사 기억을 분리해야 한다. |

## 4. 즉시 바꿔야 한다고 단정하지 않을 것

이전 답변은 640×480, Arrow/Z/X/C, Room camera, Soul Controller 등을 한꺼번에 P0로 제안했다. 이는 기획 후보로는 의미가 있지만 아직 실제 프로젝트를 바꾸는 확정 지시가 아니다.

특히:
- 960×540을 640×480으로 교체하면 현재 화면과 모든 자산 배치를 재작업해야 할 수 있다.
- E와 Space를 제거하면 기존 콘텐츠의 조사·상호작용이 깨질 수 있다.
- 모든 키를 Undertale과 동일한 고정값으로 묶으면 웹/키보드/접근성 고려가 빠질 수 있다.
- 완전히 새로운 전투 엔진을 한 번에 작성하면 현재 1.3~1.7 콘텐츠가 작동하지 않을 수 있다.

따라서 먼저 Input Layer와 작은 플레이 구간을 리빌드해 검증한 다음 확장하는 편이 안전하다.

## 5. 입력 시스템 재설계 제안

[UNDERFAIL 제안]

~~~text
InputManager
  ├─ keyboard bindings
  ├─ action events
  ├─ active context
  ├─ just pressed / held / released
  ├─ input lock
  └─ duplicate binding guard
       ↓
TITLE / OVERWORLD / DIALOGUE / BATTLE / SOUL
~~~

현재의 키를 곧바로 삭제하지 않고, 다음 키 맵을 시험한다.

- CONFIRM: Z + Enter (+ 기존 Space는 선택 유지 여부 검토)
- CANCEL: X + Shift
- MENU: C (+ Ctrl은 브라우저 충돌/접근성 검토)
- MOVE: 방향키 + WASD 보조
- INTERACT: CONFIRM 또는 E 중 하나를 주 입력으로 정하고 나머지는 별칭/별도 액션으로 결정

이는 UNDERFAIL의 후보 매핑이다. Undertale 원작의 전체 키 명세라고 선언하지 않는다.

## 6. 해상도/화면 재설계 실험

기존 960×540를 바로 바꾸지 않는다.

1. 현재 960×540에서 전투/방/텍스트 화면을 캡처한다.
2. 동일 장면을 4:3 실험 뷰포트에 배치한다.
3. 두 화면에서 주인공 크기, 텍스트 줄 수, 공격 영역, 메뉴 너비, 작은 창에서의 가독성을 비교한다.
4. 실제 브라우저 창 크기 여러 개에서 검사한다.
5. 사용자가 최종 비율을 결정한다.

## 7. Dialogue Controller

대화는 단순 문자열 출력이 아니라 상태를 가진다.

필요한 역할:
- 대화 페이지를 한 장씩 관리.
- 글자 출력/페이지 완성/다음 페이지 대기 분리.
- 선택지가 있으면 방향키 커서 제공.
- Confirm 동작 중복 방지.
- 대화 중 탐험 이동 잠금.
- 대화 종료 시 입력 잠금 해제.
- 스토리 플래그에 따른 다른 대사 경로 지원.

## 8. Battle Controller

현재 구현을 전부 제거하기보다 기존 EncounterScene/콘텐츠 데이터를 새 공통 엔진에 점차 연결하는 방식이 적합하다.

~~~text
EncounterController
  ├─ PlayerTurn
  │   ├─ FIGHT
  │   ├─ ACT
  │   ├─ ITEM
  │   └─ MERCY
  ├─ ResolveAction
  ├─ DialogueResolution
  ├─ EnemyTurn
  │   ├─ ConfigureSoul
  │   ├─ ConfigureArena
  │   ├─ RunPattern
  │   └─ ResolveHits
  └─ ReturnToPlayerTurn / EndEncounter
~~~

## 9. 우선순위

### P0 — 조작과 공통 흐름 조사/프로토타입
- 모든 화면의 현재 키 바인딩을 실제 코드에서 전수 확인.
- Confirm/Cancel/Move 입력 추상화 초안.
- 대화 중/전투 중/전환 중 입력 잠금 검증.
- 키보드 커서 메뉴 통일.
- 원작 PC판 입력 동작을 실제 플레이로 재검증.

### P1 — 탐험과 대화
- Room 데이터와 Scene 경계 확인.
- 방 이동/충돌/조사 통합.
- 대화 페이지 진행/선택지 상태 제어.
- 해상도 비교 실험.

### P2 — 전투 핵심
- 전투 상태머신 정리.
- ACT 효과와 적별 반응 데이터화.
- FIGHT 타이밍 시스템.
- Soul Controller와 Arena.
- 피해·무적 시간 중앙 처리.

### P3 — 장기 연출
- 적별 SOUL 규칙을 사용할지 결정.
- 진행 상태에 따른 타이틀 변화.
- 캐릭터 표정/포즈 시트.
- 음악/효과음/정적의 타이밍.
- Save/Reset의 서사적 의미 결정.

## 10. 기존 구현을 보존하는 마이그레이션 규칙

- CREATIVE_DECISION_WORKBOOK.md는 덮어쓰지 않는다.
- 스토리 색인 0~1.7 원문을 수정하지 않는다.
- 도미토리엘·주인공·교장 등 사용자 확정 설정을 시스템 편의로 바꾸지 않는다.
- HP 0, 사망/제압, SAVE/RESET, 루트 카운터를 임의 확정하지 않는다.
- 현재 Scene을 삭제하기 전에 각 Scene의 데이터·플래그·연결을 확인한다.
- 교체 전/후 작동을 비교하는 최소 플레이 구간을 유지한다.
- 모든 임시 수치는 [제안] 또는 [프로토타입]으로 표시한다.
- 브라우저 직접 플레이와 시각 검수를 수행하지 않은 상태에서 “완료”라고 보고하지 않는다.

## 11. 승인 필요

이 문서의 재설계 방향은 모두 [UNDERFAIL 제안]이다. 사용자의 승인 전에는 코드 수정, 해상도 변경, 키 바인딩 변경, 전투 상태머신 교체를 실행하지 않는다.
