import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import "../styles/login.css";

const API_LOGIN = "https://be.dudoanchungketlcp-tta.vn/api/admin/login";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.message || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      if (!json?.status || !json?.access_token) {
        throw new Error(json?.message || "Đăng nhập thất bại");
      }

      // Lưu token và user info
      localStorage.setItem("token", json.access_token);
      if (json.data) localStorage.setItem("user", JSON.stringify(json.data));

      // Toast success
      toast.success("Đăng nhập thành công!");

      // Chuyển hướng ngay lập tức
      navigate("/admin/member-list", { replace: true });
    } catch (err: any) {
      const errorMsg = err?.message || "Lỗi khi đăng nhập";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <Toaster richColors position="top-right" />
      <section className="login-card container">
        <h1>Đăng nhập</h1>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="login-form"
          aria-label="Login form"
        >
          <label>
            Username
            <input
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
              className="login-input__username"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
              className="login-input__password"
            />
          </label>

          <div className="login-actions">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Đang xử lý…" : "Sign in"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
