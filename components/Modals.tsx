"use client";
import { useState } from "react";
import { Modal, Toast, Field, inputStyle, btnPrimary, btnOutline, SuccessBox } from "./Modal";
import { type Locale, t } from "@/lib/i18n";

type ToastMsg = { title: string; desc: string; type: "success" | "error" } | null;

/* ── REGISTER MODAL ── */
export function RegisterModal({ open, onClose, locale }: { open: boolean; onClose: () => void; locale: Locale }) {
  const tr = t[locale].modals.register;
  const val = t[locale].validation;
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<ToastMsg>(null);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ studentName: "", dob: "", gender: "", level: "", year: tr.years[0], parentName: "", phone: "", email: "", nationality: "", source: "", notes: "", agree: false });

  const set = (k: string, v: string | boolean) => setF(p => ({ ...p, [k]: v }));
  const toast_err = (msg: string) => setToast({ title: "⚠️", desc: msg, type: "error" });

  const next = async () => {
    if (step === 1) {
      if (!f.studentName || !f.level) return toast_err(val.required);
      setStep(2);
    } else if (step === 2) {
      if (!f.parentName || !f.phone || !f.email) return toast_err(val.required);
      setStep(3);
    } else {
      if (!f.agree) return toast_err(val.agree);
      setLoading(true);
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      setLoading(false);
      if (res.ok) { setDone(true); setToast({ title: val.sent, desc: val.sentDesc, type: "success" }); }
      else toast_err("حدث خطأ، يرجى المحاولة مجدداً");
    }
  };

  const reset = () => { setStep(1); setDone(false); setF({ studentName: "", dob: "", gender: "", level: "", year: tr.years[0], parentName: "", phone: "", email: "", nationality: "", source: "", notes: "", agree: false }); onClose(); };

  const StepTabs = () => (
    <div style={{ display: "flex", gap: 0, marginBottom: "1.75rem", borderRadius: 10, overflow: "hidden", border: "1px solid #E8E0F5" }}>
      {[tr.tab1, tr.tab2, tr.tab3].map((label, i) => (
        <button key={i} style={{ flex: 1, padding: 10, textAlign: "center", fontSize: 12.5, fontWeight: 600, color: step === i + 1 ? "#fff" : "#8A8A8A", background: step === i + 1 ? "#7A24B2" : "#FAF7FF", border: "none", cursor: "default", fontFamily: "Cairo, sans-serif", borderInlineStart: i > 0 ? "1px solid #E8E0F5" : "none" }}>{label}</button>
      ))}
    </div>
  );

  return (
    <>
      <Modal open={open} onClose={reset} title={tr.title} subtitle={tr.subtitle} icon="🎓"
        footer={done ? <button onClick={reset} style={btnPrimary}>{tr.close}</button> : (
          <>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} style={btnOutline}>{tr.prev}</button>}
            <button onClick={next} style={{ ...btnPrimary, opacity: loading ? .7 : 1 }} disabled={loading}>
              {loading ? "..." : step === 3 ? tr.submit : tr.next}
            </button>
          </>
        )}>
        {done ? <SuccessBox icon="🎉" title={tr.successTitle} desc={tr.successDesc} /> : (
          <>
            <StepTabs />
            {step === 1 && (
              <>
                <Field label={tr.studentName} required><input style={inputStyle} value={f.studentName} onChange={e => set("studentName", e.target.value)} placeholder={tr.studentName.replace(" *", "")} /></Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label={tr.dob}><input type="date" style={inputStyle} value={f.dob} onChange={e => set("dob", e.target.value)} /></Field>
                  <Field label={tr.gender}>
                    <select style={inputStyle} value={f.gender} onChange={e => set("gender", e.target.value)}>
                      <option value=""></option>
                      <option value="male">{tr.male}</option>
                      <option value="female">{tr.female}</option>
                    </select>
                  </Field>
                </div>
                <Field label={tr.level} required>
                  <select style={inputStyle} value={f.level} onChange={e => set("level", e.target.value)}>
                    <option value=""></option>
                    {tr.levels.map((l, i) => <option key={i} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label={tr.year}>
                  <select style={inputStyle} value={f.year} onChange={e => set("year", e.target.value)}>
                    {tr.years.map((y, i) => <option key={i} value={y}>{y}</option>)}
                  </select>
                </Field>
              </>
            )}
            {step === 2 && (
              <>
                <Field label={tr.parentName} required><input style={inputStyle} value={f.parentName} onChange={e => set("parentName", e.target.value)} /></Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label={tr.phone} required><input type="tel" style={inputStyle} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+966 5X XXX XXXX" /></Field>
                  <Field label={tr.email} required><input type="email" style={inputStyle} value={f.email} onChange={e => set("email", e.target.value)} placeholder="example@email.com" /></Field>
                </div>
                <Field label={tr.nationality}>
                  <select style={inputStyle} value={f.nationality} onChange={e => set("nationality", e.target.value)}>
                    <option value=""></option>
                    {tr.nationalities.map((n, i) => <option key={i} value={n}>{n}</option>)}
                  </select>
                </Field>
                <Field label={tr.source}>
                  <select style={inputStyle} value={f.source} onChange={e => set("source", e.target.value)}>
                    <option value=""></option>
                    {tr.sources.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  </select>
                </Field>
              </>
            )}
            {step === 3 && (
              <>
                <div style={{ background: "#FAF7FF", borderRadius: 12, padding: "1.25rem", border: "1px solid #E8E0F5", marginBottom: "1rem" }}>
                  <div style={{ fontSize: 13, color: "#8A8A8A", marginBottom: "0.75rem", fontWeight: 600 }}>{tr.summaryTitle}</div>
                  <div style={{ fontSize: 14, color: "#5A5A5A", lineHeight: 2 }}>
                    <b>{tr.studentName.replace(" *", "")}:</b> {f.studentName}<br />
                    <b>{tr.level.replace(" *", "")}:</b> {f.level}<br />
                    <b>{tr.year}:</b> {f.year}<br />
                    <b>{tr.parentName.replace(" *", "")}:</b> {f.parentName}<br />
                    <b>{tr.phone.replace(" *", "")}:</b> {f.phone}<br />
                    <b>{tr.email.replace(" *", "")}:</b> {f.email}
                  </div>
                </div>
                <Field label={tr.notes}><textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={f.notes} onChange={e => set("notes", e.target.value)} /></Field>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#5A5A5A", cursor: "pointer" }}>
                  <input type="checkbox" checked={f.agree} onChange={e => set("agree", e.target.checked)} style={{ marginTop: 3 }} />
                  {tr.agree}
                </label>
              </>
            )}
          </>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}

/* ── TOUR MODAL ── */
export function TourModal({ open, onClose, locale }: { open: boolean; onClose: () => void; locale: Locale }) {
  const tr = t[locale].modals.tour;
  const val = t[locale].validation;
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<ToastMsg>(null);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", day: "", time: tr.times[0], children: tr.childrenOpts[0] });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!f.name || !f.phone) return setToast({ title: "⚠️", desc: val.required, type: "error" });
    if (!f.day) return setToast({ title: "⚠️", desc: val.dayRequired, type: "error" });
    setLoading(true);
    const res = await fetch("/api/tour", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setLoading(false);
    if (res.ok) { setDone(true); setToast({ title: val.booked, desc: `${f.day} — ${f.time}`, type: "success" }); }
    else setToast({ title: "⚠️", desc: "Error, please try again", type: "error" });
  };

  const reset = () => { setDone(false); setF({ name: "", phone: "", email: "", day: "", time: tr.times[0], children: tr.childrenOpts[0] }); onClose(); };

  return (
    <>
      <Modal open={open} onClose={reset} title={tr.title} subtitle={tr.subtitle} icon="🏫"
        footer={done ? <button onClick={reset} style={btnPrimary}>{tr.close}</button> : (
          <>
            <button onClick={reset} style={btnOutline}>{tr.cancel}</button>
            <button onClick={submit} style={{ ...btnPrimary, opacity: loading ? .7 : 1 }} disabled={loading}>{loading ? "..." : tr.confirm}</button>
          </>
        )}>
        {done ? <SuccessBox icon="🏫" title={tr.successTitle} desc={`${f.name} — ${f.day} ${f.time}`} /> : (
          <>
            <Field label={tr.name} required><input style={inputStyle} value={f.name} onChange={e => set("name", e.target.value)} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label={tr.phone} required><input type="tel" style={inputStyle} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+966 5X XXX XXXX" /></Field>
              <Field label={tr.email}><input type="email" style={inputStyle} value={f.email} onChange={e => set("email", e.target.value)} /></Field>
            </div>
            <Field label={tr.dayLabel} required>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: 6 }}>
                {tr.days.map((d, i) => (
                  <label key={i} style={{ cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="radio" name="tour_day" value={d} checked={f.day === d} onChange={() => set("day", d)} />
                    {d}
                  </label>
                ))}
              </div>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label={tr.time}>
                <select style={inputStyle} value={f.time} onChange={e => set("time", e.target.value)}>
                  {tr.times.map((tm, i) => <option key={i}>{tm}</option>)}
                </select>
              </Field>
              <Field label={tr.children}>
                <select style={inputStyle} value={f.children} onChange={e => set("children", e.target.value)}>
                  {tr.childrenOpts.map((c, i) => <option key={i}>{c}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}

/* ── EVENT MODAL ── */
export function EventModal({ open, onClose, locale }: { open: boolean; onClose: () => void; locale: Locale }) {
  const tr = t[locale].modals.event;
  const val = t[locale].validation;
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState<ToastMsg>(null);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", count: tr.counts[0], ageGroups: [] as string[] });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));
  const toggleAge = (ag: string) => setF(p => ({ ...p, ageGroups: p.ageGroups.includes(ag) ? p.ageGroups.filter(x => x !== ag) : [...p.ageGroups, ag] }));

  const submit = async () => {
    if (!f.name || !f.phone || !f.email) return setToast({ title: "⚠️", desc: val.required, type: "error" });
    setLoading(true);
    const res = await fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setLoading(false);
    if (res.ok) { setDone(true); setToast({ title: val.registered, desc: f.email, type: "success" }); }
    else setToast({ title: "⚠️", desc: "Error", type: "error" });
  };

  const reset = () => { setDone(false); setF({ name: "", phone: "", email: "", count: tr.counts[0], ageGroups: [] }); onClose(); };

  return (
    <>
      <Modal open={open} onClose={reset} title={tr.title} subtitle={tr.subtitle} icon="📅"
        footer={done ? <button onClick={reset} style={btnPrimary}>{tr.close}</button> : (
          <>
            <button onClick={reset} style={btnOutline}>{tr.cancel}</button>
            <button onClick={submit} style={{ ...btnPrimary, opacity: loading ? .7 : 1 }} disabled={loading}>{loading ? "..." : tr.confirm}</button>
          </>
        )}>
        {done ? <SuccessBox icon="🎊" title={tr.successTitle} desc={tr.successDesc} /> : (
          <>
            <div style={{ background: "rgba(179,0,196,.08)", border: "1px solid rgba(179,0,196,.25)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.25rem", fontSize: 14, color: "#8800CC", display: "flex", gap: 10 }}>
              <span>ℹ️</span><div>{tr.info}</div>
            </div>
            <Field label={tr.name} required><input style={inputStyle} value={f.name} onChange={e => set("name", e.target.value)} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field label={tr.phone} required><input type="tel" style={inputStyle} value={f.phone} onChange={e => set("phone", e.target.value)} placeholder="+966 5X" /></Field>
              <Field label={tr.email} required><input type="email" style={inputStyle} value={f.email} onChange={e => set("email", e.target.value)} /></Field>
            </div>
            <Field label={tr.count}>
              <select style={inputStyle} value={f.count} onChange={e => set("count", e.target.value)}>
                {tr.counts.map((c, i) => <option key={i}>{c}</option>)}
              </select>
            </Field>
            <Field label={tr.ageLabel}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                {tr.ageGroups.map((ag, i) => (
                  <label key={i} style={{ cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={f.ageGroups.includes(ag)} onChange={() => toggleAge(ag)} />
                    {ag}
                  </label>
                ))}
              </div>
            </Field>
          </>
        )}
      </Modal>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}
