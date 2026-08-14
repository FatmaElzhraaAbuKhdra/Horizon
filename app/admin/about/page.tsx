"use client";
import { useCallback, useEffect, useState } from "react";

/* ─── Types ─── */
interface Setting { key: string; valAr: string; valEn: string; }
interface Benefit  { icon: string; titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; }

/* ─── Defaults (full original content) ─── */
const D: Record<string, { ar: string; en: string }> = {
  "about.intro": {
    ar: 'مجموعة ألدنهام التعليمية ("ألدنهام" أو "AEG") هي الذراع الدولية الحصرية لمؤسسة ألدنهام. تتمتع ألدنهام بتاريخ عريق، فهي تُصنّف كواحدة من أقدم المدارس العاملة باستمرار في العالم، إذ لا تزال قائمة في موقعها نفسه شمال لندن منذ تأسيسها عام ١٥٩٧م. وبخبرة تزيد عن ٤٢٨ عامًا من التميز الأكاديمي، تجسد ألدنهام أفضل ما في التقاليد الراسخة والقيم العالمية.',
    en: 'Aldenham Education Group ("Aldenham" or "AEG") is the exclusive international arm of the Aldenham institution. Aldenham holds a distinguished history, ranking as one of the oldest continuously operating schools in the world, still standing on the same site north of London since its founding in 1597. With over 428 years of academic excellence, Aldenham embodies the finest traditions and global values.',
  },
  "about.british": {
    ar: 'جميع مدارس مجموعة تعليم ألدنهام (AEG) هي امتداد حقيقي لمدرسة ألدنهام في المملكة المتحدة، إحدى أقدم وأعرق المدارس المستقلة في البلاد، وليست امتيازات (فرنشايز) كما هو الحال في غالبية المدارس البريطانية العاملة خارج المملكة المتحدة. وتُدار كل مدرسة مباشرةً من قِبل المالكين، وتقدّم استمرارية مقصودة وفعّالة لقيم ألدنهام، وحوكمتها، ومعاييرها الأكاديمية.\n\nتُعدّ مدرسة ألدنهام بالرياض من بين أوائل المدارس الدولية التي تمت دعوتها إلى المملكة ضمن رؤية 2030، مما يعكس التزامًا مشتركًا بالتميّز التعليمي طويل الأمد والتنمية الوطنية.',
    en: 'All schools in Aldenham Education Group (AEG) are genuine extensions of Aldenham School in the United Kingdom — one of the oldest and most prestigious independent schools — not franchises as with most British schools operating abroad. Each school is managed directly by the owners, providing intentional and effective continuity of Aldenham values, governance and academic standards.\n\nAldenham Prep Riyadh was among the first international schools invited to the Kingdom under Vision 2030, reflecting a shared commitment to long-term educational excellence and national development.',
  },
  "about.model": {
    ar: 'أحدثت مجموعة AEG نقلة نوعية في قطاع التعليم، وأعادت تعريف مفهوم التوسع الدولي في التعليم البريطاني المستقل. يتميز نموذج أعمالنا بتميزه في تاريخ توسع المدارس البريطانية المستقلة. ومع ذلك، فإن الأهم بالنسبة لكم، أيها الآباء، هو كيف سيؤثر هذا النهج الفريد إيجابًا على تجربة طفلكم وتعليمه ومستقبله؟',
    en: 'AEG has made a paradigm shift in education, redefining the concept of international expansion in British independent education. Our business model stands out in the history of British independent school expansion. However, what matters most to you as parents is how this unique approach will positively impact your child\'s experience, education and future.',
  },
  "about.rationale": {
    ar: 'في مجموعة ألدنهام التعليمية، رسالتنا هي تنشئة مفكرين صامدين ومتأملين ومتعددي التخصصات ومتعلمين مدى الحياة، من خلال تعليم مُنظَّم بعناية يجمع بين الصرامة الأكاديمية الحقيقية والتعلم على مستوى الإتقان، مع الحفاظ على أساس ثابت من نهج العلوم الإنسانية الذي حدّد ثقافتنا في التطوير الشامل والرعاية التربوية منذ تأسيسنا عام ١٥٩٧.',
    en: 'At Aldenham Education Group, our mission is to cultivate extraordinarily resilient, self-reflective, multidisciplinary thinkers and lifelong learners through a carefully choreographed education that combines unapologetic academic rigour and mastery-level learning, built upon an ever-present foundation of the liberal arts approach that has defined our culture of all-rounded development and pastoral care since our inception in 1597.',
  },
  "about.teachers": {
    ar: 'يتم تعيين جميع المعلمين في مدرسة ألدنهام الرياض من خلال عملية توظيف دقيقة ومتعددة المراحل في كل من المملكة المتحدة والرياض. وتُعطى الأولوية في التعيينات للكفاءة في التخصص، والنزاهة المهنية، والالتزام العميق بالرعاية التربوية، مما يضمن معايير عالية باستمرار في جميع أنحاء المدرسة.\n\nيبدأ تدريس المواد التخصصية ابتداء من السنة الأولى الابتدائية للغة العربية، والفرنسية، والفنون، والموسيقى، والحاسوب، والتربية البدنية، ويمتد ليشمل المواد الأساسية من السنة الخامسة الابتدائية.',
    en: 'All teachers at Aldenham Prep Riyadh are selected through a rigorous, multi-stage recruitment process in both the UK and Riyadh. Priority is given to subject expertise, professional integrity and deep commitment to pastoral care, ensuring consistently high standards throughout the school.\n\nSpecialist teaching begins from Year 1 in Arabic, French, Arts, Music, Computing and Physical Education, extending to core subjects from Year 5.',
  },
  "about.commitments.intro": {
    ar: 'في مدرسة ألدنهام الرياض، نلتزم التزامًا واضحًا ومدروسًا تجاه كل أسرة نخدمها.',
    en: 'At Aldenham Prep Riyadh, we hold a clear and deliberate commitment to every family we serve.',
  },
  "about.commitments.items": {
    ar: 'نحرص على معرفة كل طفل ودعمه وتحفيزه\nالمعايير الأكاديمية عالية وهادفة ومتسلسلة بعناية\nالرعاية التربوية استباقية ومنظمة وشخصية\nنعمل على تنمية الشخصية والثقة بالنفس والمهارات القيادية\nالعمل المشترك بين المنزل والمدرسة بشكل وثيق',
    en: 'Know, support and motivate every child individually\nAcademic standards are high, purposeful and carefully sequenced\nPastoral care is proactive, organised and personal\nCharacter, confidence and leadership skills are developed deliberately\nClose and consistent partnership between home and school',
  },
  "about.commitments.closing": {
    ar: 'هذه التوقعات تُشكّل الحياة المدرسية اليومية.',
    en: 'These expectations shape daily school life.',
  },
  "about.university": {
    ar: 'صُمم برنامجنا للإرشاد الجامعي بعناية فائقة لدعم الطلاب منذ المراحل الأولى للاستكشاف وحتى تقديم طلبات الالتحاق بنجاح. بالتعاون الوثيق مع العائلات، نقدم استشارات أكاديمية شخصية، وتوجيهًا لاختيار التخصصات، ودعمًا خطوة بخطوة في تقديم الطلبات إلى الجامعات حول العالم، بما في ذلك التقديم عبر نظام UCAS للالتحاق بالجامعات في المملكة المتحدة، ومسارات القبول المباشر في الجامعات الدولية.\n\nيستفيد الطلاب من الإرشاد الفردي، والتحضير لكتابة البيانات الشخصية والمقابلات، والدعم المنظم في بناء ملفات أكاديمية قوية.\n\nيضمن نهجنا توجيه كل طالب نحو مسارات تعكس نقاط قوته واهتماماته وطموحاته، سواء كان يطمح للدراسة في المملكة المتحدة، أو الشرق الأوسط، أو أوروبا، أو أمريكا الشمالية.\n\nبنهاية المرحلة الثانوية، يغادر الطلاب مدرستنا وهم واثقون من مسارهم، ومؤهلون تنافسيًا في طلبات الالتحاق، ومستعدون جيدًا للمتطلبات الأكاديمية والشخصية للتعليم العالي.',
    en: 'Our university guidance programme is carefully designed to support students from the earliest stages of exploration through to successful applications. Working closely with families, we provide personal academic counselling, subject selection guidance, and step-by-step support for applications to universities worldwide, including UCAS applications to UK universities and direct admissions to international universities.\n\nStudents benefit from individual guidance, support for personal statements and interview preparation, and structured support in building strong academic profiles.\n\nOur approach ensures every student is guided towards pathways that reflect their strengths, interests and ambitions — whether they aspire to study in the UK, the Middle East, Europe or North America.\n\nBy the end of secondary school, students leave confident in their direction, competitive in their applications, and well-prepared for the academic and personal demands of higher education.',
  },
  "about.holistic.intro": {
    ar: 'يتجاوز التعليم في مدرسة ألدنهام الرياض حدود الفصول الدراسية. يعكس نهجنا أرقى تقاليد التعليم البريطاني المستقل، حيث تتكامل الدراسة والشخصية والرفاهية.',
    en: 'Education at Aldenham Prep Riyadh goes beyond classrooms. Our approach reflects the finest traditions of British independent education, where study, character and wellbeing are fully integrated.',
  },
  "about.holistic.items": {
    ar: 'الرعاية الطلابية\nآداب السلوك\nالرفاهية النفسية والاجتماعية\nتنمية الشخصية',
    en: 'Student Care\nConduct and Character\nWellbeing\nPersonal Development',
  },
  "about.alumni": {
    ar: 'يصبح كل طالب يتخرج من مدرسة ألدنهام الرياض عضوًا في جمعية خريجي ألدنهام القدامى، وهي شبكة الخريجين العالمية لمدرسة ألدنهام في المملكة المتحدة.\n\nهذه عضوية رسمية مدى الحياة في شبكة تمتد عبر أربعة قرون من الأجيال والجغرافيا. يتواجد خريجو ألدنهام في مختلف المجالات، من الأعمال والخدمة العامة إلى العلوم والرياضة والفنون، وتجمعهم قيم مشتركة من الطموح والخدمة والنزاهة.\n\nمن بين خريجي ألدنهام المتميزين: البارونة كارين برادي، ومات والاس لاعب الجولف المحترف، وشخصيات ملكية عالمية من بينهم ملك ماليزيا، ولاعبو نادي أرسنال مثل مايلز لويس-سكيلي وتشارلي باتينو.',
    en: 'Every student who graduates from Aldenham Prep Riyadh becomes a member of the Old Aldenhamians Association — the global alumni network of Aldenham School UK.\n\nThis is a formal, lifetime membership in a network spanning four centuries of generations and geographies. Aldenham alumni are found across every field — from business and public service to science, sport and the arts — united by shared values of ambition, service and integrity.\n\nNotable alumni include Baroness Karen Brady, professional golfer Matt Wallace, international royalty including the King of Malaysia, and Arsenal footballers Miles Lewis-Skelly and Charlie Patino.',
  },
  "about.history": {
    ar: 'ساهمت مدرسة ألدنهام في تشكيل التاريخ المبكر للعبة كرة القدم، ولا تزال تؤثر في التعليم بشكلٍ يتجاوز حدود الفصول الدراسية. منذ تأسيسها، بُنيت ألدنهام على إيمانٍ رائدٍ بالرعاية الشاملة والتنمية المتكاملة، قبل وقتٍ طويلٍ من أن تصبح هذه المبادئ لغةً تعليميةً شائعة.',
    en: 'Aldenham School helped shape the early history of football, and continues to influence education in ways that go beyond classrooms. Since its founding, Aldenham has been built on a pioneering belief in holistic care and integrated development, long before these principles became common educational language.',
  },
  "about.legacy": {
    ar: 'إن اختيار مدرسة توفر تعليمًا شاملًا في بيئة آمنة وداعمة هو أفضل هدية يمكن أن يقدّمها الوالدان لأبنائهم.',
    en: 'Choosing a school that provides comprehensive education in a safe and supportive environment is the greatest gift parents can give their children.',
  },
};

