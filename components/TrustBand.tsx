import { trustBandItems } from "@/content/home";

export default function TrustBand() {
  return (
    <section className="trust">
      <div className="trust-inner">
        {trustBandItems.map((item) => (
          <div className="tc" key={item.label}>
            <div className="tc-ico">{item.icon}</div>
            <div>
              <div className="tc-val">{item.value}</div>
              <div className="tc-lbl">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
