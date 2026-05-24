import { applicationSteps, applicationStepsSection } from "@/content/home";

export default function ApplicationSteps() {
  return (
    <section className="sec steps-sec">
      <div className="wrap">
        <div className="center-head">
          <span className="eyebrow">{applicationStepsSection.eyebrow}</span>
          <h2 className="sec-title">
            {applicationStepsSection.title}{" "}
            <em>{applicationStepsSection.titleEmphasis}</em>
          </h2>
        </div>

        <div className="steps-grid">
          {applicationSteps.map((step, index) => (
            <article className="step" key={step.number}>
              <div className="s-num">{step.number}</div>
              <div className="s-ico">{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
              {index !== applicationSteps.length - 1 && (
                <div className="s-arr">→</div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
