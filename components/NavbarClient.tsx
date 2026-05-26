"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import HeaderSocialLinks from "@/components/HeaderSocialLinks";
import { defaultSocialLinks, navLinks, navbarCta } from "@/content/site";
import type { PublicSiteSettings } from "@/lib/site-settings-data";

type NavbarClientProps = {
  settings: PublicSiteSettings;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavbarClient({ settings }: NavbarClientProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Placeholder links until all social URLs are configured in Site Settings.
  const socialLinks =
    settings.socialLinks.length > 0
      ? settings.socialLinks
      : defaultSocialLinks;

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-top-inner">
          <Link href="/" className="header-brand" onClick={closeMenu}>
            <div className={settings.logoUrl ? "crest has-logo" : "crest"}>
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt=""
                  className="brand-logo-img"
                />
              ) : (
                settings.crest
              )}
            </div>
            <div className="header-brand-text">
              <span className="logo-div">{settings.name}</span>
              <span className="logo-min header-brand-tagline">
                {settings.tagline}
              </span>
            </div>
          </Link>

          <div className="header-top-right">
            <div className="header-contact">
              <a href={settings.phone.href} className="header-contact-link">
                <span className="header-contact-icon" aria-hidden="true">
                  ☎
                </span>
                {settings.phone.display}
              </a>
              <span className="header-contact-divider" aria-hidden="true" />
              <a href={settings.email.href} className="header-contact-link">
                <span className="header-contact-icon" aria-hidden="true">
                  ✉
                </span>
                {settings.email.display}
              </a>
            </div>

            <div className="header-actions">
              <HeaderSocialLinks links={socialLinks} />
              <Link href="/application" className="header-cta">
                {navbarCta.label}
              </Link>
            </div>
          </div>

          <div className="header-mobile-actions">
            <Link href="/application" className="header-cta header-cta-mobile">
              {navbarCta.label}
            </Link>
          </div>

          <button
            type="button"
            className={open ? "hamburger open" : "hamburger"}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span className="ham-line"></span>
            <span className="ham-line"></span>
            <span className="ham-line"></span>
          </button>
        </div>
      </div>

      <nav className="header-nav" aria-label="Main navigation">
        <div className="header-nav-inner">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    isActivePath(pathname, link.href) ? "is-active" : undefined
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className={open ? "mobile-menu open" : "mobile-menu"}>
        <div className="mob-inner">
          <div className="mob-contact">
            <a href={settings.phone.href}>{settings.phone.display}</a>
            <a href={settings.email.href}>{settings.email.display}</a>
            <span>{settings.officeHours}</span>
          </div>

          {navLinks.map((link) => (
            <Link
              href={link.href}
              className={
                isActivePath(pathname, link.href)
                  ? "mob-link is-active"
                  : "mob-link"
              }
              key={link.href}
              onClick={closeMenu}
            >
              <span>{link.label}</span>
              <span>›</span>
            </Link>
          ))}

          <div className="mob-social">
            <HeaderSocialLinks links={socialLinks} />
          </div>

          <Link href="/application" className="mob-cta" onClick={closeMenu}>
            {navbarCta.mobileLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
