"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: "70vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
      fontFamily: "'Cairo', sans-serif", direction: "rtl",
    }}>
      <div style={{ fontSize: 56, marginBottom: "1rem" }}>⚠️</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#101828", marginBottom: ".75rem" }}>
        حدث خطأ غير متوقع
      </h2>
      <p style={{ fontSize: 14, color: "#667085", marginBottom: "2rem", maxWidth: 360 }}>
        نعتذر عن هذا الخطأ. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={reset} style={{
          padding: "11px 24px", background: "#7A24B2", color: "#fff",
          border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          حاول مرة أخرى
        </button>
        <Link href="/ar" style={{
          padding: "11px 24px", background: "#fff", color: "#7A24B2",
          border: "1.5px solid #7A24B2", borderRadius: 10,
          fontWeight: 700, fontSize: 14, textDecoration: "none",
        }}>
          الرئيسية
        </Link>
      </div>
    </div>
  );
}
