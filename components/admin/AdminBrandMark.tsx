type AdminBrandMarkProps = {
  logoUrl: string | null;
  crest: string;
  variant?: "header" | "login";
};

export default function AdminBrandMark({
  logoUrl,
  crest,
  variant = "header",
}: AdminBrandMarkProps) {
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
