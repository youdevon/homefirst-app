import LoginForm from "./LoginForm";

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const showInvalidError = params.error === "invalid";

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-crest">⌂</div>
          <div>
            <h1>HomeFirst Admin</h1>
            <p>Sign in to manage website content</p>
          </div>
        </div>

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
