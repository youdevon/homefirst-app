"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="admin-login-form">
      {state.error ? (
        <div className="admin-alert admin-alert-error" role="alert">
          {state.error}
        </div>
      ) : null}

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

      <button type="submit" className="admin-btn admin-btn-primary" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
