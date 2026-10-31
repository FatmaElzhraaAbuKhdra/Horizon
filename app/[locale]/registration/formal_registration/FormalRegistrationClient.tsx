"use client";
import { useState } from "react";
import SubPage from "@/components/SubPage";
import { type Locale, academicYears } from "@/lib/i18n";

const C = {
  primary: "#7A24B2", dark: "#2D0864", gold: "#B300C4",
  bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A",
};

const CSS = `
  .frm-wrap { max-width: 820px; margin: 0 auto; padding: 3rem 1.5rem; }
  .frm-steps { display: flex; gap: 0; margin-bottom: 2.5rem; overflow: hidden; border-radius: 14px; border: 1px solid ${C.border}; }
  .frm-step { flex: 1; padding: .65rem .5rem; text-align: center; font-size: 12px; font-weight: 700;
    background: ${C.card}; color: #aaa; border-left: 1px solid ${C.border}; cursor: default;
    transition: background .2s, color .2s; }
  .frm-step:first-child { border-left: none; }
  .frm-step.done { background: rgba(122,36,178,.08); color: ${C.primary}; }
  .frm-step.active { background: ${C.primary}; color: #fff; }

  .frm-section { background: ${C.card}; border-radius: 18px; border: 1px solid ${C.border}; padding: 2rem; margin-bottom: 1.5rem; }
  .frm-section-title { font-family: 'Amiri', serif; font-size: 22px; color: ${C.dark}; margin-bottom: 1.5rem;
    padding-bottom: .75rem; border-bottom: 2px solid ${C.gold}; display: inline-block; }

  .frm-row { display: grid; gap: 1rem; margin-bottom: 1rem; }
  .frm-row-2 { grid-template-columns: 1fr 1fr; }
  .frm-row-3 { grid-template-columns: 1fr 1fr 1fr; }
  @media (max-width: 600px) { .frm-row-2,.frm-row-3 { grid-template-columns: 1fr; } }

  .frm-field { display: flex; flex-direction: column; gap: 5px; }
  .frm-label { font-size: 12.5px; font-weight: 700; color: ${C.dark}; }
  .frm-required { color: ${C.gold}; margin-inline-start: 2px; }
  .frm-input {
    padding: 10px 14px; border-radius: 10px; border: 1.5px solid ${C.border};
    font-size: 14px; font-family: 'Cairo', sans-serif; background: #fafafa;
    color: #1a1a1a; transition: border-color .2s, background .2s; width: 100%; box-sizing: border-box;
  }
  .frm-input:focus { outline: none; border-color: ${C.primary}; background: #fff; }
  select.frm-input { cursor: pointer; }

  .frm-check-group { display: flex; flex-direction: column; gap: .5rem; }
  .frm-check { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: ${C.muted}; cursor: pointer; }
  .frm-check input[type="checkbox"] { width: 18px; height: 18px; accent-color: ${C.primary}; cursor: pointer; }

  .frm-notice { background: rgba(179,0,196,.08); border: 1px solid rgba(179,0,196,.3); border-radius: 12px;
    padding: 1rem 1.25rem; font-size: 13px; color: #6b4c00; line-height: 1.65; margin-bottom: 1.25rem; }

  .frm-nav { display: flex; gap: 1rem; justify-content: space-between; margin-top: 2rem; }
  .frm-btn { padding: 12px 32px; border-radius: 12px; font-size: 14px; font-weight: 700;
    font-family: 'Cairo', sans-serif; cursor: pointer; border: none; transition: all .2s; }
  .frm-btn-primary { background: ${C.primary}; color: #fff; }
  .frm-btn-primary:hover { background: ${C.dark}; }
  .frm-btn-outline { background: #fff; color: ${C.dark}; border: 1.5px solid ${C.border} !important; }
  .frm-btn-outline:hover { border-color: ${C.primary} !important; background: rgba(122,36,178,.04); }
  .frm-btn-gold { background: ${C.gold}; color: #fff; }
  .frm-btn-gold:hover { background: #8800CC; }

  .frm-success { text-align: center; padding: 4rem 2rem; }
  .frm-success-icon { font-size: 64px; margin-bottom: 1rem; }
  .frm-success-title { font-family: 'Amiri', serif; font-size: 30px; color: ${C.dark}; margin-bottom: 1rem; }
  .frm-success-text { font-size: 15px; color: ${C.muted}; line-height: 1.8; max-width: 480px; margin: 0 auto; }
`;

