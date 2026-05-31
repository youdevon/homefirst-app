export const site = {
  name: "Division of Urban Buildings",
  tagline: "Housing, Community & Social Development",
  crest: "⌂",
  phone: {
    display: "+1 (868) 612-3456",
    href: "tel:+18686123456",
  },
  email: {
    display: "info@homefirst.gov.tt",
    href: "mailto:info@homefirst.gov.tt",
  },
  officeHours: "Mon–Fri: 8:00am – 4:00pm",
  copyright: "© 2026 HomeFirst Division. All rights reserved.",
  footerTagline:
    "Delivering safe, dignified, community-centred housing support for citizens and families.",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Housing Schemes", href: "/schemes" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const navbarCta = {
  label: "Start Application",
  mobileLabel: "Start Housing Application →",
};

export type SocialNetwork = "facebook" | "instagram" | "youtube" | "linkedin";

export type SocialLink = {
  network: SocialNetwork;
  label: string;
  href: string;
};

/** Placeholder URLs until social links are managed in Site Settings. */
export const defaultSocialLinks: SocialLink[] = [
  { network: "facebook", label: "Facebook", href: "#" },
  { network: "instagram", label: "Instagram", href: "#" },
  { network: "youtube", label: "YouTube", href: "#" },
  { network: "linkedin", label: "LinkedIn", href: "#" },
];

export const footerQuickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Housing Schemes", href: "/schemes" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Apply", href: "/application" },
];

export const footerServiceLinks = [
  { label: "Family Housing", href: "/schemes" },
  { label: "Senior Living", href: "/schemes" },
  { label: "Emergency Housing", href: "/schemes" },
];
