"use client";
import { useEffect, useRef, useState } from "react";
import SubPage from "@/components/SubPage";
import { type Locale, t } from "@/lib/i18n";
import { RegisterModal, TourModal } from "@/components/Modals";

interface DbRow { id: string; group: string; term1: number; term2: number; term3: number; total: number; totalVat: number; }
interface DbOneTime { id: string; labelAr: string; labelEn: string; amount: number; noteAr: string; noteEn: string; }
interface DbSchedule { id: string; labelAr: string; labelEn: string; pct: string; dateAr: string; dateEn: string; }
interface DbAdditional { id: string; icon: string; labelAr: string; labelEn: string; valueAr: string; valueEn: string; }

const C = {
  primary: "#7A24B2", dark: "#2D0864",
  gold: "#B300C4", goldLight: "#FDE8FF",
  bg: "#FAF7FF", card: "#fff",
  border: "#E8E0F5", muted: "#5A5A5A", light: "#9CA3AF",
};

function fmtNum(n: number, locale: Locale) {
  return n.toLocaleString(locale === "ar" ? "ar-SA" : "en-US");
}

const CSS = `
  .fees-section { padding: 4rem 2rem; }
  .fees-section:nth-child(even) { background: #fff; }

  .fees-tag {
    display: inline-block; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: ${C.gold};
    background: rgba(179,0,196,.10); border: 1px solid rgba(179,0,196,.25);
    border-radius: 30px; padding: 4px 14px; margin-bottom: 1rem;
  }
  .fees-h2 {
    font-family: 'Amiri', serif;
    font-size: clamp(22px, 3vw, 34px);
    color: ${C.dark}; margin-bottom: 1.5rem; line-height: 1.3;
  }

  /* ── Fee Table ── */
  .fees-table-wrap { overflow-x: auto; border-radius: 16px; border: 1.5px solid ${C.border}; }
  .fees-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .fees-table thead th {
    background: ${C.dark}; color: rgba(255,255,255,.85);
    padding: 13px 18px; font-weight: 700; font-size: 12px;
    letter-spacing: .5px; white-space: nowrap; text-align: start;
  }
  .fees-table tbody td {
    padding: 13px 18px; border-bottom: 1px solid ${C.border};
    color: ${C.muted}; white-space: nowrap;
  }
  .fees-table tbody tr:last-child td { border-bottom: none; }
  .fees-table tbody tr:hover td { background: rgba(122,36,178,.03); }
  .fees-table .col-group { font-weight: 700; color: ${C.dark}; }
  .fees-table .col-total { font-weight: 700; color: ${C.primary}; }
  .fees-table .col-vat {
    font-weight: 800; color: ${C.gold};
    background: rgba(179,0,196,.06);
  }
  .fees-table tbody tr:nth-child(even) td { background: rgba(251,248,243,.6); }
  .fees-table tbody tr:nth-child(even) td.col-vat { background: rgba(179,0,196,.08); }

  /* ── Payment schedule ── */
  .sched-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
  }
  @media (max-width: 600px) { .sched-grid { grid-template-columns: 1fr; } }
  .sched-card {
    background: ${C.card}; border-radius: 16px;
    border: 1.5px solid ${C.border}; padding: 1.75rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .sched-pct {
    font-size: 40px; font-weight: 800; color: ${C.primary};
    line-height: 1; margin-bottom: .5rem;
  }
  .sched-label { font-size: 14px; font-weight: 700; color: ${C.dark}; margin-bottom: .35rem; }
  .sched-date {
    font-size: 12px; color: ${C.light}; font-weight: 600;
    background: rgba(122,36,178,.07); border-radius: 20px;
    display: inline-block; padding: 3px 12px;
  }

  /* ── One-time fees ── */
  .onetime-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;
  }
  .onetime-card {
    background: ${C.card}; border-radius: 16px;
    border: 1.5px solid ${C.border}; padding: 1.75rem;
    display: flex; flex-direction: column; gap: .6rem;
  }
  .onetime-amount {
    font-size: 30px; font-weight: 800; color: ${C.dark};
    line-height: 1;
  }
  .onetime-sar { font-size: 14px; color: ${C.light}; font-weight: 600; margin-bottom: .25rem; }
  .onetime-label { font-size: 15px; font-weight: 700; color: ${C.dark}; }
  .onetime-note {
    font-size: 12px; color: #DC2626;
    background: rgba(220,38,38,.06); border-radius: 8px;
    padding: 5px 10px; font-weight: 600;
  }

  /* ── Additional ── */
  .addl-list { display: flex; flex-direction: column; gap: .75rem; }
  .addl-item {
    background: ${C.card}; border-radius: 14px;
    border: 1.5px solid ${C.border};
    padding: 1rem 1.5rem;
    display: flex; align-items: center; gap: 1.25rem;
  }
  .addl-icon {
    width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
    background: rgba(122,36,178,.08);
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .addl-label { font-size: 13px; font-weight: 700; color: ${C.dark}; margin-bottom: 3px; }
  .addl-value { font-size: 13px; color: ${C.muted}; }

  /* ── BSF card ── */
  .bsf-card {
    background: linear-gradient(135deg, #1a0a3d 0%, #2d1562 100%);
    border-radius: 20px; padding: 2.5rem;
    display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
    position: relative; overflow: hidden;
  }
  .bsf-card::after {
    content: ''; position: absolute;
    bottom: -40px; right: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,.04); pointer-events: none;
  }
  .bsf-badge {
    display: inline-block; background: rgba(110,231,183,.15);
    border: 1px solid rgba(110,231,183,.35); color: #6EE7B7;
    border-radius: 30px; padding: 4px 14px;
    font-size: 12px; font-weight: 700; margin-bottom: .75rem;
  }
  .bsf-title { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: .5rem; }
  .bsf-desc { font-size: 13.5px; color: rgba(255,255,255,.60); line-height: 1.7; max-width: 480px; }
  .bsf-pips { display: flex; gap: .5rem; margin-top: 1.25rem; flex-wrap: wrap; }
  .bsf-pip {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: rgba(255,255,255,.45);
  }
  .bsf-pip.on { background: rgba(110,231,183,.18); border-color: rgba(110,231,183,.35); color: #6EE7B7; }

  /* ── Note card ── */
  .fees-note {
    background: rgba(179,0,196,.07); border: 1.5px solid rgba(179,0,196,.25);
    border-radius: 14px; padding: 1.25rem 1.5rem;
    font-size: 13px; color: ${C.muted}; line-height: 1.65;
    display: flex; gap: 10px; align-items: flex-start;
  }

  /* ── CTA ── */
  .fees-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 12px;
    font-size: 14px; font-weight: 700; font-family: 'Cairo', sans-serif;
    cursor: pointer; border: none; text-decoration: none; transition: all .2s;
  }
  .fees-cta-primary { background: linear-gradient(135deg, ${C.primary}, ${C.dark}); color: #fff; }
  .fees-cta-primary:hover { opacity: .9; transform: translateY(-1px); }
  .fees-cta-outline { background: #fff; color: ${C.dark}; border: 2px solid ${C.border} !important; }
  .fees-cta-outline:hover { border-color: rgba(122,36,178,.35) !important; }
`;

