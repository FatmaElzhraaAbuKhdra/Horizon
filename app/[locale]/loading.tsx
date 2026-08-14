export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar skeleton */}
      <div style={{ height: 40, background: "#2D0864" }} />
      {/* Navbar skeleton */}
      <div style={{ height: 72, background: "#fff", borderBottom: "2px solid #B300C4", boxShadow: "0 2px 16px rgba(0,0,0,.08)" }} />
      {/* Hero skeleton */}
      <div style={{ height: 160, background: "linear-gradient(135deg, #2D0864, #7A24B2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 220, height: 36, borderRadius: 8, background: "rgba(255,255,255,.12)", animation: "pulse 1.2s ease-in-out infinite" }} />
      </div>
      {/* Content skeleton */}
      <div style={{ flex: 1, padding: "3rem 2rem", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ marginBottom: "2rem" }}>
            <div style={{ height: 20, width: `${70 - i * 10}%`, borderRadius: 6, background: "#E8E0F5", marginBottom: "0.75rem", animation: "pulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: 14, width: "100%", borderRadius: 6, background: "#F0ECE6", marginBottom: "0.5rem", animation: "pulse 1.2s ease-in-out infinite" }} />
            <div style={{ height: 14, width: "85%", borderRadius: 6, background: "#F0ECE6", animation: "pulse 1.2s ease-in-out infinite" }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .45; }
        }
      `}</style>
    </div>
  );
}
