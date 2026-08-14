"use client";
import { useEffect, useState } from "react";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

interface NewsItem {
  id: string; icon: string; titleAr: string; titleEn: string;
  descAr: string; descEn: string; date: string; active: boolean; sortOrder: number;
}

const EMPTY: Omit<NewsItem, "id"> = {
  icon: "📰", titleAr: "", titleEn: "", descAr: "", descEn: "",
  date: new Date().toISOString().slice(0, 10), active: true, sortOrder: 0,
};

const ICONS = ["📰","🏆","🎭","📚","🎓","🌟","🏫","🎨","⚽","🔬","🎵","🌍"];

export default function NewsAdmin() {
  const [items, setItems]     = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, NewsItem>>({});
  const [saving, setSaving]   = useState<Record<string, boolean>>({});
  const [toast, setToast]     = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    fetch("/api/admin/news").then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  }, []);

  function startEdit(item: NewsItem) {
    setEditing(e => ({ ...e, [item.id]: { ...item } }));
  }
  function cancelEdit(id: string) {
    setEditing(e => { const n = { ...e }; delete n[id]; return n; });
  }
  function updateField(id: string, field: keyof NewsItem, val: string | boolean) {
    setEditing(e => ({ ...e, [id]: { ...e[id], [field]: val } }));
  }

  async function save(id: string) {
    setSaving(s => ({ ...s, [id]: true }));
    const res = await fetch(`/api/admin/news/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing[id]) });
    const updated = await res.json();
    setItems(rows => rows.map(r => r.id === id ? updated : r));
    cancelEdit(id);
    setSaving(s => ({ ...s, [id]: false }));
    showToast("✅ تم الحفظ");
  }

  async function del(id: string) {
    if (!confirm("هل تريد حذف هذا الخبر؟")) return;
    await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
    setItems(rows => rows.filter(r => r.id !== id));
    showToast("🗑️ تم الحذف");
  }

  async function add() {
    const res = await fetch("/api/admin/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(EMPTY) });
    const row = await res.json();
    setItems(rows => [...rows, row]);
    setEditing(e => ({ ...e, [row.id]: { ...row } }));
  }

  async function toggleActive(item: NewsItem) {
    const res = await fetch(`/api/admin/news/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !item.active }) });
    const updated = await res.json();
    setItems(rows => rows.map(r => r.id === item.id ? updated : r));
    showToast(updated.active ? "✅ نشط" : "⏸️ مخفي");
  }

  const label = (s: string, req?: boolean) => (
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4 }}>
      {s}{req && <span style={{ color: "#e53e3e" }}> *</span>}
    </label>
  );
  const inp = (id: string, field: keyof NewsItem, placeholder: string, multi?: boolean) => {
    const val = String((editing[id] as any)?.[field] ?? "");
    const style: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: "Cairo,sans-serif", background: "#fafafa", resize: multi ? "vertical" : "none", minHeight: multi ? 72 : undefined };
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
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.dark }}>إدارة الأخبار والمستجدات</h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>تظهر في صفحة /news على الموقع</p>
        </div>
        <button onClick={add} style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontFamily: "Cairo,sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          ➕ خبر جديد
        </button>
      </div>

      {loading ? (
        <p style={{ color: C.muted, textAlign: "center", padding: "3rem" }}>جاري التحميل...</p>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 40, marginBottom: "1rem" }}>📰</div>
          <p style={{ color: C.muted }}>لا توجد أخبار. اضغط "خبر جديد" لإضافة أول خبر.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map(item => {
            const ed = editing[item.id];
            return (
              <div key={item.id} style={{ background: C.card, borderRadius: 14, border: `1.5px solid ${ed ? C.gold : C.border}`, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: ed ? "rgba(179,0,196,.06)" : C.bg }}>
                  <span style={{ fontSize: 26 }}>{item.icon}</span>
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
                    {/* Row 1: icon + date */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        {label("الأيقونة")}
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {ICONS.map(ic => (
                            <button key={ic} onClick={() => updateField(item.id, "icon", ic)}
                              style={{ width: 34, height: 34, borderRadius: 8, border: `2px solid ${ed.icon === ic ? C.gold : C.border}`, background: ed.icon === ic ? "rgba(179,0,196,.1)" : "#fff", cursor: "pointer", fontSize: 18 }}>
                              {ic}
                            </button>
                          ))}
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
                      <div>{label("العنوان (عربي)", true)}{inp(item.id, "titleAr", "عنوان الخبر بالعربية")}</div>
                      <div style={{ direction: "ltr" }}>{label("Title (English)", true)}{inp(item.id, "titleEn", "News title in English")}</div>
                    </div>
                    {/* Row 3: descriptions */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>{label("الوصف (عربي)", true)}{inp(item.id, "descAr", "وصف الخبر بالعربية", true)}</div>
                      <div style={{ direction: "ltr" }}>{label("Description (English)", true)}{inp(item.id, "descEn", "News description in English", true)}</div>
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
