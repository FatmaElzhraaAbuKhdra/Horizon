"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface Setting { key: string; valAr: string; valEn: string; }
interface VideoEntry { url: string; }

const LABELS: Record<string, string> = {
  "contact.phone":   "📞 رقم الهاتف",
  "contact.email":   "✉️ البريد الإلكتروني",
  "contact.address": "📍 العنوان",
  "contact.hours":   "🕐 ساعات العمل",
  "contact.tourInfo":"🏫 معلومات الجولات",
};
const HIDDEN_KEYS = new Set(["gallery.speed"]);

const CSS = `
  .st-wrap { padding: 2rem 2.5rem; }
  .st-title { font-size: 22px; font-weight: 800; color: #101828; display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .st-sub   { font-size: 13.5px; color: #667085; margin-bottom: 2rem; }
  .st-card  { background: #fff; border-radius: 16px; border: 1px solid #E4E0EC; padding: 1.75rem 2rem; margin-bottom: 1.25rem; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
  .st-key-label { font-size: 13px; font-weight: 800; color: #2D0864; margin-bottom: 1rem; }
  .st-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .st-field { display: flex; flex-direction: column; gap: 5px; }
  .st-lang  { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #9CA3AF; text-transform: uppercase; }
  .st-input {
    width: 100%; padding: 8px 12px; border-radius: 9px;
    border: 1.5px solid #D1D5DB; font-size: 13.5px;
    font-family: Cairo, sans-serif; outline: none;
    background: #F9FAFB; color: #101828;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .st-input:focus { border-color: #7A24B2; background: #fff; box-shadow: 0 0 0 3px rgba(122,36,178,.10); }
  .st-btn {
    padding: 8px 18px; border-radius: 9px; font-size: 13px;
    font-family: Cairo, sans-serif; cursor: pointer; font-weight: 600;
    transition: all .15s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .st-btn:disabled { opacity: .5; cursor: not-allowed; }
  .st-btn-save  { background: #9333EA; border-color: #9333EA; color: #fff; }
  .st-btn-save:hover:not(:disabled)  { background: #7E22CE; }
  .st-btn-video { background: #2D0864; border-color: #2D0864; color: #fff; }
  .st-btn-video:hover:not(:disabled) { background: #3C0E6E; }
  .st-progress-track { height: 8px; background: #E4E0EC; border-radius: 99px; overflow: hidden; margin-top: 12px; }
  .st-progress-bar   { height: 100%; background: linear-gradient(90deg,#B300C4,#FDE8FF); border-radius: 99px; transition: width .1s linear; }
  .st-video-drop {
    border: 2px dashed #D1D5DB; border-radius: 12px; padding: 2rem;
    text-align: center; cursor: pointer; transition: border-color .2s, background .2s;
    background: #F9FAFB;
  }
  .st-video-drop:hover, .st-video-drop.drag-over { border-color: #2D0864; background: #F4F0F9; }
  .st-yt-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .st-yt-input { flex: 1; padding: 8px 12px; border-radius: 9px; border: 1.5px solid #D1D5DB; font-size: 13.5px; font-family: Cairo, sans-serif; outline: none; background: #F9FAFB; color: #101828; box-sizing: border-box; direction: ltr; }
  .st-yt-input:focus { border-color: #7A24B2; background: #fff; box-shadow: 0 0 0 3px rgba(122,36,178,.10); }
  .st-yt-del { background: #FFF1F0; border: 1.5px solid #FCCACA; color: #DC2626; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: Cairo, sans-serif; font-weight: 700; }
  .st-yt-add { background: #F4F0F9; border: 1.5px solid #D4B3E8; color: #2D0864; padding: 7px 16px; border-radius: 9px; cursor: pointer; font-size: 13px; font-family: Cairo, sans-serif; font-weight: 700; }
  .st-yt-thumb { width: 80px; height: 48px; border-radius: 6px; object-fit: cover; flex-shrink: 0; background: #E4E0EC; }
  .st-toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: #2D0864; color: #fff; padding: 10px 24px;
    border-radius: 30px; font-size: 14px; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,.2); z-index: 9999;
    animation: toastIn .3s ease;
  }
  @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
`;

interface VideoInfo { exists: boolean; size?: number; updatedAt?: string; url?: string; }

