import Link from "next/link";
import { contactStripItems } from "@/content/home";

export default function ContactStrip() {
  return (
    <section className="con-strip">
      <div className="con-grid">
        {contactStripItems.map((item) => (
          <Link href={item.href} className="con-card" key={item.title}>
            <div className="con-ico">{item.icon}</div>
            <div>
              <h5>{item.title}</h5>
              <p>{item.main}</p>
              <small>{item.sub}</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
