"use client";
import { useCallback, useState } from "react";
import { AdminTable, type Col } from "@/components/AdminTable";

interface Msg {
  id: string; name: string; phone?: string | null; email: string;
  subject?: string | null; message?: string | null;
  status: string; createdAt: string;
}

const cols: Col<Msg>[] = [
  { key: "name", label: "الاسم" },
  { key: "email", label: "البريد الإلكتروني" },
  { key: "phone", label: "الهاتف" },
  { key: "subject", label: "الموضوع" },
  { key: "message", label: "الرسالة", render: r => r.message ? (r.message.length > 60 ? r.message.slice(0, 60) + "..." : r.message) : "-" },
  {
    key: "status", label: "الحالة", render: r => {
      const colors: Record<string, string> = { unread: "#DC2626", read: "#9333EA" };
      const labels: Record<string, string> = { unread: "غير مقروءة", read: "مقروءة" };
      return <span style={{ padding: "3px 10px", borderRadius: 20, background: `${colors[r.status] ?? "#888"}18`, color: colors[r.status] ?? "#888", fontSize: 12, fontWeight: 700 }}>{labels[r.status] ?? r.status}</span>;
    }
  },
  { key: "createdAt", label: "التاريخ", render: r => new Date(r.createdAt).toLocaleDateString("ar-SA") },
];

const statusOptions = [
  { value: "unread",   label: "غير مقروءة", color: "#DC2626" },
  { value: "read",     label: "مقروءة",     color: "#9333EA" },
  { value: "replied",  label: "تم الرد",    color: "#2563EB" },
  { value: "archived", label: "مؤرشفة",     color: "#6B7280" },
];

export default function MessagesClient({ initialData }: { initialData: Msg[] }) {
  const [data, setData] = useState<Msg[]>(initialData);
  const load = useCallback(() => {
    fetch("/api/admin/messages").then(r => r.json()).then(setData);
  }, []);
  return <AdminTable title="رسائل التواصل" icon="✉️" data={data} cols={cols} statusOptions={statusOptions} apiBase="/api/admin/messages" onRefresh={load} searchKeys={["name", "email", "subject", "message"]} />;
}
