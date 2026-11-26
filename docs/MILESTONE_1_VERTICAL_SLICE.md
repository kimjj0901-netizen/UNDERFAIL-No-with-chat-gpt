> **2026-11-26 rebuild update:** story flow follows name entry → past school montage → closure document/photo/stamp → present placement notice and school rumor → flower field → abstract Bully tutorial → Domitoriell rescue → Welfare Class first room. Original SVG assets, character sprites, initial idle animations, rescue arc, synthesized low-volume Web Audio cues, and classroom collision/interaction layers are being integrated. The previous HEAD e4fcca7 Actions failure was a TS1005 quote syntax error in the Bully rescue text; corrected code is pending CI. Browser play remains NOT RUN and visual review REVIEW NEEDED.
>
> **Canon conflict held:** story index wording says 202X년 풍화양상 중학교 while workbook/canon wording says 풍화양상 고등학교; both remain visible as [미정/보류]. Do not silently normalize.
>
> **Original art status:** SVGs are first-pass independent assets authored for this project, not approved final character sheets. They still require real browser-size review and additional turn/side/back/expressive animation states.
>
> **2026-11-26 execution update:** The opening is now being rebuilt around the preserved story index rather than the former shortcut prototype. Implemented on this branch: name entry → chronological prologue montage → flower field → Bully tutorial encounter → abstract dodge/tutorial → Domitoriell rescue → Welfare Room entry. Browser play remains **NOT RUN** in the current tool environment; production build is also **NOT RUN** here because the execution environment cannot reach GitHub/npm. Do not treat this update as a completed visual QA pass.
>
> **주의 — 이전 구현 명세:** 이 문서는 첫 번째 프로토타입을 만들기 위해 작성된 범위 문서다. 2026-11-26 사용자 검토에서 스토리 순서, 오프닝, 맵·캐릭터·UI 디자인의 미숙함과 Undertale 기능 비교 부족이 지적되었다. 따라서 이 문서의 단순화된 시작 흐름을 새 정사나 최종 스토리 순서로 사용하지 않는다. 재설계 시에는 docs/story/UNDERFAIL_START_TO_CHAMBER_BATTLE_DIALOGUE_INDEX_v5.md와 docs/CHATGPT_STORY_DRIVEN_PRODUCTION_MASTER_PROMPT.md가 우선한다.

# Milestone 1 — 오프닝 및 교육복지반 Vertical Slice

> 상태: 초기 구현 반영 — 빌드 통과, 브라우저 검증 대기
>
> 정사 기준: `CREATIVE_DECISION_WORKBOOK.md`, `docs/CANON_BASELINE.md`
>
> 기술 기준: `docs/TECH_ARCHITECTURE.md`
>
> 미정인 창작 요소를 코드 편의만으로 정사화하지 않는다.

## 1. 목표

브라우저에서 새 게임을 시작한 뒤 주인공의 이름을 정하고, 교육복지실을 탐험하며, 도미토리엘과 대화하고, 첫 대립에서 비폭력 해결을 이뤄 다음 공간으로 나아가는 짧은 구간을 완성한다.

이것은 한 번 플레이할 수 있는 Vertical Slice다. 완성된 스토리 챕터나 최종 아트 제작이 목표는 아니다.

## 2. 플레이 흐름

```text
Boot
  → Title
  → Name Entry
  → Prologue Montage
  → Flower Field
  → Bully Tutorial / Abstract Dodge
  → Domitoriell Rescue
  → Education Welfare Class
  → Inspect / Talk
  → Domitoriell Encounter
  → ACT-based Peaceful Resolution
  → Exit Opens
  → Prototype End
```

## 3. 세부 요구사항

### 3.1 타이틀과 이름 입력

- 타이틀에 '언더페일'을 표시한다.
- 새 게임 시작 입력을 제공한다.
- 플레이어가 주인공 이름을 입력할 수 있다.
- 입력값을 공백 정리한 뒤 세션 상태에 저장한다.
- 입력이 비어 있을 경우 시작을 막거나 임시 기본값을 제시한다. 기본값은 최종 정사가 아닌 프로토타입 처리다.
- 이름 길이 제한은 UI가 깨지지 않는 범위에서 설정값으로 둔다.

