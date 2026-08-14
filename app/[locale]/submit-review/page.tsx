"use client";
import { useState } from "react";

const C = {
  primary: "#7A24B2",
  dark:    "#2D0864",
  gold:    "#B300C4",
  bg:      "#FAF7FF",
  border:  "#E8E0F5",
  muted:   "#5A5A5A",
};

const ROLES = [
  "ولي أمر طالب في الصف الأول",
  "ولي أمر طالب في الصف الثاني",
  "ولي أمر طالب في الصف الثالث",
  "ولي أمر طالب في الصف الرابع",
  "ولي أمر طالب في الصف الخامس",
  "ولي أمر طالب في الصف السادس",
  "ولي أمر طالب في الصف السابع",
  "ولي أمر طالب في الصف الثامن",
  "ولي أمر طالب في الصف التاسع",
  "ولي أمر طالب في الصف العاشر",
  "ولي أمر طالبة",
  "ولي أمر طالبين أو أكثر",
];

export default function SubmitReviewPage() {
  const [form, setForm] = useState({ name: "", roleAr: "", textAr: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.roleAr || !form.textAr.trim()) {
      setError("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/submit-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else setError("حدث خطأ، يرجى المحاولة مرة أخرى.");
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: ${C.bg}; margin: 0; font-family: Cairo, sans-serif; }
        .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .card { background: #fff; border-radius: 28px; border: 1px solid ${C.border}; padding: 3rem 2.5rem; max-width: 560px; width: 100%; box-shadow: 0 24px 80px rgba(90,23,133,.10); }
        .logo { display: flex; align-items: center; gap: 12px; margin-bottom: 2rem; }
        .logo-icon { width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg,${C.dark},${C.primary}); display:flex; align-items:center; justify-content:center; font-size:22px; color:#fff; font-weight:800; flex-shrink:0; }
        h1 { font-size: 24px; font-weight: 800; color: ${C.dark}; margin: 0 0 .25rem; }
        .sub { font-size: 14px; color: #8A8A8A; margin-bottom: 2rem; line-height: 1.7; }
        label { display: block; font-size: 12px; font-weight: 700; color: #667085; letter-spacing: .4px; margin-bottom: 5px; }
        .field { margin-bottom: 1.25rem; }
        input, select, textarea {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid #D1D5DB; font-size: 14px;
          font-family: Cairo, sans-serif; outline: none;
          background: #F9FAFB; color: #101828;
          transition: border-color .2s, box-shadow .2s;
          direction: rtl;
        }
        input:focus, select:focus, textarea:focus {
          border-color: ${C.primary}; background: #fff;
          box-shadow: 0 0 0 3px rgba(122,36,178,.12);
        }
        textarea { resize: vertical; min-height: 120px; }
        .req { color: #DC2626; margin-right: 3px; }
        .btn {
          width: 100%; padding: 13px; border-radius: 12px; font-size: 15px;
          font-weight: 700; font-family: Cairo, sans-serif; cursor: pointer;
          background: ${C.primary}; color: #fff; border: none;
          transition: background .2s; margin-top: .5rem;
        }
        .btn:hover:not(:disabled) { background: ${C.dark}; }
        .btn:disabled { opacity: .55; cursor: not-allowed; }
        .err { font-size: 13px; color: #DC2626; margin-bottom: 1rem; text-align: center; padding: 10px; background: #FFF1F0; border-radius: 8px; border: 1px solid #FFD0CC; }
        .done-box { text-align: center; padding: 1.5rem 0; }
        .done-icon { font-size: 64px; margin-bottom: 1rem; }
        .done-title { font-size: 22px; font-weight: 800; color: ${C.dark}; margin-bottom: .5rem; }
        .done-desc { font-size: 15px; color: #5A5A5A; line-height: 1.8; }
        .stars { display: flex; gap: 4px; justify-content: center; margin-bottom: 1.5rem; }
        .gold-line { width: 60px; height: 3px; background: linear-gradient(90deg,${C.gold},rgba(179,0,196,.3)); border-radius: 2px; margin: .75rem auto 0; }
      `}</style>

      <div className="wrap" dir="rtl">
        <div className="card">
          <div className="logo">
            <div className="logo-icon">A</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.dark }}>مدارس الأفق العالمية</div>
              <div style={{ fontSize: 12, color: "#8A8A8A" }}>Horizon International Schools</div>
            </div>
          </div>

          {done ? (
            <div className="done-box">
              <div className="done-icon">🎉</div>
              <div className="stars">{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 28, color: C.gold }}>★</span>)}</div>
              <div className="done-title">شكراً جزيلاً!</div>
              <div className="gold-line" />
              <p className="done-desc" style={{ marginTop: "1rem" }}>
                وصلنا رأيكم الكريم وسيتم مراجعته قريباً.<br />
                نقدر ثقتكم بمدارس الأفق العالمية ونسعد بخدمتكم دائماً.
              </p>
            </div>
          ) : (
            <>
              <h1>شاركنا رأيك</h1>
              <div className="gold-line" style={{ margin: ".5rem 0 1rem", marginRight: 0 }} />
              <p className="sub">آراؤكم تُلهمنا للتطوير المستمر. أخبرنا عن تجربتكم مع مدارس الأفق العالمية.</p>

              {error && <div className="err">{error}</div>}

              <form onSubmit={submit}>
                <div className="field">
                  <label>الاسم الكامل <span className="req">*</span></label>
                  <input
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="اسمك الكريم"
                  />
                </div>

                <div className="field">
                  <label>صفة ولي الأمر <span className="req">*</span></label>
                  <select value={form.roleAr} onChange={e => set("roleAr", e.target.value)}>
                    <option value="">اختر...</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>رقم الهاتف (اختياري)</label>
                  <input
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                    type="tel"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  />
                </div>

                <div className="field">
                  <label>رأيك وتجربتك مع المدرسة <span className="req">*</span></label>
                  <textarea
                    value={form.textAr}
                    onChange={e => set("textAr", e.target.value)}
                    placeholder="شاركنا تجربتك مع الأفق العالمية..."
                  />
                </div>

                <button type="submit" className="btn" disabled={loading}>
                  {loading ? "جارٍ الإرسال..." : "إرسال رأيي ★"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
