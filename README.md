# My Character

하나의 캐릭터 장비 보드를 중심으로 인프라 기술을 탐색하는 인터랙티브 포트폴리오입니다. 보드에 그려진 창, 방패, 장갑, 신발 카드를 hover, 키보드 또는 tap으로 선택할 수 있습니다.

공개 주소: `https://moolmong.github.io/My_Character/` (이번 작업 결과의 배포 여부는 이 문서에서 보장하지 않습니다.)

## 현재 구현

- Vite, React, TypeScript, plain CSS
- 사용자가 제공한 1122×1402 RGB 합성 보드 `src/assets/character-board-v2.png`를 단일 정적 hero로 표시
- 보드에 이미 포함된 패널이나 문구를 별도 UI로 다시 그리지 않음
- 컨테이너 수호창, 구름 기사의 방패, 파이썬 손목보호대, 리눅스 여행 부츠 카드에 percentage hotspot 배치
- desktop hover, native keyboard Enter/Space, Escape, mobile tap, outside close
- 선택 설명은 보드를 가리지 않는 이미지 바깥의 작은 detail strip에 표시
- reduced-motion, visible focus, ARIA label/expanded/controls, 하단 semantic sections

브라우저 runtime은 보드 PNG 한 장만 로드합니다. 이전 다섯 idle frame을 순환하던 timer와 frame rendering은 제거했으며 보드 전체를 움직이거나 변형하지 않습니다.

## 로컬 실행과 검증

Node.js 22와 npm이 필요합니다.

```bash
npm ci
npm run dev
```

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

Vite production base는 `/My_Character/`입니다. 개발 서버에서 `?motionDebug=1`을 붙이면 기존 URL 호환을 유지하면서 현재 네 hotspot 경계를 확인할 수 있습니다. production build에서는 표시되지 않습니다.

## Asset과 좌표 편집

활성 artwork와 interaction/content data는 각각 `src/assets/character-board-v2.png`, `src/data/characterConfigs.ts`에 분리되어 있습니다. 보드는 자르지 않고 원본 비율 `1122 / 1402`와 `object-fit: contain`으로 렌더링합니다. `hitbox`는 보드 전체에 대한 0–100 percentage 좌표이며, baked equipment card 영역에 맞춥니다.

이전 원본 `character-portrait-a-cutout.png`, `character-portrait-b-cutout.png`, 생성된 `src/assets/idle-frames/` 다섯 장과 `scripts/generate_idle_frames.py`는 복구/참고용으로 보존합니다. 그 파일들은 runtime에서 import하거나 로드하지 않습니다. `src/assets/character-v0.png`, `character-v1.png`, `character-portrait-b.png`, `src/assets/prototype-v0.1/`, legacy `src/data/equipment.ts`도 복구 자료로 유지합니다. `prototype-v0.1` 및 원격 `five-frame-idle-v1-20260816` tag를 변경하지 않습니다.

## Prototype 한계

- About, Experience, Projects, Contact의 사이트 본문은 검증된 개인 정보가 들어오기 전까지 의도적인 placeholder입니다.
- 네 장비의 접근성 설명은 기존 프로젝트의 일반적인 기술 문구만 재사용하며 경력 성과를 주장하지 않습니다.
- 실제 기기, 브라우저 accessibility tree, 공개 Pages 상태는 별도 검증이 필요합니다.