### 3.2 도입부

- 교육복지실로 진입하는 짧은 도입 장면을 제공한다.
- 이 단계에서 학교의 전체 역사, 교장 계획, 불리의 배경을 설명하지 않는다.
- 정확한 대사는 아직 최종 승인되지 않았으므로 대사 데이터를 쉽게 바꿀 수 있게 작성한다.
- 개발용 임시 문구에는 주석 또는 데이터 메타데이터로 `PROTOTYPE` 표시를 한다.
- 기존 창작 원본 문장을 임의로 바꾸거나 새로운 과거 설정을 사실처럼 덧붙이지 않는다.

### 3.3 교육복지실 탐험

- 작은 방 1개를 구현한다.
- 플레이어가 방향키 또는 WASD로 움직인다.
- 벽과 가구 등 장애물에 막혀야 한다.
- 화면 밖으로 나가지 않아야 한다.
- 조사 대상 최소 2개와 도미토리엘 NPC를 배치한다.
- 조사 대상의 구체적 종류와 문구는 프로토타입용 제안으로 분리한다.
- 조사 가능한 대상 가까이에서 상호작용 키를 눌렀을 때 대화/조사 UI가 열린다.
- 대화 중에는 이동이 되지 않아야 한다.

### 3.4 대화 시스템

- 화자 표시, 본문, 다음 문장 진행, 선택지 이동/확정이 가능해야 한다.
- 한 번에 하나의 대화 패널만 열려야 한다.
- 선택지에 따라 적어도 서로 다른 두 반응을 확인할 수 있어야 한다.
- 도미토리엘은 따뜻하고 걱정하는 인물로 표현한다.
- 대화의 핵심 대립은 '주인공이 자기 진로를 선택하고 싶어 한다'와 '도미토리엘은 주인공이 위험한 길로 나가는 것을 걱정해 막는다'다.
- 실제 최종 대사는 사용자가 승인하기 전까지 확정하지 않는다.

### 3.5 도미토리엘 대립/전투

- 탐험 상태에서 도미토리엘과의 대립을 시작할 수 있다.
- 메뉴에는 공격 / 행동(ACT) / 아이템 / 자비가 표시된다.
- 공격과 아이템의 실제 콘텐츠가 비어 있다면 프로토타입에서 동작하지 않는 이유를 명확히 보여주되, 선택 시 화면이 멈추거나 오류가 나서는 안 된다.
- ACT에는 자신의 진로를 선택하고 싶다는 의지를 표현하는 선택을 둔다.
- 도미토리엘은 걱정과 보호 의도에 따른 반응을 보인다.
- 상대 턴에는 제한된 회피 영역 안에서 단순한 추상 탄막 패턴을 피할 수 있다.
- 탄막은 비그래픽적이고 읽기 쉬운 형태로 표시한다.
- 평화 해결은 공격 승리가 아니라 ACT 선택을 통해 진행된다.

### 3.6 평화 해결 조건

워크북의 확정 방향은 주인공이 자기 길을 가고 싶다는 의사를 일정 횟수 이상 반복하면 도미토리엘이 주인공을 보내주는 것이다.

다음은 구현 편의를 위한 기술 조건이지 정사가 아니다.

- 반복 횟수는 하나의 설정값으로 분리한다.
- 테스트용 임시 값은 `PROTOTYPE ONLY`라고 명시한다.
- 대사와 요구 횟수를 나중에 쉽게 변경할 수 있어야 한다.
- 특정 횟수, 정확한 문구, 추가 조건을 사용자 승인 없이 정사로 기록하지 않는다.

### 3.7 종료와 다음 공간

- 평화 해결 시 도미토리엘이 길을 열어주고 출구가 사용 가능해진다.
- 출구를 통과하면 이번 프로토타입의 끝 화면에 도달한다.
- 실제 다음 지역의 이름·구조·사건은 이번 단계에서 새로 확정하지 않는다.
- 전투/대화/탐험이 종료된 뒤에도 세션 중 주인공 이름과 완료 플래그가 유지되어야 한다.

## 4. 프로토타입 전용 처리

