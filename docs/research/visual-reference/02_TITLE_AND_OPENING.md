# 02 — 타이틀과 오프닝

## 1. 참조 화면
- MobyGames 타이틀 스크린샷: https://www.mobygames.com/game/74938/undertale/screenshots/windows/809576/
- MobyGames 오프닝 스크린샷: https://www.mobygames.com/game/74938/undertale/screenshots/windows/809577/
- IGF 이미지 참조: https://igf-entries.knnlab.com/2016/1000/nsuJln4PTWnVSibEdLd0_xscreen0_1000.jpg

![Undertale opening visual reference](https://igf-entries.knnlab.com/2016/1000/nsuJln4PTWnVSibEd0_xscreen0_1000.jpg)

위 이미지는 분석용 참조이며 UNDERFAIL 게임 자산이 아니다.

## 2. 관찰
- 오프닝 이미지는 한 장면에 집중하고, 텍스트를 읽을 수 있는 여백을 마련한다.
- 화면의 어두운 면적이 장면을 감싸고, 인물 실루엣과 문장이 중심이 된다.
- 타이틀은 시작 전 정체성을 전달하는 별도 공간이다.
- 원작의 인트로 뒤 타이틀 화면으로 이어지는 구조는 초기 플레이어에게 먼저 세계의 전제를 전달한 뒤 조작을 시작하게 한다.

## 3. UNDERFAIL과의 연결
[기초자료 확인] UNDERFAIL의 오프닝은 이름 입력 → 과거의 꿈을 지원하던 학교 → 폐교 확인서/도장 → 시간이 흐른 현재 학교와 배정 통지서 → 꽃밭과 불리 → 도미토리엘의 구출로 이어진다.

[기존 프로젝트 사실] 타이틀/오프닝 에셋은 960×540 SVG다. PrologueScene은 하단에 넓은 텍스트 패널을 두고, 배경 이미지를 바꾸며 장면 분위기를 조절한다.

## 4. 개선 제안
- [제안] 한 페이지에 한 가지 시각 정보만 강하게 보여 준다.
- [제안] 폐교 문서의 손·소매·도장만 보이는 제약을 유지한다.
- [제안] 각 오프닝 컷에서 텍스트 위치, 크기, 문장 길이를 통일한다.
- [제안] 장면에 맞지 않는 임시 제목이나 과도한 설명 UI를 제거한다.
- [제안] Confirm 입력은 Z/Enter/Space로 통일하되, 이름 입력 필드에서는 Z 키를 텍스트 입력으로 정상 전달한다.
- [제안] 타이틀 메뉴는 현재 “새로운 이야기를 시작한다” 단일 선택만 있으므로 가짜 메뉴 이동을 추가하지 않는다. 저장/설정이 실제 구현되면 그때 커서 구조를 확장한다.

## 5. 현재 코드 메모
TitleScene은 원래 Enter/Space/포인터 입력으로 시작했다. 이번 브랜치 변경은 Z를 공통 Confirm에 포함하고 화면 안내에 표시한다. PrologueScene은 공통 Confirm으로 페이지를 넘기고 포인터도 계속 허용한다.

## 6. 검증 필요
- 각 페이지 텍스트가 960×540에서 실제로 잘리지 않는지.
- 타이틀에서 Z/Enter/Space/클릭 각각 한 번씩만 진입하는지.
- 이름 입력에서 Z가 글자로 정상 입력되는지.
- 오프닝 페이지 전환 중 연타가 중복 전환을 일으키지 않는지.
