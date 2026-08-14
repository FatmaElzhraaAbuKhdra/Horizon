"use client";
import { useCallback, useEffect, useState } from "react";

interface Setting { key: string; valAr: string; valEn: string; }

const STAGES = [
  { key: "academic.eyfs", label: "🌟 مرحلة التأسيس المبكر (EYFS) — 3 إلى 5 سنوات" },
  { key: "academic.ks1",  label: "📖 المرحلة الأساسية الأولى (KS1) — 5 سنوات فأكثر" },
  { key: "academic.ks2",  label: "🔬 المرحلة الأساسية الثانية (KS2) — 7 سنوات فأكثر" },
  { key: "academic.ks3",  label: "🚀 المرحلة الأساسية الثالثة (KS3) — 11 سنة فأكثر" },
  { key: "academic.ks4",  label: "🎓 المرحلة الثانوية (KS4/IGCSE) — 14 سنة فأكثر" },
  { key: "academic.ks5",  label: "🏆 المرحلة الثانوية العليا (KS5/A-Levels) — 16 سنة فأكثر" },
];

const D: Record<string, { ar: string; en: string }> = {
  "academic.intro": {
    ar: "تجمع فلسفتنا التعليمية بين الدقة الأكاديمية العالية والتنمية الشاملة، بما يتماشى مع المنهج الوطني الإنجليزي من خلال تطبيق المنهج الدولي للسنوات المبكرة (IEYC) والمنهج الدولي للمرحلة الابتدائية (IPC).",
    en: "Our educational philosophy combines high academic rigour with holistic development, aligned with the English National Curriculum through the International Early Years Curriculum (IEYC) and the International Primary Curriculum (IPC).",
  },
  "academic.plus.items": {
    ar: "إتقان أعمق للمواد الأساسية (اللغة الإنجليزية، الرياضيات، العلوم، الحوسبة)\nفهم مفاهيمي أقوى وممارسة أكاديمية منظمة\nتنمية هادفة لمهارات التفكير وحل المشكلات\nتعلم متكامل يربط المعرفة بين المواد المختلفة\nتطور متسلسل بعناية يعكس كيفية تعلم الأطفال",
    en: "Deeper mastery of core subjects (English, Mathematics, Science, Computing)\nStronger conceptual understanding and structured academic practice\nPurposeful development of thinking skills and problem-solving\nIntegrated learning connecting knowledge across subjects\nCarefully sequenced progression reflecting how children learn",
  },
  "academic.teachers": {
    ar: "يعتمد النموذج على معلمين متخصصين بدءاً من الصف الخامس في المواد الأساسية (رياضيات، اللغة الإنجليزية، علوم)، بالإضافة إلى تدريس متخصص في التربية البدنية واللغات والفنون والحوسبة منذ الصف الأول.",
    en: "The model relies on specialist teachers from Year 5 in core subjects (Mathematics, English, Science), in addition to specialist teaching in Physical Education, Languages, Arts and Computing from Year 1.",
  },
  "academic.eyfs": {
    ar: "تُقدّم مدرسة ألدنهام بالرياض تعليمًا مُنظّمًا في مرحلة السنوات المبكرة، وليس رعاية نهارية. يتلقى التلاميذ من 3 إلى 5 سنوات تعليمهم وفقاً لـ IEYC، وهو برنامج قائم على اللعب مع نتائج واضحة، يستند على إطار معايير مرحلة التأسيس للسنوات المبكرة في المملكة المتحدة.\n\nيركز البرنامج على تنمية الطفل الشاملة من خلال دمج التعلم الأكاديمي مع النمو الشخصي والاجتماعي والعاطفي والبدني.",
    en: "Aldenham Prep Riyadh provides structured early years education — not day care. Students aged 3–5 are taught according to the IEYC, a play-based programme with clear outcomes, grounded in the UK Early Years Foundation Stage framework.\n\nThe programme focuses on holistic child development by integrating academic learning with personal, social, emotional and physical growth.",
  },
  "academic.ks1": {
    ar: "انتقالٌ مُيسّرٌ إلى التعلّم الأكاديمي المنظم من خلال إطار المنهج الدولي للمرحلة الابتدائية (IPC). يركز على المتعلّم ويراعي احتياجاته الفردية ويعزز التعليم الشامل والمتعدد التخصصات.\n\nيتم تدريس الصوتيات والقراءة والكتابة والرياضيات بشكل منهجي لتنمية قراء واثقين ومتعلمين مستقلين. معلمون متخصصون في اللغة العربية واللغات الأجنبية الحديثة.",
    en: "A facilitated transition into structured academic learning through the International Primary Curriculum (IPC) framework. Learner-focused, responsive to individual needs, and promoting holistic and cross-curricular education.\n\nPhonics, reading, writing and mathematics are taught systematically to develop confident readers and independent learners. Specialist teachers in Arabic and Modern Foreign Languages.",
  },
  "academic.ks2": {
    ar: "تُعدّ المرحلة الأساسية الثانية في مدرسة ألدنهام بالرياض منهجًا دراسيًا واسعًا وطموحًا، يتسم بتزايد التحدي والاستقلالية. التركيز على الإتقان والفهم المفاهيمي والتفكير الواضح — تعلم الشرح والحل والتأمل.\n\nبدءاً من الصف الخامس، يتم تقديم تدريس متخصص منفصل في الرياضيات والعلوم واللغة الإنجليزية والعلوم الإنسانية — بداية ما يُمكن اعتباره \"مدرسة ثانوية ابتدائية\".",
    en: "Key Stage 2 at Aldenham Prep Riyadh offers a broad and ambitious curriculum, characterised by increasing challenge and independence. Focus on mastery, conceptual understanding and clear thinking — learning to explain, solve and reflect.\n\nFrom Year 5, separate specialist teaching is introduced in Mathematics, Science, English and Humanities — the beginning of what can be considered a \"junior secondary school\" approach.",
  },
  "academic.ks3": {
    ar: "يوفر برنامجنا للمرحلة الأساسية الثالثة جسرًا أكاديميًا متينًا بين التعليم الابتدائي والثانوي. تدريس متخصص في جميع المواد مع توقعات عالية وتحديات منظمة وتوسع هادف.\n\nيتوافق مع متطلبات المناهج الوطنية البريطانية وارتباطها بمسارات التقدم المعتمدة من هيئة كامبريدج للتقييم الدولي. بحلول نهاية السنة التاسعة، يكون التلاميذ مستعدين أكاديميًا، وواثقين اجتماعياً، وجاهزين لاتخاذ خيارات مدروسة.",
    en: "Our Key Stage 3 programme provides a solid academic bridge between primary and secondary education. Specialist teaching in all subjects with high expectations, structured challenge and purposeful progression.\n\nAligned with UK National Curriculum requirements and Cambridge International Assessment progression pathways. By the end of Year 9, students are academically prepared, socially confident, and ready to make informed choices.",
  },
  "academic.ks4": {
    ar: "تجربة تعليمية متقدمة وشاملة متوافقة مع المنهج الوطني الإنجليزي، مصممة وفقاً لمسارات شهادة الثانوية العامة الدولية (IGCSE) من هيئة كامبريدج للتقييم الدولي. معلمون متخصصون في المواد الدراسية.\n\nتركيز على إتقان المواد بعمق والتميز الأكاديمي ومهارات اجتياز الامتحانات. بنهاية المرحلة الأساسية الرابعة، يغادرنا التلاميذ وهم متعلمون واثقون ومتحمسون، ومستعدون جيدًا للدراسة المتقدمة.",
    en: "An advanced and comprehensive educational experience aligned with the English National Curriculum, designed according to Cambridge International IGCSE pathways. Subject-specialist teachers.\n\nFocus on deep subject mastery, academic excellence and examination skills. By the end of Key Stage 4, students leave as confident, enthusiastic learners, well-prepared for advanced study.",
  },
  "academic.ks5": {
    ar: "تجربة تعليمية متطلبة وموجهة نحو المستقبل تهيئ الطلاب للالتحاق بالجامعة. توافق مع شهادة الثانوية العامة البريطانية (A Levels) والمؤهلات المعترف بها دولياً من هيئة كامبريدج.\n\nيتجاوز التعلّم مجرد إتقان المحتوى، ليُركّز على التفكير النقدي وتحليل الأفكار وتقييمها وتركيبها. مجموعات صغيرة وتوجيه متخصص وإرشاد أكاديمي منظم. عند التخرّج، يكون الطلاب واثقين من أنفسهم، ولبقين، ومُتفوقين أكاديميًا.",
    en: "A demanding, future-focused educational experience preparing students for university admission. Aligned with British A Levels and Cambridge internationally recognised qualifications.\n\nLearning goes beyond content mastery to focus on critical thinking, analysis, evaluation and synthesis. Small groups, specialist guidance and structured academic mentoring. Upon graduation, students are self-assured, articulate and academically excellent.",
  },
  "academic.university": {
    ar: "برنامج إرشاد جامعي مصمم بعناية يدعم الطلاب بدءًا من مرحلة الاستكشاف المبكر وحتى تقديم طلبات الالتحاق بنجاح. إرشاد أكاديمي مخصص، توجيه في اختيار المواد، ودعم خطوة بخطوة في التقديم للجامعات حول العالم — المملكة المتحدة، الشرق الأوسط، أوروبا، أمريكا الشمالية.",
    en: "A carefully designed university guidance programme supporting students from early exploration through to successful applications. Personal academic counselling, subject selection guidance, and step-by-step support for university applications worldwide — UK, Middle East, Europe, North America.",
  },
};

