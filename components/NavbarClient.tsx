"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks, navbarCta } from "@/content/site";
import type { PublicSiteSettings } from "@/lib/site-settings-data";

type NavbarClientProps = {
  settings: PublicSiteSettings;
};

export default function NavbarClient({ settings }: NavbarClientProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <div className="ubar">
        <div className="ubar-inner">
          <div className="ubar-left">
            <div className="ui">
              <span>☎</span>
              <a href={settings.phone.href}>{settings.phone.display}</a>
            </div>
            <div className="udiv"></div>
            <div className="ui">
              <span>✉</span>
              <a href={settings.email.href}>{settings.email.display}</a>
            </div>
            <div className="udiv"></div>
            <div className="ui">{settings.officeHours}</div>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={closeMenu}>
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
            <div>
              <span className="logo-div">{settings.name}</span>
              <span className="logo-min">{settings.tagline}</span>
            </div>
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <Link href="/application" className="nav-cta">
              {navbarCta.label}
            </Link>

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

        <div className={open ? "mobile-menu open" : "mobile-menu"}>
          <div className="mob-inner">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                className="mob-link"
                key={link.href}
                onClick={closeMenu}
              >
                <span>{link.label}</span>
                <span>›</span>
              </Link>
            ))}

            <Link href="/application" className="mob-cta" onClick={closeMenu}>
              {navbarCta.mobileLabel}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
