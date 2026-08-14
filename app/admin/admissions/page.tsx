"use client";
import { useCallback, useEffect, useState } from "react";

interface Step {
  id: string; num: string; titleAr: string; titleEn: string;
  color: string; itemsAr: string; itemsEn: string; sortOrder: number;
}

const COLORS = ["#7A24B2","#7C3AED","#B300C4","#DC2626","#2563EB","#D97706"];

const CSS = `
  .as-wrap { padding: 2rem 2.5rem; }
  .as-title { font-size: 22px; font-weight: 800; color: #101828; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .as-sub   { font-size: 13.5px; color: #667085; margin-bottom: 2rem; }

  .as-toolbar { display: flex; gap: 10px; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .as-btn {
    padding: 8px 16px; border-radius: 9px; font-size: 13px;
    font-family: Cairo, sans-serif; cursor: pointer; font-weight: 600;
    transition: all .15s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .as-btn:disabled { opacity:.5; cursor:not-allowed; }
  .as-btn-primary { background:#7A24B2; color:#fff; }
  .as-btn-primary:hover:not(:disabled) { background:#2D0864; }
  .as-btn-ghost   { background:#fff; border-color:#E4E0EC; color:#374151; }
  .as-btn-ghost:hover:not(:disabled) { background:#F9FAFB; }
  .as-btn-danger  { background:#FFF1F0; border-color:#FFD0CC; color:#DC2626; }
  .as-btn-danger:hover:not(:disabled) { background:#FFE4E1; }
  .as-btn-save    { background:#9333EA; color:#fff; }
  .as-btn-save:hover:not(:disabled) { background:#7E22CE; }

  .as-steps { display: grid; grid-template-columns: repeat(auto-fill,minmax(320px,1fr)); gap: 1.25rem; }

  .as-card {
    background: #fff; border-radius: 16px;
    border: 1.5px solid #E4E0EC; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    transition: box-shadow .2s;
    display: flex; flex-direction: column;
  }
  .as-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }

  .as-card-header {
    display: flex; align-items: center; gap: 12px;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #F2F4F7;
  }
  .as-num-badge {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .as-card-title-ar { font-size: 14.5px; font-weight: 700; color: #101828; }
  .as-card-title-en { font-size: 12px; color: #667085; margin-top: 2px; }

  .as-card-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 14px; flex: 1; }

  .as-field-label { font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; }
  .as-input {
    width: 100%; padding: 8px 12px; border-radius: 9px;
    border: 1.5px solid #E4E0EC; font-size: 13px;
    font-family: Cairo, sans-serif; outline: none;
    background: #F9FAFB; color: #101828;
    transition: border-color .2s, box-shadow .2s; box-sizing: border-box;
  }
  .as-input:focus { border-color: #7A24B2; background: #fff; box-shadow: 0 0 0 3px rgba(122,36,178,.08); }
  .as-textarea { resize: vertical; min-height: 90px; line-height: 1.6; direction: rtl; }
  .as-textarea.en { direction: ltr; }

  .as-colors { display: flex; gap: 6px; flex-wrap: wrap; }
  .as-color-dot {
    width: 28px; height: 28px; border-radius: 8px; cursor: pointer;
    border: 2px solid transparent; transition: transform .15s, border-color .15s;
  }
  .as-color-dot:hover { transform: scale(1.15); }
  .as-color-dot.selected { border-color: #101828; transform: scale(1.1); }

  .as-card-footer {
    padding: .875rem 1.5rem; border-top: 1px solid #F2F4F7;
    display: flex; gap: 8px; justify-content: flex-end;
  }

  .as-items-preview {
    display: flex; flex-direction: column; gap: 5px; padding-top: 2px;
  }
  .as-item-chip {
    display: flex; align-items: flex-start; gap: 7px;
    font-size: 12.5px; color: #374151; line-height: 1.5;
  }
  .as-item-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }

  .as-helper { font-size: 11.5px; color: #9CA3AF; margin-top: 4px; }

  @keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .as-card { animation: cardIn .25s ease both; }
`;

