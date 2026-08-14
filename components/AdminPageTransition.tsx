"use client";
import { usePathname } from "next/navigation";

export function AdminPageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div key={path} style={{ animation: "adminIn .18s ease both" }}>
      <style>{`@keyframes adminIn { from { transform: translateY(7px); } to { transform: none; } }`}</style>
      {children}
    </div>
  );
}
