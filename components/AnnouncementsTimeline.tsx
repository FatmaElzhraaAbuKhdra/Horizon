"use client";
import { useEffect, useRef, useState } from "react";
import { type Locale } from "@/lib/i18n";
import { Toast } from "./Modal";

export interface AnnouncementItem {
  id: string;
  date: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  imageUrl: string;
}

type ToastMsg = { title: string; desc: string; type: "success" | "error" } | null;

export default function AnnouncementsTimeline({ items, locale, initialId }: { items: AnnouncementItem[]; locale: Locale; initialId?: string }) {
  const isAr = locale === "ar";
  const C = { primaryDark: "#2D0864", secondary: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A", light: "#8A8A8A" };

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const didInitialScroll = useRef(false);
  const [toast, setToast] = useState<ToastMsg>(null);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(isAr ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Scroll to the requested post once, on first load.
  useEffect(() => {
    if (!initialId || didInitialScroll.current) return;
    const el = cardRefs.current[initialId];
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: "auto", block: "center" }));
    }
    didInitialScroll.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // As the user scrolls, quietly update the URL to reflect the post currently in view.
  useEffect(() => {
    if (items.length === 0) return;
    const io = new IntersectionObserver(
      entries => {
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
        }
        if (best) {
          const id = (best.target as HTMLElement).dataset.postId;
          if (id) {
            const path = `/${locale}/announcements/${id}`;
            if (window.location.pathname !== path) window.history.replaceState(null, "", path);
          }
        }
      },
      { threshold: [0, 0.5, 1], rootMargin: "-35% 0px -35% 0px" }
    );
    Object.values(cardRefs.current).forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [items, locale]);

  async function copyLink(id: string) {
    const url = `${window.location.origin}/${locale}/announcements/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast({ title: isAr ? "✅ تم النسخ" : "✅ Copied", desc: isAr ? "تم نسخ رابط التعميم" : "Announcement link copied", type: "success" });
    } catch {
      setToast({ title: "⚠️", desc: isAr ? "تعذر نسخ الرابط" : "Could not copy the link", type: "error" });
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: C.card, borderRadius: 20, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 44, marginBottom: "1rem" }}>📢</div>
        <p style={{ color: C.muted, fontSize: 15 }}>{isAr ? "لا توجد تعميمات حالياً." : "No announcements at the moment."}</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <Toast message={toast} onDone={() => setToast(null)} />

      {/* Vertical line */}
      <div style={{ position: "absolute", top: 8, bottom: 8, insetInlineStart: 15, width: 2, background: `linear-gradient(to bottom, ${C.secondary}, ${C.border})` }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {items.map(item => {
          const isActive = item.id === initialId;
          return (
            <div key={item.id} data-post-id={item.id} ref={el => { cardRefs.current[item.id] = el; }} style={{ position: "relative", paddingInlineStart: "3rem", scrollMarginTop: "6rem" }}>
              {/* Dot */}
              <div style={{ position: "absolute", insetInlineStart: 7, top: 6, width: 18, height: 18, borderRadius: "50%", background: C.secondary, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 2px ${C.secondary}` }} />

              <div style={{ background: C.card, borderRadius: 18, border: `1px solid ${isActive ? C.secondary : C.border}`, overflow: "hidden", boxShadow: isActive ? `0 4px 24px rgba(179,0,196,.18)` : "0 4px 18px rgba(90,23,133,.06)", transition: "border-color .3s, box-shadow .3s" }}>
                {item.imageUrl && (
                  <div style={{ width: "100%", aspectRatio: "16/8", overflow: "hidden" }}>
                    <img src={item.imageUrl} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                )}
                <div style={{ padding: "1.5rem 1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "0.6rem" }}>
                    <div style={{ fontSize: 12.5, color: C.secondary, fontWeight: 700 }}>{fmtDate(item.date)}</div>
                    <button
                      onClick={() => copyLink(item.id)}
                      title={isAr ? "نسخ رابط التعميم" : "Copy announcement link"}
                      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.secondary, background: "rgba(179,0,196,.08)", border: `1px solid rgba(179,0,196,.20)`, borderRadius: 20, padding: "5px 12px", cursor: "pointer", flexShrink: 0, fontFamily: "Cairo,sans-serif" }}
                    >
                      🔗 {isAr ? "نسخ الرابط" : "Copy link"}
                    </button>
                  </div>
                  <h3 style={{ fontFamily: "Amiri,serif", fontSize: 21, color: C.primaryDark, marginBottom: "0.75rem", lineHeight: 1.4 }}>
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9, whiteSpace: "pre-line" }}>
                    {isAr ? item.bodyAr : item.bodyEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
