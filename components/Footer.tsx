import {
  footerQuickLinks,
  footerServiceLinks,
  site,
} from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ft-grid">
        <div>
          <div className="ft-logo-row">
            <div className="ft-crest">{site.crest}</div>
            <div>
              <div className="ft-name">{site.name}</div>
              <div className="ft-min">{site.tagline}</div>
            </div>
          </div>
          <p className="ft-desc">{site.footerDescription}</p>
        </div>

        <div className="ft-col">
          <h6>Quick Links</h6>
          <ul>
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft-col">
          <h6>Services</h6>
          <ul>
            {footerServiceLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="ft-col">
          <h6>Contact</h6>
          <ul>
            <li>
              <a href={site.phone.href}>{site.phone.display}</a>
            </li>
            <li>
              <a href={site.email.href}>{site.email.display}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ft-btm">
        <p>{site.copyright}</p>
      </div>
    </footer>
  );
}
