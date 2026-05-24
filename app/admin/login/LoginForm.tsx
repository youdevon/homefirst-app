export default function LoginForm() {
  return (
    <form method="post" action="/api/admin/login" className="admin-login-form">
      <label className="admin-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          placeholder="admin@homefirst.local"
        />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
        />
      </label>

      <button type="submit" className="admin-btn admin-btn-primary">
        Sign In
      </button>
    </form>
  );
}
