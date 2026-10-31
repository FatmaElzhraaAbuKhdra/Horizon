"use client";
import { useEffect, useRef, useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { inputStyle } from "./Modal";

type Toast = { msg: string; ok: boolean } | null;

// ─── Brand ────────────────────────────────────────────────────────────────────
const C = {
  primary:   "#7A24B2",
  dark:      "#2D0864",
  gold:      "#B300C4",
  goldLight: "#FDE8FF",
  bg:        "#F6F4FA",
  card:      "#fff",
  border:    "#E4E0EA",
  muted:     "#5A6459",
  light:     "#8A9A88",
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  .cc-info-card {
    transition: transform .22s ease, border-color .22s, box-shadow .22s;
  }
  .cc-info-card:hover {
    transform: translateY(-3px);
    border-color: #B300C4 !important;
    box-shadow: 0 8px 28px rgba(179,0,196,.12) !important;
  }
  .cc-social {
    transition: all .2s ease;
  }
  .cc-social:hover {
    background: #7A24B2 !important;
    color: #fff !important;
    border-color: #7A24B2 !important;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(122,36,178,.25);
  }
  .cc-submit {
    transition: all .25s ease;
  }
  .cc-submit:hover:not(:disabled) {
    background: #2D0864 !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(90,23,133,.3) !important;
  }
  .cc-input:focus {
    outline: none;
    border-color: #7A24B2 !important;
    box-shadow: 0 0 0 4px rgba(122,36,178,.10) !important;
    background: #fff !important;
  }
  .cc-quick {
    transition: all .2s ease;
  }
  .cc-quick:hover {
    background: #7A24B2 !important;
    color: #fff !important;
    border-color: #7A24B2 !important;
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    .cc-grid { grid-template-columns: 1fr !important; }
    .cc-info-cols { grid-template-columns: 1fr !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// ─── Info items ───────────────────────────────────────────────────────────────
const INFO_ICONS: Record<string, string> = {
  address: "📍", phone: "📞", email: "✉️", hours: "🕐",
};

interface ContactInfo {
  phone: string; email: string; address: string; hours: string; tourInfo: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ContactClient({ locale, contactInfo }: { locale: Locale; contactInfo?: ContactInfo | null }) {
  const tr    = t[locale];
  const isRtl = locale === "ar";

  const ci = contactInfo ?? {
    phone:   tr.contact.phone,
    email:   tr.contact.email,
    address: tr.contact.address,
    hours:   tr.contact.hours,
    tourInfo:tr.contact.tourInfo,
  };

  const [form, setForm]       = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [toast, setToast]     = useState<Toast>(null);

  const pageRef = useRef<HTMLDivElement>(null);

  // scroll reveal via IntersectionObserver
  useEffect(() => {
    if (!pageRef.current) return;
    const els = pageRef.current.querySelectorAll<HTMLElement>(
      ".cc-info-card,.cc-form-box,.cc-quick,.cc-social"
    );
    els.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .28s ease, transform .28s ease";
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, i * 40);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email)
      return setToast({ msg: tr.validation.required, ok: false });
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { setDone(true); setToast({ msg: tr.validation.sent, ok: true }); }
    else setToast({ msg: isRtl ? "حدث خطأ، حاول مجدداً" : "Error, please try again", ok: false });
  };

  const infoItems = [
    { key: "address", label: isRtl ? "العنوان"          : "Address",       value: ci.address,  ltr: false },
    { key: "phone",   label: isRtl ? "الهاتف"           : "Phone",         value: ci.phone,    ltr: true  },
    { key: "email",   label: isRtl ? "البريد الإلكتروني": "Email",         value: ci.email,    ltr: true  },
    { key: "hours",   label: isRtl ? "ساعات العمل"      : "Working Hours",  value: ci.hours,   ltr: false },
  ];

  const quickActions = isRtl
    ? [
        { label: "ابدأ رحلة التسجيل", icon: "🎓", href: "#register" },
        { label: "احجز جولة مجانية",  icon: "🏫", href: "#tour"     },
        { label: "البرامج الأكاديمية", icon: "📚", href: `/ar/programs` },
        { label: "الأسئلة الشائعة",   icon: "❓", href: `/ar/admissions` },
      ]
    : [
        { label: "Start Application",   icon: "🎓", href: "#register"       },
        { label: "Book a Free Tour",    icon: "🏫", href: "#tour"           },
        { label: "Academic Programmes", icon: "📚", href: `/en/programs`    },
        { label: "FAQs",                icon: "❓", href: `/en/admissions`  },
      ];

  return (
    <>
      <style>{CSS}</style>

      <div ref={pageRef} style={{ background: C.bg }}>

        {/* ── Top banner: map placeholder ── */}
        <div style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, padding: "3.5rem 2rem", position: "relative", overflow: "hidden" }}>
          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
          {/* Orb */}
          <div style={{ position: "absolute", top: "-40%", ...(isRtl ? { left: "-10%" } : { right: "-10%" }), width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(179,0,196,.12) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
            {/* Location strip */}
            <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(179,0,196,.18)", border: "1px solid rgba(179,0,196,.30)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  📍
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.40)", marginBottom: 4 }}>
                    {isRtl ? "موقعنا" : "Our Location"}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", whiteSpace: "pre-line" }}>
                    {[tr.contact.addressWoroud, tr.contact.addressLaban].join("\n")}
                  </div>
                </div>
              </div>

              <div style={{ marginInlineStart: "auto", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { icon: "📞", val: ci.phone },
                  { icon: "✉️", val: ci.email },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,.75)", fontSize: 14 }}>
                    <span>{x.icon}</span> <span style={{ direction: "ltr" }}>{x.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch maps */}
            <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                {
                  name: isRtl ? "فرع الورود" : "Al-Woroud Branch",
                  area: tr.contact.addressWoroud,
                  map: tr.contact.mapWoroud,
                },
                {
                  name: isRtl ? "فرع ظهرة لبن" : "Zahrat Laban Branch",
                  area: tr.contact.addressLaban,
                  map: tr.contact.mapLaban,
                },
              ].map((branch, i) => (
                <div key={i} style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22 }}>📍</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "rgba(255,255,255,.85)", fontSize: 14 }}>{branch.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", marginTop: 2 }}>{branch.area}</div>
                    </div>
                  </div>
                  <a
                    href={branch.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: "6px 14px", borderRadius: 30, background: "rgba(179,0,196,.20)", border: "1px solid rgba(179,0,196,.35)", color: C.goldLight, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none", display: "inline-block", textAlign: "center" }}
                  >
                    {isRtl ? "فتح الخريطة ↗" : "Open Map ↗"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main: Info + Form ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}>
          <div className="cc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "3.5rem", alignItems: "start" }}>

            {/* ── Left: Info cards ── */}
            <div className="cc-info-section">
              {/* Section label */}
              <div style={{ marginBottom: "2rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(122,36,178,.08)", color: C.primary, padding: "5px 16px", borderRadius: 40, fontSize: 13, fontWeight: 700, border: "1px solid rgba(122,36,178,.14)" }}>
                  <span style={{ width: 6, height: 6, background: C.primary, borderRadius: "50%", display: "inline-block" }} />
                  {tr.contact.tag}
                </span>
                <h2 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(24px,3.5vw,38px)", color: C.dark, margin: ".9rem 0 .5rem", lineHeight: 1.3 }}>
                  {tr.contact.title}
                </h2>
                <div style={{ width: 48, height: 3, background: "linear-gradient(90deg,#B300C4,#FDE8FF)", borderRadius: 4, boxShadow: "0 2px 8px rgba(179,0,196,.3)" }} />
              </div>

              {/* Info cards */}
              <div className="cc-info-cols" style={{ display: "grid", gridTemplateColumns: "1fr", gap: ".85rem", marginBottom: "2rem" }}>
                {infoItems.map((item, i) => (
                  <div
                    key={i}
                    className="cc-info-card"
                    style={{
                      background: C.card, borderRadius: 16,
                      border: `1px solid ${C.border}`,
                      padding: "1.1rem 1.4rem",
                      display: "flex", alignItems: "flex-start", gap: 14,
                    }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,rgba(122,36,178,.12),rgba(122,36,178,.05))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>
                      {INFO_ICONS[item.key]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: C.light, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.dark, lineHeight: 1.5, direction: item.ltr ? "ltr" : undefined, textAlign: isRtl && item.ltr ? "right" : undefined, wordBreak: "break-all", whiteSpace: item.key === "address" ? "pre-line" : undefined }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.light, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: ".85rem" }}>
                  {isRtl ? "تابعونا" : "Follow Us"}
                </div>
                <div className="cc-social-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { icon: "📘", label: tr.footer.social.fbWoroudLabel,    href: tr.footer.social.fbWoroud    },
                    { icon: "📘", label: tr.footer.social.fbLabanLabel,     href: tr.footer.social.fbLaban     },
                    { icon: "👻", label: tr.footer.social.snapchatLabel,    href: tr.footer.social.snapchat    },
                    { icon: "📸", label: tr.footer.social.instaWoroudLabel, href: tr.footer.social.instaWoroud },
                    { icon: "📸", label: tr.footer.social.instaLabanLabel,  href: tr.footer.social.instaLaban  },
                    { icon: "🎵", label: tr.footer.social.tiktokLabel,      href: tr.footer.social.tiktok      },
                    { icon: "▶️", label: tr.footer.social.youtubeLabel,     href: tr.footer.social.youtube     },
                  ].map((s, i) => (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="cc-social" title={s.label}
                      style={{ padding: "6px 12px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.muted, textDecoration: "none", whiteSpace: "nowrap" }}>
                      {s.icon} {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Working hours visual */}
              <div style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, borderRadius: 18, padding: "1.4rem 1.6rem", color: "#fff" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.50)", letterSpacing: 1, textTransform: "uppercase", marginBottom: ".75rem" }}>
                  {isRtl ? "أوقات العمل" : "Working Hours"}
                </div>
                {[
                  isRtl ? ["الأحد – الخميس", "٧:٠٠ ص – ٣:٠٠ م"] : ["Sunday – Thursday", "7:00 AM – 3:00 PM"],
                  isRtl ? ["السبت",           "٩:٠٠ ص – ١:٠٠ م"] : ["Saturday",          "9:00 AM – 1:00 PM"],
                  isRtl ? ["الجمعة",          "مغلق"]             : ["Friday",            "Closed"],
                ].map(([day, hrs], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".45rem 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.10)" : "none" }}>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,.75)" }}>{day}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: i < 2 ? C.goldLight : "rgba(255,255,255,.35)" }}>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div className="cc-form-box" style={{ background: C.card, borderRadius: 24, padding: "2.5rem", border: `1px solid ${C.border}`, boxShadow: "0 16px 56px rgba(90,23,133,.08)", position: "sticky", top: "100px" }}>

              {done ? (
                /* Success state */
                <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(122,36,178,.08)", border: "2px solid rgba(122,36,178,.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 36 }}>✅</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.dark, marginBottom: ".6rem" }}>{isRtl ? "تم الإرسال!" : "Message Sent!"}</div>
                  <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: "1.5rem" }}>
                    {isRtl ? "شكراً لتواصلكم معنا. سنرد عليكم في أقرب وقت." : "Thank you! We'll get back to you as soon as possible."}
                  </div>
                  <button onClick={() => { setDone(false); setForm({ name: "", phone: "", email: "", subject: "", message: "" }); }}
                    style={{ padding: "10px 28px", borderRadius: 10, background: C.primary, color: "#fff", border: "none", cursor: "pointer", fontFamily: "Cairo,sans-serif", fontSize: 14, fontWeight: 600 }}>
                    {isRtl ? "إرسال رسالة أخرى" : "Send Another Message"}
                  </button>
                </div>
              ) : (
                <>
                  {/* Form header */}
                  <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: ".5rem" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(179,0,196,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✉️</div>
                      <div>
                        <div style={{ fontSize: 19, fontWeight: 800, color: C.dark }}>{tr.contact.formTitle}</div>
                        <div style={{ fontSize: 13, color: C.light, marginTop: 2 }}>
                          {isRtl ? "سنرد على استفساركم خلال ٢٤ ساعة" : "We'll respond within 24 hours"}
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 1, background: C.border, marginTop: "1.25rem" }} />
                  </div>

                  <form onSubmit={submit}>
                    {/* Name + Phone */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      {[
                        { label: tr.contact.fields.name,  ph: tr.contact.fields.namePh,  key: "name",  type: "text",  req: true },
                        { label: tr.contact.fields.phone, ph: tr.contact.fields.phonePh, key: "phone", type: "tel",   req: false },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.dark, marginBottom: 6, letterSpacing: .2 }}>
                            {f.label}{f.req && <span style={{ color: C.gold }}>  *</span>}
                          </label>
                          <input
                            type={f.type}
                            className="cc-input"
                            style={{ ...inputStyle, background: C.bg, border: `1.5px solid ${C.border}` }}
                            placeholder={f.ph}
                            value={(form as any)[f.key]}
                            onChange={e => set(f.key, e.target.value)}
                            required={f.req}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                        {tr.contact.fields.email}<span style={{ color: C.gold }}> *</span>
                      </label>
                      <input
                        type="email"
                        className="cc-input"
                        style={{ ...inputStyle, background: C.bg, border: `1.5px solid ${C.border}` }}
                        placeholder={tr.contact.fields.emailPh}
                        value={form.email}
                        onChange={e => set("email", e.target.value)}
                        required
                      />
                    </div>

                    {/* Subject */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                        {tr.contact.fields.subject}
                      </label>
                      <select
                        className="cc-input"
                        style={{ ...inputStyle, background: C.bg, border: `1.5px solid ${C.border}` }}
                        value={form.subject}
                        onChange={e => set("subject", e.target.value)}
                      >
                        <option value="">{isRtl ? "اختر الموضوع..." : "Select a topic..."}</option>
                        {tr.contact.fields.subjectOpts.map((o, i) => <option key={i}>{o}</option>)}
                      </select>
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.dark, marginBottom: 6 }}>
                        {tr.contact.fields.message}
                      </label>
                      <textarea
                        className="cc-input"
                        style={{ ...inputStyle, background: C.bg, border: `1.5px solid ${C.border}`, minHeight: 120, resize: "vertical" }}
                        placeholder={tr.contact.fields.messagePh}
                        value={form.message}
                        onChange={e => set("message", e.target.value)}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="cc-submit"
                      disabled={loading}
                      style={{ width: "100%", padding: "14px", borderRadius: 12, background: C.primary, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Cairo,sans-serif", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? .7 : 1, boxShadow: "0 4px 18px rgba(122,36,178,.22)" }}
                    >
                      {loading
                        ? (isRtl ? "جارٍ الإرسال..." : "Sending...")
                        : tr.contact.fields.send}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="cc-quick-section" style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "3.5rem 2rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.light, letterSpacing: 2, textTransform: "uppercase", marginBottom: ".5rem" }}>
                {isRtl ? "ماذا تريد أن تفعل؟" : "What would you like to do?"}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
              {quickActions.map((q, i) => (
                <a key={i} href={q.href} className="cc-quick"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "1rem 1.25rem", borderRadius: 14, background: C.bg, border: `1.5px solid ${C.border}`, textDecoration: "none", color: C.dark, fontWeight: 600, fontSize: 14 }}>
                  <span style={{ fontSize: 22 }}>{q.icon}</span>
                  {q.label}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "2rem", insetInlineEnd: "2rem", zIndex: 3000, background: "#fff", borderRadius: 14, padding: "1rem 1.25rem", boxShadow: "0 8px 32px rgba(0,0,0,.15)", display: "flex", alignItems: "center", gap: 12, minWidth: 260, borderInlineEnd: `4px solid ${toast.ok ? C.primary : "#c0392b"}` }}>
          <span style={{ fontSize: 20 }}>{toast.ok ? "✅" : "⚠️"}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.dark }}>{toast.msg}</span>
        </div>
      )}
    </>
  );
}
