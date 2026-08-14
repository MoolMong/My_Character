# My_Character Goal Spec

## Goal
완성도 높은 인터랙티브 픽셀 캐릭터 포트폴리오. 캐릭터 자체가 메인 인터페이스처럼 느껴지고, 방문자가 캐릭터 장비를 탐색해 인프라 엔지니어 포트폴리오 맥락을 이해할 수 있어야 한다.

## MUST acceptance criteria
- 단일 캐릭터 중심 Hero; Character A/B/Equipment Board 선택 UI 없음
- 장갑·신발·창·방패 hotspot click/tap/keyboard 동작 및 설명 표시
- 캐릭터 이미지가 깨지거나 ghosting/double-edge 없이 정상 표시
- 발/바닥 접점 고정; 전체 캐릭터 bobbing 금지
- desktop, mobile portrait, mobile landscape에서 overflow 없음
- reduced-motion에서 motion 정지, interaction 접근성 유지
- `npm run typecheck`, `npm test`, `npm run build` PASS
- 실제 preview/browser에서 console 치명 오류 없음
- GitHub Pages 최신 commit 반영 및 HTTP 200
- 기존 `prototype-v0.1` 복구 tag 보존

## SHOULD quality criteria
- 캐릭터 원본 identity/픽셀 선명도 유지
- hover/focus/tap feedback이 과하지 않음
- 설명 panel이 캐릭터를 과도하게 가리지 않음
- 시각적 motion은 자연스럽고, 불안정한 asset이면 정적 master를 우선
- debug mode는 `?motionDebug=1`에서만 노출

## Forbidden
- 비밀/개인정보 커밋
- force push, PR merge, 기존 backup 삭제
- 검증되지 않은 새 캐릭터/asset 생성
- MUST 실패 상태 배포

## Verification
- Fresh Codex verifier가 현재 렌더링·코드·test/build 결과를 별도 평가
- FAIL 시 defect-only repair, 최대 9 rounds
- 동일 결함 반복 또는 새 사용자 asset/판단 필요 시 NEEDS_MASTER_DECISION
- 각 round candidate와 점수를 기록하고 최고 candidate를 보존
