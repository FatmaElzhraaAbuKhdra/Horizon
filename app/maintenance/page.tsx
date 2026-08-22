export const metadata = {
  title: "الموقع تحت التطوير | Horizon International Schools",
};

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "linear-gradient(135deg,#3C0E6E 0%,#2D0864 60%,#6B1EA5 100%)",
        color: "#fff",
      }}
    >
      <img src="/logo.png" alt="مدارس الأفق العالمية" style={{ width: 84, height: 84, objectFit: "contain", marginBottom: "1.75rem" }} />

      <div style={{ width: 60, height: 3, background: "linear-gradient(90deg,#B300C4,#FDE8FF)", borderRadius: 4, marginBottom: "1.75rem" }} />

      <h1 style={{ fontFamily: "var(--font-amiri, serif)", fontSize: "clamp(28px,4vw,42px)", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
        الموقع تحت التطوير حالياً
      </h1>
      <p style={{ fontSize: 16, color: "rgba(255,255,255,.72)", maxWidth: 480, lineHeight: 1.9, margin: "0 0 0.5rem" }}>
        نعمل حالياً على تحديث الموقع لتقديم تجربة أفضل. سنعود قريباً.
      </p>
      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,.45)", maxWidth: 480, lineHeight: 1.8 }}>
        Site under maintenance — we&apos;ll be back shortly.
      </p>
    </div>
  );
}
