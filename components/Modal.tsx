"use client";
import { useEffect, useState, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, subtitle, icon, children, footer }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(8,45,36,.65)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.25)", animation: "modalIn .25s ease" }}>
        <div style={{ padding: "1.5rem 1.75rem 1.25rem", borderBottom: "1px solid #E8E0F5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            {icon && <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(122,36,178,.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>}
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2D0864" }}>{title}</div>
              {subtitle && <div style={{ fontSize: 13, color: "#8A8A8A", marginTop: 2 }}>{subtitle}</div>}
            </div>
          </div>
          <button onClick={onClose} aria-label="إغلاق" style={{ width: 34, height: 34, background: "#FAF7FF", border: "1px solid #E8E0F5", borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#5A5A5A", flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ padding: "1.5rem 1.75rem" }}>{children}</div>
        {footer && <div style={{ padding: "1.25rem 1.75rem", borderTop: "1px solid #E8E0F5", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>{footer}</div>}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(.94) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}

export function Toast({ message, onDone }: { message: { title: string; desc: string; type: "success" | "error" } | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 4500);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;
  return (
    <div style={{ position: "fixed", bottom: "2rem", insetInlineEnd: "2rem", zIndex: 3000 }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "1rem 1.25rem", boxShadow: "0 8px 32px rgba(0,0,0,.15)", display: "flex", alignItems: "flex-start", gap: 12, minWidth: 280, borderInlineEnd: `4px solid ${message.type === "success" ? "#7A24B2" : "#c0392b"}` }}>
        <span style={{ fontSize: 22 }}>{message.type === "success" ? "✅" : "❌"}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{message.title}</div>
          <div style={{ fontSize: 13, color: "#5A5A5A", marginTop: 2 }}>{message.desc}</div>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}
export function Field({ label, required, children }: FormFieldProps) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>{label}{required && " *"}</label>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: "1.5px solid #E8E0F5", borderRadius: 10, fontFamily: "Cairo, sans-serif", fontSize: 14, color: "#1A1A1A", background: "#FAF7FF", outline: "none", boxSizing: "border-box" };
export const btnPrimary: React.CSSProperties = { padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "#B300C4", border: "none", color: "#fff", fontFamily: "Cairo, sans-serif", minWidth: 120 };
export const btnOutline: React.CSSProperties = { padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "transparent", border: "1.5px solid #7A24B2", color: "#7A24B2", fontFamily: "Cairo, sans-serif", minWidth: 120 };

export function SuccessBox({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ width: 72, height: 72, background: "rgba(122,36,178,.10)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: 32 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#2D0864", marginBottom: "0.5rem" }}>{title}</div>
      <div style={{ fontSize: 14, color: "#5A5A5A", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: desc }} />
    </div>
  );
}
