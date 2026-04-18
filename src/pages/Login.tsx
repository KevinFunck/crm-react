import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  /* Form field state */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Error message shown below the form fields */
  const [error, setError] = useState("");

  /* Disables the submit button while the request is in flight */
  const [loading, setLoading] = useState(false);

  /* Calls the backend auth endpoint and redirects on success */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  /* Skips authentication and enters the app as a guest */
  function handleGuestLogin() {
    loginAsGuest();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">

        <h1 className="text-2xl font-bold text-gray-800 mb-1">CRM</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to continue</p>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="••••••••"
            />
          </div>

          {/* Inline error message */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider between sign-in and guest option */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">or</span>
          </div>
        </div>

        {/* Guest login — bypasses authentication entirely */}
        <button
          onClick={handleGuestLogin}
          className="w-full border border-gray-300 text-gray-600 rounded-md py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Guest Login
        </button>

      </div>
    </div>
  );
}