const DEFAULT_BENEFITS: Benefit[] = [
  { icon:"🎓", titleAr:"مسار معتمد إلى المملكة المتحدة", titleEn:"UK Accredited Pathway", bodyAr:"يخضع الطلاب لعملية تقييم شاملة تضمن اتساق مستويات الطلاب. يتيح ذلك فرصًا سلسة للانتقال، ويتمتع الطلاب بأولوية النظر في طلباتهم كطلاب منتقلين إلى ألدنهام المملكة المتحدة.", bodyEn:"Students undergo comprehensive assessment ensuring consistent standards. This allows smooth transfer opportunities, with students receiving priority consideration as transfer applicants to Aldenham UK." },
  { icon:"👨‍🏫", titleAr:"إجراءات توظيف دقيقة للكادر التدريسي", titleEn:"Rigorous Teacher Recruitment", bodyAr:"يتم اختيار كل معلم من خلال عملية متعددة المراحل تشمل قيادة أكاديمية بريطانية رفيعة. نبدأ بالسؤال: هل مستوى المعلم يؤهله للانضمام إلى مدرستنا في المملكة المتحدة؟", bodyEn:"Each teacher is selected through a multi-stage process involving senior British academic leadership. We begin with the question: does this teacher's level qualify them to join our UK school?" },
  { icon:"🌐", titleAr:"عضوية كاملة في رابطة خريجي المملكة المتحدة", titleEn:"Full UK Alumni Membership", bodyAr:"ينضم الخريجون إلى جمعية خريجي قدامى ألدنهام، وهي شبكة عالمية للخريجين تم بناؤها على مدى أربعة قرون سابقة.", bodyEn:"Graduates join the Old Aldenhamians Association — a global alumni network built over the previous four centuries." },
  { icon:"📚", titleAr:"منهج دراسي من إعداد مدرسة ألدنهام بالمملكة المتحدة", titleEn:"UK-Designed Curriculum", bodyAr:"تم تصميم وتطوير منهجنا الدراسي من قبل مدرسة ألدنهام في المملكة المتحدة، مما يضمن أصالة المنهج وتماسكه وجودته الأكاديمية.", bodyEn:"Our curriculum was designed and developed by Aldenham School UK, ensuring authenticity, coherence and academic quality." },
  { icon:"🏫", titleAr:"شبكة مدارس دولية حقيقية", titleEn:"A True International Network", bodyAr:"تكامل هادف بين المدرستين من خلال الرحلات المشتركة والمخيمات في المملكة المتحدة وتبادل الطلاب والمعلمين.", bodyEn:"Purposeful integration between both schools through joint trips, UK camps, and student and teacher exchanges." },
  { icon:"🎓", titleAr:"المخيمات والبرامج الأكاديمية", titleEn:"Camps & Academic Programmes", bodyAr:"إثراء أكاديمي يوسع نطاق التعلم خارج نطاق الفصل الدراسي من خلال مخيمات وبرامج تقودها جامعات بريطانية.", bodyEn:"Academic enrichment extending learning beyond the classroom through camps and programmes led by British universities." },
  { icon:"🔄", titleAr:"تبادل المعلمين والاندماج المهني", titleEn:"Teacher Exchange & Integration", bodyAr:"تعاون دولي يتيح للمعلمين التدريب والتدريس والتعاون عبر المدرستين بما يعود بالنفع على الطلاب.", bodyEn:"International collaboration allowing teachers to train, teach and collaborate across both schools for the benefit of students." },
];

