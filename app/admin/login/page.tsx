import AdminBrandMark from "@/components/admin/AdminBrandMark";
import { getAdminBranding } from "@/lib/admin-branding";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const branding = await getAdminBranding();
  const showInvalidError = params.error === "invalid";

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <AdminBrandMark
            logoUrl={branding.logoUrl}
            crest={branding.crest}
            variant="login"
          />
          <div>
            <h1>{branding.adminTitle}</h1>
            <p className="admin-login-tagline">{branding.tagline}</p>
          </div>
        </div>

        <p className="admin-login-intro">Sign in to manage website content.</p>

        {showInvalidError ? (
          <div className="admin-alert admin-alert-error" role="alert">
            Invalid email or password.
          </div>
        ) : null}

        <LoginForm />

        <p className="admin-login-note">
          Internal access only. Contact your system administrator if you need
          help signing in.
        </p>
      </div>
    </div>
  );
}
