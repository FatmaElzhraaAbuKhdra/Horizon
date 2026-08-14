"use client";
import { useCallback, useEffect, useState } from "react";

interface Testimonial {
  id: string; name: string; initials: string; sortOrder: number;
  textAr: string; textEn: string;
  roleAr: string; roleEn: string;
}

interface Pending {
  id: string; name: string; roleAr: string; textAr: string; textEn: string; phone: string; createdAt: string;
}

const EMPTY: Omit<Testimonial, "id"> = {
  textAr: "", textEn: "", name: "", roleAr: "", roleEn: "", initials: "", sortOrder: 0,
};

const CSS = `
  .tm-wrap  { padding: 2rem 2.5rem; }
  .tm-title { font-size: 22px; font-weight: 800; color: #101828; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .tm-sub   { font-size: 13.5px; color: #667085; margin-bottom: 2rem; }
  .tm-card  { background: #fff; border-radius: 16px; border: 1px solid #E4E0EC; padding: 1.75rem; margin-bottom: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
  .tm-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
  .tm-field { display: flex; flex-direction: column; gap: 4px; }
  .tm-label { font-size: 11px; font-weight: 700; color: #667085; letter-spacing: .4px; }
  .tm-input {
    width: 100%; padding: 7px 11px; border-radius: 8px;
    border: 1.5px solid #D1D5DB; font-size: 13px;
    font-family: Cairo, sans-serif; outline: none;
    background: #F9FAFB; color: #101828; box-sizing: border-box;
    transition: border-color .2s, box-shadow .2s;
  }
  .tm-input:focus { border-color: #7A24B2; background: #fff; box-shadow: 0 0 0 3px rgba(122,36,178,.10); }
  .tm-textarea { resize: vertical; min-height: 80px; }
  .tm-btn {
    padding: 8px 16px; border-radius: 9px; font-size: 13px;
    font-family: Cairo, sans-serif; cursor: pointer; font-weight: 600;
    transition: all .15s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .tm-btn:disabled { opacity: .5; cursor: not-allowed; }
  .tm-btn-primary { background: #7A24B2; color: #fff; border-color: #7A24B2; }
  .tm-btn-primary:hover:not(:disabled) { background: #2D0864; }
  .tm-btn-save    { background: #9333EA; border-color: #9333EA; color: #fff; }
  .tm-btn-save:hover:not(:disabled) { background: #7E22CE; }
  .tm-btn-ghost   { background: #fff; border-color: #E4E0EC; color: #374151; }
  .tm-btn-ghost:hover:not(:disabled) { background: #F9FAFB; }
  .tm-btn-danger  { background: #FFF1F0; border-color: #FFD0CC; color: #DC2626; }
  .tm-btn-danger:hover:not(:disabled) { background: #FFE4E1; }
  .tm-btn-approve { background: #F4ECFD; border-color: #6EE7B7; color: #7C3AED; }
  .tm-btn-approve:hover:not(:disabled) { background: #EDD1FA; }
  .tm-actions { display: flex; gap: 8px; margin-top: 1rem; justify-content: flex-end; }
  .tm-avatar { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg,#7A24B2,#2D0864); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #fff; flex-shrink: 0; }
  .tm-add-form { background: #F0FDF8; border: 1.5px dashed rgba(122,36,178,.30); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .tm-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #2D0864; color: #fff; padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); z-index: 9999; }
  .tm-pending-card { background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem; }
  .tm-section-title { font-size: 16px; font-weight: 800; color: #101828; margin-bottom: 1rem; padding-bottom: .75rem; border-bottom: 2px solid #E4E0EC; display: flex; align-items: center; gap: 8px; }
  .tm-badge { background: #DC2626; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
  .link-box { background: #F0FDF8; border: 1.5px solid #6EE7B7; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 12px; }
  .link-url { flex: 1; font-size: 13px; color: #7C3AED; font-family: monospace; word-break: break-all; }
  .tm-btn-copy { background: #7A24B2; color: #fff; border-color: #7A24B2; }
  .tm-btn-copy:hover { background: #2D0864; }
`;

