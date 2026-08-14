# My Character

하나의 고정된 픽셀 캐릭터를 중심으로 인프라·클라우드 기술을 살펴보는 인터랙티브 포트폴리오 MVP입니다. 창·방패·장갑·신발을 hover, 키보드 또는 tap으로 선택할 수 있습니다.

공개 주소: `https://moolmong.github.io/My_Character/`

## Stack and features

- Vite, React, TypeScript, plain CSS
- 고정 visual master, 원본에서 추출한 투명 ahoge sprite와 ground/contact 레이어
- 데이터 기반 4개 hotspot과 편집 가능한 placeholder 설명
- desktop hover, keyboard Enter/Space/Escape, mobile tap/outside close
- 반응형 bottom card, reduced-motion 지원, GitHub Pages workflow
- Vitest + Testing Library 핵심 상호작용 및 렌더 구조 테스트

## Motion design and frame classification

`src/assets/character-frame-idle.png`만 **Base-safe** visual master로 렌더링합니다. 이 이미지의 위치와 크기는 idle 및 장비 반응 중 항상 동일하며 발 기준선은 캔버스의 `87.5%`입니다. 캐릭터 전체에 opacity 교차 전환, bobbing, scale 또는 translate animation을 적용하지 않습니다.

- `character-frame-idle.png`: Base-safe. 고정 master로 사용.
- `character-frame-breathe.png`: Reject. 머리/얼굴, 상체, 방패, 창, 망토와 실루엣이 달라 local breathing 또는 full-body frame으로 안전하지 않음.
- `character-frame-blink.png`: Reject. 눈뿐 아니라 머리 위치, 머리카락, 얼굴 비율, 장비, 팔, 발 위치까지 달라 face crop도 identity를 보존하지 못함.
- `character-portrait-a(-cutout).png`, `character-portrait-b(-cutout).png`, `character-v0.png`, `character-v1.png`: 기존 참고/복구 asset이며 runtime motion에서 제외.

요청에 언급된 별도 5-frame ZIP은 작업 시점의 저장소와 `src/assets` 어디에도 존재하지 않았습니다. 따라서 없는 frame을 생성하거나 추정하지 않았습니다. 현재 PNG들은 동일한 1024×1536 canvas이지만 reject frame은 translation/scale만으로 정규화할 수 없는 구조 변화가 있어 runtime normalization을 하지 않습니다.

자연스러운 idle은 master와 발을 움직이지 않습니다. runtime에서 full master는 정확히 한 번만 렌더링하며, clip된 master 사본은 사용하지 않습니다. 움직이는 유일한 캐릭터 레이어는 원본의 ahoge만 담은 92×112 투명 PNG입니다. 뿌리 부착점을 고정하고 `steps(1, end)`의 5개 정수 상태에서 ±5도 회전하므로 작은 화면에서도 움직임을 알아볼 수 있습니다. 상체·망토·창 레이어는 분리된 원본 asset이 없어 움직일 때 경계가 깨지므로 제거했습니다. face도 안전하게 분리할 수 있는 동일-identity 눈 frame이 없어 overlay를 생략하고 base 얼굴을 그대로 보존합니다. contact shadow는 발 기준선을 바꾸지 않으며, 장갑/신발 선택은 hotspot outline/glow, 신발은 ground ring으로 반응합니다. 장비 reaction 중 ahoge idle은 잠시 멈춥니다. Reduced motion에서는 ahoge overlay를 숨기고 shadow animation도 정지하지만 고정 master, hotspot과 설명은 유지됩니다.

### Generated local asset

`src/assets/character-hair-ahoge.png`는 `src/assets/character-frame-idle.png`의 `(x:456, y:166, width:92, height:112)` 영역에서 생성합니다. `scripts/extract-hair-overlay.mjs`가 crop 경계와 연결된 밝은 배경을 flood 제거하고, crown pixels가 따라오지 않도록 source outline을 따르는 ahoge mask를 적용합니다. 외부 image package는 필요하지 않습니다. 재생성 명령은 다음과 같습니다.

```bash
npm run assets:hair
```

### Motion debug

URL에 `?motionDebug=1`을 추가하면 production build에서도 명시적으로만 debug overlay가 나타납니다. sprite bounding box, floor baseline, 4개 hotspot bounds, 현재 idle/reaction state, layer 목록, master offset과 frame 이름을 확인할 수 있습니다. query가 없으면 debug DOM과 시각 표시가 생성되지 않습니다.

## Local development

Node.js 22와 npm이 필요합니다.

```bash
npm install
npm run dev
```

검증:

```bash
npm run typecheck
npm test
npm run build
```

Vite production base는 `/My_Character/`입니다.

## Editing content and coordinates

승인된 장비 문구가 준비되면 `src/data/characterConfigs.ts`의 `portraitCopy`만 교체합니다. `hitbox`와 `anchor`는 portrait 전체 기준 0–100 percentage 좌표입니다. 실제 기기에서 장갑/신발을 포함한 네 hotspot을 확인하고 필요할 때 1–2px 수준으로 조정하세요. `src/assets/prototype-v0.1/`과 legacy asset은 보존합니다.

GitHub Actions 배포와 commit/push는 Hermes가 담당합니다.
