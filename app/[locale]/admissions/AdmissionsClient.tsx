"use client";
import { useEffect, useRef } from "react";
// No GSAP — uses native IntersectionObserver for scroll animations
import Link from "next/link";
import SubPage from "@/components/SubPage";
import { type Locale, t, REGISTRATION_URL, PAYMENT_URL, PAYMENT_PHONE } from "@/lib/i18n";

const C = {
  primary:     "#7A24B2",
  dark:        "#2D0864",
  gold:        "#B300C4",
  goldLight:   "#FDE8FF",
  bg:          "#FAF7FF",
  card:        "#fff",
  border:      "#E8E0F5",
  muted:       "#5A5A5A",
  light:       "#9CA3AF",
};

const CSS = `
  .adm-section { padding: 4rem 2rem; }
  .adm-section:nth-child(even) { background: #fff; }

  .adm-section-tag {
    display: inline-block;
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${C.gold};
    background: rgba(179,0,196,.10); border: 1px solid rgba(179,0,196,.25);
    border-radius: 30px; padding: 4px 14px; margin-bottom: 1rem;
  }

  .adm-h2 {
    font-family: 'Amiri', serif;
    font-size: clamp(24px, 3.5vw, 38px);
    color: ${C.dark}; margin-bottom: 1rem; line-height: 1.3;
  }

  .adm-intro-box {
    background: linear-gradient(135deg, ${C.dark}, ${C.primary});
    border-radius: 20px; padding: 2.5rem 3rem;
    color: rgba(255,255,255,.85); font-size: 15px; line-height: 1.8;
    position: relative; overflow: hidden; margin-bottom: 2rem;
  }
  .adm-intro-box::before {
    content: '';
    position: absolute; top: -40px; left: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(179,0,196,.10); pointer-events: none;
  }
  .adm-intro-badge {
    display: inline-block;
    background: rgba(179,0,196,.20); border: 1px solid rgba(179,0,196,.40);
    color: ${C.goldLight}; border-radius: 30px;
    padding: 4px 16px; font-size: 12px; font-weight: 700;
    margin-bottom: 1rem; letter-spacing: .5px;
  }

  /* Stages */
  .adm-stages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
  }
  .adm-stage-card {
    background: ${C.card}; border-radius: 16px;
    border: 1.5px solid ${C.border};
    padding: 1.75rem 1.5rem; text-align: center;
    transition: transform .2s, box-shadow .2s, border-color .2s;
  }
  .adm-stage-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0,0,0,.08);
    border-color: rgba(122,36,178,.3);
  }
  .adm-stage-icon {
    font-size: 32px; margin-bottom: .75rem;
  }
  .adm-stage-name {
    font-size: 14px; font-weight: 700; color: ${C.dark};
    margin-bottom: .4rem; line-height: 1.3;
  }
  .adm-stage-age {
    display: inline-block;
    font-size: 12px; font-weight: 700; color: ${C.primary};
    background: rgba(122,36,178,.08); border-radius: 20px;
    padding: 3px 12px;
  }

  /* Journey steps */
  .adm-journey-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  .adm-journey-step {
    background: ${C.card}; border-radius: 16px;
    border: 1.5px solid ${C.border}; padding: 1.75rem;
  }
  .adm-journey-num {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: #fff;
    margin-bottom: 1rem; flex-shrink: 0;
  }
  .adm-journey-title {
    font-size: 15px; font-weight: 700; color: ${C.dark};
    margin-bottom: .875rem;
  }
  .adm-journey-item {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13px; color: ${C.muted}; line-height: 1.55;
    margin-bottom: .5rem;
  }
  .adm-journey-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${C.gold}; flex-shrink: 0; margin-top: 6px;
  }

  /* Two-col info */
  .adm-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  @media (max-width: 640px) { .adm-two-col { grid-template-columns: 1fr; } }

  .adm-info-card {
    background: ${C.card}; border-radius: 16px;
    border: 1.5px solid ${C.border}; padding: 2rem;
  }
  .adm-info-card-title {
    font-size: 15px; font-weight: 800; color: ${C.dark};
    margin-bottom: .25rem;
  }
  .adm-info-card-sub {
    font-size: 12px; color: ${C.light}; margin-bottom: 1.25rem;
    font-weight: 600; letter-spacing: .4px;
  }
  .adm-doc-item {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; color: ${C.muted}; padding: 8px 0;
    border-bottom: 1px solid ${C.border};
  }
  .adm-doc-item:last-child { border-bottom: none; }
  .adm-doc-check {
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(122,36,178,.10); color: ${C.primary};
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; flex-shrink: 0; font-weight: 700;
  }

  /* Payment card */
  .adm-payment-card {
    background: linear-gradient(135deg, #1a0a3d, #2d1562);
    border-radius: 20px; padding: 2.5rem;
    color: rgba(255,255,255,.8); position: relative; overflow: hidden;
  }
  .adm-payment-card::after {
    content: '';
    position: absolute; bottom: -30px; right: -30px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(255,255,255,.04); pointer-events: none;
  }
  .adm-payment-badge {
    display: inline-block;
    background: rgba(52,211,153,.20); border: 1px solid rgba(52,211,153,.40);
    color: #6EE7B7; border-radius: 30px;
    padding: 4px 14px; font-size: 12px; font-weight: 700;
    margin-bottom: 1rem;
  }
  .adm-payment-partner {
    font-size: 18px; font-weight: 800; color: #fff; margin-bottom: .75rem;
  }
  .adm-payment-desc {
    font-size: 14px; line-height: 1.7; color: rgba(255,255,255,.65);
  }
  .adm-installments {
    display: flex; gap: .5rem; margin-top: 1.5rem; flex-wrap: wrap;
  }
  .adm-installment-pip {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: rgba(255,255,255,.6);
  }
  .adm-installment-pip.active {
    background: rgba(52,211,153,.20); border-color: rgba(52,211,153,.40);
    color: #6EE7B7;
  }

  /* SEN card */
  .adm-sen-card {
    background: rgba(122,36,178,.06); border: 1.5px solid rgba(122,36,178,.15);
    border-radius: 16px; padding: 1.75rem 2rem;
    display: flex; gap: 1.25rem; align-items: flex-start;
  }
  .adm-sen-icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: rgba(122,36,178,.12); display: flex; align-items: center;
    justify-content: center; font-size: 20px;
  }

  /* Contact banner */
  .adm-contact-banner {
    background: ${C.card}; border-radius: 16px;
    border: 1.5px solid ${C.border}; padding: 2rem;
    display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
    justify-content: space-between;
  }
  .adm-contact-item {
    display: flex; align-items: center; gap: 12px;
  }
  .adm-contact-icon {
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    background: rgba(122,36,178,.08);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .adm-contact-label { font-size: 11px; color: ${C.light}; font-weight: 600; margin-bottom: 2px; }
  .adm-contact-val { font-size: 13.5px; font-weight: 700; color: ${C.dark}; direction: ltr; }

  /* CTA */
  .adm-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 30px; border-radius: 12px;
    font-size: 15px; font-weight: 700; font-family: 'Cairo', sans-serif;
    cursor: pointer; border: none; text-decoration: none;
    transition: all .2s;
  }
  .adm-cta-primary {
    background: linear-gradient(135deg, ${C.primary}, ${C.dark});
    color: #fff;
  }
  .adm-cta-primary:hover { opacity: .9; transform: translateY(-1px); }
  .adm-cta-outline {
    background: #fff; color: ${C.dark};
    border: 2px solid ${C.border} !important;
  }
  .adm-cta-outline:hover { border-color: rgba(122,36,178,.4) !important; background: rgba(122,36,178,.04); }

  /* Reg interest */
  .adm-reg-item {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13.5px; color: ${C.muted}; margin-bottom: .75rem; line-height: 1.55;
  }
  .adm-reg-num {
    width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
    background: ${C.primary}; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800;
  }
`;

