# My Character

하나의 캐릭터를 중심으로 인프라 기술을 탐색하는 인터랙티브 포트폴리오 프로토타입입니다. 캐릭터의 창, 방패, 장갑, 신발을 hover, 키보드 또는 tap으로 선택할 수 있습니다.

공개 주소: `https://moolmong.github.io/My_Character/` (이번 작업 결과의 배포 여부는 이 문서에서 보장하지 않습니다.)

## 현재 구현

- Vite, React, TypeScript, plain CSS
- 동일한 1024×1536 canvas와 발 기준선을 쓰는 PNG 5장 기반 단일 캐릭터 hero
- neutral → inhale → peak → exhale → settle 순서의 의도적으로 끊기는 픽셀 idle motion
- 창(Kubernetes/Container), 방패(AWS), 장갑(Python), 신발(Linux) percentage hotspot
- desktop hover, native keyboard Enter/Space, Escape, mobile tap, outside close
- 별도 tooltip 및 SVG connection layer, mobile viewport-safe bottom card
- reduced-motion, visible focus, ARIA label/expanded/controls, 하단 semantic sections
- A/B/장비 보드 selector 없음

runtime은 다섯 PNG를 한 scene에 두고 한 번에 정확히 한 장만 표시합니다. opacity transition이나 crossfade는 없으며 bounded timeout으로 각 frame의 hold 시간을 다르게 둡니다. 하체는 모든 frame에서 source A와 byte 단위로 같아 발과 바닥 접점이 움직이지 않습니다. `prefers-reduced-motion` 환경에서는 neutral frame만 표시합니다.

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

Vite production base는 `/My_Character/`입니다. 개발 서버에서 `?motionDebug=1`을 붙이면 현재 frame index/id, 고정 floor 선, 네 hotspot 경계를 확인할 수 있습니다. 이 표시는 production build에서는 활성화되지 않습니다.

## Asset과 좌표 편집

검증된 원본은 `src/assets/character-portrait-a-cutout.png`와 `character-portrait-b-cutout.png`이며 변경하지 않습니다. runtime frame은 `src/assets/idle-frames/`의 정확히 다섯 PNG이고 다음 명령으로 결정론적으로 다시 만듭니다(Pillow/Numpy는 browser dependency가 아닙니다).

```bash
uv run --with pillow --with numpy python scripts/generate_idle_frames.py
```

script는 두 원본의 RGBA canvas를 검증하고 A의 픽셀만 nearest-neighbor로 국소 재배치합니다. B는 승인된 pose 참고 자료로 baseline 차이를 검증하지만, 큰 전신 pose 차이 때문에 blend하지 않습니다. 상체 호흡, hair/ahoge, cape tip 범위만 움직이며 row 1050 이하를 원본과 byte 단위로 고정하고 모든 출력의 1345 floor row를 검사합니다. frame을 교체할 때는 1024×1536 RGBA, 동일 floor row, 다섯 파일/ID 순서를 유지하고 script의 locked-zone 검증을 통과시킨 뒤 hotspot을 확인해야 합니다. `hitbox`와 `anchor`는 portrait 전체에 대한 0–100 percentage 좌표입니다.

`src/assets/character-v0.png`, `character-v1.png`, `character-portrait-b.png`, `src/assets/prototype-v0.1/`, legacy `src/data/equipment.ts`는 삭제하거나 runtime 합성하지 않고 복구/참고용으로 유지합니다. `prototype-v0.1` tag도 그대로 보존합니다.

## Prototype 한계

- About, Experience, Projects, Contact는 검증된 개인 정보가 들어오기 전까지 의도적인 placeholder입니다.
- 네 장비 설명은 기존 프로젝트에 있던 일반적인 기술 문구만 재사용하며 경력 성과를 주장하지 않습니다.
- 실제 기기, 브라우저 accessibility tree, 공개 Pages 상태는 별도 검증이 필요합니다.
- 최종 asset이나 검증된 경력·연락처를 임의로 만들지 않습니다.