type FormState = {
  childFirstName: string; childMiddleName: string; childLastName: string; childPreferredName: string;
  childGender: string; childDob: string; childNationality: string;
  childEnglishNative: string; childLang1: string; childLang2: string;
  childPassport: string; childPassportExpiry: string;
  childIqama: string; childIqamaExpiry: string;
  childVaccinated: string; childEntryYear: string; childEntryTerm: string;
  childPreviousApplied: string; childOtherSchools: string;
  fatherTitle: string; fatherFirst: string; fatherLast: string;
  fatherAddress: string; fatherCountry: string;
  fatherPassport: string; fatherIqama: string;
  fatherOccupation: string; fatherCompany: string;
  fatherPhone: string; fatherWhatsapp: string; fatherEmail: string;
  skipMother: boolean;
  motherTitle: string; motherFirst: string; motherLast: string;
  motherAddress: string; motherCountry: string;
  motherPassport: string; motherIqama: string;
  motherOccupation: string; motherCompany: string;
  motherPhone: string; motherWhatsapp: string; motherEmail: string;
  aldenhamConnection: string; discoverySource: string;
  senDyslexia: boolean; senDyspraxia: boolean; senVision: boolean;
  senHearing: boolean; senASD: boolean; senADHD: boolean;
  senOther: boolean; senOtherDetails: string;
  declarationFather: string; declarationMother: string; additionalInfo: string;
};

const INIT: FormState = {
  childFirstName: "", childMiddleName: "", childLastName: "", childPreferredName: "",
  childGender: "", childDob: "", childNationality: "",
  childEnglishNative: "", childLang1: "", childLang2: "",
  childPassport: "", childPassportExpiry: "",
  childIqama: "", childIqamaExpiry: "",
  childVaccinated: "", childEntryYear: "", childEntryTerm: "",
  childPreviousApplied: "", childOtherSchools: "",
  fatherTitle: "", fatherFirst: "", fatherLast: "",
  fatherAddress: "", fatherCountry: "المملكة العربية السعودية",
  fatherPassport: "", fatherIqama: "",
  fatherOccupation: "", fatherCompany: "",
  fatherPhone: "", fatherWhatsapp: "", fatherEmail: "",
  skipMother: false,
  motherTitle: "", motherFirst: "", motherLast: "",
  motherAddress: "", motherCountry: "المملكة العربية السعودية",
  motherPassport: "", motherIqama: "",
  motherOccupation: "", motherCompany: "",
  motherPhone: "", motherWhatsapp: "", motherEmail: "",
  aldenhamConnection: "", discoverySource: "",
  senDyslexia: false, senDyspraxia: false, senVision: false,
  senHearing: false, senASD: false, senADHD: false,
  senOther: false, senOtherDetails: "",
  declarationFather: "", declarationMother: "", additionalInfo: "",
};

const STEPS_AR = ["معلومات الطالب", "بيانات الأب", "بيانات الأم", "معلومات إضافية", "الإقرار"];
const STEPS_EN = ["Child Details", "Father Details", "Mother Details", "Additional Info", "Declaration"];

