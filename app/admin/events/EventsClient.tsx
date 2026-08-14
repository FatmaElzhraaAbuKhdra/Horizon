"use client";
import { useCallback, useState } from "react";
import { AdminTable, type Col } from "@/components/AdminTable";

interface Evt {
  id: string; name: string; phone: string; email: string;
  ageGroups: string; notes?: string | null;
  status: string; createdAt: string;
}

const cols: Col<Evt>[] = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "ageGroups", label: "الفئات العمرية" },
  { key: "notes", label: "ملاحظات" },
  { key: "createdAt", label: "تاريخ التسجيل", render: r => new Date(r.createdAt).toLocaleDateString("ar-SA") },
];

const statusOptions = [
  { value: "registered", label: "مسجل",  color: "#9333EA" },
  { value: "attended",   label: "حضر",   color: "#2563EB" },
  { value: "cancelled",  label: "ملغي",  color: "#DC2626" },
];

export default function EventsClient({ initialData }: { initialData: Evt[] }) {
  const [data, setData] = useState<Evt[]>(initialData);
  const load = useCallback(() => {
    fetch("/api/admin/events").then(r => r.json()).then(setData);
  }, []);
  return <AdminTable title="تسجيلات يوم الاستكشاف ٢٠٢٦" icon="📅" data={data} cols={cols} statusOptions={statusOptions} apiBase="/api/admin/events" onRefresh={load} searchKeys={["name", "phone", "email"]} />;
}