function fmtBytes(b: number) {
  if (b >= 1e9) return (b / 1e9).toFixed(1) + " GB";
  if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB";
  return (b / 1e3).toFixed(0) + " KB";
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [edited, setEdited]     = useState<Record<string, Setting>>({});
  const [saving, setSaving]     = useState<string | null>(null);
  const [toast, setToast]       = useState<string | null>(null);

  // ── About page videos ──
  const [aboutVideos, setAboutVideos] = useState<VideoEntry[]>([]);
  const [videosSaving, setVideosSaving] = useState(false);

  const loadAboutVideos = useCallback(() => {
    fetch("/api/admin/settings").then(r => r.json()).then((rows: Setting[]) => {
      const row = rows.find(r => r.key === "about.videos");
      try { setAboutVideos((JSON.parse(row?.valAr ?? "[]") as string[]).map(u => ({ url: u }))); } catch { setAboutVideos([]); }
    });
  }, []);

  const saveAboutVideos = async () => {
    setVideosSaving(true);
    const urls = JSON.stringify(aboutVideos.map(v => v.url.trim()).filter(Boolean));
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "about.videos", valAr: urls, valEn: urls }),
    });
    setVideosSaving(false);
    showToast("✓ تم حفظ الفيديوهات");
  };

  function ytId(url: string): string | null {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  // ── Hero video upload ──
  const [gallerySpeed, setGallerySpeed] = useState(5);
  const [speedSaving,  setSpeedSaving]  = useState(false);

  const [videoInfo, setVideoInfo]     = useState<VideoInfo | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPct, setUploadPct]     = useState<number | null>(null);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadVideoInfo = useCallback(() => {
    let alive = true;
    fetch("/api/admin/hero-video")
      .then(r => r.json())
      .then(d => { if (alive) setVideoInfo(d); });
    return () => { alive = false; };
  }, []);

  const deleteVideo = useCallback(async () => {
    if (!confirm("حذف الفيديو الحالي؟ سيظهر خلفية خضراء بدلاً منه حتى ترفع فيديو جديد.")) return;
    const r = await fetch("/api/admin/hero-video", { method: "DELETE" });
    if (r.ok) { showToast("✓ تم حذف الفيديو"); loadVideoInfo(); }
    else { const d = await r.json(); showToast("✗ " + (d.error ?? "فشل الحذف")); }
  }, [loadVideoInfo]);

  const uploadVideo = useCallback(() => {
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append("video", selectedFile);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadPct(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploadPct(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (xhr.status === 200) {
        showToast("✓ تم رفع الفيديو بنجاح");
        loadVideoInfo();
      } else {
        try { showToast("✗ " + JSON.parse(xhr.responseText).error); } catch { showToast("✗ فشل الرفع"); }
      }
    };
    xhr.onerror = () => { setUploadPct(null); showToast("✗ خطأ في الشبكة"); };
    setUploadPct(0);
    xhr.open("POST", "/api/admin/hero-video");
    xhr.send(fd);
  }, [selectedFile, loadVideoInfo]);

  const saveSpeed = async (val: number) => {
    setSpeedSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "gallery.speed", valAr: String(val), valEn: String(val) }),
    });
    setSpeedSaving(false);
    showToast("✓ تم حفظ سرعة السلايدر");
  };

  const load = useCallback(() => {
    fetch("/api/admin/settings").then(r => r.json()).then((rows: Setting[]) => {
      setSettings(rows);
      const map: Record<string, Setting> = {};
      rows.forEach(r => {
        map[r.key] = { ...r };
        if (r.key === "gallery.speed") setGallerySpeed(Number(r.valAr) || 5);
      });
      setEdited(map);
    });
  }, []);
  useEffect(() => {
    load();
    loadAboutVideos();
    const cancel = loadVideoInfo();
    return cancel;
  }, [load, loadVideoInfo]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const save = async (key: string) => {
    const s = edited[key];
    if (!s) return;
    setSaving(key);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, valAr: s.valAr, valEn: s.valEn }),
    });
    setSaving(null);
    showToast("✓ تم الحفظ");
    load();
  };

  const update = (key: string, field: "valAr" | "valEn", val: string) =>
    setEdited(p => ({ ...p, [key]: { ...p[key], [field]: val } }));

  const keys = Object.keys(LABELS);

  return (
    <>
      <style>{CSS}</style>
      <div className="st-wrap">
        <div className="st-title">⚙️ إعدادات الموقع</div>
        <p className="st-sub">معلومات التواصل وبيانات المدرسة — تظهر التغييرات فوراً على الموقع</p>

        {/* ── Hero Video Upload ── */}
        <div className="st-card">
          <div className="st-key-label">🎬 فيديو الصفحة الرئيسية</div>

          {/* Current video status */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem", padding: "10px 14px", background: videoInfo?.exists ? "#F5F0FD" : videoInfo === null ? "#F9FAFB" : "#FFF8F0", borderRadius: 10, border: `1px solid ${videoInfo?.exists ? "#D4A7F3" : videoInfo === null ? "#E4E0EC" : "#FCD3A1"}` }}>
            <span style={{ fontSize: 22 }}>{videoInfo === null ? "⏳" : videoInfo.exists ? "🎥" : "📭"}</span>
            <div style={{ flex: 1 }}>
              {videoInfo === null ? (
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>جاري التحقق...</div>
              ) : videoInfo.exists ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>فيديو مرفوع — {fmtBytes(videoInfo.size!)}</div>
                  <div style={{ fontSize: 11.5, color: "#6B7280", marginTop: 2 }}>
                    آخر تحديث: {new Date(videoInfo.updatedAt!).toLocaleString("ar-EG")}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>لا يوجد فيديو — يظهر خلفية خضراء بدلاً منه</div>
              )}
            </div>
            {videoInfo?.exists && (
              <button
                onClick={deleteVideo}
                style={{ background: "#FFF1F0", border: "1.5px solid #FCCACA", color: "#DC2626", padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontFamily: "Cairo, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                🗑 حذف الفيديو
              </button>
            )}
          </div>

          {/* Drop zone */}
          <div
            className={`st-video-drop${dragOver ? " drag-over" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault(); setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) setSelectedFile(f);
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📹</div>
            {selectedFile ? (
              <>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2D0864" }}>{selectedFile.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{fmtBytes(selectedFile.size)}</div>
              </>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>اسحب وأفلت الفيديو هنا</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>أو انقر للاختيار — MP4 / WebM مدعوم</div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) setSelectedFile(f); }}
            />
          </div>

          {/* Progress bar */}
          {uploadPct !== null && (
            <div className="st-progress-track">
              <div className="st-progress-bar" style={{ width: `${uploadPct}%` }} />
            </div>
          )}
          {uploadPct !== null && (
            <div style={{ textAlign: "center", fontSize: 12, color: "#6B7280", marginTop: 6 }}>
              جاري الرفع... {uploadPct}%
            </div>
          )}

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem", alignItems: "center" }}>
            {selectedFile && uploadPct === null && (
              <span style={{ fontSize: 12, color: "#6B7280" }}>سيحلّ الفيديو الجديد محلّ الموجود</span>
            )}
            <button
              className="st-btn st-btn-video"
              onClick={uploadVideo}
              disabled={!selectedFile || uploadPct !== null}
            >
              {uploadPct !== null ? `⏳ ${uploadPct}%` : "⬆ رفع الفيديو"}
            </button>
          </div>
        </div>

        {/* ── Gallery Speed ── */}
        <div className="st-card">
          <div className="st-key-label">🎞️ سرعة سلايدر معرض الصور</div>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: "1.25rem" }}>
            كم ثانية تظهر كل صورة قبل الانتقال للتالية
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <input
              type="range"
              min={2} max={15} step={1}
              value={gallerySpeed}
              onChange={e => setGallerySpeed(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#2D0864" }}
            />
            <div style={{ minWidth: 56, textAlign: "center", fontWeight: 800, fontSize: 22, color: "#2D0864" }}>
              {gallerySpeed}s
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
            <span>سريع (٢s)</span><span>بطيء (١٥s)</span>
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <button className="st-btn st-btn-save" onClick={() => saveSpeed(gallerySpeed)} disabled={speedSaving}>
              {speedSaving ? "جاري الحفظ..." : "✓ حفظ"}
            </button>
          </div>
        </div>

        {/* ── About Page Videos ── */}
        <div className="st-card">
          <div className="st-key-label">🎬 فيديوهات صفحة "عن المدرسة" (يوتيوب)</div>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: "1.25rem" }}>
            أضف روابط يوتيوب — تظهر مباشرة في صفحة التعريف بالمدرسة
          </p>
          {aboutVideos.map((v, i) => {
            const id = ytId(v.url);
            return (
              <div key={i} className="st-yt-row">
                {id
                  ? <img className="st-yt-thumb" src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="" />
                  : <div className="st-yt-thumb" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>▶️</div>
                }
                <input
                  className="st-yt-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={v.url}
                  onChange={e => setAboutVideos(p => p.map((x, j) => j === i ? { url: e.target.value } : x))}
                />
                <button className="st-yt-del" onClick={() => setAboutVideos(p => p.filter((_, j) => j !== i))}>🗑</button>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
            <button className="st-yt-add" onClick={() => setAboutVideos(p => [...p, { url: "" }])}>+ إضافة فيديو</button>
            <button className="st-btn st-btn-save" onClick={saveAboutVideos} disabled={videosSaving}>
              {videosSaving ? "جاري الحفظ..." : "✓ حفظ الفيديوهات"}
            </button>
          </div>
        </div>

        {/* ── Site Settings ── */}
        {keys.map(key => {
          const s = edited[key];
          if (!s || HIDDEN_KEYS.has(key)) return null;
          return (
            <div key={key} className="st-card">
              <div className="st-key-label">{LABELS[key]}</div>
              <div className="st-grid">
                <div className="st-field">
                  <div className="st-lang">عربي</div>
                  <input
                    className="st-input"
                    style={{ direction: "rtl" }}
                    value={s.valAr}
                    onChange={e => update(key, "valAr", e.target.value)}
                  />
                </div>
                <div className="st-field">
                  <div className="st-lang">English</div>
                  <input
                    className="st-input"
                    style={{ direction: "ltr" }}
                    value={s.valEn}
                    onChange={e => update(key, "valEn", e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                <button className="st-btn st-btn-save" onClick={() => save(key)} disabled={saving === key}>
                  {saving === key ? "جاري الحفظ..." : "✓ حفظ"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <div className="st-toast">{toast}</div>}
    </>
  );
}
