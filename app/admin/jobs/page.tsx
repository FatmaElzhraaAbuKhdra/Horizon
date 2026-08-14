"use client";
import { useEffect, useState } from "react";

interface Job { id: string; titleAr: string; titleEn: string; descAr: string; descEn: string; active: boolean; }

const S = { dark: "#2D0864", gold: "#B300C4", bg: "#F0EBF8", card: "#fff", border: "#E0D5F0" };

export default function AdminJobsPage() {
  const [items, setItems] = useState<Job[]>([]);
  const [editing, setEditing] = useState<Job | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<Job>>({});
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/admin/jobs").then(r => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editing) await fetch(`/api/admin/jobs/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    else await fetch("/api/admin/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setEditing(null); setAdding(false); setForm({}); load();
  };

  const del = async (id: string) => { if (!confirm("حذف؟")) return; await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" }); load(); };
  const F = (field: keyof Job) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [field]: field === "active" ? (e as React.ChangeEvent<HTMLInputElement>).target.checked : e.target.value }));

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", background: S.bg, fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: S.dark }}>💼 إدارة فرص التوظيف</h1>
          <button onClick={() => { setAdding(true); setEditing(null); setForm({ active: true }); }} style={{ background: S.gold, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif", fontWeight: 600 }}>+ إضافة وظيفة</button>
        </div>

        {(editing || adding) && (
          <div style={{ background: S.card, borderRadius: 14, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${S.gold}` }}>
            <h3 style={{ color: S.dark, marginBottom: "1rem" }}>{editing ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "0.85rem", marginBottom: "1rem" }}>
              {(["titleAr","titleEn"] as (keyof Job)[]).map(field => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>{field === "titleAr" ? "العنوان (عربي)" : "العنوان (إنجليزي)"}</label>
                  <input value={String(form[field] ?? "")} onChange={F(field)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: "Cairo, sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
              {(["descAr","descEn"] as (keyof Job)[]).map(field => (
                <div key={field} style={{ gridColumn: "span 1" }}>
                  <label style={{ display: "block", fontSize: 12, color: "#666", marginBottom: 4 }}>{field === "descAr" ? "الوصف (عربي)" : "الوصف (إنجليزي)"}</label>
                  <textarea value={String(form[field] ?? "")} onChange={F(field)} rows={4} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 14, fontFamily: "Cairo, sans-serif", boxSizing: "border-box", resize: "vertical" }} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" checked={form.active ?? true} onChange={F("active")} id="job-active" />
                <label htmlFor="job-active" style={{ fontSize: 14 }}>نشط (يظهر على الموقع)</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={save} disabled={saving} style={{ background: S.dark, color: "#fff", border: "none", padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>{saving ? "جاري الحفظ..." : "حفظ"}</button>
              <button onClick={() => { setEditing(null); setAdding(false); }} style={{ background: "none", border: `1px solid ${S.border}`, padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>إلغاء</button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "1rem" }}>
          {items.map(job => (
            <div key={job.id} style={{ background: S.card, borderRadius: 12, padding: "1.5rem", border: `1px solid ${S.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: S.dark }}>{job.titleAr}</div>
                  <div style={{ fontSize: 13, color: "#999" }}>{job.titleEn}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => { setEditing(job); setForm(job); setAdding(false); }} style={{ background: "none", border: `1px solid ${S.border}`, padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>تعديل</button>
                  <button onClick={() => del(job.id)} style={{ background: "#FEE", border: "1px solid #FCC", padding: "5px 12px", borderRadius: 6, cursor: "pointer", color: "#C00", fontSize: 12 }}>حذف</button>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>{job.descAr.substring(0, 150)}...</p>
            </div>
          ))}
          {items.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>لا توجد وظائف شاغرة. اضغط "+ إضافة وظيفة" لإضافة أول وظيفة.</div>}
        </div>
      </div>
    </div>
  );
}