export default function FormalRegistrationClient({ locale }: { locale: Locale }) {
  const isRtl = locale === "ar";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const steps = isRtl ? STEPS_AR : STEPS_EN;

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const Field = ({ label, name, type = "text", required = false, placeholder = "" }: {
    label: string; name: keyof FormState; type?: string; required?: boolean; placeholder?: string;
  }) => (
    <div className="frm-field">
      <label className="frm-label">{label}{required && <span className="frm-required">*</span>}</label>
      <input
        type={type}
        className="frm-input"
        value={form[name] as string}
        onChange={e => set(name, e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const Select = ({ label, name, options, required = false }: {
    label: string; name: keyof FormState; options: string[]; required?: boolean;
  }) => (
    <div className="frm-field">
      <label className="frm-label">{label}{required && <span className="frm-required">*</span>}</label>
      <select className="frm-input" value={form[name] as string} onChange={e => set(name, e.target.value)} required={required}>
        <option value="">{isRtl ? "اختر..." : "Select..."}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const Check = ({ label, name }: { label: string; name: keyof FormState }) => (
    <label className="frm-check">
      <input type="checkbox" checked={form[name] as boolean} onChange={e => set(name, e.target.checked)} />
      {label}
    </label>
  );

  const parentFields = (prefix: "father" | "mother") => {
    const p = prefix;
    const titles = isRtl ? ["السيد", "الدكتور", "الأستاذ", "المهندس", "السيدة", "الدكتورة"] : ["Mr", "Dr", "Prof", "Eng", "Mrs", "Ms"];
    const firstKey = `${p}First` as keyof FormState;
    const lastKey = `${p}Last` as keyof FormState;
    const titleKey = `${p}Title` as keyof FormState;
    const addressKey = `${p}Address` as keyof FormState;
    const countryKey = `${p}Country` as keyof FormState;
    const passportKey = `${p}Passport` as keyof FormState;
    const iqamaKey = `${p}Iqama` as keyof FormState;
    const occupationKey = `${p}Occupation` as keyof FormState;
    const companyKey = `${p}Company` as keyof FormState;
    const phoneKey = `${p}Phone` as keyof FormState;
    const whatsappKey = `${p}Whatsapp` as keyof FormState;
    const emailKey = `${p}Email` as keyof FormState;
    return (
      <>
        <div className="frm-row frm-row-3">
          <Select label={isRtl ? "اللقب" : "Title"} name={titleKey} options={titles} required />
          <Field label={isRtl ? "الاسم الأول" : "First Name"} name={firstKey} required />
          <Field label={isRtl ? "الاسم الأخير" : "Last Name"} name={lastKey} required />
        </div>
        <div className="frm-row frm-row-2">
          <Field label={isRtl ? "العنوان الكامل" : "Full Address"} name={addressKey} required />
          <Field label={isRtl ? "بلد الإقامة" : "Country of Residence"} name={countryKey} />
        </div>
        <div className="frm-row frm-row-2">
          <Field label={isRtl ? "رقم جواز السفر" : "Passport Number"} name={passportKey} required />
          <Field label={isRtl ? "رقم الإقامة / الهوية السعودية" : "Iqama / Saudi ID"} name={iqamaKey} />
        </div>
        <div className="frm-row frm-row-2">
          <Field label={isRtl ? "المهنة" : "Occupation"} name={occupationKey} required />
          <Field label={isRtl ? "جهة العمل" : "Company / Employer"} name={companyKey} />
        </div>
        <div className="frm-row frm-row-3">
          <Field label={isRtl ? "رقم الهاتف" : "Phone"} name={phoneKey} type="tel" required placeholder="+966 5X XXX XXXX" />
          <Field label={isRtl ? "واتساب" : "WhatsApp"} name={whatsappKey} type="tel" placeholder="+966 5X XXX XXXX" />
          <Field label={isRtl ? "البريد الإلكتروني" : "Email"} name={emailKey} type="email" required placeholder="example@email.com" />
        </div>
      </>
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const childName = [form.childFirstName, form.childMiddleName, form.childLastName].filter(Boolean).join(" ");
      const fatherName = [form.fatherTitle, form.fatherFirst, form.fatherLast].filter(Boolean).join(" ");
      const notes = JSON.stringify({
        childPreferredName: form.childPreferredName,
        childEnglishNative: form.childEnglishNative,
        childLang1: form.childLang1, childLang2: form.childLang2,
        childPassport: form.childPassport, childPassportExpiry: form.childPassportExpiry,
        childIqama: form.childIqama, childIqamaExpiry: form.childIqamaExpiry,
        childVaccinated: form.childVaccinated,
        childPreviousApplied: form.childPreviousApplied, childOtherSchools: form.childOtherSchools,
        father: { title: form.fatherTitle, first: form.fatherFirst, last: form.fatherLast,
          address: form.fatherAddress, country: form.fatherCountry,
          passport: form.fatherPassport, iqama: form.fatherIqama,
          occupation: form.fatherOccupation, company: form.fatherCompany,
          phone: form.fatherPhone, whatsapp: form.fatherWhatsapp, email: form.fatherEmail },
        mother: form.skipMother ? null : {
          title: form.motherTitle, first: form.motherFirst, last: form.motherLast,
          address: form.motherAddress, country: form.motherCountry,
          passport: form.motherPassport, iqama: form.motherIqama,
          occupation: form.motherOccupation, company: form.motherCompany,
          phone: form.motherPhone, whatsapp: form.motherWhatsapp, email: form.motherEmail },
        aldenhamConnection: form.aldenhamConnection,
        sen: { dyslexia: form.senDyslexia, dyspraxia: form.senDyspraxia,
          vision: form.senVision, hearing: form.senHearing,
          asd: form.senASD, adhd: form.senADHD,
          other: form.senOther, otherDetails: form.senOtherDetails },
        declarationFather: form.declarationFather, declarationMother: form.declarationMother,
        additionalInfo: form.additionalInfo,
        formType: "formal_registration",
      });

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: childName,
          dob: form.childDob,
          gender: form.childGender,
          level: form.childEntryTerm,
          academicYear: form.childEntryYear,
          parentName: fatherName,
          phone: form.fatherPhone,
          email: form.fatherEmail,
          nationality: form.childNationality,
          source: form.discoverySource,
          notes,
        }),
      });

      if (!res.ok) throw new Error("server error");
      setSubmitted(true);
    } catch {
      alert(isRtl ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const title = isRtl ? "نموذج التسجيل الرسمي" : "Formal Registration Form";

  return (
    <>
      <style>{CSS}</style>
      <SubPage locale={locale} title={title} subtitle={isRtl ? "نموذج التسجيل الرسمي في مدارس الأفق العالمية" : "Formal registration at Horizon International Schools"}>
        <section style={{ background: C.bg, padding: "3rem 2rem" }}>
          <div className="frm-wrap">

            {submitted ? (
              <div className="frm-section frm-success">
                <div className="frm-success-icon">✅</div>
                <div className="frm-success-title">{isRtl ? "تم إرسال نموذج التسجيل بنجاح" : "Registration Submitted Successfully"}</div>
                <p className="frm-success-text">
                  {isRtl
                    ? "شكراً لتسجيلكم في مدارس الأفق العالمية. سيتواصل معكم فريق القبول خلال ٢-٣ أيام عمل على البريد الإلكتروني أو رقم الهاتف المُدخل."
                    : "Thank you for registering at Aldenham Prep School Riyadh. Our admissions team will contact you within 2-3 business days via the provided email or phone number."
                  }
                </p>
                <div style={{ marginTop: "1.5rem", fontSize: 13, color: C.muted }}>
                  {isRtl ? "للاستفسار: " : "For enquiries: "}
                  <a href="mailto:registrar@aldenhamprepriyadh.com" style={{ color: C.primary }}>registrar@aldenhamprepriyadh.com</a>
                  {" · +966 11 826 5411"}
                </div>
              </div>
            ) : (
              <>
                {/* Step indicators */}
                <div className="frm-steps">
                  {steps.map((s, i) => (
                    <div key={i} className={`frm-step${i + 1 === step ? " active" : i + 1 < step ? " done" : ""}`}>
                      {i + 1 < step ? "✓ " : `${i + 1}. `}{s}
                    </div>
                  ))}
                </div>

                {/* ── STEP 1: Child ── */}
                {step === 1 && (
                  <div className="frm-section">
                    <div className="frm-section-title">👶 {isRtl ? "معلومات الطالب" : "Child's Details"}</div>
                    <div className="frm-row frm-row-2">
                      <Field label={isRtl ? "الاسم الأول" : "First Name"} name="childFirstName" required />
                      <Field label={isRtl ? "الاسم الأوسط" : "Middle Name"} name="childMiddleName" />
                    </div>
                    <div className="frm-row frm-row-2">
                      <Field label={isRtl ? "الاسم الأخير" : "Last Name"} name="childLastName" required />
                      <Field label={isRtl ? "الاسم المفضل" : "Preferred Name"} name="childPreferredName" />
                    </div>
                    <div className="frm-row frm-row-3">
                      <Select label={isRtl ? "الجنس" : "Gender"} name="childGender" required
                        options={isRtl ? ["ذكر", "أنثى"] : ["Male", "Female"]} />
                      <Field label={isRtl ? "تاريخ الميلاد" : "Date of Birth"} name="childDob" type="date" required />
                      <Field label={isRtl ? "الجنسية" : "Nationality"} name="childNationality" required />
                    </div>
                    <div className="frm-row frm-row-2">
                      <Select label={isRtl ? "مستوى اللغة الإنجليزية" : "English Proficiency"} name="childEnglishNative" required
                        options={isRtl ? ["ناطق أصلي", "غير ناطق أصلي"] : ["Native Speaker", "Non-Native Speaker"]} />
                      <Field label={isRtl ? "اللغة الأولى" : "First Language"} name="childLang1" required placeholder={isRtl ? "العربية" : "Arabic"} />
                    </div>
                    <div className="frm-row frm-row-3">
                      <Field label={isRtl ? "رقم جواز السفر" : "Passport Number"} name="childPassport" required />
                      <Field label={isRtl ? "تاريخ انتهاء الجواز" : "Passport Expiry"} name="childPassportExpiry" type="date" required />
                      <Field label={isRtl ? "اللغة الثانية (اختياري)" : "Second Language (optional)"} name="childLang2" />
                    </div>
                    <div className="frm-row frm-row-2">
                      <Field label={isRtl ? "رقم الإقامة / الهوية السعودية" : "Iqama / Saudi ID"} name="childIqama" />
                      <Field label={isRtl ? "تاريخ انتهاء الإقامة" : "Iqama Expiry"} name="childIqamaExpiry" type="date" />
                    </div>
                    <div className="frm-row frm-row-3">
                      <Select label={isRtl ? "شهادة التطعيم" : "Vaccination Certificate"} name="childVaccinated" required
                        options={isRtl ? ["مكتملة", "جزئية", "غير متوفرة"] : ["Complete", "Partial", "Not Available"]} />
                      <Select label={isRtl ? "سنة الالتحاق المتوقعة" : "Expected Entry Year"} name="childEntryYear" required
                        options={academicYears()} />
                      <Select label={isRtl ? "الفصل الدراسي" : "Term of Entry"} name="childEntryTerm" required
                        options={isRtl ? ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"] : ["Term 1", "Term 2", "Term 3"]} />
                    </div>
                    <div className="frm-row frm-row-2">
                      <Select label={isRtl ? "هل سبق التقدم للأفق العالمية؟" : "Previously applied to Horizon International Schools?"} name="childPreviousApplied"
                        options={isRtl ? ["نعم", "لا"] : ["Yes", "No"]} />
                      <Select label={isRtl ? "هل الطالب مسجل في مدارس أخرى؟" : "Registered at other schools?"} name="childOtherSchools"
                        options={isRtl ? ["نعم", "لا"] : ["Yes", "No"]} />
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Father ── */}
                {step === 2 && (
                  <div className="frm-section">
                    <div className="frm-section-title">👨 {isRtl ? "بيانات الأب" : "Father's Details"}</div>
                    {parentFields("father")}
                  </div>
                )}

                {/* ── STEP 3: Mother ── */}
                {step === 3 && (
                  <div className="frm-section">
                    <div className="frm-section-title">👩 {isRtl ? "بيانات الأم" : "Mother's Details"}</div>
                    <label className="frm-check" style={{ marginBottom: "1.25rem" }}>
                      <input type="checkbox" checked={form.skipMother} onChange={e => set("skipMother", e.target.checked)} />
                      {isRtl ? "تخطي بيانات الأم (غير متاحة)" : "Skip mother's details (not applicable)"}
                    </label>
                    {!form.skipMother && parentFields("mother")}
                  </div>
                )}

                {/* ── STEP 4: Additional + SEN ── */}
                {step === 4 && (
                  <>
                    <div className="frm-section">
                      <div className="frm-section-title">ℹ️ {isRtl ? "معلومات إضافية" : "Additional Information"}</div>
                      <div className="frm-row">
                        <div className="frm-field">
                          <label className="frm-label">{isRtl ? "هل لديك صلة سابقة بمدارس الأفق العالمية؟ (الرجاء الإيضاح)" : "Any prior connection to Horizon International Schools? (Please explain)"}</label>
                          <textarea className="frm-input" rows={3} style={{ resize: "vertical" }}
                            value={form.aldenhamConnection}
                            onChange={e => set("aldenhamConnection", e.target.value)} />
                        </div>
                      </div>
                      <Select
                        label={isRtl ? "كيف تعرفت على مدارس الأفق العالمية؟" : "How did you hear about Horizon International Schools?"}
                        name="discoverySource"
                        options={isRtl
                          ? ["السمعة المحلية", "توصية من المدرسة الحالية", "معرض تعليمي", "إعلان", "البحث على الإنترنت", "وسائل التواصل الاجتماعي", "مقال صحفي", "توصية شخصية", "أخرى"]
                          : ["Local Reputation", "School Recommendation", "School Expo", "Advertisement", "Web Search", "Social Media", "Press Article", "Personal Recommendation", "Other"]
                        }
                      />
                    </div>

                    <div className="frm-section">
                      <div className="frm-section-title">♿ {isRtl ? "الاحتياجات التعليمية الخاصة" : "Additional Needs"}</div>
                      <div className="frm-notice">
                        {isRtl
                          ? "مدارس الأفق العالمية مدرسة شاملة ترحب بالجميع الذين يستوفون معايير القبول. يُرجى الإفصاح عن أي احتياجات خاصة حتى نتمكن من تقديم الدعم المناسب. تحتفظ المدرسة بحق سحب مكان مُعرض إذا لم يُفصح عن معلومات ذات صلة."
                          : "Horizon International Schools is an inclusive school welcoming all who meet admission criteria. Please disclose any special needs so we can provide appropriate support. The school reserves the right to withdraw an offered place if relevant information is not disclosed."
                        }
                      </div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: C.dark, marginBottom: ".75rem" }}>
                        {isRtl ? "هل يعاني الطالب من أي مما يلي؟" : "Does the child have any of the following?"}
                      </p>
                      <div className="frm-check-group">
                        <Check label={isRtl ? "عسر القراءة (Dyslexia)" : "Dyslexia"} name="senDyslexia" />
                        <Check label={isRtl ? "عسر الحركة (Dyspraxia)" : "Dyspraxia"} name="senDyspraxia" />
                        <Check label={isRtl ? "ضعف البصر" : "Visual Impairment"} name="senVision" />
                        <Check label={isRtl ? "ضعف السمع" : "Hearing Impairment"} name="senHearing" />
                        <Check label={isRtl ? "اضطراب طيف التوحد (ASD)" : "Autism Spectrum Disorder (ASD)"} name="senASD" />
                        <Check label={isRtl ? "اضطراب نقص الانتباه وفرط الحركة (ADHD)" : "ADHD"} name="senADHD" />
                        <Check label={isRtl ? "احتياجات أخرى" : "Other needs"} name="senOther" />
                      </div>
                      {form.senOther && (
                        <div className="frm-field" style={{ marginTop: ".75rem" }}>
                          <label className="frm-label">{isRtl ? "يرجى التوضيح" : "Please specify"}</label>
                          <textarea className="frm-input" rows={2} style={{ resize: "vertical" }}
                            value={form.senOtherDetails}
                            onChange={e => set("senOtherDetails", e.target.value)} />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ── STEP 5: Declaration ── */}
                {step === 5 && (
                  <div className="frm-section">
                    <div className="frm-section-title">📜 {isRtl ? "الإقرار والتوقيع" : "Declaration"}</div>
                    <div className="frm-notice" style={{ background: "rgba(122,36,178,.06)", border: "1px solid rgba(122,36,178,.2)", color: C.dark }}>
                      {isRtl
                        ? "بتقديم هذا النموذج، أُقرّ بأن الطفل المذكور سيُسجّل رسمياً كطالب محتمل في مدارس الأفق العالمية، وأتفهم أن هذا لا يضمن الحصول على مقعد."
                        : "By submitting this form, I confirm that the child named will be formally registered as a prospective pupil at Horizon International Schools, and I understand that this does not guarantee a place."
                      }
                    </div>
                    <div className="frm-row frm-row-2">
                      <Field label={isRtl ? "الاسم الكامل للأب (توقيع)" : "Father's Full Name (Signature)"} name="declarationFather" required />
                      <Field label={isRtl ? "الاسم الكامل للأم (توقيع)" : "Mother's Full Name (Signature)"} name="declarationMother" />
                    </div>
                    <div className="frm-field" style={{ marginBottom: "1rem" }}>
                      <label className="frm-label">{isRtl ? "معلومات إضافية (اختياري)" : "Additional Information (optional)"}</label>
                      <textarea className="frm-input" rows={4} style={{ resize: "vertical" }}
                        placeholder={isRtl ? "أي معلومات تودّ إضافتها..." : "Any additional information..."}
                        value={form.additionalInfo}
                        onChange={e => set("additionalInfo", e.target.value)} />
                    </div>
                    <div className="frm-notice">
                      {isRtl
                        ? "📎 يمكنك إرسال التقارير المدرسية والمستندات الداعمة عبر البريد الإلكتروني إلى: registrar@aldenhamprepriyadh.com"
                        : "📎 You may email school reports and supporting documents to: registrar@aldenhamprepriyadh.com"
                      }
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="frm-nav">
                  {step > 1 ? (
                    <button className="frm-btn frm-btn-outline" onClick={() => setStep(s => s - 1)}>
                      {isRtl ? "→ السابق" : "← Previous"}
                    </button>
                  ) : <div />}
                  {step < 5 ? (
                    <button className="frm-btn frm-btn-primary" onClick={() => setStep(s => s + 1)}>
                      {isRtl ? "التالي ←" : "Next →"}
                    </button>
                  ) : (
                    <button className="frm-btn frm-btn-gold" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? (isRtl ? "جاري الإرسال..." : "Submitting...") : (isRtl ? "إرسال النموذج ✓" : "Submit Form ✓")}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </SubPage>
    </>
  );
}
