export default function AdminLoading() {
  return (
    <div style={{ padding: "2rem 2.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ height: 28, width: 180, borderRadius: 8, background: "#E4E0EC", marginBottom: 10, animation: "pulse 1.2s ease-in-out infinite" }} />
        <div style={{ height: 16, width: 280, borderRadius: 6, background: "#F0F2F5", animation: "pulse 1.2s ease-in-out infinite" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E4E0EC", padding: "1.5rem", animation: "pulse 1.2s ease-in-out infinite" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".875rem" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "#F0F2F5" }} />
              <div style={{ width: 50, height: 36, borderRadius: 8, background: "#F0F2F5" }} />
            </div>
            <div style={{ height: 16, width: "70%", borderRadius: 6, background: "#F0F2F5", marginBottom: 6 }} />
            <div style={{ height: 12, width: "50%", borderRadius: 6, background: "#F0F2F5" }} />
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E4E0EC", padding: "1.5rem" }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ height: 44, borderRadius: 8, background: "#F9FAFB", marginBottom: 10, animation: "pulse 1.2s ease-in-out infinite" }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}