다음은 이번 테스트에 필요한 임시값이며 최종 정사가 아니다.

- 플레이어 이동 속도와 충돌 크기
- 방 크기, 가구 위치, 상호작용 거리
- 기본 HP와 회피 패턴의 속도
- ACT 반복 요구 횟수
- 이름 미입력 시 동작
- 임시 UI 문구와 도형 그래픽
- 전투에서 실패했을 때의 재시도 동작

HP 0 이후 세계관에서 어떤 일이 벌어지는지는 보류한다. 프로토타입에서는 전투 직전으로 재시도하는 단순 테스트 처리를 사용해도 되지만, 이를 공식 설정이나 최종 사망 규칙으로 기록하지 않는다.

## 5. 범위 밖

- 파프리카 보스전과 다른 교실
- 일반 적 전투 및 드롭 시스템
- 최종 장비/아이템 밸런스
- 복잡한 관계 수치 시스템
- 전체 저장/불러오기와 세계관상 리셋
- 불살 외의 전체 루트와 엔딩
- 몰살 모드
- 불리의 상세 서사
- 최종 캐릭터 일러스트, 타일셋, 음악, 효과음

## 6. 완료 기준

- [ ] 새 게임 시작과 이름 입력이 된다.
- [ ] 이름이 장면을 전환해도 유지된다.
- [ ] 교육복지실에서 캐릭터가 움직인다.
- [ ] 벽·가구 충돌이 작동한다.
- [ ] 조사 대상이 2개 이상 있고 각기 반응한다.
- [ ] 도미토리엘과 상호작용할 수 있다.
- [ ] 대화 중 이동이 잠긴다.
- [ ] 선택지에 따라 반응이 달라진다.
- [ ] 도미토리엘 대립으로 진입할 수 있다.
- [ ] 전투 메뉴와 턴 상태 전환이 작동한다.
- [ ] 회피 영역과 단순 패턴이 작동한다.
- [ ] ACT 선택 누적에 따라 평화 해결이 열린다.
- [ ] 해결 후 도미토리엘이 길을 열어준다.
- [ ] 출구를 통과하면 프로토타입 종료 지점에 도달한다.
- [ ] `npm run build` 성공.
- [ ] 브라우저에서 전체 흐름을 직접 플레이해 확인.

## 7. Copilot 작업 시 주의

- 먼저 현재 파일 구조와 코드를 읽고, 기존 설정과 충돌하는지 확인한다.
- 3~5개 핵심 문서만 컨텍스트로 사용한다.
- 사용자가 만든 캐릭터 디자인 이미지가 제공되기 전까지 최종 아트를 발명하지 않는다.
- 원작 Undertale의 대사·음악·이미지를 복제하지 않는다.
- 사용자 승인 없이 대사·세계관·루트의 보류 항목을 확정하지 않는다.
- 구현 후 빌드와 실제 브라우저 테스트 결과를 분리해 보고한다.


## 8. 2026-11-26 구현 반영 기록

### 코드에 반영된 기능

- 타이틀 화면과 새 게임 시작
- HTML 이름 입력창, 공백 정리, 빈 입력 거부
- 짧은 도입부
- 교육복지실 방 그래픽과 WASD / 방향키 이동
- 가구·벽 충돌 및 화면 경계 제한
- 책장·게시판·보온병 조사
- 도미토리엘 대화와 선택지
- FIGHT / ACT / ITEM / MERCY 기본 메뉴
- ACT를 통한 진로 선택 의지 누적과 자비 해결
- 제한된 영역에서 회피하는 임시 패턴
- 평화 해결 후 출입문 개방과 프로토타입 종료 화면
- 세션 상태를 통한 이름·아이템·조사·평화 해결 상태 유지

### 구현상 임시 처리

- 방 배치, 캐릭터 도형, UI, 대사, 이동 속도, HP, 회피 속도, ACT 요구 횟수는 PROTOTYPE이다.
- 임시 보온병 아이템은 전투에서 한 번 사용하는 회복 아이템이다.
- FIGHT는 이번 Slice에서 비살상 대립 행동으로 표현하며, 전투 승리를 위한 적 HP/처치 시스템은 구현하지 않았다.
- HP 0은 세계관상 결과를 정하지 않고 연습 패턴을 재시도하는 임시 처리다.
- 최종 캐릭터 아트, 애니메이션 스프라이트, 음악, 효과음은 아직 적용하지 않았다.

