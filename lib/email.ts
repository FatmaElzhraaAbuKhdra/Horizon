import { Resend } from "resend";
import { prisma } from "@/lib/db";

const FROM = "مدارس الأفق العالمية <onboarding@resend.dev>";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

async function getSchoolEmail(): Promise<string> {
  try {
    const row = await prisma.schoolSetting.findUnique({ where: { key: "contact.email" } });
    return row?.valEn?.trim() || "Info@horizon.sch.sa";
  } catch {
    return "Info@horizon.sch.sa";
  }
}

export async function sendRegistrationEmail(data: {
  studentName: string;
  parentName: string;
  level: string;
  phone: string;
  email: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  source?: string;
  notes?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const to = await getSchoolEmail();
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `تسجيل جديد — ${data.studentName}`,
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E8E0F5;border-radius:12px;overflow:hidden">
        <div style="background:#7A24B2;padding:24px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px">📋 طلب تسجيل جديد</h1>
          <p style="color:#E8D5FF;margin:6px 0 0">مدارس الأفق العالمية</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666;width:40%">اسم الطالب</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;font-weight:bold">${data.studentName}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">اسم ولي الأمر</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;font-weight:bold">${data.parentName}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">المرحلة الدراسية</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.level}</td></tr>
            ${data.gender ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الجنس</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.gender}</td></tr>` : ""}
            ${data.dob ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">تاريخ الميلاد</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.dob}</td></tr>` : ""}
            ${data.nationality ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الجنسية</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.nationality}</td></tr>` : ""}
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الهاتف</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">البريد الإلكتروني</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.source ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">مصدر المعرفة</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.source}</td></tr>` : ""}
            ${data.notes ? `<tr><td style="padding:10px 0;color:#666">ملاحظات</td><td style="padding:10px 0">${data.notes}</td></tr>` : ""}
          </table>
          <div style="margin-top:28px;text-align:center">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app"}/admin/registrations" style="background:#7A24B2;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">عرض في لوحة الإدارة</a>
          </div>
        </div>
        <div style="background:#F8F5FF;padding:16px 32px;text-align:center;color:#999;font-size:12px">مدارس الأفق العالمية — الرياض</div>
      </div>`,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const to = await getSchoolEmail();
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `رسالة جديدة — ${data.subject || "تواصل"}`,
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E8E0F5;border-radius:12px;overflow:hidden">
        <div style="background:#7A24B2;padding:24px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px">✉️ رسالة تواصل جديدة</h1>
          <p style="color:#E8D5FF;margin:6px 0 0">مدارس الأفق العالمية</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666;width:40%">الاسم</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;font-weight:bold">${data.name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">البريد الإلكتروني</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الهاتف</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ""}
            ${data.subject ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الموضوع</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.subject}</td></tr>` : ""}
          </table>
          ${data.message ? `<div style="margin-top:20px;background:#F8F5FF;border-right:4px solid #7A24B2;padding:16px 20px;border-radius:8px"><p style="margin:0;color:#333;line-height:1.7">${data.message.replace(/\n/g, "<br>")}</p></div>` : ""}
          <div style="margin-top:28px;text-align:center">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app"}/admin/messages" style="background:#7A24B2;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">عرض في لوحة الإدارة</a>
          </div>
        </div>
        <div style="background:#F8F5FF;padding:16px 32px;text-align:center;color:#999;font-size:12px">مدارس الأفق العالمية — الرياض</div>
      </div>`,
  });
}

export async function sendTourEmail(data: {
  name: string;
  phone: string;
  email?: string;
  day: string;
  time: string;
  children?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const to = await getSchoolEmail();
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `حجز جولة جديد — ${data.name}`,
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E8E0F5;border-radius:12px;overflow:hidden">
        <div style="background:#7A24B2;padding:24px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px">🏫 حجز جولة مدرسية جديد</h1>
          <p style="color:#E8D5FF;margin:6px 0 0">مدارس الأفق العالمية</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666;width:40%">الاسم</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;font-weight:bold">${data.name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الهاتف</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            ${data.email ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">البريد الإلكتروني</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="mailto:${data.email}">${data.email}</a></td></tr>` : ""}
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">اليوم المختار</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#7A24B2;font-weight:bold">${data.day}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الوقت</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#7A24B2;font-weight:bold">${data.time}</td></tr>
            ${data.children ? `<tr><td style="padding:10px 0;color:#666">عدد الأطفال</td><td style="padding:10px 0">${data.children}</td></tr>` : ""}
          </table>
          <div style="margin-top:28px;text-align:center">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app"}/admin/tours" style="background:#7A24B2;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">عرض في لوحة الإدارة</a>
          </div>
        </div>
        <div style="background:#F8F5FF;padding:16px 32px;text-align:center;color:#999;font-size:12px">مدارس الأفق العالمية — الرياض</div>
      </div>`,
  });
}

export async function sendEventEmail(data: {
  name: string;
  phone: string;
  email: string;
  ageGroups: string;
  notes?: string;
}) {
  if (!process.env.RESEND_API_KEY) return;
  const to = await getSchoolEmail();
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `تسجيل فعالية جديد — ${data.name}`,
    html: `
      <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E8E0F5;border-radius:12px;overflow:hidden">
        <div style="background:#7A24B2;padding:24px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px">🎉 تسجيل فعالية جديد</h1>
          <p style="color:#E8D5FF;margin:6px 0 0">مدارس الأفق العالمية</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666;width:40%">الاسم</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;font-weight:bold">${data.name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الهاتف</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">البريد الإلكتروني</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #F0EBF8;color:#666">الفئات العمرية</td><td style="padding:10px 0;border-bottom:1px solid #F0EBF8">${data.ageGroups}</td></tr>
            ${data.notes ? `<tr><td style="padding:10px 0;color:#666">ملاحظات</td><td style="padding:10px 0">${data.notes}</td></tr>` : ""}
          </table>
          <div style="margin-top:28px;text-align:center">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://horizon-schools.vercel.app"}/admin/registrations" style="background:#7A24B2;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold">عرض في لوحة الإدارة</a>
          </div>
        </div>
        <div style="background:#F8F5FF;padding:16px 32px;text-align:center;color:#999;font-size:12px">مدارس الأفق العالمية — الرياض</div>
      </div>`,
  });
}
