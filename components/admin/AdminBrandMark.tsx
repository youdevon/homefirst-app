import type { LogoDisplayMode } from "@/lib/logo-display-mode";

type AdminBrandMarkProps = {
  logoUrl: string | null;
  crest: string;
  logoDisplayMode?: LogoDisplayMode;
  variant?: "header" | "login";
};

export default function AdminBrandMark({
  logoUrl,
  crest,
  logoDisplayMode = "icon-text",
  variant = "header",
}: AdminBrandMarkProps) {
  const isFullLogo = logoDisplayMode === "full-logo" && Boolean(logoUrl);

  if (isFullLogo && logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className={
          variant === "login"
            ? "admin-brand-logo admin-brand-logo-full admin-brand-logo-login"
            : "admin-brand-logo admin-brand-logo-full"
        }
      />
    );
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className={
          variant === "login"
            ? "admin-brand-logo admin-brand-logo-login"
            : "admin-brand-logo"
        }
      />
    );
  }

  if (variant === "login") {
    return <span className="admin-login-crest">{crest}</span>;
  }

  return <span className="admin-brand-mark">{crest}</span>;
}
