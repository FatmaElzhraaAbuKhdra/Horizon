"use client";
import { useCallback, useEffect, useState } from "react";

interface BiFieldProps {
  label: string;
  arKey: string;
  enKey: string;
  obj: Record<string, unknown>;
  onChange: (key: string, val: string) => void;
  textarea?: boolean;
}

function BiField({ label, arKey, enKey, obj, onChange, textarea }: BiFieldProps) {
  return (
    <div style={{ marginBottom: ".75rem" }}>
      <div className="ev-lang-header">{label}</div>
      <div className="ev-grid" style={{ marginBottom: 0 }}>
        <div className="ev-field">
          <div className="ev-label">عربي</div>
          {textarea
            ? <textarea className="ev-input ev-textarea" style={{ direction: "rtl" }} value={(obj[arKey] as string) ?? ""} onChange={e => onChange(arKey, e.target.value)} />
            : <input className="ev-input" style={{ direction: "rtl" }} value={(obj[arKey] as string) ?? ""} onChange={e => onChange(arKey, e.target.value)} />}
        </div>
        <div className="ev-field">
          <div className="ev-label">English</div>
          {textarea
            ? <textarea className="ev-input ev-textarea" style={{ direction: "ltr" }} value={(obj[enKey] as string) ?? ""} onChange={e => onChange(enKey, e.target.value)} />
            : <input className="ev-input" style={{ direction: "ltr" }} value={(obj[enKey] as string) ?? ""} onChange={e => onChange(enKey, e.target.value)} />}
        </div>
      </div>
    </div>
  );
}

interface SchoolEvent {
  id: string; active: boolean;
  titleAr: string; titleEn: string;
  dateAr: string; dateEn: string;
  timeAr: string; timeEn: string;
  locationAr: string; locationEn: string;
  descAr: string; descEn: string;
  dateISO: string;
}

const EMPTY: Omit<SchoolEvent, "id"> = {
  active: true,
  titleAr: "", titleEn: "",
  dateAr: "", dateEn: "",
  timeAr: "", timeEn: "",
  locationAr: "", locationEn: "",
  descAr: "", descEn: "",
  dateISO: "",
};

const CSS = `
  .ev-wrap { padding: 2rem 2.5rem; }
  .ev-title { font-size: 22px; font-weight: 800; color: #101828; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .ev-sub   { font-size: 13.5px; color: #667085; margin-bottom: 2rem; }
  .ev-card  { background: #fff; border-radius: 16px; border: 1px solid #E4E0EC; padding: 1.75rem; margin-bottom: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
  .ev-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; margin-bottom: 1rem; }
  .ev-field { display: flex; flex-direction: column; gap: 4px; }
  .ev-label { font-size: 11px; font-weight: 700; color: #667085; letter-spacing: .4px; }
  .ev-input {
    width: 100%; padding: 7px 11px; border-radius: 8px;
    border: 1.5px solid #D1D5DB; font-size: 13px;
    font-family: Cairo, sans-serif; outline: none;
    background: #F9FAFB; color: #101828; box-sizing: border-box;
    transition: border-color .2s, box-shadow .2s;
  }
  .ev-input:focus { border-color: #7A24B2; background: #fff; box-shadow: 0 0 0 3px rgba(122,36,178,.10); }
  .ev-textarea { resize: vertical; min-height: 70px; }
  .ev-btn {
    padding: 8px 16px; border-radius: 9px; font-size: 13px;
    font-family: Cairo, sans-serif; cursor: pointer; font-weight: 600;
    transition: all .15s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .ev-btn:disabled { opacity: .5; cursor: not-allowed; }
  .ev-btn-primary { background: #7A24B2; color: #fff; border-color: #7A24B2; }
  .ev-btn-primary:hover:not(:disabled) { background: #2D0864; }
  .ev-btn-save    { background: #9333EA; border-color: #9333EA; color: #fff; }
  .ev-btn-save:hover:not(:disabled) { background: #7E22CE; }
  .ev-btn-ghost   { background: #fff; border-color: #E4E0EC; color: #374151; }
  .ev-btn-ghost:hover:not(:disabled) { background: #F9FAFB; }
  .ev-btn-danger  { background: #FFF1F0; border-color: #FFD0CC; color: #DC2626; }
  .ev-btn-danger:hover:not(:disabled) { background: #FFE4E1; }
  .ev-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .ev-badge-active   { background: rgba(5,150,105,.10); color: #9333EA; border: 1px solid rgba(5,150,105,.25); }
  .ev-badge-inactive { background: rgba(156,163,175,.10); color: #6B7280; border: 1px solid rgba(156,163,175,.25); }
  .ev-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 1.25rem; justify-content: flex-end; }
  .ev-add-form { background: #F0FDF8; border: 1.5px dashed rgba(122,36,178,.30); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .ev-lang-header { font-size: 12px; font-weight: 800; color: #2D0864; margin-bottom: .5rem; }
  .ev-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #2D0864; color: #fff; padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); z-index: 9999; }
`;

