"use client";
import { useEffect, useRef, useState } from "react";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

interface Announcement {
  id: string; titleAr: string; titleEn: string;
  bodyAr: string; bodyEn: string; imageUrl: string;
  date: string; active: boolean; sortOrder: number;
}

const EMPTY: Omit<Announcement, "id"> = {
  titleAr: "", titleEn: "", bodyAr: "", bodyEn: "", imageUrl: "",
  date: new Date().toISOString().slice(0, 10), active: true, sortOrder: 0,
};

export default function AnnouncementsAdmin() {
  const [items, setItems]     = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, Announcement>>({});
  const [saving, setSaving]   = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [toast, setToast]     = useState("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/announcements").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  function startEdit(item: Announcement) {
    setEditing(e => ({ ...e, [item.id]: { ...item } }));
  }
  function cancelEdit(id: string) {
    setEditing(e => { const n = { ...e }; delete n[id]; return n; });
  }
  function updateField(id: string, field: keyof Announcement, val: string | boolean) {
    setEditing(e => ({ ...e, [id]: { ...e[id], [field]: val } }));
  }

  async function save(id: string) {
    setSaving(s => ({ ...s, [id]: true }));
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing[id]) });
    const updated = await res.json();
    setItems(rows => rows.map(r => r.id === id ? updated : r));
    cancelEdit(id);
    setSaving(s => ({ ...s, [id]: false }));
    showToast("✅ تم الحفظ");
  }

  async function del(id: string) {
    if (!confirm("هل تريد حذف هذا التعميم؟")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    setItems(rows => rows.filter(r => r.id !== id));
    showToast("🗑️ تم الحذف");
  }

  async function add() {
    const res = await fetch("/api/admin/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(EMPTY) });
    const row = await res.json();
    setItems(rows => [...rows, row]);
    setEditing(e => ({ ...e, [row.id]: { ...row } }));
  }

  async function toggleActive(item: Announcement) {
    const res = await fetch(`/api/admin/announcements/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !item.active }) });
    const updated = await res.json();
    setItems(rows => rows.map(r => r.id === item.id ? updated : r));
    showToast(updated.active ? "✅ نشط" : "⏸️ مخفي");
  }

  async function uploadImage(id: string, file: File) {
    setUploading(u => ({ ...u, [id]: true }));
    const form = new FormData();
    form.append("slot", "announcements");
    form.append("file", file);
    const res = await fetch("/api/admin/images", { method: "POST", body: form });
    const data = await res.json();
    setUploading(u => ({ ...u, [id]: false }));
    if (!res.ok) { showToast(`⚠️ ${data.error ?? "فشل رفع الصورة"}`); return; }
    updateField(id, "imageUrl", data.url);
  }

  const label = (s: string, req?: boolean) => (
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>
      {s}{req && <span style={{ color: "#e53e3e" }}> *</span>}
    </label>
  );
  const inp = (id: string, field: keyof Announcement, placeholder: string, multi?: boolean) => {
    const val = String((editing[id] as any)?.[field] ?? "");
    const style: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "Cairo,sans-serif", background: "#fafafa", resize: multi ? "vertical" : "none", minHeight: multi ? 90 : undefined };
    return multi
      ? <textarea style={style} value={val} placeholder={placeholder} onChange={e => updateField(id, field, e.target.value)} />
      : <input   style={style} value={val} placeholder={placeholder} onChange={e => updateField(id, field, e.target.value)} />;
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto", direction: "rtl", fontFamily: "Cairo,sans-serif" }}>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, background: C.dark, color: "#fff", padding: "10px 20px", borderRadius: 10, zIndex: 999, fontSize: 14, fontWeight: 600 }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.dark }}>إدارة تعاميم</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>تظهر كخط زمني في صفحة /announcements على الموقع</p>
        </div>
        <button onClick={add} style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "Cairo,sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          ➕ تعميم جديد
        </button>
      </div>

      {loading ? (
        <p style={{ color: C.muted, textAlign: "center", padding: "3rem" }}>جاري التحميل...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 40, marginBottom: "1rem" }}>📢</div>
          <p style={{ color: C.muted }}>لا توجد تعميمات. اضغط "تعميم جديد" لإضافة أول تعميم.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map(item => {
            const ed = editing[item.id];
            return (
              <div key={item.id} style={{ background: C.card, borderRadius: 14, border: `1.5px solid ${ed ? C.gold : C.border}`, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: ed ? "rgba(179,0,196,.06)" : C.bg }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt="" style={{ width: 42, height: 42, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    : <span style={{ fontSize: 26 }}>📢</span>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>{item.titleAr || "(بدون عنوان)"}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.date} · {item.titleEn || "(no English title)"}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button onClick={() => toggleActive(item)} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontFamily: "Cairo,sans-serif", background: item.active ? "#F0DCFE" : "#fef2f2", borderColor: item.active ? "#86efac" : "#fca5a5", color: item.active ? "#166534" : "#b91c1c" }}>
                      {item.active ? "✅ نشط" : "⏸️ مخفي"}
                    </button>
                    {!ed ? (
                      <>
                        <button onClick={() => startEdit(item)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontFamily: "Cairo,sans-serif", fontWeight: 600, color: C.dark }}>✏️ تعديل</button>
                        <button onClick={() => del(item.id)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", cursor: "pointer", fontFamily: "Cairo,sans-serif", fontWeight: 600, color: "#b91c1c" }}>🗑️</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => save(item.id)} disabled={saving[item.id]} style={{ fontSize: 12, padding: "6px 16px", borderRadius: 8, border: "none", background: C.dark, color: "#fff", cursor: "pointer", fontFamily: "Cairo,sans-serif", fontWeight: 700 }}>
                          {saving[item.id] ? "..." : "💾 حفظ"}
                        </button>
                        <button onClick={() => cancelEdit(item.id)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", cursor: "pointer", fontFamily: "Cairo,sans-serif", color: C.muted }}>إلغاء</button>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit form */}
                {ed && (
                  <div style={{ padding: "1.25rem", display: "grid", gap: "1rem", borderTop: `1px solid ${C.border}` }}>
                    {/* Row 1: image + date */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        {label("الصورة")}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {ed.imageUrl && <img src={ed.imageUrl} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", border: `1px solid ${C.border}` }} />}
                          <input
                            ref={el => { fileInputs.current[item.id] = el; }}
                            type="file" accept="image/*" style={{ display: "none" }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(item.id, f); e.target.value = ""; }}
                          />
                          <button type="button" onClick={() => fileInputs.current[item.id]?.click()} disabled={uploading[item.id]}
                            style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fafafa", cursor: "pointer", fontFamily: "Cairo,sans-serif", fontWeight: 600, color: C.dark }}>
                            {uploading[item.id] ? "جاري الرفع..." : ed.imageUrl ? "تغيير الصورة" : "⬆️ رفع صورة"}
                          </button>
                          {ed.imageUrl && (
                            <button type="button" onClick={() => updateField(item.id, "imageUrl", "")}
                              style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", cursor: "pointer", fontFamily: "Cairo,sans-serif", color: "#b91c1c" }}>
                              إزالة
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        {label("التاريخ", true)}
                        <input type="date" value={ed.date} onChange={e => updateField(item.id, "date", e.target.value)}
                          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, background: "#fafafa" }} />
                      </div>
                    </div>
                    {/* Row 2: titles */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>{label("العنوان (عربي)", true)}{inp(item.id, "titleAr", "عنوان التعميم بالعربية")}</div>
                      <div style={{ direction: "ltr" }}>{label("Title (English)", true)}{inp(item.id, "titleEn", "Announcement title in English")}</div>
                    </div>
                    {/* Row 3: body */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>{label("النص (عربي)", true)}{inp(item.id, "bodyAr", "نص التعميم بالعربية", true)}</div>
                      <div style={{ direction: "ltr" }}>{label("Body (English)", true)}{inp(item.id, "bodyEn", "Announcement body in English", true)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