### 검증 상태

| 항목 | 상태 |
|---|---|
| GitHub 원격 파일·씬 연결 재확인 | PASS — 원격 파일 확인 |
| 구현 논리·입력 흐름 정적 검토 | PASS — 코드 검토 |
| GitHub Actions 푸시 빌드 | PASS — run 45716583686 |
| GitHub Actions PR 빌드 | PASS — run 45716592114 |
| npm run build | NOT RUN — 실행 환경에서 저장소 내려받기가 DNS 오류로 차단됨 |
| 브라우저 전체 플레이 | NOT RUN — 실제 브라우저 플레이 확인은 아직 안 됨 |

위 두 실행 테스트를 통과하기 전에는 Milestone 1을 완료 처리하지 않는다.


## 9. 2026-11-26 시각 구현 메모

- 타이틀·과거 학교·폐교 문서·현재 학교·꽃밭 장면을 독립 SVG 배경으로 사용한다.
- 플레이어·불리·도미토리엘·프로깃허브·전교 2등을 별도 SVG 스프라이트로 사용한다.
- 교육복지반 첫 방은 교실 배경과 NPC/오브젝트 스프라이트, 충돌영역을 분리한다.
- 캐릭터 유휴 애니메이션과 꽃잎 문양 회전은 첫 패스 제안 구현이다. 감정별 프레임 시트와 방향별 이동 프레임은 실제 검토 후 추가해야 한다.
- 스토리 색인 0~1.7의 원문은 보존 대상이다. 현재 코드가 이 구간을 전부 구현했다고 주장하지 않는다.
- 실제 화면 크기에서 한국어 폰트와 sprite readability를 검토하지 못했으므로 REVIEW NEEDED다.


## 10. 교육복지반 1.2 특수 조우

- 프로깃허브 메뉴 튜토리얼의 선택 완료 후 전교 2등이 등장한다.
- 전교 2등을 조사하면 SecondRankEncounterScene으로 이동한다.
- FIGHT: 도미토리엘이 막아선다. 전교 2등은 퇴장한다.
- ACT: 책/과목/인사에 관한 선택을 한다. 전교 2등은 퇴장한다.
- ITEM: 사용 가능한 아이템이 없다는 안내 후 메뉴로 복귀한다.
- MERCY: 공격 의사를 거두지만 전교 2등은 퇴장한다.
- 공통 후속: "전교 2등은 공부를 하러 갔다." → 교육복지반 재진입 → 도미토리엘 후속 대화.
- 이 이벤트는 사용자 확정 사건 결과를 지키되, 메뉴 문구·애니메이션·세부 ACT 문장은 [제안]이다.


## 11. 교육복지반 1.3~1.7 1차 확장

- 교육복지실에서 복도로 이동할 수 있다.
- 일반 조우 5종의 대화·ACT·개별 추상 패턴을 별도 데이터/Scene으로 분리했다.
- 프로깃허브 안내/취소/표시/숨은 개체의 기능을 서로 나눴다.
- 복도 바닥 스위치의 반복 시도/실패 힌트/성공 상태를 추가했다.
- 도미토리엘에게 전화할 수 있으며 진행 상황과 대기 시간에 따라 별도 대화가 나온다.
- 너드스타블룩의 만화 추천·ACT·부정 반응·가짜 피격/자신감 부족 서사를 별도 조우로 구현했다.
- 해결 후 통로 충돌이 해제되어 교육복지반으로 되돌아갈 수 있다.

새 캐릭터, ACT 문구, 복도 퍼즐 해답, 건너뛰기 임계값, 전투 패턴 속도 및 FIGHT 반응 단계는 [제안/PROTOTYPE]이다. HP 0·죽음·제압·SAVE/RESET·지역 처치 카운터는 이 구현에 포함하지 않았다. 세부 조건과 수동 QA는 docs/design/WELFARE_1_3_TO_1_7_EVENT_GRAPH.md에 정리한다.