export default function FeesPage({ locale, dbRows, dbOneTime, dbSchedule, dbAdditional }: { locale: Locale; dbRows?: DbRow[] | null; dbOneTime?: DbOneTime[] | null; dbSchedule?: DbSchedule[] | null; dbAdditional?: DbAdditional[] | null }) {
  const tr   = t[locale];
  const fp   = tr.feesPage;
  const isRtl = locale === "ar";
  const rootRef = useRef<HTMLDivElement>(null);

  const [showReg,  setShowReg]  = useState(false);
  const [showTour, setShowTour] = useState(false);

  const rows = dbRows
    ? dbRows.map(r => ({ group: r.group, term1: fmtNum(r.term1, locale), term2: fmtNum(r.term2, locale), term3: fmtNum(r.term3, locale), total: fmtNum(r.total, locale), totalVat: fmtNum(r.totalVat, locale) }))
    : fp.rows;

  const oneTimeItems = dbOneTime
    ? dbOneTime.map(r => ({ label: isRtl ? r.labelAr : r.labelEn, amount: fmtNum(r.amount, locale), note: isRtl ? r.noteAr : r.noteEn }))
    : fp.oneTime.items;

  const scheduleTerms = dbSchedule
    ? dbSchedule.map(r => ({ label: isRtl ? r.labelAr : r.labelEn, pct: r.pct, date: isRtl ? r.dateAr : r.dateEn }))
    : fp.schedule.terms;

  const additionalItems = dbAdditional
    ? dbAdditional.map(r => ({ icon: r.icon, label: isRtl ? r.labelAr : r.labelEn, value: isRtl ? r.valueAr : r.valueEn }))
    : fp.additional.items;

  useEffect(() => {
    if (!rootRef.current) return;
    const els = rootRef.current.querySelectorAll<HTMLElement>(
      ".fees-tag,.fees-h2,.fees-table tbody tr,.sched-card,.onetime-card,.addl-item,.bsf-card"
    );
    els.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      el.style.transition = "opacity .28s ease, transform .28s ease";
    });
    const io = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; }, i * 35);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div ref={rootRef}>
        <SubPage locale={locale} title={tr.nav.fees}>

          {/* ── 1. Tuition Table ── */}
          <section className="fees-section" style={{ background: C.bg }}>
            <div style={{ maxWidth: 1050, margin: "0 auto" }}>
              <div className="fees-tag">💰 {fp.tag}</div>
              <h2 className="fees-h2">{fp.title}</h2>

              <div className="fees-table-wrap" style={{ marginBottom: "1.25rem" }}>
                <table className="fees-table">
                  <thead>
                    <tr>
                      <th>{fp.table.yearGroup}</th>
                      <th>{fp.table.term1}</th>
                      <th>{fp.table.term2}</th>
                      <th>{fp.table.term3}</th>
                      <th>{fp.table.total}</th>
                      <th>{fp.table.totalVat}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        <td className="col-group">{row.group}</td>
                        <td>{row.term1}</td>
                        <td>{row.term2}</td>
                        <td>{row.term3}</td>
                        <td className="col-total">{row.total}</td>
                        <td className="col-vat">{row.totalVat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 12, color: C.light, fontWeight: 600 }}>{fp.vatNote}</p>
                <p style={{ fontSize: 12, color: C.light }}>{fp.subjectToContract}</p>
              </div>
            </div>
          </section>

          {/* ── 2. Payment Schedule ── */}
          <section className="fees-section">
            <div style={{ maxWidth: 1050, margin: "0 auto" }}>
              <div className="fees-tag">📅 {isRtl ? "مواعيد السداد" : "Payment Dates"}</div>
              <h2 className="fees-h2">{fp.schedule.title}</h2>
              <div className="sched-grid">
                {scheduleTerms.map((term, i) => (
                  <div key={i} className="sched-card">
                    <div className="sched-pct">{term.pct}</div>
                    <div className="sched-label">{term.label}</div>
                    <div className="sched-date">📅 {term.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 3. One-time fees ── */}
          <section className="fees-section" style={{ background: C.bg }}>
            <div style={{ maxWidth: 1050, margin: "0 auto" }}>
              <div className="fees-tag">🔖 {isRtl ? "رسوم التسجيل" : "Registration Fees"}</div>
              <h2 className="fees-h2">{fp.oneTime.title}</h2>
              <div className="onetime-grid">
                {oneTimeItems.map((item, i) => (
                  <div key={i} className="onetime-card">
                    <div className="onetime-sar">{fp.currency}</div>
                    <div className="onetime-amount">{item.amount}</div>
                    <div className="onetime-label">{item.label}</div>
                    <div className="onetime-note">⚠ {item.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 4. Additional + BSF ── */}
          <section className="fees-section">
            <div style={{ maxWidth: 1050, margin: "0 auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2rem" }}>

                {/* Additional charges */}
                <div>
                  <div className="fees-tag">📋 {isRtl ? "رسوم إضافية" : "Additional"}</div>
                  <h2 className="fees-h2" style={{ marginBottom: "1rem" }}>{fp.additional.title}</h2>
                  <div className="addl-list">
                    {additionalItems.map((item, i) => (
                      <div key={i} className="addl-item">
                        <div className="addl-icon">{item.icon}</div>
                        <div>
                          <div className="addl-label">{item.label}</div>
                          <div className="addl-value">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BSF + note */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="bsf-card">
                    <div style={{ position: "relative" }}>
                      <div className="bsf-badge">✓ {fp.bsfTitle}</div>
                      <div className="bsf-title">BSF</div>
                      <p className="bsf-desc">{fp.bsfDesc}</p>
                      <div className="bsf-pips">
                        {[1,2,3,4,5,6].map(n => (
                          <div key={n} className={`bsf-pip${n <= 4 ? " on" : ""}`}>{n}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="fees-note">
                    <span style={{ fontSize: 18, flexShrink: 0 }}>📌</span>
                    <span>{fp.subjectToContract}</span>
                  </div>

                  <div className="fees-note" style={{ background: "rgba(220,38,38,.05)", borderColor: "rgba(220,38,38,.15)" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                    <span style={{ color: "#991B1B" }}>{fp.vatNote}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. CTA ── */}
          <section className="fees-section" style={{ background: C.bg, textAlign: "center" }}>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div className="fees-tag">🎓 {isRtl ? "ابدأ الآن" : "Get Started"}</div>
              <h2 className="fees-h2">
                {isRtl ? "هل أنت مستعد للانضمام إلى مدارس الأفق؟" : "Ready to Join Horizon International Schools?"}
              </h2>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: "2rem" }}>
                {isRtl
                  ? "تواصل مع فريق القبول للاستفسار عن الرسوم أو لحجز جولة مدرسية مجانية."
                  : "Contact our admissions team for fee enquiries or to book a free school tour."}
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="fees-cta-btn fees-cta-primary" onClick={() => setShowReg(true)}>
                  🎓 {tr.nav.register}
                </button>
                <button className="fees-cta-btn fees-cta-outline" onClick={() => setShowTour(true)}>
                  🏫 {tr.nav.tour}
                </button>
              </div>
            </div>
          </section>

        </SubPage>
      </div>

      <RegisterModal open={showReg}  onClose={() => setShowReg(false)}  locale={locale} />
      <TourModal     open={showTour} onClose={() => setShowTour(false)} locale={locale} />
    </>
  );
}
