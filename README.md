# My Character

중앙 픽셀 캐릭터의 장비 자체가 인터페이스인 인프라 엔지니어 포트폴리오입니다. 초기 화면에는 캐릭터만 보이며, 착용하거나 들고 있는 창·갑옷·방패·장갑·망토·신발을 선택하면 분홍 장비 윤곽선과 connector가 먼저 나타나고 endpoint에 설명 말풍선이 열립니다.

## 구현

- Vite + React + TypeScript + plain CSS
- 400×600 transparent canvas의 neutral/inhale/peak/settle 4-frame idle
- CSS step animation으로 한 프레임만 표시; reduced-motion에서는 neutral 고정
- 데이터로 분리된 hitbox, item/bubble anchor, SVG outline, copy
- hover/focus preview와 click/tap pinning, Enter/Space, Escape, outside-close, focus restoration
- accessible region, `aria-expanded`, `aria-controls`, visible focus, close control
- desktop/portrait/landscape 반응형 말풍선과 paper/grid visual language

## 실행 및 검증

```bash
npm ci
npm run typecheck
npm test
npm run build
uv run --with pillow --with numpy --with opencv-python-headless python scripts/generate_board_layers.py --check
```

`npm run dev` 또는 `npm run preview`로 실행합니다. 개발 환경의 `?motionDebug=1`은 hotspot 경계를 표시합니다.

## Assets

`src/assets/character-board-v2.png`는 변경하지 않는 디자인 source/recovery입니다. `scripts/generate_board_layers.py`가 여기서 tight transparent runtime frames와 checker-background verification contact sheet/GIF를 결정론적으로 생성합니다. 기존 `src/assets/idle-frames/`, `scripts/generate_idle_frames.py`, `board-static.png` 등 복구 자료는 보존되지만 runtime에서 import되지 않습니다. 원격 `static-board-v2-20260816`, `five-frame-idle-v1-20260816`, `prototype-v0.1` tag도 변경하지 않습니다.
