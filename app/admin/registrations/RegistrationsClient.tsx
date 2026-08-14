"use client";
import { useCallback, useState } from "react";
import { AdminTable, type Col } from "@/components/AdminTable";

interface Reg {
  id: string; studentName: string; level: string; academicYear: string;
  parentName: string; phone: string; email: string; gender?: string | null;
  nationality?: string | null; dateOfBirth?: string | null; notes?: string | null; source?: string | null;
  status: string; createdAt: string;
}

const cols: Col<Reg>[] = [
  { key: "studentName", label: "اسم الطالب" },
  { key: "level", label: "المرحلة" },
  { key: "academicYear", label: "العام الدراسي" },
  { key: "parentName", label: "ولي الأمر" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "createdAt", label: "تاريخ التقديم", render: r => new Date(r.createdAt).toLocaleDateString("ar-SA") },
];

const statusOptions = [
  { value: "pending",  label: "معلق",          color: "#D97706" },
  { value: "reviewed", label: "قيد المراجعة",  color: "#2563EB" },
  { value: "accepted", label: "مقبول",          color: "#9333EA" },
  { value: "rejected", label: "مرفوض",          color: "#DC2626" },
];

export default function RegistrationsClient({ initialData }: { initialData: Reg[] }) {
  const [data, setData] = useState<Reg[]>(initialData);
  const load = useCallback(() => {
    fetch("/api/admin/registrations").then(r => r.json()).then(setData);
  }, []);
  return <AdminTable title="طلبات التسجيل" icon="📋" data={data} cols={cols} statusOptions={statusOptions} apiBase="/api/admin/registrations" onRefresh={load} searchKeys={["studentName", "email", "phone", "parentName"]} />;
}
