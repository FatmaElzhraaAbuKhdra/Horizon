"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { IMAGE_SLOT_GROUPS, type Slot } from "@/lib/image-slots";

interface ImgFile { name: string; url: string; }
type Summary = Record<string, ImgFile[]>;

function fmtSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}

const CSS = `
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  .slot-card { background:#fff; border:1px solid #E4E0EC; border-radius:16px; padding:1.25rem; animation:fadeIn .25s ease both; }
  .thumb-grid { display:grid; gap:8px; margin-top:10px; }
  .thumb-wrap { position:relative; border-radius:8px; overflow:hidden; aspect-ratio:4/3; background:#F0F2F5; }
  .thumb-wrap img { width:100%;height:100%;object-fit:cover;display:block; }
  .thumb-del { position:absolute;top:4px;left:4px;width:22px;height:22px;background:rgba(220,38,38,.85);border:none;border-radius:50%;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s; }
  .thumb-wrap:hover .thumb-del { opacity:1; }
  .drop-mini { border:2px dashed #D8C8E8;border-radius:10px;padding:.85rem;text-align:center;cursor:pointer;transition:all .15s;font-size:12px;color:#667085; }
  .drop-mini.drag { border-color:#7A24B2;background:#EEE8F8;color:#7A24B2; }
  .drop-mini:hover { border-color:#9CA3AF; }
  .badge-full { background:#EDE1F8;color:#8C2AC8;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700; }
  .badge-partial { background:#FEF3C7;color:#92400E;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700; }
  .badge-empty { background:#FEE2E2;color:#991B1B;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700; }
  .toast { position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#7A24B2;color:#fff;padding:10px 22px;border-radius:10px;font-size:13px;font-weight:700;z-index:9999;animation:fadeIn .2s ease both;pointer-events:none;white-space:nowrap; }
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
`;

