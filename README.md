# My Character

하나의 캐릭터를 중심으로 인프라 기술을 탐색하는 인터랙티브 포트폴리오 프로토타입입니다. 캐릭터의 창, 방패, 장갑, 신발을 hover, 키보드 또는 tap으로 선택할 수 있습니다.

공개 주소: `https://moolmong.github.io/My_Character/` (이번 작업 결과의 배포 여부는 이 문서에서 보장하지 않습니다.)

## 현재 구현

- Vite, React, TypeScript, plain CSS
- 1024×1536 portrait A 한 장을 고정 렌더링하는 단일 캐릭터 hero
- 창(Kubernetes/Container), 방패(AWS), 장갑(Python), 신발(Linux) percentage hotspot
- desktop hover, native keyboard Enter/Space, Escape, mobile tap, outside close
- 별도 tooltip 및 SVG connection layer, mobile viewport-safe bottom card
- reduced-motion, visible focus, ARIA label/expanded/controls, 하단 semantic sections
- A/B/장비 보드 selector 없음

전체 portrait frame 교차 전환은 픽셀 가장자리 ghosting과 발 기준선 이동을 피하기 위해 사용하지 않습니다. `character-portrait-b.png`와 기존 장비 보드/데이터는 보존된 참고 자료이며 runtime에는 portrait A만 표시됩니다. 캐릭터 자체의 bobbing도 없습니다.

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

Vite production base는 `/My_Character/`입니다. 개발 서버에서 `?motionDebug=1`을 붙이면 현재 static master와 네 hotspot 경계를 확인할 수 있습니다. 이 표시는 production build에서는 활성화되지 않습니다.

## Asset과 좌표 편집

runtime asset과 hotspot 정의는 각각 `src/assets/character-portrait-a.png`, `src/data/characterConfigs.ts`에 있습니다. `hitbox`와 `anchor`는 portrait 전체에 대한 0–100 percentage 좌표입니다. 이미지를 교체할 때 실제 비율, 발바닥 `floorY`, 네 장비 영역을 함께 다시 측정하고 desktop/mobile에서 확인해야 합니다.

`src/assets/character-v0.png`, `character-v1.png`, `character-portrait-b.png`, `src/assets/prototype-v0.1/`, legacy `src/data/equipment.ts`는 삭제하거나 runtime 합성하지 않고 복구/참고용으로 유지합니다. `prototype-v0.1` tag도 그대로 보존합니다.

## Prototype 한계

- About, Experience, Projects, Contact는 검증된 개인 정보가 들어오기 전까지 의도적인 placeholder입니다.
- 네 장비 설명은 기존 프로젝트에 있던 일반적인 기술 문구만 재사용하며 경력 성과를 주장하지 않습니다.
- 실제 기기, 브라우저 accessibility tree, 공개 Pages 상태는 별도 검증이 필요합니다.
- 최종 asset이나 검증된 경력·연락처를 임의로 만들지 않습니다.
