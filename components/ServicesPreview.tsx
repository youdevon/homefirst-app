import { services, servicesSection } from "@/content/services";

export default function ServicesPreview() {
  return (
    <section className="sec services-sec">
      <div className="wrap">
        <div className="svc-intro">
          <div>
            <span className="eyebrow">{servicesSection.eyebrow}</span>
            <h2 className="sec-title">
              {servicesSection.title}{" "}
              <em>{servicesSection.titleEmphasis}</em>
            </h2>
            <p className="sec-lead">{servicesSection.lead}</p>
          </div>

          <div className="svc-img">
            <img
              src={servicesSection.image.src}
              alt={servicesSection.image.alt}
            />
          </div>
        </div>

        <div className="svc-grid">
          {services.map((service) => (
            <article className="svc-item" key={service.title}>
              <div className="svc-ico">{service.icon}</div>
              <div>
                <h5>{service.title}</h5>
                <p>{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