interface DbStep {
  id: string; num: string; titleAr: string; titleEn: string;
  color: string; itemsAr: string[]; itemsEn: string[];
}

export default function AdmissionsClient({ locale, dbSteps }: { locale: Locale; dbSteps?: DbStep[] | null }) {
  const tr = t[locale];
  const adm = tr.admissionsPage;
  const isRtl = locale === "ar";
  const rootRef = useRef<HTMLDivElement>(null);

  const journeySteps = dbSteps
    ? dbSteps.map(s => ({
        num: s.num, title: isRtl ? s.titleAr : s.titleEn,
        color: s.color, items: isRtl ? s.itemsAr : s.itemsEn,
      }))
    : adm.journey.steps;

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll<HTMLElement>(
      ".adm-section-tag,.adm-h2,.adm-intro-box,.adm-stage-card,.adm-journey-step,.adm-info-card,.adm-payment-card,.adm-doc-item"
    );
    els.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .3s ease, transform .3s ease";
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * 40);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div ref={rootRef}>
      <SubPage locale={locale} title={tr.nav.admissions}>

        {/* ── 1. Intro ── */}
        <section className="adm-section" style={{ background: C.bg }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="adm-intro-box">
              <div className="adm-intro-badge">✦ {adm.acceptedYears}</div>
              <p style={{ position: "relative" }}>{adm.intro}</p>
            </div>

            {/* Registrar contact */}
            <div className="adm-contact-banner">
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div className="adm-contact-item">
                  <div className="adm-contact-icon">✉️</div>
                  <div>
                    <div className="adm-contact-label">{isRtl ? "البريد الإلكتروني" : "Email"}</div>
                    <div className="adm-contact-val">{adm.registrarEmail}</div>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <div className="adm-contact-icon">📞</div>
                  <div>
                    <div className="adm-contact-label">{isRtl ? "الهاتف" : "Phone"}</div>
                    <div className="adm-contact-val">{adm.registrarPhone}{adm.registrarExt ? ` — ${adm.registrarExt}` : ""}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                <a className="adm-cta-btn adm-cta-primary" href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                  🎓 {tr.nav.register}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Academic Stages ── */}
        <section className="adm-section">
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="adm-section-tag">📚 {isRtl ? "المراحل الدراسية" : "Academic Stages"}</div>
            <h2 className="adm-h2">{adm.stages.title}</h2>
            <div className="adm-stages-grid">
              {adm.stages.list.map((s, i) => (
                <div key={i} className="adm-stage-card">
                  <div className="adm-stage-icon">{s.icon}</div>
                  <div className="adm-stage-name">{s.stage}</div>
                  <div className="adm-stage-age">{s.age}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. Admission Journey ── */}
        <section className="adm-section" style={{ background: C.bg }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="adm-section-tag">🗺️ {isRtl ? "مراحل التسجيل" : "Registration Stages"}</div>
            <h2 className="adm-h2">{adm.journey.title}</h2>
            <div className="adm-journey-grid">
              {journeySteps.map((step, i) => (
                <div key={i} className="adm-journey-step">
                  <div className="adm-journey-num" style={{ background: step.color }}>
                    {step.num}
                  </div>
                  <div className="adm-journey-title">{step.title}</div>
                  {step.items.map((item, j) => (
                    <div key={j} className="adm-journey-item">
                      <div className="adm-journey-dot" style={{ background: step.color }} />
                      {item}
                    </div>
                  ))}
                  {i === 0 && (
                    <Link
                      href={`/${locale}/registration/formal_registration`}
                      style={{ display: "inline-block", marginTop: ".85rem", fontSize: 13,
                        fontWeight: 700, color: C.primary, textDecoration: "underline",
                        textUnderlineOffset: 3 }}>
                      {isRtl ? "← نموذج التسجيل الرسمي" : "Formal Registration Form →"}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Registration of Interest + Documents ── */}
        <section className="adm-section">
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="adm-section-tag">📋 {isRtl ? "التسجيل والوثائق" : "Registration & Documents"}</div>
            <div className="adm-two-col">

              {/* Reg of Interest */}
              <div className="adm-info-card">
                <div className="adm-info-card-title">{adm.regInterest.title}</div>
                <div className="adm-info-card-sub" style={{ marginBottom: "1rem" }}>{adm.regInterest.desc}</div>
                {adm.regInterest.items.map((item, i) => (
                  <div key={i} className="adm-reg-item">
                    <div className="adm-reg-num">{i + 1}</div>
                    {item}
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div className="adm-info-card">
                  <div className="adm-info-card-title">{adm.documents.title}</div>
                  <div className="adm-info-card-sub">{adm.documents.subtitle}</div>
                  {adm.documents.list.map((doc, i) => (
                    <div key={i} className="adm-doc-item">
                      <div className="adm-doc-check">✓</div>
                      {doc}
                    </div>
                  ))}
                </div>

                {/* SEN */}
                <div className="adm-sen-card">
                  <div className="adm-sen-icon">♿</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 6 }}>{adm.sen.title}</div>
                    <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{adm.sen.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Payment Options + Fees ── */}
        <section className="adm-section" style={{ background: C.bg }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div className="adm-section-tag">💳 {isRtl ? "الرسوم والسداد" : "Fees & Payment"}</div>
            <div className="adm-two-col" style={{ gridTemplateColumns: "1fr" }}>

              {/* Payment card */}
              <div className="adm-payment-card">
                <div className="adm-payment-badge">✓ {adm.payment.badge}</div>
                <div className="adm-payment-partner">{adm.payment.partner}</div>
                <p className="adm-payment-desc">{adm.payment.desc}</p>
                <div className="adm-installments">
                  {[1,2,3,4,5,6].map(n => (
                    <div key={n} className={`adm-installment-pip${n <= 3 ? " active" : ""}`}>
                      {n}
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)", display: "flex", alignItems: "center", marginRight: 4 }}>
                    {isRtl ? "أقساط شهرية" : "monthly installments"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: ".85rem", flexWrap: "wrap", alignItems: "center", marginTop: "1.5rem", position: "relative", zIndex: 1 }}>
                  <a href={`tel:${PAYMENT_PHONE}`} dir="ltr"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,.10)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    📞 {PAYMENT_PHONE}
                  </a>
                  <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer"
                    aria-label={isRtl ? "الدفع الإلكتروني" : "Pay online"}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, background: "#B300C4", color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
                    💳 {isRtl ? "ادفع الآن" : "Pay Now"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. CTA ── */}
        <section className="adm-section" style={{ textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div className="adm-section-tag">🎓 {isRtl ? "ابدأ رحلتك" : "Start Your Journey"}</div>
            <h2 className="adm-h2" style={{ marginBottom: ".75rem" }}>
              {isRtl ? "جاهز للانضمام إلى مدارس الأفق؟" : "Ready to Join Horizon International Schools?"}
            </h2>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7, marginBottom: "2rem" }}>
              {isRtl
                ? "فريق القبول لدينا مستعد للإجابة على جميع استفساراتكم ومساعدتكم في كل خطوة."
                : "Our admissions team is ready to answer all your questions and guide you through every step."
              }
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a className="adm-cta-btn adm-cta-primary" href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                🎓 {tr.admissionsSteps.btnStart}
              </a>
            </div>
          </div>
        </section>

      </SubPage>
      </div>
    </>
  );
}
