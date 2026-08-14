import { CharacterStage } from "./components/CharacterStage";

const sections = [
  ["about", "About", "운영의 맥락을 이해하고, 반복을 더 나은 시스템으로 바꾸는 일을 지향합니다."],
  ["experience", "Experience", "검증된 경력과 역할은 다음 업데이트에서 차분히 정리할 예정입니다."],
  ["projects", "Projects", "문제, 선택, 결과를 중심으로 한 프로젝트 기록을 준비하고 있습니다."],
  ["contact", "Contact", "확인된 연락 방법을 곧 추가하겠습니다."],
];

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">장비 건너뛰기</a>
      <main>
        <section className="hero" aria-labelledby="page-title">
          <h1 id="page-title" className="visually-hidden">클라우드 인프라 엔지니어 포트폴리오</h1>
          <CharacterStage />
          <p className="instruction"><span className="desktop-instruction">장비에 마우스를 올리거나 Tab 키로 살펴보세요.</span><span className="touch-instruction">장비를 탭해 기술을 살펴보세요.</span></p>
          <a className="scroll-cue" href="#about">이야기 더 보기 <span aria-hidden="true">↓</span></a>
        </section>
        <div className="content-sections">
          {sections.map(([id, title, copy], index) => (
            <section id={id} className="content-section" aria-labelledby={`${id}-title`} key={id}>
              <p className="section-index" aria-hidden="true">0{index + 1}</p>
              <div><h2 id={`${id}-title`}>{title}</h2><p>{copy}</p></div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
