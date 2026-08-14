"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Amiri:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    background: #FAF7FF;
  }

  /* ── Brand panel ── */
  .login-brand {
    width: 480px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #3C0E6E 0%, #2D0864 45%, #7A24B2 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    position: relative;
    overflow: hidden;
  }

  .login-brand-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .login-brand-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .login-brand-logo {
    position: relative;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .login-brand-badge {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #B300C4, #8800CC);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Amiri', serif;
    font-size: 18px; color: #fff; font-weight: 700;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(179,0,196,.35);
  }

  .login-brand-name { color: #fff; }
  .login-brand-name h1 {
    font-size: 17px; font-weight: 700; line-height: 1.25;
  }
  .login-brand-name p {
    font-size: 12px; color: rgba(255,255,255,.40); margin-top: 3px;
  }

  .login-brand-center { position: relative; }

  .login-brand-year {
    font-family: 'Amiri', serif;
    font-size: clamp(80px, 12vw, 120px);
    font-weight: 700;
    color: rgba(179,0,196,.12);
    line-height: 1;
    margin-bottom: .5rem;
    letter-spacing: -2px;
  }

  .login-brand-tagline {
    font-family: 'Amiri', serif;
    font-size: 26px;
    color: #fff;
    line-height: 1.45;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .login-brand-tagline span {
    color: #FDE8FF;
  }

  .login-brand-desc {
    font-size: 13px;
    color: rgba(255,255,255,.45);
    line-height: 1.7;
    max-width: 320px;
  }

  .login-brand-stats {
    position: relative;
    display: flex;
    gap: 2rem;
  }

  .login-brand-stat-val {
    font-size: 22px; font-weight: 800; color: #FDE8FF;
  }
  .login-brand-stat-lbl {
    font-size: 11px; color: rgba(255,255,255,.35);
    margin-top: 2px; font-weight: 600; letter-spacing: .5px;
  }

  /* ── Form panel ── */
  .login-form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .login-form-box {
    width: 100%;
    max-width: 400px;
  }

  .login-form-header {
    margin-bottom: 2.5rem;
  }

  .login-form-header h2 {
    font-size: 26px; font-weight: 800;
    color: #101828; margin-bottom: 6px;
  }

  .login-form-header p {
    font-size: 14px; color: #6B7280;
  }

  .login-field { margin-bottom: 1.25rem; }

  .login-label {
    display: block;
    font-size: 13px; font-weight: 700;
    color: #374151; margin-bottom: 7px;
  }

  .login-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1.5px solid #E5E7EB;
    font-size: 14px;
    font-family: 'Cairo', sans-serif;
    background: #fff;
    color: #101828;
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    direction: ltr;
    text-align: right;
  }
  .login-input:focus {
    border-color: #7A24B2;
    box-shadow: 0 0 0 3px rgba(122,36,178,.10);
  }
  .login-input.error { border-color: #EF4444; }

  .login-error {
    display: flex; align-items: center; gap: 8px;
    background: #FEF2F2; border: 1px solid #FEE2E2;
    border-radius: 10px; padding: 10px 14px;
    font-size: 13px; color: #DC2626; font-weight: 600;
    margin-bottom: 1.25rem;
  }

  .login-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #7A24B2, #2D0864);
    color: #fff;
    font-size: 15px; font-weight: 700;
    font-family: 'Cairo', sans-serif;
    cursor: pointer;
    transition: opacity .2s, transform .15s;
    margin-top: .5rem;
  }
  .login-btn:hover:not(:disabled) {
    opacity: .92; transform: translateY(-1px);
  }
  .login-btn:disabled { opacity: .6; cursor: not-allowed; }

  .login-footer {
    text-align: center;
    margin-top: 2rem;
    font-size: 12px;
    color: #9CA3AF;
  }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .login-root { flex-direction: column; }
    .login-brand {
      width: 100%;
      min-height: 240px;
      padding: 2rem;
    }
    .login-brand-center { display: none; }
    .login-brand-stats { gap: 1.5rem; }
    .login-brand-year { display: none; }
  }
`;

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Read from FormData to catch password-manager fills that bypass React state
    const fd = new FormData(e.currentTarget);
    const u = (fd.get("username") as string) || username;
    const p = (fd.get("password") as string) || password;
    if (!u || !p) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const d = await res.json();
        setError(d.error ?? "بيانات خاطئة");
      }
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="login-root">

        {/* ── Brand panel ── */}
        <div className="login-brand">
          <div className="login-brand-grid" />

          {/* Orbs */}
          <div className="login-brand-orb" style={{ top: "-20%", right: "-15%", width: 360, height: 360, background: "radial-gradient(circle, rgba(179,0,196,.10) 0%, transparent 65%)" }} />
          <div className="login-brand-orb" style={{ bottom: "-10%", left: "-10%", width: 280, height: 280, background: "radial-gradient(circle, rgba(122,36,178,.25) 0%, transparent 65%)" }} />

          {/* Logo */}
          <div className="login-brand-logo">
            <div className="login-brand-badge">أف</div>
            <div className="login-brand-name">
              <h1>مدارس الأفق العالمية</h1>
              <p>Horizon International Schools</p>
            </div>
          </div>

          {/* Center content */}
          <div className="login-brand-center">
            <div className="login-brand-year">١٩٩٩</div>
            <div className="login-brand-tagline">
              التعليم حيث يلتقي<br />
              <span>التاريخ</span> بالمستقبل
            </div>
            <p className="login-brand-desc">
              لوحة الإدارة الخاصة بمدارس الأفق العالمية — إدارة التسجيلات والجولات والفعاليات ورسائل التواصل.
            </p>
          </div>

          {/* Stats */}
          <div className="login-brand-stats">
            {[
              { val: "٢٦", lbl: "عاماً من التميز" },
              { val: "٣–١٨", lbl: "الفئة العمرية" },
              { val: "١٠٠٪", lbl: "مُدار من المالكين" },
            ].map((s, i) => (
              <div key={i}>
                <div className="login-brand-stat-val">{s.val}</div>
                <div className="login-brand-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form panel ── */}
        <div className="login-form-panel">
          <div className="login-form-box">

            <div className="login-form-header">
              <h2>تسجيل الدخول</h2>
              <p>أدخل بياناتك للوصول إلى لوحة الإدارة</p>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="login-field">
                <label className="login-label" htmlFor="username">اسم المستخدم</label>
                <input
                  id="username"
                  name="username"
                  className={`login-input${error ? " error" : ""}`}
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  placeholder="admin"
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">كلمة المرور</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    className={`login-input${error ? " error" : ""}`}
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ paddingLeft: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: .5, color: "#374151" }}
                    tabIndex={-1}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? "جاري التحقق..." : "دخول ←"}
              </button>
            </form>

            <div className="login-footer">
              مدارس الأفق العالمية · لوحة الإدارة<br />
              <span style={{ color: "#D1D5DB" }}>جميع الحقوق محفوظة © ٢٠٢٦</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
