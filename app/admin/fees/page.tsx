"use client";
import { useCallback, useEffect, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface FeeRow { id: string; group: string; term1: number; term2: number; term3: number; total: number; totalVat: number; sortOrder: number; }
interface OneTime { id: string; labelAr: string; labelEn: string; amount: number; noteAr: string; noteEn: string; sortOrder: number; }
interface ScheduleTerm { id: string; labelAr: string; labelEn: string; pct: string; dateAr: string; dateEn: string; sortOrder: number; }
interface Additional { id: string; icon: string; labelAr: string; labelEn: string; valueAr: string; valueEn: string; sortOrder: number; }

const SAR = (n: number) => n.toLocaleString("en-US");

// ── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .fe-wrap { padding: 2rem 2.5rem; }
  .fe-header { margin-bottom: 1.5rem; }
  .fe-title { font-size: 22px; font-weight: 800; color: #101828; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .fe-sub   { font-size: 13.5px; color: #667085; }

  .fe-tabs { display: flex; gap: 4px; border-bottom: 1.5px solid #E4E0EC; margin-bottom: 1.75rem; }
  .fe-tab {
    padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
    border: none; background: none; font-family: Cairo, sans-serif; color: #667085;
    border-bottom: 2.5px solid transparent; margin-bottom: -1.5px; transition: color .15s;
  }
  .fe-tab.active { color: #7A24B2; border-bottom-color: #7A24B2; font-weight: 700; }
  .fe-tab:hover:not(.active) { color: #374151; }

  .fe-toolbar { display: flex; gap: 10px; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
  .fe-btn {
    padding: 8px 16px; border-radius: 9px; font-size: 13px;
    font-family: Cairo, sans-serif; cursor: pointer; font-weight: 600;
    transition: all .15s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  }
  .fe-btn:disabled { opacity: .5; cursor: not-allowed; }
  .fe-btn-primary { background: #7A24B2; color: #fff; border-color: #7A24B2; }
  .fe-btn-primary:hover:not(:disabled) { background: #2D0864; }
  .fe-btn-ghost  { background: #fff; border-color: #E4E0EC; color: #374151; }
  .fe-btn-ghost:hover:not(:disabled) { background: #F9FAFB; }
  .fe-btn-danger { background: #FFF1F0; border-color: #FFD0CC; color: #DC2626; }
  .fe-btn-danger:hover:not(:disabled) { background: #FFE4E1; }
  .fe-btn-save   { background: #9333EA; border-color: #9333EA; color: #fff; }
  .fe-btn-save:hover:not(:disabled) { background: #7E22CE; }

  .fe-card { background: #fff; border-radius: 16px; border: 1px solid #E4E0EC; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.04); }

  .fe-table { width: 100%; border-collapse: collapse; }
  .fe-table thead th { background: #F9FAFB; padding: 11px 14px; font-size: 11px; font-weight: 700; color: #667085; text-transform: uppercase; letter-spacing: .5px; border-bottom: 1.5px solid #E4E0EC; white-space: nowrap; text-align: start; }
  .fe-table thead th.col-vat { color: #B300C4; }
  .fe-table tbody td { padding: 10px 14px; font-size: 13.5px; color: #374151; border-bottom: 1px solid #F2F4F7; vertical-align: middle; }
  .fe-table tbody tr:last-child td { border-bottom: none; }
  .fe-table tbody tr:hover td { background: #F0FDF8; }

  .fe-input { width: 100%; padding: 6px 10px; border-radius: 8px; border: 1.5px solid #D1D5DB; font-size: 13px; font-family: Cairo, sans-serif; outline: none; background: #F9FAFB; color: #101828; transition: border-color .2s, box-shadow .2s; box-sizing: border-box; }
  .fe-input:focus { border-color: #7A24B2; background: #fff; box-shadow: 0 0 0 3px rgba(122,36,178,.10); }
  .fe-input.wide { min-width: 160px; }
  .fe-input.narrow { max-width: 90px; }

  .col-group { font-weight: 700; color: #2D0864; }
  .col-total { font-weight: 700; color: #7A24B2; }
  .col-vat   { font-weight: 800; color: #B300C4; background: rgba(179,0,196,.05); }

  .fe-note { margin-top: 1.25rem; padding: 12px 16px; border-radius: 10px; background: rgba(122,36,178,.06); border: 1px solid rgba(122,36,178,.15); font-size: 12.5px; color: #374151; }
  .fe-add-form { background: #F0FDF8; border: 1.5px dashed rgba(122,36,178,.30); border-radius: 12px; padding: 1.25rem 1.5rem; display: grid; gap: 10px; margin-bottom: 1.5rem; }
  .fe-add-row  { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }
  .fe-add-label { font-size: 11px; font-weight: 700; color: #667085; margin-bottom: 4px; letter-spacing: .4px; }
  .fe-add-field { display: flex; flex-direction: column; }

  .fe-inline-card { background: #fff; border: 1px solid #E4E0EC; border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }
  .fe-bi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: .75rem; }
  .fe-bi-label { font-size: 10px; font-weight: 700; color: #9CA3AF; letter-spacing: .4px; text-transform: uppercase; margin-bottom: 3px; }
  .fe-actions { display: flex; gap: 6px; margin-top: .75rem; justify-content: flex-end; }

  .fe-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #2D0864; color: #fff; padding: 10px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,.2); z-index: 9999; }

  @keyframes rowIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
  .fe-table tbody tr { animation: rowIn .2s ease both; }
  @media (max-width:800px) { .fe-bi-grid { grid-template-columns:1fr !important; } }
`;

// ── Main Fees Tab ─────────────────────────────────────────────────────────────

function MainFeesTab() {
  const [rows, setRows]   = useState<FeeRow[]>([]);
  const [editing, setEditing] = useState<{ [id: string]: Partial<FeeRow> }>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRow, setNewRow]   = useState({ group: "", term1: "", term2: "", term3: "" });
  const [adding, setAdding]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    setRefreshing(true);
    fetch("/api/admin/fees").then(r => r.json()).then(d => { setRows(d); setRefreshing(false); }).catch(() => setRefreshing(false));
  }, []);
  useEffect(load, [load]);

  const startEdit  = (row: FeeRow) => setEditing(p => ({ ...p, [row.id]: { ...row } }));
  const cancelEdit = (id: string) => setEditing(p => { const n = { ...p }; delete n[id]; return n; });

  const updateField = (id: string, field: keyof FeeRow, val: string) => {
    setEditing(p => {
      const cur = { ...p[id] };
      (cur as any)[field] = val;
      if (["term1","term2","term3"].includes(field)) {
        const t1 = Number(field === "term1" ? val : cur.term1) || 0;
        const t2 = Number(field === "term2" ? val : cur.term2) || 0;
        const t3 = Number(field === "term3" ? val : cur.term3) || 0;
        cur.total    = t1 + t2 + t3;
        cur.totalVat = Math.round((t1 + t2 + t3) * 1.15);
      }
      return { ...p, [id]: cur };
    });
  };

  const saveRow = async (id: string) => {
    setSaving(id);
    await fetch(`/api/admin/fees/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing[id]) });
    setSaving(null); cancelEdit(id); load();
  };

  const deleteRow = async (id: string) => {
    if (!confirm("حذف هذا الصف نهائياً؟")) return;
    setDeleting(id);
    await fetch(`/api/admin/fees/${id}`, { method: "DELETE" });
    setDeleting(null); load();
  };

  const addRow = async () => {
    if (!newRow.group || !newRow.term1) return;
    setAdding(true);
    await fetch("/api/admin/fees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ group: newRow.group, term1: Number(newRow.term1), term2: Number(newRow.term2)||0, term3: Number(newRow.term3)||0 }) });
    setAdding(false); setNewRow({ group: "", term1: "", term2: "", term3: "" }); setShowAdd(false); load();
  };

  const ed = (id: string) => editing[id];

  return (
    <>
      <div className="fe-toolbar">
        <button className="fe-btn fe-btn-primary" onClick={() => setShowAdd(s => !s)}>{showAdd ? "✕ إلغاء" : "+ إضافة مرحلة دراسية"}</button>
        <button className="fe-btn fe-btn-ghost" onClick={load} disabled={refreshing} style={refreshing ? {opacity:.6} : undefined}>{refreshing ? "⏳ جاري..." : "↺ تحديث"}</button>
        <span style={{ fontSize: 12, color: "#9CA3AF", marginRight: "auto" }}>{rows.length} مرحلة — الرسوم بالريال السعودي (شامل 15% ض.ق.م)</span>
      </div>

      {showAdd && (
        <div className="fe-add-form">
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#2D0864", marginBottom: 4 }}>إضافة مرحلة جديدة</div>
          <div className="fe-add-row">
            <div className="fe-add-field" style={{ flex: 2, minWidth: 200 }}>
              <div className="fe-add-label">اسم المرحلة</div>
              <input className="fe-input" placeholder="مثال: الصف العاشر (Year 10)" value={newRow.group} onChange={e => setNewRow(p => ({ ...p, group: e.target.value }))} />
            </div>
            {(["term1","term2","term3"] as const).map((f, i) => (
              <div key={f} className="fe-add-field">
                <div className="fe-add-label">الفصل {["الأول","الثاني","الثالث"][i]} (ر.س)</div>
                <input className="fe-input narrow" type="number" placeholder="0" value={(newRow as any)[f]} onChange={e => setNewRow(p => ({ ...p, [f]: e.target.value }))} />
              </div>
            ))}
            <button className="fe-btn fe-btn-save" onClick={addRow} disabled={adding || !newRow.group}>{adding ? "..." : "✓ إضافة"}</button>
          </div>
          {newRow.term1 && (
            <div style={{ fontSize: 12, color: "#667085" }}>
              المجموع: {SAR((Number(newRow.term1)||0)+(Number(newRow.term2)||0)+(Number(newRow.term3)||0))} | المجموع + ض.ق.م: {SAR(Math.round(((Number(newRow.term1)||0)+(Number(newRow.term2)||0)+(Number(newRow.term3)||0))*1.15))} ر.س
            </div>
          )}
        </div>
      )}

      <div className="fe-card">
        <div style={{ overflowX: "auto" }}>
          <table className="fe-table">
            <thead><tr>
              <th>المرحلة الدراسية</th><th>الفصل الأول (ر.س)</th><th>الفصل الثاني (ر.س)</th><th>الفصل الثالث (ر.س)</th><th>المجموع (ر.س)</th><th className="col-vat">المجموع + ض.ق.م</th><th>الإجراءات</th>
            </tr></thead>
            <tbody>
              {rows.map((row, i) => {
                const isEditing = !!ed(row.id);
                const cur = ed(row.id) ?? row;
                return (
                  <tr key={row.id} style={{ animationDelay: `${i*40}ms` }}>
                    <td className="col-group">{isEditing ? <input className="fe-input wide" value={String(cur.group??"")} onChange={e => updateField(row.id,"group",e.target.value)}/> : row.group}</td>
                    {(["term1","term2","term3"] as const).map(f => (
                      <td key={f}>{isEditing ? <input className="fe-input narrow" type="number" value={String(cur[f]??"")} onChange={e => updateField(row.id,f,e.target.value)}/> : SAR(row[f])}</td>
                    ))}
                    <td className="col-total">{isEditing ? SAR(Number(cur.total)||0) : SAR(row.total)}</td>
                    <td className="col-vat">{isEditing ? <input className="fe-input narrow" type="number" value={String(cur.totalVat??"")} onChange={e => updateField(row.id,"totalVat",e.target.value)}/> : SAR(row.totalVat)}</td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        {isEditing ? (
                          <><button className="fe-btn fe-btn-save" style={{padding:"4px 12px",fontSize:12}} onClick={()=>saveRow(row.id)} disabled={saving===row.id}>{saving===row.id?"...":"✓ حفظ"}</button><button className="fe-btn fe-btn-ghost" style={{padding:"4px 12px",fontSize:12}} onClick={()=>cancelEdit(row.id)}>إلغاء</button></>
                        ) : (
                          <><button className="fe-btn fe-btn-ghost" style={{padding:"4px 12px",fontSize:12}} onClick={()=>startEdit(row)}>✏️ تعديل</button><button className="fe-btn fe-btn-danger" style={{padding:"4px 12px",fontSize:12}} onClick={()=>deleteRow(row.id)} disabled={deleting===row.id}>{deleting===row.id?"...":"حذف"}</button></>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="fe-note">💡 عند تعديل قيم الفصول يُحسب المجموع تلقائياً (+ 15% ض.ق.م).</div>
    </>
  );
}

// ── Generic bi-lingual inline editor ─────────────────────────────────────────

function InlineEditor<T extends { id: string; sortOrder: number }>({
  apiBase, fields, seed, renderView,
}: {
  apiBase: string;
  fields: Array<{ key: string; label: string; type?: "text"|"number"|"textarea"; rtl?: boolean; ltr?: boolean }>;
  seed?: Partial<T>;
  renderView: (item: T) => React.ReactNode;
}) {
  const [items, setItems]   = useState<T[]>([]);
  const [editing, setEditing] = useState<Record<string, Partial<T>>>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Record<string, any>>(seed ?? {});
  const [adding, setAdding]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    setRefreshing(true);
    fetch(apiBase).then(r => r.json()).then(d => { setItems(d); setRefreshing(false); }).catch(() => setRefreshing(false));
  }, [apiBase]);
  useEffect(load, [load]);

  const startEdit = (item: T) => setEditing(p => ({ ...p, [item.id]: { ...item } }));
  const cancelEdit = (id: string) => setEditing(p => { const n = { ...p }; delete n[id]; return n; });
  const updateF = (id: string, k: string, v: string) => setEditing(p => ({ ...p, [id]: { ...p[id], [k]: v } }));

  const save = async (id: string) => {
    setSaving(id);
    await fetch(`${apiBase}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing[id]) });
    setSaving(null); cancelEdit(id); load();
  };

  const del = async (id: string) => {
    if (!confirm("حذف؟")) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    load();
  };

  const add = async () => {
    setAdding(true);
    await fetch(apiBase, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newItem) });
    setAdding(false); setShowAdd(false); setNewItem(seed ?? {}); load();
  };

  const renderInput = (obj: Record<string, any>, onChange: (k: string, v: string) => void, f: typeof fields[0]) => {
    const val = String(obj[f.key] ?? "");
    const dir = f.rtl ? "rtl" : f.ltr ? "ltr" : undefined;
    const style = { ...(dir ? { direction: dir as "rtl"|"ltr" } : {}) };
    if (f.type === "textarea")
      return <textarea className="fe-input" style={{ ...style, minHeight: 60, resize: "vertical" as const }} value={val} onChange={e => onChange(f.key, e.target.value)} />;
    return <input className="fe-input" type={f.type ?? "text"} value={val} onChange={e => onChange(f.key, e.target.value)} style={style} />;
  };

  return (
    <>
      <div className="fe-toolbar">
        <button className="fe-btn fe-btn-primary" onClick={() => setShowAdd(s => !s)}>{showAdd ? "✕ إلغاء" : "+ إضافة جديد"}</button>
        <button className="fe-btn fe-btn-ghost" onClick={load} disabled={refreshing} style={refreshing ? {opacity:.6} : undefined}>{refreshing ? "⏳ جاري..." : "↺ تحديث"}</button>
      </div>

      {showAdd && (
        <div className="fe-add-form">
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#2D0864", marginBottom: 8 }}>إضافة جديد</div>
          <div className="fe-bi-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {fields.map(f => (
              <div key={f.key} className="fe-add-field">
                <div className="fe-add-label">{f.label}</div>
                {renderInput(newItem, (k, v) => setNewItem(p => ({ ...p, [k]: v })), f)}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="fe-btn fe-btn-save" onClick={add} disabled={adding}>{adding ? "..." : "✓ إضافة"}</button>
            <button className="fe-btn fe-btn-ghost" onClick={() => setShowAdd(false)}>إلغاء</button>
          </div>
        </div>
      )}

      {items.map(item => {
        const isEditing = !!editing[item.id];
        const cur = (editing[item.id] ?? item) as Record<string, any>;
        return (
          <div key={item.id} className="fe-inline-card">
            {isEditing ? (
              <div className="fe-bi-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                {fields.map(f => (
                  <div key={f.key} className="fe-add-field">
                    <div className="fe-add-label">{f.label}</div>
                    {renderInput(cur, (k, v) => updateF(item.id, k, v), f)}
                  </div>
                ))}
              </div>
            ) : (
              renderView(item)
            )}
            <div className="fe-actions">
              {isEditing ? (
                <><button className="fe-btn fe-btn-save" style={{padding:"5px 14px",fontSize:12.5}} onClick={()=>save(item.id)} disabled={saving===item.id}>{saving===item.id?"...":"✓ حفظ"}</button><button className="fe-btn fe-btn-ghost" style={{padding:"5px 14px",fontSize:12.5}} onClick={()=>cancelEdit(item.id)}>إلغاء</button></>
              ) : (
                <><button className="fe-btn fe-btn-ghost" style={{padding:"5px 14px",fontSize:12.5}} onClick={()=>startEdit(item)}>✏️ تعديل</button><button className="fe-btn fe-btn-danger" style={{padding:"5px 14px",fontSize:12.5}} onClick={()=>del(item.id)}>حذف</button></>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "main",       label: "💰 الرسوم الأساسية" },
  { id: "onetime",    label: "🔖 رسوم التسجيل" },
  { id: "schedule",   label: "📅 جدول السداد" },
  { id: "additional", label: "📋 رسوم إضافية" },
];

export default function FeesAdminPage() {
  const [tab, setTab] = useState("main");

  return (
    <>
      <style>{CSS}</style>
      <div className="fe-wrap">
        <div className="fe-header">
          <h1 className="fe-title">💰 إدارة الرسوم الدراسية</h1>
          <p className="fe-sub">جميع التغييرات تظهر فوراً على الموقع بعد الحفظ</p>
        </div>

        <div className="fe-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`fe-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {tab === "main" && <MainFeesTab />}

        {tab === "onetime" && (
          <InlineEditor<OneTime>
            apiBase="/api/admin/fee-onetime"
            fields={[
              { key: "labelAr", label: "الاسم (عربي)", rtl: true },
              { key: "labelEn", label: "Name (English)", ltr: true },
              { key: "amount",  label: "المبلغ (ر.س)", type: "number" },
              { key: "noteAr",  label: "ملاحظة (عربي)", rtl: true },
              { key: "noteEn",  label: "Note (English)", ltr: true },
            ]}
            renderView={(item) => (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 24, color: "#2D0864" }}>{SAR(item.amount)} <span style={{ fontSize: 13, fontWeight: 600, color: "#9CA3AF" }}>ر.س</span></div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginTop: 2 }}>{item.labelAr}</div>
                  <div style={{ fontSize: 12, color: "#DC2626", marginTop: 2 }}>{item.noteAr}</div>
                </div>
              </div>
            )}
          />
        )}

        {tab === "schedule" && (
          <InlineEditor<ScheduleTerm>
            apiBase="/api/admin/fee-schedule"
            fields={[
              { key: "labelAr", label: "الاسم (عربي)", rtl: true },
              { key: "labelEn", label: "Name (English)", ltr: true },
              { key: "pct",     label: "النسبة المئوية" },
              { key: "dateAr",  label: "الموعد (عربي)", rtl: true },
              { key: "dateEn",  label: "Date (English)", ltr: true },
            ]}
            renderView={(item) => (
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#7A24B2", lineHeight: 1 }}>{item.pct}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#2D0864" }}>{item.labelAr}</div>
                  <div style={{ fontSize: 12.5, color: "#9CA3AF" }}>📅 {item.dateAr}</div>
                </div>
              </div>
            )}
          />
        )}

        {tab === "additional" && (
          <InlineEditor<Additional>
            apiBase="/api/admin/fee-additional"
            fields={[
              { key: "icon",    label: "الأيقونة (emoji)" },
              { key: "labelAr", label: "الاسم (عربي)", rtl: true },
              { key: "labelEn", label: "Name (English)", ltr: true },
              { key: "valueAr", label: "القيمة (عربي)", rtl: true },
              { key: "valueEn", label: "Value (English)", ltr: true },
            ]}
            renderView={(item) => (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(122,36,178,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#2D0864" }}>{item.labelAr}</div>
                  <div style={{ fontSize: 13, color: "#5A5A5A" }}>{item.valueAr}</div>
                </div>
              </div>
            )}
          />
        )}
      </div>
    </>
  );
}