const CSS = `
  .ac-wrap { padding: 2rem 2.5rem; }
  .ac-title { font-size: 22px; font-weight: 800; color: #101828; margin-bottom: 6px; }
  .ac-sub   { font-size: 13.5px; color: #667085; margin-bottom: 2rem; }
  .ac-card  { background:#fff; border-radius:16px; border:1px solid #E4E0EC; margin-bottom:1.25rem; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.04); }
  .ac-head  { padding:1rem 1.5rem; background:#F9FAFB; border-bottom:1px solid #E4E0EC; display:flex; align-items:center; justify-content:space-between; cursor:pointer; }
  .ac-ht    { font-size:14px; font-weight:800; color:#2D0864; }
  .ac-body  { padding:1.25rem 1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .ac-field { display:flex; flex-direction:column; gap:5px; }
  .ac-lang  { font-size:10px; font-weight:800; letter-spacing:1px; color:#9CA3AF; }
  .ac-ta    { width:100%; padding:8px 12px; border-radius:9px; border:1.5px solid #D1D5DB; font-size:13.5px; font-family:Cairo,sans-serif; outline:none; background:#F9FAFB; color:#101828; resize:vertical; min-height:100px; box-sizing:border-box; transition:border-color .2s; }
  .ac-ta:focus { border-color:#7A24B2; background:#fff; box-shadow:0 0 0 3px rgba(122,36,178,.10); }
  .ac-btn { padding:8px 18px; border-radius:9px; font-size:13px; font-family:Cairo,sans-serif; cursor:pointer; font-weight:600; border:1.5px solid transparent; }
  .ac-save { background:#9333EA; border-color:#9333EA; color:#fff; }
  .ac-save:hover:not(:disabled) { background:#7E22CE; }
  .ac-btn:disabled { opacity:.5; }
  .ac-toast { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%); background:#2D0864; color:#fff; padding:10px 24px; border-radius:30px; font-size:14px; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,.2); z-index:9999; animation:toastIn .3s ease; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @media (max-width:800px) { .ac-body { grid-template-columns:1fr !important; } }
`;

