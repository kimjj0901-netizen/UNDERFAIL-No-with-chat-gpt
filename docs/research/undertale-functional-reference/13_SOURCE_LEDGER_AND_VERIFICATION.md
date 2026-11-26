# 13 — 출처 목록, 연구 기록, 검증 수준

## 1. 연구 범위와 질문

- Goal: Undertale의 실제 플레이 입력·전투·변수·UI·연출·이미지 문법을 확인해 UNDERFAIL의 독립적인 설계 기준을 만든다.
- Scope: Undertale의 게임 시스템 및 시각/서사 연출.
- Object: 플레이어가 실제로 체감하는 탐험, 전투, 대화, 상태 변화, 오프닝, 타이틀.
- Subject: 공개 개발자 발언, 공개 데모 GML, 커뮤니티 정리, 게임 화면 참조 이미지, 기존 UNDERFAIL 문서.
- Type: Exploratory. 먼저 시스템을 폭넓게 이해하고 이후 상세 구현 사양으로 좁힌다.

## 2. 출처 등급

| 등급 | 의미 | 이번 조사에서의 출처 |
|---|---|---|
| Rank 1 | 제작자/원본에서 나온 직접 자료 | Toby Fox 본인 명의 Game Developer 기고 |
| Rank 2 | 공식/권위 있는 기술·제품 자료 | UndertaleModTool의 공식 저장소 문서(도구 기능에 한정), 프로젝트 공식 문서 |
| Rank 3 | 원본에 가까운 직접 데이터 또는 직접 관찰 | Undertale Demo GML을 추출해 공개한 저장소(범위 제한), 이번 세션에서의 직접 게임 플레이는 미실시 |
| Rank 4 | 커뮤니티/리뷰/보조 분석 | Undertale Wiki, MobyGames 스크린샷, 리뷰 기사 |
| 제외/비사용 | 검증되지 않거나 출처 수준을 확인할 수 없는 내용 | teemo.dev의 일부 세부 입력 설명은 별도 교차검증 없이 확정 사실로 사용하지 않음 |

## 3. 주요 출처

### S1 — Toby Fox 개발자 기고

Game Developer, “Game Design Deep Dive: Undertale's action-based RPG battles”, 2015-10-30  
https://www.gamedeveloper.com/design/game-design-deep-dive-i-undertale-i-s-action-based-rpg-battles

확인한 내용:
- Toby Fox 본인이 전투 시스템의 설계 배경을 설명.
- 전투 엔진을 다른 게임 요소보다 먼저 만들었다는 진술.
- 전통적인 RPG 행동 반복을 피하기 위해 짧은 탄막 패턴을 구상.
- 여러 적의 공격을 결합해 조우에 고유성을 제공.
- ACT/SPARE는 메뉴로 단순하게 구성하고, 텍스트의 재미를 통해 보완.
- 조우 빈도 역시 중요한 설계 요소로 언급.

이 자료는 개발자의 설계 의도를 밝히는 1차 자료다. 모든 세부 구현 수치를 설명하지 않는다.

### S2 — Undertale Demo GML

BioTomateDE / UndertaleDemoCode  
https://github.com/BioTomateDE/UndertaleDemoCode

README는 Undertale Demo의 GML 소스가 추출되어 있다고 설명한다. 다만 GML 소스만 전체 자산 데이터 중 일부이고, 일부 Drag-and-Drop 호출은 GML로 재구성된 부분이라고 적혀 있다.

따라서:
- Demo의 해당 코드 범위만 참고한다.
- 정식판 전체 원본 코드로 간주하지 않는다.
- 저장소 폴더 구조는 게시자가 편의를 위해 재구성했다고 설명한다.
- 공개된 코드가 게임 전체 자산, 모든 방 생성 정보, 모든 타임라인을 포함한다고 주장하지 않는다.

### S3 — UndertaleModTool

UnderminersTeam / UndertaleModTool  
https://github.com/UnderminersTeam/UndertaleModTool

README는 Undertale 및 기타 GameMaker 게임을 편집/디컴파일/언팩하는 도구라고 설명한다. README에 적힌 기능은 게임 데이터 파일을 열어 내용을 조사하는 기술적 가능성을 나타내지만, 그 자체가 정식판의 모든 데이터를 이미 검증했다는 뜻은 아니다.

이 저장소의 자료는 도구의 기능과 한계를 설명하는 자료로 사용한다.

