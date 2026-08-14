"use client";
import { useEffect, useState } from "react";

interface AspaMember { id: string; nameAr: string; nameEn: string; roleAr: string; roleEn: string; sortOrder: number; }

const S = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E0D5F0" };

export default function AdminAspaPage() {
  const [items, setItems] = useState<AspaMember[]>([]);
  const [editing, setEditing] = useState<AspaMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<AspaMember>>({});
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/aspa-members").then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editing) await fetch(`/api/admin/aspa-members/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    else await fetch("/api/admin/aspa-members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setEditing(null); setAdding(false); setForm({}); load();
  };

  const del = async (id: string) => { if (!confirm("حذف؟")) return; await fetch(`/api/admin/aspa-members/${id}`, { method: "DELETE" }); load(); };
  const F = (field: keyof AspaMember) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: field === "sortOrder" ? +e.target.value : e.target.value }));

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: S.bg, fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: S.dark }}>👥 أعضاء رابطة ASPA</h1>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ sortOrder: items.length + 1 }); }} style={{ background: S.gold, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>+ إضافة عضو</button>
        </div>

        {(editing || adding) && (
          <div style={{ background: S.card, borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${S.gold}` }}>
            <h3 style={{ color: S.dark, marginBottom: "1rem" }}>{editing ? "تعديل العضو" : "إضافة عضو جديد"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.85rem", marginBottom: "1rem" }}>
              {([["nameAr","الاسم (عربي)"],["nameEn","الاسم (إنجليزي)"],["roleAr","المنصب (عربي)"],["roleEn","المنصب (إنجليزي)"],["sortOrder","الترتيب"]] as [keyof AspaMember, string][]).map(([field, label]) => (
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.85rem" }}>
          {items.map(m => (
            <div key={m.id} style={{ background: S.card, borderRadius: 12, padding: "1.25rem", border: `1px solid ${S.border}`, display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: S.dark, display: "flex", alignItems: "center", justifyContent: "center", color: S.gold, fontWeight: 700, flexShrink: 0 }}>
                {m.nameAr.split(" ").slice(-1)[0]?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>{m.nameAr}</div>
                <div style={{ fontSize: 12, color: S.gold }}>{m.roleAr}</div>
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.5rem" }}>
                  <button onClick={() => { setEditing(m); setForm(m); setAdding(false); }} style={{ background: "none", border: `1px solid ${S.border}`, padding: "3px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11 }}>تعديل</button>
                  <button onClick={() => del(m.id)} style={{ background: "#FEE", border: "1px solid #FCC", padding: "3px 10px", borderRadius: 5, cursor: "pointer", color: "#C00", fontSize: 11 }}>حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
