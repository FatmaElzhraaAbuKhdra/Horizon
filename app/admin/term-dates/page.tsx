"use client";
import { useEffect, useState } from "react";

interface TermDate { id: string; year: string; termNumber: number; labelAr: string; labelEn: string; startAr: string; startEn: string; endAr: string; endEn: string; halfTermStartAr: string; halfTermStartEn: string; halfTermEndAr: string; halfTermEndEn: string; sortOrder: number; }

const S = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E0D5F0" };
const FIELDS: [keyof TermDate, string][] = [
  ["year", "السنة الدراسية"], ["termNumber", "رقم الفصل"], ["labelAr", "الاسم (عربي)"], ["labelEn", "الاسم (إنجليزي)"],
  ["startAr", "بداية الفصل (عربي)"], ["startEn", "بداية الفصل (إنجليزي)"], ["endAr", "نهاية الفصل (عربي)"], ["endEn", "نهاية الفصل (إنجليزي)"],
  ["halfTermStartAr", "بداية إجازة منتصف الفصل (عربي)"], ["halfTermStartEn", "بداية إجازة منتصف الفصل (إنجليزي)"],
  ["halfTermEndAr", "نهاية إجازة منتصف الفصل (عربي)"], ["halfTermEndEn", "نهاية إجازة منتصف الفصل (إنجليزي)"],
  ["sortOrder", "الترتيب"],
];

export default function AdminTermDatesPage() {
  const [items, setItems] = useState<TermDate[]>([]);
  const [editing, setEditing] = useState<TermDate | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<TermDate>>({});
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/term-dates").then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editing) await fetch(`/api/admin/term-dates/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    else await fetch("/api/admin/term-dates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setEditing(null); setAdding(false); setForm({}); load();
  };

  const del = async (id: string) => { if (!confirm("حذف؟")) return; await fetch(`/api/admin/term-dates/${id}`, { method: "DELETE" }); load(); };
  const F = (field: keyof TermDate) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: ["termNumber","sortOrder"].includes(field) ? +e.target.value : e.target.value }));

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: S.bg, fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: S.dark }}>🗓️ إدارة الفصول الدراسية</h1>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ sortOrder: items.length + 1, termNumber: 1, year: "2025-2026" }); }} style={{ background: S.gold, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>+ إضافة فصل</button>
        </div>

        {(editing || adding) && (
          <div style={{ background: S.card, borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${S.gold}` }}>
            <h3 style={{ color: S.dark, marginBottom: "1rem" }}>{editing ? "تعديل الفصل" : "إضافة فصل جديد"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "1rem" }}>
              {FIELDS.map(([field, label]) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>{label}</label>
                  <input value={String(form[field] ?? "")} onChange={F(field)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: "Cairo, sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={save} disabled={saving} style={{ background: S.dark, color: "#fff", border: "none", padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>{saving ? "جاري الحفظ..." : "حفظ"}</button>
              <button onClick={() => { setEditing(null); setAdding(false); }} style={{ background: "none", border: `1px solid ${S.border}`, padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "1rem" }}>
          {items.map(term => (
            <div key={term.id} style={{ background: S.card, borderRadius: 12, border: `1px solid ${S.border}`, overflow: "hidden" }}>
              <div style={{ background: S.dark, padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>{term.labelAr} — {term.year}</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => { setEditing(term); setForm(term); setAdding(false); }} style={{ background: "rgba(255,255,255,.15)", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>تعديل</button>
                  <button onClick={() => del(term.id)} style={{ background: "rgba(255,60,60,.2)", color: "#FF6B6B", border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>حذف</button>
                </div>
              </div>
              <div style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: 13, color: "#555" }}>
                <div>📅 {term.startAr} → {term.endAr}</div>
                <div>📅 {term.startEn} → {term.endEn}</div>
                {term.halfTermStartAr && <div>🏖️ {term.halfTermStartAr} → {term.halfTermEndAr}</div>}
                {term.halfTermStartEn && <div>🏖️ {term.halfTermStartEn} → {term.halfTermEndEn}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
