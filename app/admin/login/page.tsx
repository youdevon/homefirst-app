import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
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

        <LoginForm />

        <p className="admin-login-note">
          Internal access only. Contact your system administrator if you need
          help signing in.
        </p>
      </div>
    </div>
  );
}
