# My Character

하나의 캐릭터를 중심으로 인프라·클라우드 기술을 살펴보는 인터랙티브 포트폴리오 MVP입니다. 두 portrait는 서로 다른 캐릭터가 아니라 한 캐릭터의 idle 상태 두 프레임이며, 창·방패·장갑·신발을 hover, 키보드, 또는 tap으로 선택할 수 있습니다.

공개 주소: `https://moolmong.github.io/My_Character/`

## Stack and features

- Vite, React, TypeScript, plain CSS
- 하나의 데이터 기반 character config, 두 portrait frame, 공유 percentage hotspot map
- 분리된 캐릭터, hotspot, SVG connection, tooltip 레이어
- desktop hover, keyboard Enter/Space/Escape, mobile tap/outside close
- 두 이미지를 같은 fixed-bottom scene에 겹친 3.8초 CSS 호흡 모션과 연속 opacity crossfade
- frame별 `floorY`와 공유 scene `floorY`로 발 기준선을 명시하고, 캐릭터 전체 이동 없이 정렬
- 반응형 bottom card, reduced-motion 지원, GitHub Pages workflow
- Vitest + Testing Library 기반 핵심 상호작용 테스트

## Local development

Node.js 22와 npm이 필요합니다.

```bash
npm install
npm run dev
```

검증 및 production preview:

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

Vite의 production base는 `/My_Character/`입니다.

## Character assets and backup

원본 1024×1536 RGB 파일 `src/assets/character-portrait-a.png`와 `character-portrait-b.png`는 복구/참고용으로 보존됩니다. 메인 DOM은 투명 배경으로 전처리한 `character-portrait-a-cutout.png`와 `character-portrait-b-cutout.png`를 사용합니다. `src/assets/character-v1.png`의 기존 장비 보드와 `src/data/equipment.ts`의 여섯 장비 데이터도 legacy 자료로만 남으며 메인 UI에는 렌더링되지 않습니다. 전달본은 `src/assets/prototype-v0.1/`에도 보존됩니다. 기존 상태는 `prototype-v0.1` 및 `prototype-v0.2-pre-rework` tag로 복구할 수 있습니다.

### Rebuilding the cutouts

추가 패키지 없이 Python 3 표준 라이브러리만 사용하는 전처리 스크립트로 runtime asset을 재생성할 수 있습니다.

```bash
python3 scripts/remove_portrait_background.py src/assets/character-portrait-a.png src/assets/character-portrait-a-cutout.png --lightness 180 --chroma 55
python3 scripts/remove_portrait_background.py src/assets/character-portrait-b.png src/assets/character-portrait-b-cutout.png --lightness 180 --chroma 55
```

스크립트는 캔버스 가장자리와 연결된 밝고 채도가 낮은 픽셀만 flood-fill하여 alpha 0으로 바꿉니다. 따라서 검은 외곽선 안쪽의 흰 갑옷과 하이라이트는 단순 색상 키보다 잘 보존되지만, 자동 마스킹은 pixel-perfect를 보장하지 않습니다. 다른 원본에 적용할 때는 `--lightness`와 `--chroma`를 조절하고, 투명 모서리·외곽 halo·밝은 디테일·발 기준선을 어두운 배경에서 다시 육안 확인해야 합니다.

`src/assets/character-v0.png`도 이전 디자인 참고본으로 유지됩니다. 두 frame asset, 크기, frame별 발 기준선, 공유 창/방패/장갑/신발 hotspot은 `src/data/characterConfigs.ts`의 `characterConfig`에서 설정합니다.

1. 두 frame의 asset import와 `frames` 항목을 수정합니다.
2. 실제 PNG `width`와 `height`를 config에 기록합니다.
3. 각 이미지 발바닥 y 좌표를 frame `floorY`에, 표시 기준을 character `floorY`에 기록합니다.
4. 공유 `hotspots`의 percentage 좌표를 두 frame 모두에 맞게 보정합니다.
5. hover, keyboard, mobile card와 연결선을 다시 확인합니다.

## Editing equipment coordinates

기존 보드의 여섯 좌표/설명은 legacy 파일 `src/data/equipment.ts`에 있습니다. 메인 캐릭터의 창·방패·장갑·신발 좌표와 명확한 임시 문구는 `src/data/characterConfigs.ts`에 있습니다. 각 `hitbox`와 `anchor`는 portrait 전체를 기준으로 한 0–100 percentage 값이며 개발 환경과 테스트에서 범위를 검증합니다. 승인된 문구가 준비되면 같은 파일의 `portraitCopy`만 교체하면 됩니다.

## TODO

- 실제 기기에서 네 portrait 장비 좌표를 필요에 따라 미세조정
- 검증된 경력, 프로젝트, 연락처와 링크 추가
- 실제 기기와 보조기술을 포함한 추가 사용성 점검
- content 확장 시 시각 회귀 및 브라우저 통합 테스트 보강

GitHub Actions는 `main` push 또는 수동 실행 시 공식 Pages actions로 `dist`를 배포하도록 준비되어 있습니다. 저장소 생성, push, Pages 활성화와 공개 URL 확인은 Hermes가 담당합니다.
