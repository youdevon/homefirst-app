import type { SocialLink } from "@/content/site";

type HeaderSocialLinksProps = {
  links: SocialLink[];
};

function SocialIcon({ network }: { network: SocialLink["network"] }) {
  switch (network) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 8.5V7.2c0-.7.5-1.2 1.2-1.2H16V4h-1.4c-2 0-3.2 1.2-3.2 3.2V8.5H10V11h1.4v9h2.6v-9H16l.4-2.5H13.6z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8zm8.5 1.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C17.8 5 12 5 12 5s-5.8 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6.2 19 12 19 12 19s5.8 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.5V8.5l5.5 3.5L10 15.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.5 9.5H4V20h2.5V9.5zM5.2 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9 9.5h2.4v1.4h.1c.3-.6 1.1-1.3 2.3-1.3 2.5 0 3 1.6 3 3.7V20H14v-5.2c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7V20H9V9.5z" />
        </svg>
      );
  }
}

export default function HeaderSocialLinks({ links }: HeaderSocialLinksProps) {
  return (
    <div className="header-social">
      {links.map((link) => (
        <a
          key={link.network}
          href={link.href}
          className="header-social-link"
          aria-label={link.label}
          target={link.href.startsWith("#") ? undefined : "_blank"}
          rel={link.href.startsWith("#") ? undefined : "noopener noreferrer"}
        >
          <SocialIcon network={link.network} />
        </a>
      ))}
    </div>
  );
}
