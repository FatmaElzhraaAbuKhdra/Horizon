"use client";
import { useEffect, useState } from "react";

interface AcademicEvent { id: string; titleAr: string; titleEn: string; dateAr: string; dateEn: string; category: string; active: boolean; sortOrder: number; }

const S = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E0D5F0" };
const CATEGORIES = ["academic", "exams", "arts", "sports", "culture", "admissions", "parents", "general"];

export default function AdminAcademicEventsPage() {
  const [items, setItems] = useState<AcademicEvent[]>([]);
  const [editing, setEditing] = useState<AcademicEvent | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<AcademicEvent>>({});
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/academic-events").then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editing) await fetch(`/api/admin/academic-events/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    else await fetch("/api/admin/academic-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setEditing(null); setAdding(false); setForm({}); load();
  };

  const del = async (id: string) => { if (!confirm("حذف؟")) return; await fetch(`/api/admin/academic-events/${id}`, { method: "DELETE" }); load(); };
  const F = (field: keyof AcademicEvent) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [field]: field === "sortOrder" ? +e.target.value : field === "active" ? (e as React.ChangeEvent<HTMLInputElement>).target.checked : e.target.value }));

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: S.bg, fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: S.dark }}>📆 الأحداث الأكاديمية</h1>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ active: true, category: "academic", sortOrder: items.length + 1 }); }} style={{ background: S.gold, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>+ إضافة حدث</button>
        </div>

        {(editing || adding) && (
          <div style={{ background: S.card, borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${S.gold}` }}>
            <h3 style={{ color: S.dark, marginBottom: "1rem" }}>{editing ? "تعديل الحدث" : "إضافة حدث جديد"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.85rem", marginBottom: "1rem" }}>
              {(["titleAr","titleEn","dateAr","dateEn"] as (keyof AcademicEvent)[]).map(field => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>{field}</label>
                  <input value={String(form[field] ?? "")} onChange={F(field)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: "Cairo, sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>التصنيف</label>
                <select value={form.category ?? "general"} onChange={F("category")} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: "Cairo, sans-serif" }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>الترتيب</label>
                <input type="number" value={form.sortOrder ?? 0} onChange={F("sortOrder")} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 14 }} />
              </div>
              <div style={{ gridColumn: "span 2", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" checked={form.active ?? true} onChange={F("active")} id="active-chk" />
                <label htmlFor="active-chk" style={{ fontSize: 14 }}>نشط (يظهر على الموقع)</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={save} disabled={saving} style={{ background: S.dark, color: "#fff", border: "none", padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>{saving ? "جاري الحفظ..." : "حفظ"}</button>
              <button onClick={() => { setEditing(null); setAdding(false); }} style={{ background: "none", border: `1px solid ${S.border}`, padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {items.map(ev => (
            <div key={ev.id} style={{ background: S.card, borderRadius: 10, padding: "1rem 1.25rem", border: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A1A" }}>{ev.titleAr}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>📅 {ev.dateAr} • {ev.category}</div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => { setEditing(ev); setForm(ev); setAdding(false); }} style={{ background: "#fff", border: "1.5px solid #D1D5DB", padding: "5px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, color: "#374151", fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>تعديل</button>
                <button onClick={() => del(ev.id)} style={{ background: "#FFF1F0", border: "1.5px solid #FCCACA", padding: "5px 14px", borderRadius: 6, cursor: "pointer", color: "#DC2626", fontSize: 13, fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