interface BlockProps {
  id: string; label: string; keys: string[];
  open: Record<string, boolean>;
  onToggle: (k: string) => void;
  get: (key: string, lang: "ar" | "en") => string;
  set: (key: string, lang: "ar" | "en", val: string) => void;
  save: (key: string) => Promise<void>;
  saving: string | null;
}

function Block({ id, label, keys, open, onToggle, get, set, save, saving }: BlockProps) {
  return (
    <div className="ac-card">
      <div className="ac-head" onClick={() => onToggle(id)}>
        <span className="ac-ht">{label}</span>
        <span style={{ color: "#9CA3AF", fontSize: 18 }}>{open[id] ? "▲" : "▼"}</span>
      </div>
      {open[id] && keys.map(key => (
        <div key={key} style={{ borderTop: "1px solid #F3F4F6" }}>
          {keys.length > 1 && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", padding: "8px 1.5rem 0" }}>{key}</div>
          )}
          <div className="ac-body">
            <div className="ac-field">
              <span className="ac-lang">عربي</span>
              <textarea className="ac-ta" style={{ direction: "rtl" }} value={get(key, "ar")} onChange={e => set(key, "ar", e.target.value)} />
            </div>
            <div className="ac-field">
              <span className="ac-lang">English</span>
              <textarea className="ac-ta" style={{ direction: "ltr" }} value={get(key, "en")} onChange={e => set(key, "en", e.target.value)} />
            </div>
          </div>
          <div style={{ padding: "0 1.5rem 1rem", display: "flex", justifyContent: "flex-end" }}>
            <button className="ac-btn ac-save" onClick={() => save(key)} disabled={saving === key}>
              {saving === key ? "جاري الحفظ..." : "✓ حفظ"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AcademicAdmin() {
  const [map, setMap] = useState<Record<string, { ar: string; en: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast]   = useState<string | null>(null);
  const [open, setOpen]     = useState<Record<string, boolean>>({ intro: true });

  const load = useCallback(() => {
    fetch("/api/admin/settings").then(r => r.json()).then((rows: Setting[]) => {
      const m: Record<string, { ar: string; en: string }> = {};
      rows.forEach(r => { if (r.key.startsWith("academic.")) m[r.key] = { ar: r.valAr, en: r.valEn }; });
      setMap(m);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const toggle = (k: string) => setOpen(p => ({ ...p, [k]: !p[k] }));
  const get = (key: string, lang: "ar" | "en") => map[key]?.[lang] ?? D[key]?.[lang] ?? "";
  const set = (key: string, lang: "ar" | "en", val: string) =>
    setMap(p => ({ ...p, [key]: { ...(p[key] ?? D[key] ?? { ar: "", en: "" }), [lang]: val } }));

  const save = async (key: string) => {
    setSaving(key);
    await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, valAr: get(key, "ar"), valEn: get(key, "en") }),
    });
    setSaving(null); showToast("✓ تم الحفظ");
  };

  const blockProps = { open, onToggle: toggle, get, set, save, saving };

  return (
    <>
      <style>{CSS}</style>
      <div className="ac-wrap">
        <div className="ac-title">🎓 محتوى البرنامج الأكاديمي</div>
        <p className="ac-sub">عدّل أي نص ويظهر على الموقع فوراً — عربي وإنجليزي معًا</p>

        <Block {...blockProps} id="intro"      label="📌 الفلسفة التعليمية — المقدمة"                      keys={["academic.intro"]} />
        <Block {...blockProps} id="plus"       label="✨ برنامج ألدنهام+ (نقاط قابلة للتعديل سطراً سطراً)" keys={["academic.plus.items"]} />
        <Block {...blockProps} id="teachers"   label="👩‍🏫 نموذج المعلمين المتخصصين"                        keys={["academic.teachers"]} />
        <Block {...blockProps} id="eyfs"       label="🌟 مرحلة التأسيس المبكر (EYFS) — 3 إلى 5 سنوات"    keys={["academic.eyfs"]} />
        <Block {...blockProps} id="ks1"        label="📖 المرحلة الأساسية الأولى (KS1) — 5+ سنوات"         keys={["academic.ks1"]} />
        <Block {...blockProps} id="ks2"        label="🔬 المرحلة الأساسية الثانية (KS2) — 7+ سنوات"        keys={["academic.ks2"]} />
        <Block {...blockProps} id="ks3"        label="🚀 المرحلة الأساسية الثالثة (KS3) — 11+ سنة"         keys={["academic.ks3"]} />
        <Block {...blockProps} id="ks4"        label="🎓 المرحلة الثانوية IGCSE (KS4) — 14+ سنة"           keys={["academic.ks4"]} />
        <Block {...blockProps} id="ks5"        label="🏆 المرحلة الثانوية العليا A-Levels (KS5) — 16+ سنة" keys={["academic.ks5"]} />
        <Block {...blockProps} id="university" label="🌍 مسارات الجامعة والآفاق العالمية"                   keys={["academic.university"]} />
      </div>
      {toast && <div className="ac-toast">{toast}</div>}
    </>
  );
}