### S4 — Undertale Wiki: Stats

https://undertale.wiki/w/Stats

확인한 내용:
- HP, AT, DF의 기본 개념.
- EXP/LOVE의 의미.
- INV와 SPEED가 숨은 변수로 설명되는 부분.
- LV별 HP/AT/DF 표.
- 일부 Murder Level 관련 설명.

이 자료는 게임 커뮤니티의 2차 정리다. 내부 계산을 완전히 직접 계측한 결과라고 표현하지 않는다.

### S5 — Undertale Wiki: SOUL Modes

https://undertale.wiki/w/SOUL_Modes

확인한 내용:
- Red/Normal, Blue/Jump, Green/Shield, Purple/Trap, Yellow/Shooter.
- 각 모드의 이동/방어 규칙.
- Switch판 특정 전투의 Blue/Red 모드.
- Red 모드에서 Cancel/Shift 감속 설명.
- Purple 모드에서 해당 감속이 적용되지 않는다는 설명.

이 자료는 커뮤니티 2차 정리다.

### S6 — Undertale Wiki: Main Menu

https://undertale.wiki/w/Main_menu

확인한 내용:
- 시작 시 인트로 시퀀스 후 타이틀 화면.
- PC 타이틀 진행 입력 Z/Enter.
- Continue/Reset/Settings 메뉴.
- 진행에 따라 메인 메뉴 화면 인물 배치와 음악이 변하는 내용.

### S7 — Undertale Wiki: SAVE

https://undertale.wiki/w/SAVE

확인한 내용:
- 일반 SAVE 슬롯의 구조.
- SAVE Point와 자동 저장.
- HP 0 후 최신 저장 상태를 불러오는 설명.
- Reset과 True Reset의 차이.
- 일부 상태/인물 반응이 리셋 후에도 달라질 수 있다는 설명.

### S8 — Undertale Wiki: Settings

https://undertale.wiki/w/Settings

확인한 내용:
- 콘솔 버전의 버튼 재설정 관련 정보.
- Confirm, Cancel, Menu 입력을 분리해 설정한다는 내용.

PC 키보드 전체 매핑을 확정하는 출처로는 사용하지 않는다.

### S9 — Undertale Wiki: 파일/스크린샷 안내

https://undertale.wiki/w/Undertale_Wiki:Files

확인한 내용:
- 위키의 창 모드 화면/스크린샷 표현 기준으로 640×480을 사용한다는 안내.
- 픽셀 이미지 확대 시 nearest-neighbor 관련 권장.

이는 위키의 이미지 게시 기준이다. 프로젝트의 내부 논리 해상도를 무조건 640×480으로 설정하라는 공식 개발 사양은 아니다.

### S10 — 이미지 참조

MobyGames Undertale screenshot page  
https://www.mobygames.com/game/windows/undertale/screenshots/gameShotId,809589/

The Link Newspaper review  
https://thelinknewspaper.ca/article/undertale-over-achieves

The Connector review  
https://umlconnector.com/2015/09/indie-spotlight-undertale-game-review/

이 자료는 화면 구성 관찰에만 사용한다. 이미지의 저장소 내 재사용을 승인하지 않는다.

## 4. Findings Ledger

