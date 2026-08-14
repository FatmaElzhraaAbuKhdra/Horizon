"use client";
import { Fragment, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Col<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export type StatusOption = {
  value: string;
  label: string;
  color: string;
};

interface Props<T extends { id: string; status?: string; createdAt: string }> {
  title: string;
  icon: string;
  data: T[];
  cols: Col<T>[];
  statusOptions?: StatusOption[];
  apiBase: string;
  onRefresh: () => void;
  searchKeys?: (keyof T)[];
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
  .at-wrap { padding: 2rem 2.5rem; }

  /* Header */
  .at-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .at-title {
    font-size: 22px; font-weight: 800;
    color: #101828; display: flex;
    align-items: center; gap: 10px;
  }
  .at-count {
    display: inline-block; margin-top: 5px;
    font-size: 12px; font-weight: 600;
    color: #667085; background: #F2F4F7;
    padding: 2px 10px; border-radius: 20px;
  }
  .at-controls { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

  /* Search */
  .at-search-wrap { position: relative; }
  .at-search-icon {
    position: absolute; right: 11px; top: 50%;
    transform: translateY(-50%);
    font-size: 14px; pointer-events: none; opacity: .5;
  }
  .at-search {
    padding: 8px 14px 8px 14px;
    padding-right: 34px;
    border-radius: 10px; border: 1.5px solid #E4E0EC;
    font-size: 13.5px; font-family: Cairo, sans-serif;
    outline: none; width: 220px;
    background: #F9FAFB; color: #101828;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .at-search:focus {
    border-color: #7A24B2; background: #fff;
    box-shadow: 0 0 0 3px rgba(122,36,178,.1);
  }

  /* Buttons */
  .at-btn {
    padding: 8px 16px; border-radius: 9px;
    font-size: 13px; font-family: Cairo, sans-serif;
    cursor: pointer; font-weight: 600;
    transition: all .15s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .at-btn:disabled { opacity: .5; cursor: not-allowed; }

  .at-btn-primary { background: #7A24B2; color: #fff; }
  .at-btn-primary:hover:not(:disabled) { background: #2D0864; }

  .at-btn-sm { padding: 4px 12px; font-size: 12.5px; }

  .at-btn-ghost { background: #fff; border-color: #E4E0EC; color: #374151; }
  .at-btn-ghost:hover:not(:disabled) { background: #F9FAFB; border-color: #D1D5DB; }

  .at-btn-danger { background: #FFF1F0; border-color: #FFD0CC; color: #DC2626; }
  .at-btn-danger:hover:not(:disabled) { background: #FFE4E1; }

  /* Card */
  .at-card {
    background: #fff; border-radius: 16px;
    border: 1px solid #E4E0EC; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }

  /* Table */
  .at-table { width: 100%; border-collapse: collapse; }

  .at-table thead th {
    background: #F9FAFB;
    padding: 11px 16px;
    text-align: start;
    font-size: 11.5px; font-weight: 700;
    color: #667085;
    text-transform: uppercase; letter-spacing: .5px;
    white-space: nowrap;
    border-bottom: 1.5px solid #E4E0EC;
  }

  .at-table tbody td {
    padding: 13px 16px;
    font-size: 13.5px; color: #374151;
    vertical-align: middle;
    border-bottom: 1px solid #F2F4F7;
  }

  .at-row { transition: background .15s; }
  .at-row:hover td { background: #F0FDF8; }
  .at-row:last-child td { border-bottom: none; }
  .at-row-alt td { background: #FAFAFA; }

  /* Status select */
  .at-status-select {
    padding: 4px 8px; border-radius: 8px;
    font-size: 12.5px; font-family: Cairo, sans-serif;
    font-weight: 700; outline: none;
    cursor: pointer; border: 1.5px solid;
    transition: all .2s;
  }

  /* Expanded detail row */
  .at-expand td {
    padding: 1.25rem 1.75rem !important;
    border-bottom: 2px solid rgba(122,36,178,.1) !important;
  }
  .at-expand-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: .75rem;
  }
  .at-field {
    background: #F9FAFB; border-radius: 10px;
    padding: 10px 14px; border: 1px solid #E4E0EC;
  }
  .at-field-key {
    font-size: 10.5px; color: #9CA3AF;
    font-weight: 700; text-transform: uppercase;
    letter-spacing: .5px; margin-bottom: 3px;
  }
  .at-field-val { font-size: 13px; color: #101828; word-break: break-all; }

  /* Empty state */
  .at-empty { text-align: center; padding: 5rem 2rem; }
  .at-empty-icon { font-size: 48px; opacity: .35; margin-bottom: 1rem; }
  .at-empty-text { font-size: 15px; font-weight: 600; color: #9CA3AF; }

  /* Row stagger animation */
  @keyframes rowIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: none; }
  }
  .at-row { animation: rowIn .25s ease both; }

  @media (max-width: 800px) {
    .at-wrap { padding: 1rem !important; }
    .at-search { width: 140px !important; }
    .at-title { font-size: 18px !important; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminTable<T extends { id: string; status?: string; createdAt: string }>({
  title, icon, data, cols, statusOptions, apiBase, onRefresh, searchKeys = [],
}: Props<T>) {
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = search
    ? data.filter(row =>
        searchKeys.some(k =>
          String((row as any)[k] ?? "").toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    setDeleting(id);
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    setDeleting(null);
    onRefresh();
  };

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`${apiBase}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    onRefresh();
  };

  const statusOpt = (val: string) =>
    statusOptions?.find(s => s.value === val);

  return (
    <>
      <style>{CSS}</style>
      <div className="at-wrap">

        {/* ── Header ── */}
        <div className="at-header">
          <div>
            <h1 className="at-title">
              <span>{icon}</span> {title}
            </h1>
            <span className="at-count">{filtered.length} سجل</span>
          </div>

          <div className="at-controls">
            <div className="at-search-wrap">
              <span className="at-search-icon">🔍</span>
              <input
                className="at-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="بحث..."
              />
            </div>
            <button className="at-btn at-btn-primary" onClick={onRefresh}>
              ↺ تحديث
            </button>
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="at-card">
          {filtered.length === 0 ? (
            <div className="at-empty">
              <div className="at-empty-icon">📭</div>
              <div className="at-empty-text">
                {search ? "لا توجد نتائج للبحث" : "لا توجد بيانات بعد"}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="at-table">
                <thead>
                  <tr>
                    {cols.map(c => (
                      <th key={String(c.key)}>{c.label}</th>
                    ))}
                    {statusOptions && <th>الحالة</th>}
                    <th>الإجراءات</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((row, i) => {
                    const opt = statusOpt(row.status ?? "");
                    const isOpen = expanded === row.id;

                    return (
                      <Fragment key={row.id}>
                        <tr
                          className={`at-row${i % 2 !== 0 ? " at-row-alt" : ""}`}
                          style={{ animationDelay: `${Math.min(i * 35, 350)}ms` }}
                        >
                          {/* Data columns */}
                          {cols.map(c => (
                            <td key={String(c.key)}>
                              {c.render
                                ? c.render(row)
                                : String((row as any)[c.key] ?? "—")}
                            </td>
                          ))}

                          {/* Status column */}
                          {statusOptions && (
                            <td>
                              <select
                                className="at-status-select"
                                value={row.status ?? ""}
                                onChange={e => handleStatus(row.id, e.target.value)}
                                disabled={updating === row.id}
                                style={{
                                  color: opt?.color ?? "#374151",
                                  borderColor: opt?.color ?? "#E4E0EC",
                                  background: opt ? `${opt.color}18` : "#F9FAFB",
                                }}
                              >
                                {statusOptions.map(o => (
                                  <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                              </select>
                            </td>
                          )}

                          {/* Actions column */}
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                className="at-btn at-btn-ghost at-btn-sm"
                                onClick={() => setExpanded(isOpen ? null : row.id)}
                              >
                                {isOpen ? "إخفاء" : "تفاصيل"}
                              </button>
                              <button
                                className="at-btn at-btn-danger at-btn-sm"
                                onClick={() => handleDelete(row.id)}
                                disabled={deleting === row.id}
                              >
                                {deleting === row.id ? "..." : "حذف"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded detail row */}
                        {isOpen && (
                          <tr className="at-expand">
                            <td colSpan={cols.length + (statusOptions ? 2 : 1)}>
                              <div className="at-expand-grid">
                                {Object.entries(row)
                                  .filter(([k]) => k !== "id")
                                  .map(([k, v]) => (
                                    <div key={k} className="at-field">
                                      <div className="at-field-key">{k}</div>
                                      <div className="at-field-val">{String(v ?? "—")}</div>
                                    </div>
                                  ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  );
}