export default function TestimonialsPage() {
  const [items, setItems]     = useState<Testimonial[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [editing, setEditing] = useState<Record<string, Partial<Testimonial>>>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTm, setNewTm]     = useState<Omit<Testimonial,"id">>(EMPTY);
  const [adding, setAdding]   = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [toast, setToast]     = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const siteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/ar/submit-review`
    : "/ar/submit-review";

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("✓ تم نسخ الرابط");
  };

  const load = useCallback(() => {
    fetch("/api/admin/testimonials")
      .then(r => r.ok ? r.json() : []).then(setItems).catch(() => {});
    fetch("/api/admin/testimonials/pending")
      .then(r => r.ok ? r.json() : []).then(setPending).catch(() => {});
  }, []);
  useEffect(load, [load]);

  const startEdit = (t: Testimonial) => setEditing(p => ({ ...p, [t.id]: { ...t } }));
  const cancelEdit = (id: string) => setEditing(p => { const n = { ...p }; delete n[id]; return n; });
  const updateField = (id: string, field: string, val: string) =>
    setEditing(p => ({ ...p, [id]: { ...p[id], [field]: val } }));

  const save = async (id: string) => {
    setSaving(id);
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing[id]),
    });
    setSaving(null); cancelEdit(id); load(); showToast("✓ تم الحفظ");
  };

  const del = async (id: string) => {
    if (!confirm("حذف هذه الشهادة نهائياً؟")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load(); showToast("تم الحذف");
  };

  const approve = async (id: string) => {
    setApproving(id);
    await fetch(`/api/admin/testimonials/pending/${id}`, { method: "POST" });
    setApproving(null); load(); showToast("✓ تمت الموافقة ونُشر الرأي");
  };

  const reject = async (id: string) => {
    if (!confirm("رفض هذا الرأي؟")) return;
    await fetch(`/api/admin/testimonials/pending/${id}`, { method: "DELETE" });
    load(); showToast("تم الرفض");
  };

  const add = async () => {
    if (!newTm.name || !newTm.textAr) return;
    setAdding(true);
    await fetch("/api/admin/testimonials", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTm),
    });
    setAdding(false); setShowAdd(false); setNewTm(EMPTY); load(); showToast("✓ تمت الإضافة");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="tm-wrap">
        <div className="tm-title">💬 إدارة شهادات أولياء الأمور</div>
        <p className="tm-sub">تظهر في قسم «آراء أولياء الأمور» في الصفحة الرئيسية</p>

        {/* Share link */}
        <div className="link-box">
          <span style={{ fontSize: 20 }}>🔗</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", marginBottom: 4 }}>رابط فورم إرسال الرأي لأولياء الأمور</div>
            <div className="link-url">{siteUrl}</div>
          </div>
          <button className="tm-btn tm-btn-copy" onClick={copyLink}>
            {copied ? "✓ تم النسخ" : "نسخ الرابط"}
          </button>
        </div>

        {/* Pending submissions */}
        {pending.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <div className="tm-section-title">
              ⏳ آراء في انتظار الموافقة
              <span className="tm-badge">{pending.length}</span>
            </div>
            {pending.map(p => (
              <div key={p.id} className="tm-pending-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".75rem" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#2D0B55" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#667085" }}>{p.roleAr}</div>
                    {p.phone && <div style={{ fontSize: 12, color: "#667085", direction: "ltr", textAlign: "right" }}>{p.phone}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                    {new Date(p.createdAt).toLocaleDateString("ar-SA")}
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: "0 0 1rem", direction: "rtl" }}>
                  "{p.textAr}"
                </p>
                <div className="tm-actions">
                  <button className="tm-btn tm-btn-approve" onClick={() => approve(p.id)} disabled={approving === p.id}>
                    {approving === p.id ? "..." : "✓ موافقة ونشر"}
                  </button>
                  <button className="tm-btn tm-btn-danger" onClick={() => reject(p.id)}>رفض</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Published testimonials */}
        <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="tm-section-title" style={{ margin: 0, border: "none", paddingBottom: 0 }}>
            ✅ الشهادات المنشورة
          </div>
          <button className="tm-btn tm-btn-primary" onClick={() => setShowAdd(s => !s)}>
            {showAdd ? "✕ إلغاء" : "+ إضافة يدوية"}
          </button>
        </div>

        {showAdd && (
          <div className="tm-add-form">
            <div style={{ fontSize: 14, fontWeight: 800, color: "#2D0864", marginBottom: "1rem" }}>شهادة جديدة</div>
            <div className="tm-grid" style={{ marginBottom: ".75rem" }}>
              <div className="tm-field">
                <div className="tm-label">اسم ولي الأمر</div>
                <input className="tm-input" value={newTm.name} onChange={e => setNewTm(p => ({ ...p, name: e.target.value }))} placeholder="الاسم الكامل" />
              </div>
              <div className="tm-field">
                <div className="tm-label">الأحرف الأولى (initials)</div>
                <input className="tm-input" value={newTm.initials} onChange={e => setNewTm(p => ({ ...p, initials: e.target.value }))} placeholder="ن.ع" />
              </div>
            </div>
            <div className="tm-grid" style={{ marginBottom: ".75rem" }}>
              <div className="tm-field">
                <div className="tm-label">الدور (عربي)</div>
                <input className="tm-input" value={newTm.roleAr} onChange={e => setNewTm(p => ({ ...p, roleAr: e.target.value }))} placeholder="والد طالب في الصف الثالث" style={{ direction: "rtl" }} />
              </div>
              <div className="tm-field">
                <div className="tm-label">Role (English)</div>
                <input className="tm-input" value={newTm.roleEn} onChange={e => setNewTm(p => ({ ...p, roleEn: e.target.value }))} placeholder="Parent of a Year 3 student" style={{ direction: "ltr" }} />
              </div>
            </div>
            <div className="tm-grid" style={{ marginBottom: ".75rem" }}>
              <div className="tm-field">
                <div className="tm-label">الشهادة (عربي)</div>
                <textarea className="tm-input tm-textarea" value={newTm.textAr} onChange={e => setNewTm(p => ({ ...p, textAr: e.target.value }))} style={{ direction: "rtl" }} />
              </div>
              <div className="tm-field">
                <div className="tm-label">Testimonial (English)</div>
                <textarea className="tm-input tm-textarea" value={newTm.textEn} onChange={e => setNewTm(p => ({ ...p, textEn: e.target.value }))} style={{ direction: "ltr" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="tm-btn tm-btn-save" onClick={add} disabled={adding || !newTm.name}>
                {adding ? "..." : "✓ إضافة"}
              </button>
              <button className="tm-btn tm-btn-ghost" onClick={() => setShowAdd(false)}>إلغاء</button>
            </div>
          </div>
        )}

        {items.map(tm => {
          const isEditing = !!editing[tm.id];
          const cur = editing[tm.id] ?? tm;
          return (
            <div key={tm.id} className="tm-card">
              <div style={{ display: "flex", gap: 14, marginBottom: isEditing ? "1rem" : 0 }}>
                <div className="tm-avatar">{tm.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#2D0864" }}>{tm.name}</div>
                  <div style={{ fontSize: 12.5, color: "#667085", marginBottom: 6 }}>{tm.roleAr}</div>
                  {!isEditing && <p style={{ fontSize: 13, color: "#5A5A5A", lineHeight: 1.65, margin: 0 }}>"{tm.textAr}"</p>}
                </div>
              </div>

              {isEditing && (
                <div>
                  <div className="tm-grid" style={{ marginBottom: ".75rem" }}>
                    <div className="tm-field">
                      <div className="tm-label">الاسم</div>
                      <input className="tm-input" value={String(cur.name ?? "")} onChange={e => updateField(tm.id, "name", e.target.value)} />
                    </div>
                    <div className="tm-field">
                      <div className="tm-label">الأحرف الأولى</div>
                      <input className="tm-input" value={String(cur.initials ?? "")} onChange={e => updateField(tm.id, "initials", e.target.value)} />
                    </div>
                  </div>
                  <div className="tm-grid" style={{ marginBottom: ".75rem" }}>
                    <div className="tm-field">
                      <div className="tm-label">الدور (عربي)</div>
                      <input className="tm-input" value={String(cur.roleAr ?? "")} onChange={e => updateField(tm.id, "roleAr", e.target.value)} style={{ direction: "rtl" }} />
                    </div>
                    <div className="tm-field">
                      <div className="tm-label">Role (English)</div>
                      <input className="tm-input" value={String(cur.roleEn ?? "")} onChange={e => updateField(tm.id, "roleEn", e.target.value)} style={{ direction: "ltr" }} />
                    </div>
                  </div>
                  <div className="tm-grid">
                    <div className="tm-field">
                      <div className="tm-label">الشهادة (عربي)</div>
                      <textarea className="tm-input tm-textarea" value={String(cur.textAr ?? "")} onChange={e => updateField(tm.id, "textAr", e.target.value)} style={{ direction: "rtl" }} />
                    </div>
                    <div className="tm-field">
                      <div className="tm-label">Testimonial (English)</div>
                      <textarea className="tm-input tm-textarea" value={String(cur.textEn ?? "")} onChange={e => updateField(tm.id, "textEn", e.target.value)} style={{ direction: "ltr" }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="tm-actions">
                {isEditing ? (
                  <>
                    <button className="tm-btn tm-btn-save" onClick={() => save(tm.id)} disabled={saving === tm.id}>
                      {saving === tm.id ? "..." : "✓ حفظ"}
                    </button>
                    <button className="tm-btn tm-btn-ghost" onClick={() => cancelEdit(tm.id)}>إلغاء</button>
                  </>
                ) : (
                  <>
                    <button className="tm-btn tm-btn-ghost" onClick={() => startEdit(tm)}>✏️ تعديل</button>
                    <button className="tm-btn tm-btn-danger" onClick={() => del(tm.id)}>حذف</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {toast && <div className="tm-toast">{toast}</div>}
    </>
  );
}