| ID | 주장 | 근거 | 등급 | 판정 |
|---|---|---|---|---|
| F1 | Undertale 전투 엔진은 개발 초기 다른 게임 요소보다 먼저 제작되었다. | S1 | Rank 1 | 지원됨 |
| F2 | 짧은 탄막 패턴과 복수 적 공격 조합이 전투 다양성에 사용되었다. | S1 | Rank 1 | 지원됨 |
| F3 | PC 타이틀 진행 입력으로 Z/Enter가 안내된다. | S6 | Rank 4 | 지원됨 |
| F4 | Red SOUL은 자유 이동하며 Cancel/Shift 감속 설명이 있다. | S5 | Rank 4 | 지원됨 |
| F5 | Blue/Green/Purple/Yellow 모드는 기본 이동/방어 규칙을 바꾼다. | S5 | Rank 4 | 지원됨 |
| F6 | INV는 피격 이후 무적 프레임을 다루는 숨은 변수다. | S4 | Rank 4 | 지원됨 |
| F7 | SPEED는 SOUL 이동 속도를 결정하는 숨은 변수다. | S4 | Rank 4 | 지원됨 |
| F8 | LV별 HP/AT/DF 공식과 표가 존재한다. | S4 | Rank 4 | 지원됨 — 2차 자료 범위 |
| F9 | SAVE/Reset/True Reset의 상태 보존 차이가 있다. | S7 | Rank 4 | 지원됨 — 2차 자료 범위 |
| F10 | 창 모드 640×480이 위키 스크린샷의 표준 크기다. | S9 | Rank 4 | 지원됨 — 위키 이미지 표준에 한정 |
| F11 | Undertale 정식판의 모든 원본 GML이 공개되어 있다. | S2/S3 | Rank 3 | 지원되지 않음 |
| F12 | PC 키보드의 Z/X/C 전체 매핑이 공식 문서에서 확인됐다. | S6/S8 | Rank 4 | 일부만 확인. X/C의 세부 역할은 미검증 |
| F13 | Undertale의 모든 방이 640×480 고정 논리 좌표를 사용한다. | S9 | Rank 4 | 확인되지 않음 |
| F14 | 모든 공격의 피해 계산 공식과 타이밍 배율을 정확히 복원했다. | S4 | Rank 4 | 확인되지 않음 |
| F15 | Undertale Demo GML은 정식판 전체 코드와 동일하다. | S2 | Rank 3 | 부정확. Demo 범위만 공개됨 |
| F16 | 직접 플레이를 통해 프레임별 입력/카메라/충돌을 측정했다. | 없음 | 없음 | 수행하지 않음 |

## 5. Scope Filter

- 원작 전체 코드가 공개되었다는 주장은 제외했다. 공개 Demo GML은 Demo 범위만 포함하고 전체 정식판 소스가 아니다.
- 640×480은 위키 스크린샷 기준으로 한정했다. 프로젝트 논리 해상도의 근거로 사용하지 않는다.
- 캐릭터 외형의 실루엣 설명은 아트 분석으로 한정했다. 공식 캐릭터 시트나 원본 스프라이트 규격으로 취급하지 않는다.
- teemo.dev의 입력·이동 세부 설명은 다른 원출처로 독립 확인하지 않았으므로 확정 사실 목록에서 제외/보류했다.
- 이전 답변에서 넣었던 일부 숨은 변수 약어 MDR은 정식 내부 변수명으로 확인하지 못해 제외했다.

## 6. Object Filter

연구 대상은 Undertale의 기능·연출이지만, 자료의 직접성과 버전 범위는 서로 다르다.

- Toby Fox 기고는 개발 의도를 직접 말하지만 전투 알고리즘 세부를 모두 공개하지 않는다.
- Demo GML은 원본에 가까운 코드지만 Demo 버전이라 정식판 기능 전체를 대표하지 않는다.
- Wiki는 상세한 값과 규칙을 정리하지만 공식 개발 사양서는 아니다.
- 스크린샷은 시각 구성을 보여주지만 카메라 알고리즘, hitbox, 프레임 타이밍을 증명하지 않는다.

## 7. 결론과 검증 한계

지원되는 결론:
- 전투는 게임의 중요한 설계 축이고, 짧은 패턴과 조우별 변화를 중시한다.
- 전투 입력과 SOUL의 이동 규칙은 구분된 시스템으로 분석할 수 있다.
- 여러 SOUL 모드가 플레이어의 이동/방어 규칙을 바꾼다.
- EXP/LV와 HP/AT/DF의 연결은 숫자 성장과 서사 의미를 결합한다.
- 오프닝/타이틀 메뉴는 진행 상태에 반응하는 프레젠테이션 시스템을 갖는다.
- SAVE/RESET은 기술 저장과 서사 의미가 연결되어 있다.

미해결:
- PC 키보드의 전체 키 매핑을 실제 빌드에서 확인해야 한다.
- 정식판의 모든 내부 함수명·변수명은 확인하지 못했다.
- 모든 전투 공격의 정확한 프레임·배율·충돌상자는 확인하지 못했다.
- 모든 방의 정확한 좌표계/카메라 수치를 확보하지 못했다.
- 모든 캐릭터의 실제 sprite sheet와 프레임을 수집하지 않았다.
- 직접 플레이, 브라우저 프레임 캡처, 사운드 청취는 수행하지 않았다.

## 8. 연구 자료 작성 상태

이 문서의 결론은 출처 검토를 통해 과장된 문장을 줄인 상태다. 이는 동일한 조사자가 수행한 내부 증거 감사이며, 독립 외부 검토를 수행했다고 주장하지 않는다.
