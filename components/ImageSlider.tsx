"use client";
import { useEffect, useState, useCallback, useRef } from "react";

export default function ImageSlider({ images, height = "420px", altPrefix = "صورة من مدارس الأفق العالمية" }: { images: string[]; height?: string; altPrefix?: string }) {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const seen = useRef(new Set<number>([0]));

  const go = useCallback((next: number) => {
    if (animating || images.length <= 1) return;
    setAnimating(true);
    seen.current.add(next);
    setTimeout(() => { setCur(next); setAnimating(false); }, 600);
  }, [animating, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCur(p => {
        const next = (p + 1) % images.length;
        seen.current.add(next);
        seen.current.add((next + 1) % images.length);
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [images.length]);

  if (!images.length) return null;

  const nextIdx = (cur + 1) % images.length;
  const renderSet = new Set([...seen.current, nextIdx]);

  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height, background: "#2D0864" }}>
      {images.map((src, i) => renderSet.has(i) ? (
        <img
          key={src}
          src={src}
          alt={`${altPrefix} ${i + 1}`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            opacity: i === cur ? 1 : 0,
            transform: i === cur ? "scale(1)" : "scale(1.04)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            pointerEvents: "none",
          }}
        />
      ) : null)}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(90,23,133,.55) 0%, transparent 60%)" }} />
      {images.length > 1 && (
        <>
          <button aria-label="السابق" onClick={() => go((cur - 1 + images.length) % images.length)}
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.18)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, color: "#fff", backdropFilter: "blur(6px)", transition: "background .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.32)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.18)")}
          >‹</button>
          <button aria-label="التالي" onClick={() => go((cur + 1) % images.length)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.18)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, color: "#fff", backdropFilter: "blur(6px)", transition: "background .2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.32)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.18)")}
          >›</button>
        </>
      )}
      {images.length > 1 && (
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 2 }}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} aria-label={`صورة ${i + 1}`}
              style={{ width: i === cur ? 26 : 8, height: 8, borderRadius: 4, background: i === cur ? "#B300C4" : "rgba(255,255,255,.55)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.35s ease" }}
            />
          ))}
        </div>
      )}
      {images.length > 1 && (
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,.45)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(4px)" }}>
          {cur + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