export default function SchoolEventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [editing, setEditing] = useState<Record<string, Partial<SchoolEvent>>>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newEv, setNewEv]     = useState<Omit<SchoolEvent,"id">>(EMPTY);
  const [adding, setAdding]   = useState(false);
  const [toast, setToast]     = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const load = useCallback(() => {
    fetch("/api/admin/school-events").then(r => r.json()).then(setEvents);
  }, []);
  useEffect(load, [load]);

  const startEdit = (ev: SchoolEvent) => setEditing(p => ({ ...p, [ev.id]: { ...ev } }));
  const cancelEdit = (id: string) => setEditing(p => { const n = { ...p }; delete n[id]; return n; });
  const updateField = (id: string, field: string, val: string | boolean) =>
    setEditing(p => ({ ...p, [id]: { ...p[id], [field]: val } }));

  const save = async (id: string) => {
    setSaving(id);
    await fetch(`/api/admin/school-events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing[id]),
    });
    setSaving(null); cancelEdit(id); load(); showToast("✓ تم الحفظ");
  };

  const del = async (id: string) => {
    if (!confirm("حذف هذه الفعالية نهائياً؟")) return;
    await fetch(`/api/admin/school-events/${id}`, { method: "DELETE" });
    load(); showToast("تم الحذف");
  };

  const add = async () => {
    if (!newEv.titleAr) return;
    setAdding(true);
    await fetch("/api/admin/school-events", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEv),
    });
    setAdding(false); setShowAdd(false); setNewEv(EMPTY); load(); showToast("✓ تمت الإضافة");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ev-wrap">
        <div className="ev-title">📅 إدارة فعاليات المدرسة</div>
        <p className="ev-sub">الفعالية النشطة تظهر في الصفحة الرئيسية وصفحة الفعاليات</p>

        <div style={{ marginBottom: "1.5rem" }}>
          <button className="ev-btn ev-btn-primary" onClick={() => setShowAdd(s => !s)}>
            {showAdd ? "✕ إلغاء" : "+ إضافة فعالية جديدة"}
          </button>
        </div>

        {showAdd && (
          <div className="ev-add-form">
            <div style={{ fontSize: 14, fontWeight: 800, color: "#2D0864", marginBottom: "1rem" }}>فعالية جديدة</div>
            <BiField label="العنوان" arKey="titleAr" enKey="titleEn" obj={newEv} onChange={(k: string, v: string) => setNewEv(p => ({ ...p, [k]: v }))} />
            <BiField label="التاريخ" arKey="dateAr" enKey="dateEn" obj={newEv} onChange={(k: string, v: string) => setNewEv(p => ({ ...p, [k]: v }))} />
            <BiField label="الوقت" arKey="timeAr" enKey="timeEn" obj={newEv} onChange={(k: string, v: string) => setNewEv(p => ({ ...p, [k]: v }))} />
            <BiField label="الموقع" arKey="locationAr" enKey="locationEn" obj={newEv} onChange={(k: string, v: string) => setNewEv(p => ({ ...p, [k]: v }))} />
            <BiField label="الوصف" arKey="descAr" enKey="descEn" obj={newEv} onChange={(k: string, v: string) => setNewEv(p => ({ ...p, [k]: v }))} textarea />
            <div className="ev-field" style={{ marginBottom: ".75rem" }}>
              <div className="ev-label">⏱ تاريخ ووقت العد التنازلي</div>
              <input type="datetime-local" className="ev-input" style={{ direction: "ltr", maxWidth: 280 }}
                value={newEv.dateISO} onChange={e => setNewEv(p => ({ ...p, dateISO: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
              <button className="ev-btn ev-btn-save" onClick={add} disabled={adding || !newEv.titleAr}>
                {adding ? "..." : "✓ إضافة"}
              </button>
              <button className="ev-btn ev-btn-ghost" onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        {events.map(ev => {
          const isEditing = !!editing[ev.id];
          const cur = editing[ev.id] ?? ev;
          return (
            <div key={ev.id} className="ev-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#2D0864" }}>{ev.titleAr}</div>
                  <div style={{ fontSize: 13, color: "#667085", direction: "ltr" }}>{ev.titleEn}</div>
                  <div style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 4 }}>📅 {ev.dateAr} — 🕙 {ev.timeAr} — 📍 {ev.locationAr}</div>
                </div>
                <span className={`ev-badge ${ev.active ? "ev-badge-active" : "ev-badge-inactive"}`}>
                  {ev.active ? "● نشط" : "○ غير نشط"}
                </span>
              </div>

              {isEditing ? (
                <div>
                  <BiField label="العنوان" arKey="titleAr" enKey="titleEn" obj={cur} onChange={(k: string, v: string) => updateField(ev.id, k, v)} />
                  <BiField label="التاريخ" arKey="dateAr" enKey="dateEn" obj={cur} onChange={(k: string, v: string) => updateField(ev.id, k, v)} />
                  <BiField label="الوقت" arKey="timeAr" enKey="timeEn" obj={cur} onChange={(k: string, v: string) => updateField(ev.id, k, v)} />
                  <BiField label="الموقع" arKey="locationAr" enKey="locationEn" obj={cur} onChange={(k: string, v: string) => updateField(ev.id, k, v)} />
                  <BiField label="الوصف" arKey="descAr" enKey="descEn" obj={cur} onChange={(k: string, v: string) => updateField(ev.id, k, v)} textarea />
                  <div className="ev-field" style={{ marginBottom: ".75rem" }}>
                    <div className="ev-label">⏱ تاريخ ووقت العد التنازلي</div>
                    <input type="datetime-local" className="ev-input" style={{ direction: "ltr", maxWidth: 280 }}
                      value={(cur as any).dateISO ?? ""} onChange={e => updateField(ev.id, "dateISO", e.target.value)} />
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: ".5rem", alignItems: "center" }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input type="checkbox" checked={!!(cur as any).active} onChange={e => updateField(ev.id, "active", e.target.checked)} />
                      نشط على الموقع
                    </label>
                  </div>
                  <div className="ev-actions">
                    <button className="ev-btn ev-btn-save" onClick={() => save(ev.id)} disabled={saving === ev.id}>
                      {saving === ev.id ? "..." : "✓ حفظ"}
                    </button>
                    <button className="ev-btn ev-btn-ghost" onClick={() => cancelEdit(ev.id)}>إلغاء</button>
                  </div>
                </div>
              ) : (
                <div className="ev-actions">
                  <button className="ev-btn ev-btn-ghost" onClick={() => startEdit(ev)}>✏️ تعديل</button>
                  <button className="ev-btn ev-btn-danger" onClick={() => del(ev.id)}>حذف</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {toast && <div className="ev-toast">{toast}</div>}
    </>
  );
}
