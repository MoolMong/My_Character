# My Character

장비를 탐색하며 인프라·클라우드 기술을 살펴보는 인터랙티브 포트폴리오 MVP입니다. 기존 여섯 장비 보드와 두 캐릭터 portrait를 선택할 수 있고, hover, 키보드, 또는 tap으로 설명을 열 수 있습니다.

예상 공개 주소: `https://moolmong.github.io/My_Character/` (Hermes의 배포 및 확인 전까지는 미배포 상태입니다.)

## Stack and features

- Vite, React, TypeScript, plain CSS
- 데이터 기반 percentage hitbox와 anchor
- 분리된 캐릭터, hotspot, SVG connection, tooltip 레이어
- desktop hover, keyboard Enter/Space/Escape, mobile tap/outside close
- `장비 설명 모두 보기` 버튼으로 여섯 설명을 별도의 반응형 목록에서 열고 닫기 (`aria-pressed` 상태 제공)
- 접근 가능한 화면 선택기로 기존 보드와 두 portrait 전환
- portrait 전용 transform 기반 6초 breathing motion (`prefers-reduced-motion`에서는 정지)
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

`src/assets/character-v1.png`는 1122×1402 기존 보드입니다. 두 1024×1536 runtime asset은 `src/assets/character-portrait-a.png`와 `character-portrait-b.png`입니다. 전달본은 `src/assets/prototype-v0.1/`에도 원본 이름 그대로 보존되며, 수정 전 Git 상태는 `prototype-v0.1` tag로 복구할 수 있습니다.

`src/assets/character-v0.png`도 이전 디자인 참고본으로 유지됩니다. 화면별 asset, 실제 이미지 크기, label, hotspot 목록은 `src/data/characterConfigs.ts`에서 설정합니다.

1. asset을 `src/assets/`에 추가합니다.
2. `src/data/characterConfigs.ts`에서 asset import와 config를 추가합니다.
3. 실제 PNG `width`와 `height`를 config에 기록합니다.
4. 같은 config의 percentage 좌표를 보정합니다.
5. hover, keyboard, mobile card와 연결선을 다시 확인합니다.

## Editing equipment coordinates

기존 보드의 여섯 좌표/설명은 `src/data/equipment.ts`에 있습니다. 두 portrait의 장갑·신발 좌표와 명확한 임시 문구는 `src/data/characterConfigs.ts`에 있습니다. 각 `hitbox`와 `anchor`는 선택된 이미지 전체를 기준으로 한 0–100 percentage 값이며 개발 환경과 테스트에서 범위를 검증합니다. 승인된 문구가 준비되면 `portraitCopy`만 교체하면 됩니다.

## TODO

- 실제 기기에서 portrait 장갑/신발 좌표를 필요에 따라 미세조정
- 검증된 경력, 프로젝트, 연락처와 링크 추가
- 실제 기기와 보조기술을 포함한 추가 사용성 점검
- content 확장 시 시각 회귀 및 브라우저 통합 테스트 보강

GitHub Actions는 `main` push 또는 수동 실행 시 공식 Pages actions로 `dist`를 배포하도록 준비되어 있습니다. 저장소 생성, push, Pages 활성화와 공개 URL 확인은 Hermes가 담당합니다.