export default function AdmissionsAdminPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [edits, setEdits] = useState<{ [id: string]: Partial<Step> }>({});
  const [saving, setSaving]   = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/admissions-steps").then(r => r.json()).then(setSteps);
  }, []);
  useEffect(load, [load]);

  const getEd = (id: string) => edits[id] ?? {};
  const startEdit = (s: Step) => setEdits(p => ({ ...p, [s.id]: { ...s } }));
  const cancelEdit = (id: string) => setEdits(p => { const n = { ...p }; delete n[id]; return n; });
  const setField = (id: string, f: keyof Step, v: string) =>
    setEdits(p => ({ ...p, [id]: { ...p[id], [f]: v } }));

  const isEditing = (id: string) => id in edits;

  const save = async (id: string) => {
    setSaving(id);
    await fetch(`/api/admin/admissions-steps/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edits[id]),
    });
    setSaving(null);
    cancelEdit(id);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("حذف هذه الخطوة نهائياً؟")) return;
    setDeleting(id);
    await fetch(`/api/admin/admissions-steps/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const parseItems = (json: string) => {
    try { return JSON.parse(json) as string[]; } catch { return []; }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="as-wrap">
        <h1 className="as-title">🗺️ إدارة مسار القبول</h1>
        <p className="as-sub">تعديل خطوات رحلة القبول — تظهر على صفحة التسجيل والقبول مباشرةً</p>

        <div className="as-toolbar">
          <button className="as-btn as-btn-ghost" onClick={load}>↺ تحديث</button>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{steps.length} خطوات</span>
        </div>

        <div className="as-steps">
          {steps.map((step, idx) => {
            const ed = getEd(step.id);
            const editing = isEditing(step.id);
            const color  = editing ? (ed.color ?? step.color) : step.color;
            const titAr  = editing ? (ed.titleAr ?? step.titleAr) : step.titleAr;
            const titEn  = editing ? (ed.titleEn ?? step.titleEn) : step.titleEn;
            const rawAr  = editing ? (ed.itemsAr ?? step.itemsAr) : step.itemsAr;
            const rawEn  = editing ? (ed.itemsEn ?? step.itemsEn) : step.itemsEn;

            return (
              <div key={step.id} className="as-card" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="as-card-header">
                  <div className="as-num-badge" style={{ background: color }}>{step.num}</div>
                  <div>
                    <div className="as-card-title-ar">{titAr}</div>
                    <div className="as-card-title-en">{titEn}</div>
                  </div>
                </div>

                <div className="as-card-body">
                  {editing ? (
                    <>
                      <div>
                        <div className="as-field-label">رقم الخطوة</div>
                        <input className="as-input" value={ed.num ?? step.num} onChange={e => setField(step.id, "num", e.target.value)} style={{ maxWidth: 80, textAlign: "center" }} />
                      </div>
                      <div>
                        <div className="as-field-label">اللون</div>
                        <div className="as-colors">
                          {COLORS.map(c => (
                            <div key={c} className={`as-color-dot${color === c ? " selected" : ""}`}
                              style={{ background: c }} onClick={() => setField(step.id, "color", c)} />
                          ))}
                          <input type="color" value={color} onChange={e => setField(step.id, "color", e.target.value)}
                            style={{ width: 28, height: 28, border: "2px solid #E4E0EC", borderRadius: 8, cursor: "pointer", padding: 0 }} />
                        </div>
                      </div>
                      <div>
                        <div className="as-field-label">العنوان (عربي)</div>
                        <input className="as-input" value={ed.titleAr ?? step.titleAr} onChange={e => setField(step.id, "titleAr", e.target.value)} />
                      </div>
                      <div>
                        <div className="as-field-label">العنوان (English)</div>
                        <input className="as-input" style={{ direction: "ltr" }} value={ed.titleEn ?? step.titleEn} onChange={e => setField(step.id, "titleEn", e.target.value)} />
                      </div>
                      <div>
                        <div className="as-field-label">البنود (عربي) — سطر لكل بند</div>
                        <textarea className="as-input as-textarea"
                          value={parseItems(rawAr).join("\n")}
                          onChange={e => setField(step.id, "itemsAr", JSON.stringify(e.target.value.split("\n").filter(Boolean)))}
                        />
                        <div className="as-helper">كل سطر = بند واحد</div>
                      </div>
                      <div>
                        <div className="as-field-label">Items (English) — one per line</div>
                        <textarea className="as-input as-textarea en"
                          value={parseItems(rawEn).join("\n")}
                          onChange={e => setField(step.id, "itemsEn", JSON.stringify(e.target.value.split("\n").filter(Boolean)))}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="as-items-preview">
                      {parseItems(step.itemsAr).map((item, j) => (
                        <div key={j} className="as-item-chip">
                          <div className="as-item-dot" style={{ background: step.color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="as-card-footer">
                  {editing ? (
                    <>
                      <button className="as-btn as-btn-save" style={{ padding: "6px 14px" }} onClick={() => save(step.id)} disabled={saving === step.id}>
                        {saving === step.id ? "..." : "✓ حفظ"}
                      </button>
                      <button className="as-btn as-btn-ghost" style={{ padding: "6px 14px" }} onClick={() => cancelEdit(step.id)}>
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="as-btn as-btn-ghost" style={{ padding: "6px 14px" }} onClick={() => startEdit(step)}>
                        ✏️ تعديل
                      </button>
                      <button className="as-btn as-btn-danger" style={{ padding: "6px 14px" }} onClick={() => del(step.id)} disabled={deleting === step.id}>
                        {deleting === step.id ? "..." : "حذف"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
