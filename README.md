# My Character

장비를 탐색하며 인프라·클라우드 기술을 살펴보는 인터랙티브 포트폴리오 MVP입니다. 픽셀 아트 포트폴리오 보드의 여섯 장비를 hover, 키보드, 또는 tap으로 열 수 있습니다.

예상 공개 주소: `https://moolmong.github.io/My_Character/` (Hermes의 배포 및 확인 전까지는 미배포 상태입니다.)

## Stack and features

- Vite, React, TypeScript, plain CSS
- 데이터 기반 percentage hitbox와 anchor
- 분리된 캐릭터, hotspot, SVG connection, tooltip 레이어
- desktop hover, keyboard Enter/Space/Escape, mobile tap/outside close
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

## Character asset replacement

`src/assets/character-v1.png`가 현재 hero에 표시되는 1122×1402 픽셀 아트 포트폴리오 보드입니다. `CharacterVisual`은 이 파일을 import하는 장식 전용 renderer이고, 장비 데이터·투명 버튼·연결선·tooltip은 별도 레이어로 유지됩니다. 이미지 안의 문구와 별개로 여섯 버튼과 설명 카드가 같은 정보를 접근 가능하게 제공합니다.

`src/assets/character-v0.png`는 이전 디자인 참고본으로 원본 그대로 보존합니다. 이후 새 asset으로 교체할 때는:

1. asset을 `src/assets/`에 추가합니다.
2. `CharacterVisual`의 asset import만 새 파일로 바꿉니다.
3. 새 그림의 비율에 맞춰 `.stage-shell`의 `aspect-ratio`를 조정합니다.
4. `src/data/equipment.ts`의 좌표를 보정합니다.
5. hover, keyboard, mobile card와 연결선을 다시 확인합니다.

## Editing equipment coordinates

각 `hitbox`와 `anchor`는 `CharacterStage` 전체를 기준으로 한 0–100 percentage 값입니다. `hitbox`는 버튼의 `x`, `y`, `width`, `height`이고 `anchor`는 연결선 시작점입니다. 설명 카드의 기본 방향은 `tooltipSide`로 정합니다. 좌표는 asset 픽셀이나 SVG에 내장되어 있지 않으며 개발 환경에서 범위를 검증합니다.

## TODO

- 필요 시 hero art를 교체하고 여섯 좌표 재보정
- 검증된 경력, 프로젝트, 연락처와 링크 추가
- 실제 기기와 보조기술을 포함한 추가 사용성 점검
- content 확장 시 시각 회귀 및 브라우저 통합 테스트 보강

GitHub Actions는 `main` push 또는 수동 실행 시 공식 Pages actions로 `dist`를 배포하도록 준비되어 있습니다. 저장소 생성, push, Pages 활성화와 공개 URL 확인은 Hermes가 담당합니다.