/* ─── CSS ─── */
const CSS = `
  .ab-wrap { padding: 2rem 2.5rem; }
  .ab-title { font-size: 22px; font-weight: 800; color: #101828; margin-bottom: 6px; }
  .ab-sub   { font-size: 13.5px; color: #667085; margin-bottom: 2rem; }
  .ab-card  { background:#fff; border-radius:16px; border:1px solid #E4E0EC; margin-bottom:1.25rem; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.04); }
  .ab-card-head { padding:1rem 1.5rem; background:#F9FAFB; border-bottom:1px solid #E4E0EC; display:flex; align-items:center; justify-content:space-between; cursor:pointer; }
  .ab-card-title { font-size:14px; font-weight:800; color:#2D0864; }
  .ab-card-body  { padding:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .ab-field  { display:flex; flex-direction:column; gap:5px; }
  .ab-lang   { font-size:10px; font-weight:800; letter-spacing:1px; color:#9CA3AF; }
  .ab-ta  { width:100%; padding:8px 12px; border-radius:9px; border:1.5px solid #D1D5DB; font-size:13.5px; font-family:Cairo,sans-serif; outline:none; background:#F9FAFB; color:#101828; resize:vertical; min-height:80px; box-sizing:border-box; transition:border-color .2s; }
  .ab-ta:focus { border-color:#7A24B2; background:#fff; box-shadow:0 0 0 3px rgba(122,36,178,.10); }
  .ab-ta-rtl { direction:rtl; }
  .ab-ta-ltr { direction:ltr; }
  .ab-btn { padding:8px 18px; border-radius:9px; font-size:13px; font-family:Cairo,sans-serif; cursor:pointer; font-weight:600; border:1.5px solid transparent; }
  .ab-btn:disabled { opacity:.5; }
  .ab-save { background:#9333EA; border-color:#9333EA; color:#fff; }
  .ab-save:hover:not(:disabled) { background:#7E22CE; }
  .ab-full { grid-column:1/-1; }
  .ab-benefit { background:#F9FAFB; border-radius:12px; padding:1rem; border:1px solid #E4E0EC; margin-bottom:1rem; }
  .ab-benefit-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-top:.75rem; }
  .ab-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); background:#2D0864; color:#fff; padding:10px 24px; border-radius:30px; font-size:14px; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,.2); z-index:9999; animation:toastIn .3s ease; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @media (max-width:800px) {
    .ab-card-body    { grid-template-columns:1fr !important; }
    .ab-benefit-grid { grid-template-columns:1fr !important; }
  }
`;

