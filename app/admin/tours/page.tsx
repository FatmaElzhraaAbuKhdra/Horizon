"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-cache";
import ToursClient from "./ToursClient";

export default function ToursPage() {
  const [data, setData] = useState<any[] | null>(null);
  useEffect(() => { adminFetch<any[]>("/api/admin/tours").then(setData); }, []);
  if (!data) return <p style={{ padding: "3rem", textAlign: "center", color: "#667085", fontFamily: "Cairo,sans-serif" }}>جاري التحميل...</p>;
  return <ToursClient initialData={data} />;
}
