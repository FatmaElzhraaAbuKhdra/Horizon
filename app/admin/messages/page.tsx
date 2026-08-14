"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-cache";
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  const [data, setData] = useState<any[] | null>(null);
  useEffect(() => { adminFetch<any[]>("/api/admin/messages").then(setData); }, []);
  if (!data) return <p style={{ padding: "3rem", textAlign: "center", color: "#667085", fontFamily: "Cairo,sans-serif" }}>جاري التحميل...</p>;
  return <MessagesClient initialData={data} />;
}
