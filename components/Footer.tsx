import { footerQuickLinks, footerServiceLinks } from "@/content/site";
import type { PublicSiteSettings } from "@/lib/site-settings-data";

type FooterProps = {
  settings: PublicSiteSettings;
};

export default function Footer({ settings }: FooterProps) {
  const isFullLogo =
    settings.logoDisplayMode === "full-logo" && Boolean(settings.logoUrl);

  return (
    <footer className="footer">
      <div className="ft-grid">
        <div>
          <div
            className={
              isFullLogo ? "ft-logo-row ft-logo-row-full" : "ft-logo-row"
            }
          >
            {isFullLogo ? (
              <img
                src={settings.logoUrl!}
                alt={settings.name}
                className="footer-logo-full"
              />
            ) : (
              <>
                <div
                  className={settings.logoUrl ? "ft-crest has-logo" : "ft-crest"}
                >
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt=""
                      className="footer-logo-img"
                    />
                  ) : (
                    settings.crest
                  )}
                </div>
                <div>
                  <div className="ft-name">{settings.name}</div>
                  <div className="ft-min">{settings.tagline}</div>
                </div>
              </>
            )}
          </div>
          <p className="ft-desc">{settings.footerTagline}</p>
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
              <a href={settings.phone.href}>{settings.phone.display}</a>
            </li>
            <li>
              <a href={settings.email.href}>{settings.email.display}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ft-btm">
        <p>{settings.copyright}</p>
      </div>
    </footer>
  );
}
