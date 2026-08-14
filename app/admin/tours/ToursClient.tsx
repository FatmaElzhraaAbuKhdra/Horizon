"use client";
import { useCallback, useState } from "react";
import { AdminTable, type Col } from "@/components/AdminTable";

interface Tour {
  id: string; name: string; phone: string; email?: string | null;
  day: string; time: string; children?: string | null;
  status: string; createdAt: string;
}

const cols: Col<Tour>[] = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "day", label: "اليوم" },
  { key: "time", label: "الوقت" },
  { key: "children", label: "عدد الأطفال" },
  { key: "createdAt", label: "تاريخ الحجز", render: r => new Date(r.createdAt).toLocaleDateString("ar-SA") },
];

const statusOptions = [
  { value: "pending",   label: "معلق",    color: "#D97706" },
  { value: "confirmed", label: "مؤكد",   color: "#9333EA" },
  { value: "cancelled", label: "ملغي",   color: "#DC2626" },
  { value: "completed", label: "مكتمل",  color: "#2563EB" },
];

export default function ToursClient({ initialData }: { initialData: Tour[] }) {
  const [data, setData] = useState<Tour[]>(initialData);
  const load = useCallback(() => {
    fetch("/api/admin/tours").then(r => r.json()).then(setData);
  }, []);
  return <AdminTable title="حجز الجولات المدرسية" icon="🏫" data={data} cols={cols} statusOptions={statusOptions} apiBase="/api/admin/tours" onRefresh={load} searchKeys={["name", "phone", "email"]} />;
}