export default function ImagesPage() {
  const [summary,  setSummary]  = useState<Summary>({});
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState<string | null>(null);
  const [uploading,setUploading]= useState<string | null>(null); // slot key being uploaded
  const inputRef  = useRef<HTMLInputElement>(null);
  const activeSlot= useRef<string>("");

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/images")
      .then(r => r.json())
      .then(d => { setSummary(d ?? {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const upload = async (slot: string, files: FileList | File[]) => {
    setUploading(slot);
    let ok = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("slot", slot);
      fd.append("file", file);
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      if (res.ok) ok++;
      else { const d = await res.json(); showToast(d.error ?? "فشل الرفع"); }
    }
    if (ok > 0) showToast(ok === 1 ? "تم رفع الصورة ✓" : `تم رفع ${ok} صور ✓`);
    setUploading(null);
    load();
  };

  const del = async (slot: string, name: string) => {
    if (!confirm("حذف هذه الصورة؟")) return;
    const res = await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, name }),
    });
    if (res.ok) { showToast("تم الحذف"); load(); }
    else showToast("فشل الحذف");
  };

  const openPicker = (slotKey: string) => {
    activeSlot.current = slotKey;
    if (inputRef.current) { inputRef.current.value = ""; inputRef.current.click(); }
  };

  const SlotCard = ({ slot }: { slot: Slot }) => {
    const imgs     = summary[slot.key] ?? [];
    const count    = imgs.length;
    const isFull   = count >= slot.max;
    const isEmpty  = count === 0;
    const isUp     = uploading === slot.key;
    const [drag, setDrag] = useState(false);

    const onDrop = (e: React.DragEvent) => {
      e.preventDefault(); setDrag(false);
      if (!isFull && e.dataTransfer.files.length) upload(slot.key, e.dataTransfer.files);
    };

    const cols = slot.max === 1 ? 1 : slot.max <= 2 ? 2 : slot.max <= 4 ? 2 : 3;

    return (
      <div className="slot-card">
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"#101828" }}>{slot.label}</div>
            <div style={{ fontSize:12, color:"#667085", marginTop:2 }}>{slot.desc}</div>
          </div>
          <span className={isFull ? "badge-full" : isEmpty ? "badge-empty" : "badge-partial"}>
            {count}/{slot.max} {isFull ? "✓ مكتمل" : isEmpty ? "فارغ" : "ناقص"}
          </span>
        </div>

        {/* Thumbnails */}
        {count > 0 && (
          <div className="thumb-grid" style={{ gridTemplateColumns:`repeat(${cols},1fr)` }}>
            {imgs.map(img => (
              <div key={img.name} className="thumb-wrap">
                <img src={img.url} alt={img.name} loading="lazy" />
                <button className="thumb-del" onClick={() => del(slot.key, img.name)} title="حذف">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        {!isFull && (
          <div
            className={`drop-mini${drag ? " drag" : ""}`}
            style={{ marginTop: count > 0 ? 10 : 0 }}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => !isUp && openPicker(slot.key)}
          >
            {isUp ? "⏳ جاري الرفع…" : (
              <>
                <span style={{ fontSize:18 }}>+</span>
                <span style={{ marginRight:6 }}>
                  {slot.max - count === 1
                    ? "أضف صورة واحدة"
                    : `أضف حتى ${slot.max - count} صور`}
                </span>
                <br />
                <span style={{ fontSize:11, opacity:.7 }}>{slot.hint}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display:"none" }}
        onChange={e => {
          if (e.target.files?.length && activeSlot.current) {
            upload(activeSlot.current, e.target.files);
          }
        }}
      />

      <div style={{ padding:"2rem 2.5rem", fontFamily:"'Cairo',sans-serif", direction:"rtl" }}>

        {/* Page header */}
        <div style={{ marginBottom:"2rem" }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#101828" }}>مكتبة الصور</h1>
          <p style={{ fontSize:13, color:"#667085", marginTop:4 }}>
            كل قسم في الموقع له مكان محدد — ارفع الصور في المكان الصح
          </p>
        </div>

        {/* Progress bar - overall */}
        {!loading && (() => {
          const total   = IMAGE_SLOT_GROUPS.flatMap(g => g.slots).reduce((s, sl) => s + sl.max, 0);
          const filled  = IMAGE_SLOT_GROUPS.flatMap(g => g.slots).reduce((s, sl) => s + Math.min((summary[sl.key]?.length ?? 0), sl.max), 0);
          const pct     = Math.round(filled / total * 100);
          return (
            <div style={{ background:"#fff", border:"1px solid #E4E0EC", borderRadius:12, padding:"1rem 1.25rem", marginBottom:"2rem", display:"flex", alignItems:"center", gap:"1rem" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#101828" }}>اكتمال مكتبة الصور</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#7A24B2" }}>{pct}%</span>
                </div>
                <div style={{ height:8, background:"#E4E0EC", borderRadius:99, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:"#7A24B2", borderRadius:99, transition:"width .4s ease" }} />
                </div>
              </div>
              <div style={{ fontSize:13, color:"#667085", whiteSpace:"nowrap" }}>{filled} / {total} صورة</div>
            </div>
          );
        })()}

        {/* Skeleton */}
        {loading && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1rem" }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ background:"#fff", border:"1px solid #E4E0EC", borderRadius:16, padding:"1.25rem", animation:"pulse 1.2s infinite" }}>
                <div style={{ height:18, width:"60%", background:"#F0F2F5", borderRadius:6, marginBottom:8 }} />
                <div style={{ height:13, width:"85%", background:"#F5F5F5", borderRadius:6, marginBottom:12 }} />
                <div style={{ height:90, background:"#F0F2F5", borderRadius:10 }} />
              </div>
            ))}
          </div>
        )}

        {/* Groups */}
        {!loading && IMAGE_SLOT_GROUPS.map(group => (
          <div key={group.page} style={{ marginBottom:"2.5rem" }}>
            {/* Group header */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"1rem", paddingBottom:8, borderBottom:"2px solid #E4E0EC" }}>
              <span style={{ fontSize:20 }}>{group.icon}</span>
              <span style={{ fontSize:16, fontWeight:800, color:"#101828" }}>{group.page}</span>
              <span style={{ fontSize:12, color:"#9CA3AF", marginRight:"auto" }}>
                {group.slots.length} {group.slots.length === 1 ? "موقع" : "مواقع"} ·{" "}
                {group.slots.reduce((s, sl) => s + sl.max, 0)} صورة إجمالي
              </span>
            </div>

            {/* Slot cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"1rem" }}>
              {group.slots.map(slot => <SlotCard key={slot.key} slot={slot} />)}
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
