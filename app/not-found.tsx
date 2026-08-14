import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", textAlign: "center",
      fontFamily: "'Cairo', sans-serif", direction: "rtl",
      background: "#FAF7FF",
    }}>
      <div style={{ fontSize: 96, fontWeight: 800, color: "#7A24B2", lineHeight: 1, marginBottom: "1rem" }}>
        ٤٠٤
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#101828", marginBottom: ".75rem" }}>
        الصفحة غير موجودة
      </h1>
      <p style={{ fontSize: 15, color: "#667085", marginBottom: "2rem", maxWidth: 380 }}>
        يبدو أن الرابط الذي تبحث عنه غير موجود أو قد تم نقله.
      </p>
      <Link href="/ar" style={{
        display: "inline-block", padding: "12px 28px",
        background: "#7A24B2", color: "#fff",
        borderRadius: 10, textDecoration: "none",
        fontWeight: 700, fontSize: 15,
      }}>
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