/* ─── Helper ─── */
function useAboutSettings() {
  const [map, setMap] = useState<Record<string, { ar: string; en: string }>>({});
  const [benefits, setBenefits] = useState<Benefit[]>(DEFAULT_BENEFITS);
  const load = useCallback(() => {
    fetch("/api/admin/settings").then(r => r.json()).then((rows: Setting[]) => {
      const m: Record<string, { ar: string; en: string }> = {};
      rows.forEach(r => {
        if (r.key.startsWith("about.")) m[r.key] = { ar: r.valAr, en: r.valEn };
      });
      setMap(m);
      const bRow = rows.find(r => r.key === "about.benefits");
      if (bRow?.valAr) { try { setBenefits(JSON.parse(bRow.valAr)); } catch {} }
    });
  }, []);
  useEffect(() => { load(); }, [load]);
  return { map, setMap, benefits, setBenefits, reload: load };
}

/* ─── Component ─── */
interface SectionProps {
  id: string; label: string; keys: string[];
  open: Record<string, boolean>;
  onToggle: (k: string) => void;
  get: (key: string, lang: "ar" | "en") => string;
  set: (key: string, lang: "ar" | "en", val: string) => void;
  save: (key: string) => Promise<void>;
  saving: string | null;
}

function Section({ id, label, keys, open, onToggle, get, set, save, saving }: SectionProps) {
  return (
    <div className="ab-card">
      <div className="ab-card-head" onClick={() => onToggle(id)}>
        <span className="ab-card-title">{label}</span>
        <span style={{ color: "#9CA3AF", fontSize: 18 }}>{open[id] ? "▲" : "▼"}</span>
      </div>
      {open[id] && keys.map(key => (
        <div key={key} style={{ padding: "1rem 1.5rem", borderTop: "1px solid #F3F4F6" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8 }}>{key}</div>
          <div className="ab-card-body" style={{ padding: 0 }}>
            <div className="ab-field">
              <span className="ab-lang">عربي</span>
              <textarea className="ab-ta ab-ta-rtl" rows={4} value={get(key, "ar")} onChange={e => set(key, "ar", e.target.value)} />
            </div>
            <div className="ab-field">
              <span className="ab-lang">English</span>
              <textarea className="ab-ta ab-ta-ltr" rows={4} value={get(key, "en")} onChange={e => set(key, "en", e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button className="ab-btn ab-save" onClick={() => save(key)} disabled={saving === key}>
              {saving === key ? "جاري الحفظ..." : "✓ حفظ"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AboutAdmin() {
  const { map, setMap, benefits, setBenefits, reload } = useAboutSettings();
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast]   = useState<string | null>(null);
  const [open, setOpen]     = useState<Record<string, boolean>>({ s1: true });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const get = (key: string, lang: "ar" | "en") =>
    map[key]?.[lang] ?? D[key]?.[lang] ?? "";

  const set = (key: string, lang: "ar" | "en", val: string) =>
    setMap(p => ({ ...p, [key]: { ...((p[key] ?? D[key]) || { ar: "", en: "" }), [lang]: val } }));

  const save = async (key: string) => {
    setSaving(key);
    await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, valAr: get(key, "ar"), valEn: get(key, "en") }),
    });
    setSaving(null); showToast("✓ تم الحفظ");
  };

  const saveBenefits = async () => {
    setSaving("about.benefits");
    const json = JSON.stringify(benefits);
    await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "about.benefits", valAr: json, valEn: json }),
    });
    setSaving(null); showToast("✓ تم حفظ الفوائد");
  };

  const toggle = (k: string) => setOpen(p => ({ ...p, [k]: !p[k] }));

  const sectionProps = { open, onToggle: toggle, get, set, save, saving };

  return (
    <>
      <style>{CSS}</style>
      <div className="ab-wrap">
        <div className="ab-title">✏️ محتوى صفحة "عن المدرسة"</div>
        <p className="ab-sub">عدّل أي نص وسيظهر على الموقع فوراً — عربي وإنجليزي معًا</p>

        <Section {...sectionProps} id="s1" label="📌 القسم التمهيدي — مقدمة ألدنهام" keys={["about.intro"]} />
        <Section {...sectionProps} id="s2" label="🇬🇧 مدرسة بريطانية حقيقية" keys={["about.british"]} />
        <Section {...sectionProps} id="s3" label="🔷 نموذج فريد من نوعه" keys={["about.model"]} />

        {/* ── Benefits ── */}
        <div className="ab-card">
          <div className="ab-card-head" onClick={() => toggle("benefits")}>
            <span className="ab-card-title">✅ ماذا يعني ذلك للطلاب والأسر — الفوائد (٧ بطاقات)</span>
            <span style={{ color: "#9CA3AF", fontSize: 18 }}>{open["benefits"] ? "▲" : "▼"}</span>
          </div>
          {open["benefits"] && (
            <div style={{ padding: "1.25rem 1.5rem" }}>
              {benefits.map((b, i) => (
                <div key={i} className="ab-benefit">
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                    <input value={b.icon} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))}
                      style={{ width: 48, textAlign: "center", border: "1px solid #E4E0EC", borderRadius: 8, padding: "4px", fontSize: 20, background: "#F9FAFB" }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>البطاقة {i + 1}</span>
                  </div>
                  <div className="ab-benefit-grid">
                    <div className="ab-field">
                      <span className="ab-lang">عنوان عربي</span>
                      <textarea className="ab-ta ab-ta-rtl" rows={2} value={b.titleAr} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, titleAr: e.target.value } : x))} />
                    </div>
                    <div className="ab-field">
                      <span className="ab-lang">English Title</span>
                      <textarea className="ab-ta ab-ta-ltr" rows={2} value={b.titleEn} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, titleEn: e.target.value } : x))} />
                    </div>
                    <div className="ab-field">
                      <span className="ab-lang">نص عربي</span>
                      <textarea className="ab-ta ab-ta-rtl" rows={3} value={b.bodyAr} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, bodyAr: e.target.value } : x))} />
                    </div>
                    <div className="ab-field">
                      <span className="ab-lang">English Text</span>
                      <textarea className="ab-ta ab-ta-ltr" rows={3} value={b.bodyEn} onChange={e => setBenefits(p => p.map((x, j) => j === i ? { ...x, bodyEn: e.target.value } : x))} />
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button className="ab-btn ab-save" onClick={saveBenefits} disabled={saving === "about.benefits"}>
                  {saving === "about.benefits" ? "جاري الحفظ..." : "✓ حفظ كل الفوائد"}
                </button>
              </div>
            </div>
          )}
        </div>

        <Section {...sectionProps} id="s4" label="🎯 الرسالة التعليمية — This &amp; That" keys={["about.rationale"]} />
        <Section {...sectionProps} id="s5" label="👩‍🏫 معلمون بارعون مختارون بعناية" keys={["about.teachers"]} />
        <Section {...sectionProps} id="s6" label="📋 التزامات ألدنهام" keys={["about.commitments.intro", "about.commitments.items", "about.commitments.closing"]} />
        <Section {...sectionProps} id="s7" label="🎓 مسارات جامعية وآفاق مستقبلية" keys={["about.university"]} />
        <Section {...sectionProps} id="s8" label="🌱 تعليم شامل" keys={["about.holistic.intro", "about.holistic.items"]} />
        <Section {...sectionProps} id="s9" label="🌐 شبكة الخريجين العالمية" keys={["about.alumni"]} />
        <Section {...sectionProps} id="s10" label="⚽ مدرسة تصنع التاريخ" keys={["about.history"]} />
        <Section {...sectionProps} id="s11" label="🏆 انضم إلى إرث ألدنهام" keys={["about.legacy"]} />
      </div>
      {toast && <div className="ab-toast">{toast}</div>}
    </>
  );
}
