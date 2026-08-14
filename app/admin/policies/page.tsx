"use client";
import { useEffect, useState } from "react";

interface Policy { id: string; categoryAr: string; categoryEn: string; titleAr: string; titleEn: string; fileUrl: string; sortOrder: number; }

const S = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E0D5F0" };

export default function AdminPoliciesPage() {
  const [items, setItems] = useState<Policy[]>([]);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<Policy>>({});
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/policies").then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editing) {
      await fetch(`/api/admin/policies/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/policies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setSaving(false); setEditing(null); setAdding(false); setForm({}); load();
  };

  const del = async (id: string) => {
    if (!confirm("حذف هذه السياسة؟")) return;
    await fetch(`/api/admin/policies/${id}`, { method: "DELETE" }); load();
  };

  const startEdit = (p: Policy) => { setEditing(p); setForm(p); setAdding(false); };
  const startAdd  = () => { setAdding(true); setEditing(null); setForm({ sortOrder: items.length + 1 }); };

  const F = (field: keyof Policy) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: field === "sortOrder" ? +e.target.value : e.target.value }));

  const grouped = items.reduce<Record<string, Policy[]>>((acc, p) => { (acc[p.categoryAr] ??= []).push(p); return acc; }, {});

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: S.bg, fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: S.dark }}>📄 إدارة السياسات</h1>
          <button onClick={startAdd} style={{ background: S.gold, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>+ إضافة سياسة</button>
        </div>

        {(editing || adding) && (
          <div style={{ background: S.card, borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${S.gold}` }}>
            <h3 style={{ color: S.dark, marginBottom: "1rem" }}>{editing ? "تعديل السياسة" : "إضافة سياسة جديدة"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {([["categoryAr", "التصنيف (عربي)"], ["categoryEn", "التصنيف (إنجليزي)"], ["titleAr", "العنوان (عربي)"], ["titleEn", "العنوان (إنجليزي)"], ["fileUrl", "رابط الملف (اختياري)"], ["sortOrder", "الترتيب"]] as [keyof Policy, string][]).map(([field, label]) => (
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

        {Object.entries(grouped).map(([cat, policies]) => (
          <div key={cat} style={{ background: S.card, borderRadius: 12, border: `1px solid ${S.border}`, marginBottom: "1.25rem", overflow: "hidden" }}>
            <div style={{ background: S.dark, padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: S.gold, fontWeight: 700, fontSize: 14 }}>{cat}</span>
              <span style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>{policies.length} سياسة</span>
            </div>
            {policies.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.25rem", borderBottom: "1px solid #F2EEFF" }}>
                <span style={{ fontSize: 14, color: "#1A1A1A" }}>{p.titleAr}</span>
                <span style={{ fontSize: 12, color: "#999", flex: 1, marginInline: "1rem" }}>{p.titleEn}</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(p)} style={{ background: "none", border: `1px solid ${S.border}`, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>تعديل</button>
                  <button onClick={() => del(p.id)} style={{ background: "#FEE", border: "1px solid #FCC", padding: "5px 12px", borderRadius: 6, cursor: "pointer", color: "#C00", fontSize: 12 }}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
