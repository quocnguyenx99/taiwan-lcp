import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import taiwanLogoOrange from "../assets/taiwanLogoOrange.png";
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
      
      <div className="login-container">
        <div className="login-panel">
          {/* Logo và Header */}
          <div className="login-header">
            <img 
              src={taiwanLogoOrange} 
              alt="Taiwan Mobile" 
              className="login-logo"
            />
            <h1 className="login-title">HỆ THỐNG QUẢN TRỊ</h1>
            <p className="login-subtitle">
              DỰ ĐOÁN ĐỘI CHIẾN THẮNG CHUNG KẾT
              <br />
              <span className="login-event">LCP 2025</span>
            </p>
          </div>

          {/* Login Card */}
          <section className="login-card">
            <div className="login-card-header">
              <h2>Đăng nhập Admin</h2>
              <p>Vui lòng đăng nhập để truy cập hệ thống quản trị</p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="login-form"
              aria-label="Login form"
            >
              <div className="login-field">
                <label htmlFor="username" className="login-label">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                  className="login-input"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-label">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="login-input"
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="login-loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>© 2025 Quốc Nguyễn Website. All rights reserved.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
