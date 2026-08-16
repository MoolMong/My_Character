# My_Character Goal Spec

## Goal
완성도 높은 인터랙티브 픽셀 캐릭터 포트폴리오. 캐릭터 자체가 메인 인터페이스처럼 느껴지고, 방문자가 캐릭터 장비를 탐색해 인프라 엔지니어 포트폴리오 맥락을 이해할 수 있어야 한다.

## MUST acceptance criteria
- 단일 캐릭터 중심 Hero; Character A/B/Equipment Board 선택 UI 없음
- 초기 화면에는 깨끗한 paper/grid 배경 위 중앙 캐릭터만 표시; 원본 보드의 baked panel/문구/설명 DOM/connector/outline 없음
- 장갑·창·갑옷·신발·망토·방패의 착용/소지 위치 hotspot이 hover/focus/click/tap/keyboard로 동작
- 활성 장비에 분홍 silhouette outline, 장비에서 시작하는 분홍 connector, endpoint에 pop-in speech bubble 순서로 표시
- bubble은 제목·기술·설명·닫기와 접근 가능한 region semantics 제공
- hover preview와 click/tap pinning, Enter/Space, Escape, outside-close, focus restoration 유지
- tight transparent 4-frame idle; 동일 canvas/baseline, 발 고정, upper body/hair/cape만 integer 이동, 동시에 한 frame만 표시
- 캐릭터 이미지가 깨지거나 ghosting/double-edge 없이 정상 표시
- 발/바닥 접점 고정; 전체 캐릭터 bobbing 금지
- desktop, mobile portrait, mobile landscape에서 overflow 없음
- reduced-motion에서 motion 정지, interaction 접근성 유지
- 390×844 portrait에서는 bubble을 캐릭터 아래/근처, 844×390 landscape와 desktop에서는 장비를 가리지 않는 좌/우에 표시
- `npm run typecheck`, `npm test`, `npm run build` PASS
- 실제 preview/browser에서 console 치명 오류 없음
- 배포를 요청받은 경우에만 GitHub Pages 최신 commit 반영 및 HTTP 200 확인
- 기존 `prototype-v0.1` 복구 tag 보존

## SHOULD quality criteria
- 원본 `src/assets/character-board-v2.png` 및 recovery assets/tags 변경 없이 보존
- hover/focus/tap feedback이 과하지 않음
- 설명 panel이 캐릭터를 과도하게 가리지 않음
- 시각적 motion은 자연스럽고, 불안정한 asset이면 정적 master를 우선
- debug mode는 `?motionDebug=1`에서만 노출

## Forbidden
- 비밀/개인정보 커밋
- force push, PR merge, 기존 backup 삭제
- 검증되지 않은 새 캐릭터/asset 생성
- runtime/dist에서 full board와 기존 five-frame asset 사용
- MUST 실패 상태 배포

## Verification
- Fresh Codex verifier가 현재 렌더링·코드·test/build 결과를 별도 평가
- FAIL 시 defect-only repair, 최대 9 rounds
- 동일 결함 반복 또는 새 사용자 asset/판단 필요 시 NEEDS_MASTER_DECISION
- 각 round candidate와 점수를 기록하고 최고 candidate를 보존
