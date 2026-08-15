import { type Locale } from "@/lib/i18n";
import SubPage from "@/components/SubPage";
import { slotImage, slotImages } from "@/lib/slots";
import { getSettings } from "@/lib/db-cache";
import ImageSlider from "@/components/ImageSlider";

const C = { dark: "#2D0864", gold: "#B300C4", bg: "#FAF7FF", card: "#fff", border: "#E8E0F5", muted: "#5A5A5A" };

/* ─── Defaults (shown when admin hasn't saved yet) ─── */
const D: Record<string, { ar: string; en: string }> = {
  "about.intro": {
    ar: 'مدارس الأفق العالمية مؤسسة تعليمية دولية رائدة تأسست عام ١٩٩٩ في الرياض، تجمع بين أفضل المناهج البريطانية والأمريكية مع الهوية العربية الإسلامية الأصيلة. تقدم المدرسة تجربة تعليمية متكاملة للأعمار من ٣ إلى ١٨ سنة عبر فرعين في قلب مدينة الرياض.',
    en: 'Horizon International Schools is a leading international educational institution founded in 1999 in Riyadh, combining the best of British and American curricula with authentic Arab Islamic identity. The school offers a comprehensive educational experience for ages 3 to 18 across two campuses in the heart of Riyadh.',
  },
  "about.british": {
    ar: 'تتميز مدارس الأفق العالمية بتقديم منهج دولي معتمد يجمع بين المنهج البريطاني والأمريكي، مما يضمن تحضيرًا شاملًا للطلاب لمرحلة التعليم العالي في أرقى الجامعات حول العالم. حصلت المدرسة على اعتمادات دولية مرموقة من Cognia (AdvancED) وWASC وAIAA.\n\nتعمل مدارس الأفق العالمية بشكل مستقل، يديرها فريق إداري متخصص يضع معايير عالية في التدريس والرعاية التربوية والبيئة المدرسية، مع الحرص الدائم على تحقيق التوازن بين متطلبات التعليم الدولي والهوية الإسلامية العربية.',
    en: 'Horizon International Schools offers an accredited international curriculum combining British and American approaches, ensuring comprehensive preparation for students aspiring to top universities worldwide. The school holds international accreditations from Cognia (AdvancED), WASC, and AIAA.\n\nHorizon International Schools operates independently, managed by a specialised professional team upholding high standards in teaching, pastoral care, and school environment — always balancing international educational excellence with Arab Islamic identity.',
  },
  "about.model": {
    ar: 'تُعدّ مدارس الأفق العالمية نموذجاً فريداً في التعليم الدولي بالمملكة العربية السعودية، إذ تجمع بين المنهجين البريطاني والأمريكي في بيئة تعليمية عربية إسلامية متكاملة. والأهم — كيف يؤثر هذا النهج إيجابًا على تجربة طفلكم وتعليمه ومستقبله؟',
    en: 'Horizon International Schools represents a unique model in international education in Saudi Arabia, combining British and American curricula within a comprehensive Arab Islamic educational environment. Most importantly — how does this approach positively impact your child\'s experience, education and future?',
  },
  "about.rationale": {
    ar: 'في مدارس الأفق العالمية، رسالتنا هي تنشئة جيل من المفكرين المبدعين والمتعلمين مدى الحياة، من خلال منهج دولي متكامل يجمع الصرامة الأكاديمية بالتنمية الشخصية الشاملة، مع الحفاظ على الهوية العربية الإسلامية الأصيلة التي تُشكّل جوهر ثقافتنا التعليمية.',
    en: 'At Horizon International Schools, our mission is to cultivate creative thinkers and lifelong learners through a comprehensive international curriculum that combines academic rigour with holistic personal development, while preserving the authentic Arab Islamic identity that forms the core of our educational culture.',
  },
  "about.teachers": {
    ar: 'يتم تعيين جميع المعلمين في مدارس الأفق العالمية من خلال عملية توظيف دقيقة ومتعددة المراحل. وتُعطى الأولوية للكفاءة في التخصص، والنزاهة المهنية، والالتزام العميق بالرعاية التربوية.\n\nيبدأ تدريس المواد التخصصية ابتداء من المرحلة الأولى للغة العربية، والفنون، والموسيقى، والحاسوب، والتربية البدنية، ويمتد ليشمل المواد الأساسية في المراحل الأعلى.',
    en: 'All teachers at Horizon International Schools are selected through a rigorous, multi-stage recruitment process. Priority is given to subject expertise, professional integrity and deep commitment to pastoral care.\n\nSpecialist teaching begins from the earliest stages in Arabic, Arts, Music, Computing and Physical Education, extending to core subjects in higher stages.',
  },
  "about.commitments.intro": { ar: 'في مدارس الأفق العالمية، نلتزم التزامًا واضحًا ومدروسًا تجاه كل أسرة نخدمها.', en: 'At Horizon International Schools, we hold a clear and deliberate commitment to every family we serve.' },
  "about.commitments.items": {
    ar: 'نحرص على معرفة كل طفل ودعمه وتحفيزه\nالمعايير الأكاديمية عالية وهادفة ومتسلسلة بعناية\nالرعاية التربوية استباقية ومنظمة وشخصية\nنعمل على تنمية الشخصية والثقة بالنفس والمهارات القيادية\nالعمل المشترك بين المنزل والمدرسة بشكل وثيق',
    en: 'Know, support and motivate every child individually\nAcademic standards are high, purposeful and carefully sequenced\nPastoral care is proactive, organised and personal\nCharacter, confidence and leadership skills are developed deliberately\nClose and consistent partnership between home and school',
  },
  "about.commitments.closing": { ar: 'هذه التوقعات تُشكّل الحياة المدرسية اليومية.', en: 'These expectations shape daily school life.' },
  "about.university": {
    ar: 'صُمم برنامجنا للإرشاد الجامعي بعناية فائقة لدعم الطلاب منذ المراحل الأولى للاستكشاف وحتى تقديم طلبات الالتحاق بنجاح. بالتعاون الوثيق مع العائلات، نقدم استشارات أكاديمية شخصية، وتوجيهًا لاختيار التخصصات، ودعمًا خطوة بخطوة في تقديم الطلبات إلى الجامعات حول العالم، بما في ذلك التقديم عبر نظام UCAS للالتحاق بالجامعات في المملكة المتحدة، ومسارات القبول المباشر في الجامعات الدولية.\n\nيستفيد الطلاب من الإرشاد الفردي، والتحضير لكتابة البيانات الشخصية والمقابلات، والدعم المنظم في بناء ملفات أكاديمية قوية.\n\nيضمن نهجنا توجيه كل طالب نحو مسارات تعكس نقاط قوته واهتماماته وطموحاته، سواء كان يطمح للدراسة في المملكة المتحدة، أو الشرق الأوسط، أو أوروبا، أو أمريكا الشمالية.\n\nبنهاية المرحلة الثانوية، يغادر الطلاب مدرستنا وهم واثقون من مسارهم، ومؤهلون تنافسيًا، ومستعدون جيدًا للمتطلبات الأكاديمية والشخصية للتعليم العالي.',
    en: 'Our university guidance programme is carefully designed to support students from the earliest stages of exploration through to successful applications. Working closely with families, we provide personal academic counselling, subject selection guidance, and step-by-step support for applications worldwide, including UCAS applications to UK universities.\n\nStudents benefit from individual guidance, support for personal statements and interview preparation, and structured support in building strong academic profiles.\n\nOur approach ensures every student is guided towards pathways that reflect their strengths, interests and ambitions — whether they aspire to study in the UK, the Middle East, Europe or North America.\n\nBy the end of secondary school, students leave confident in their direction, competitive in their applications, and well-prepared for higher education.',
  },
  "about.holistic.intro": {
    ar: 'يتجاوز التعليم في مدارس الأفق العالمية حدود الفصول الدراسية. يعكس نهجنا التزامًا حقيقيًا بالتنمية الشاملة، حيث تتكامل الدراسة الأكاديمية وبناء الشخصية ورعاية الطالب.',
    en: 'Education at Horizon International Schools goes beyond classrooms. Our approach reflects a genuine commitment to holistic development, where academic study, character-building, and student wellbeing are fully integrated.',
  },
  "about.holistic.items": {
    ar: 'الرعاية الطلابية\nآداب السلوك\nالرفاهية النفسية والاجتماعية\nتنمية الشخصية',
    en: 'Student Care\nConduct and Character\nWellbeing\nPersonal Development',
  },
  "about.alumni": {
    ar: 'يصبح كل طالب يتخرج من مدارس الأفق العالمية جزءًا من مجتمع خريجينا المتميزين، الذين يحملون قيم التميز والنزاهة والمسؤولية في مختلف مجالات الحياة.\n\nيتواجد خريجو الأفق العالمية في الجامعات المحلية والدولية الرائدة، ويساهمون في بناء مجتمعهم وتطوير المملكة العربية السعودية في إطار رؤية 2030.',
    en: 'Every student who graduates from Horizon International Schools becomes part of our distinguished alumni community, carrying the values of excellence, integrity, and responsibility across all walks of life.\n\nHorizon alumni are found in leading local and international universities, contributing to their communities and Saudi Arabia\'s development under Vision 2030.',
  },
  "about.history": {
    ar: 'منذ تأسيسها عام ١٩٩٩، رسخت مدارس الأفق العالمية مكانتها كإحدى المؤسسات التعليمية الرائدة في الرياض. تواصل المدرسة بناء تراثها التعليمي يومًا بعد يوم، ملتزمةً بأعلى معايير الجودة والتميز الأكاديمي.',
    en: 'Since its founding in 1999, Horizon International Schools has established itself as one of Riyadh\'s leading educational institutions. The school continues to build its educational legacy day by day, committed to the highest standards of quality and academic excellence.',
  },
  "about.legacy": {
    ar: 'إن اختيار مدرسة توفر تعليمًا شاملًا في بيئة آمنة وداعمة هو أفضل هدية يمكن أن يقدّمها الوالدان لأبنائهم.',
    en: 'Choosing a school that provides comprehensive education in a safe and supportive environment is the greatest gift parents can give their children.',
  },
};

const DEFAULT_BENEFITS = [
  { icon:"🏅", titleAr:"اعتماد دولي مرموق", titleEn:"Prestigious International Accreditation", bodyAr:"حاصلون على اعتمادات دولية من Cognia (AdvancED) وWASC وAIAA، مما يضمن معايير تعليمية عالمية عالية.", bodyEn:"Accredited by Cognia (AdvancED), WASC, and AIAA, ensuring the highest international educational standards." },
  { icon:"👨‍🏫", titleAr:"كادر تدريسي متخصص ومؤهل", titleEn:"Qualified & Specialised Teaching Staff", bodyAr:"يتم اختيار كل معلم من خلال عملية توظيف دقيقة متعددة المراحل، مع إعطاء الأولوية للكفاءة التخصصية والنزاهة المهنية.", bodyEn:"Each teacher is selected through a rigorous multi-stage recruitment process, prioritising subject expertise and professional integrity." },
  { icon:"🌐", titleAr:"بيئة دولية متنوعة", titleEn:"Diverse International Environment", bodyAr:"يدرس في مدارسنا طلاب من جنسيات عالمية متعددة، مما يُثري التجربة التعليمية ويُنمي مهارات التواصل الدولي.", bodyEn:"Students from diverse nationalities study together, enriching the educational experience and developing international communication skills." },
  { icon:"📚", titleAr:"منهج بريطاني وأمريكي معتمد", titleEn:"Accredited British & American Curriculum", bodyAr:"منهج دولي متكامل يجمع أفضل ما في المنهجين البريطاني والأمريكي مع مراعاة المقررات الوطنية.", bodyEn:"A comprehensive international curriculum combining the best of British and American approaches, alongside national requirements." },
  { icon:"🏫", titleAr:"فرعان في قلب الرياض", titleEn:"Two Campuses in Central Riyadh", bodyAr:"فرع الورود وفرع ظهرة لبن — فرعان متكاملان يوفران بيئات تعليمية ممتازة ومرافق حديثة.", bodyEn:"Al-Wuroud and Dhahrat Laban campuses — two complementary locations providing excellent learning environments and modern facilities." },
  { icon:"🎓", titleAr:"توجيه أكاديمي شامل", titleEn:"Comprehensive Academic Guidance", bodyAr:"برامج إرشاد أكاديمي تدعم الطلاب منذ مراحل الروضة وحتى الإعداد للجامعة، مع اهتمام شخصي بكل طالب.", bodyEn:"Academic guidance programmes supporting students from kindergarten through university preparation, with personal attention to each student." },
  { icon:"🤝", titleAr:"شراكة قوية مع أسر الطلاب", titleEn:"Strong Partnership with Families", bodyAr:"نؤمن بأن التواصل المستمر والشفاف مع أولياء الأمور ركيزة أساسية لنجاح الطالب وتطوره الأكاديمي والشخصي.", bodyEn:"We believe continuous and transparent communication with families is a cornerstone of student success and personal development." },
];

function ytId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function g(map: Record<string, { valAr: string; valEn: string }>, key: string, lang: "ar" | "en"): string {
  const row = map[key];
  const v = lang === "ar" ? row?.valAr : row?.valEn;
  return v || D[key]?.[lang] || "";
}

function Paras({ text, style }: { text: string; style?: React.CSSProperties }) {
  return (
    <>
      {text.split("\n\n").filter(Boolean).map((p, i) => (
        <p key={i} style={{ fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: "1.1rem", ...style }}>{p}</p>
      ))}
    </>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isRtl = locale === "ar";
  const lang = isRtl ? "ar" : "en";

  const [heroImg, galleryImgs, allSettings] = await Promise.all([
    slotImage("about-hero"),
    slotImages("about-gallery"),
    getSettings(),
  ]);

  const map: Record<string, { valAr: string; valEn: string }> = {};
  allSettings.forEach((r: { key: string; valAr: string; valEn: string }) => { map[r.key] = { valAr: r.valAr, valEn: r.valEn }; });

  const s = (key: string) => g(map, key, lang);

  const videoUrls: string[] = (() => {
    try { return JSON.parse(map["about.videos"]?.valAr ?? "[]"); } catch { return []; }
  })();

  const benefits = (() => {
    try { return JSON.parse(map["about.benefits"]?.valAr ?? "null") ?? DEFAULT_BENEFITS; } catch { return DEFAULT_BENEFITS; }
  })();

  const commitmentItems = s("about.commitments.items").split("\n").filter(Boolean);
  const holisticItems   = s("about.holistic.items").split("\n").filter(Boolean);

  // Animation CSS
  const animCss = `
    @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    .reveal { animation: fadeUp 0.7s ease both; }
    .reveal-1 { animation-delay: 0.05s; } .reveal-2 { animation-delay: 0.15s; }
    .reveal-3 { animation-delay: 0.25s; } .reveal-4 { animation-delay: 0.35s; }
    .reveal-5 { animation-delay: 0.45s; } .reveal-6 { animation-delay: 0.55s; }
    .reveal-7 { animation-delay: 0.65s; }
  `;

  return (
    <SubPage locale={locale} title={isRtl ? "نبذة عن مدارس الأفق العالمية" : "About Horizon International Schools"} heroImage={heroImg}>
      <style>{animCss}</style>
      <div style={{ background: C.bg }}>

        {/* ── 1. Intro banner ── */}
        <section style={{ padding: "3.5rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-1">
            <div style={{ background: C.dark, borderRadius: 22, padding: "3rem 3rem 2.5rem", color: "#fff", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <span style={{ background: C.gold, color: "#fff", fontWeight: 800, fontSize: 13, padding: "4px 16px", borderRadius: 30, letterSpacing: 1 }}>EST. 1999</span>
                <span style={{ background: "rgba(255,255,255,.15)", color: "#fff", fontWeight: 700, fontSize: 13, padding: "4px 16px", borderRadius: 30 }}>
                  {isRtl ? "٢٦+ عاماً من التميز الأكاديمي" : "26+ Years of Academic Excellence"}
                </span>
              </div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 30, color: "#fff", marginBottom: "1.25rem", lineHeight: 1.55 }}>
                {isRtl ? "التعليم في الأفق — حيث يلتقي التميز بالمستقبل" : "Education at Horizon — Where Excellence Meets the Future"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.88)", lineHeight: 1.9, maxWidth: 680, margin: "0 auto", fontSize: 15 }}>
                {s("about.intro")}
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Real British school ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-2">
            <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: 36 }}>🇬🇧</span>
                <div>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>
                    {isRtl ? "مدرسة بريطانية حقيقية ومستقلة" : "A REAL AND INDEPENDENT BRITISH SCHOOL"}
                  </div>
                  <h3 style={{ fontFamily: "Amiri,serif", fontSize: 24, color: C.dark, marginTop: 4 }}>
                    {isRtl ? "مملوكة ومُدارة مباشرة من قِبل مالكيها" : "Owned and Managed Directly by Its Owners"}
                  </h3>
                </div>
              </div>
              <Paras text={s("about.british")} />
            </div>
          </div>
        </section>

        {/* ── 3. Unique model + slider ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: galleryImgs.length ? "repeat(auto-fit,minmax(300px,1fr))" : "1fr", gap: "1.5rem", alignItems: "start" }}>
              <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }} className="reveal reveal-3">
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: "0.75rem" }}>
                  {isRtl ? "نموذج فريد من نوعه" : "A UNIQUE MODEL"}
                </div>
                <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1rem", lineHeight: 1.5 }}>
                  {isRtl ? "مدارس الأفق العالمية" : "Horizon International Schools"}
                </h3>
                <Paras text={s("about.model")} />
              </div>
              {galleryImgs.length > 0 && (
                <div className="reveal reveal-4">
                  <ImageSlider images={galleryImgs} height="340px" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 4. Benefits ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "Amiri,serif", fontSize: 28, color: C.dark, marginBottom: "1.75rem", textAlign: "center" }} className="reveal reveal-1">
              {isRtl ? "ماذا يعني ذلك لك ولطفلك؟" : "What Does This Mean for You and Your Child?"}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.1rem" }}>
              {benefits.map((b: typeof DEFAULT_BENEFITS[0], i: number) => (
                <div key={i} className={`reveal reveal-${Math.min(i + 1, 7)}`}
                  style={{ background: C.card, borderRadius: 16, padding: "1.6rem", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 34, marginBottom: "0.65rem" }}>{b.icon}</div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: C.dark, marginBottom: "0.6rem", lineHeight: 1.4 }}>
                    {isRtl ? b.titleAr : b.titleEn}
                  </h4>
                  <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8 }}>
                    {isRtl ? b.bodyAr : b.bodyEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Educational Rationale ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-2">
            <div style={{ background: C.dark, borderRadius: 20, padding: "2.75rem 3rem", color: "#fff" }}>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: "0.75rem", textAlign: "center" }}>
                EDUCATIONAL RATIONALE
              </div>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 30, color: C.gold, marginBottom: "1.25rem", textAlign: "center", lineHeight: 1.5 }}>
                {isRtl ? '"هذا وذاك — وليس هذا أو ذاك"' : '"This & That — NOT This or That"'}
              </h2>
              <p style={{ color: "rgba(255,255,255,.88)", lineHeight: 1.9, fontSize: 15, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                {s("about.rationale")}
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Teachers ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-3">
            <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👩‍🏫</div>
                <div>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>
                    {isRtl ? "الكادر التدريسي" : "OUR TEACHERS"}
                  </div>
                  <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginTop: 4 }}>
                    {isRtl ? "معلمون بارعون مختارون بعناية فائقة" : "Expert Teachers Selected with Exceptional Care"}
                  </h3>
                </div>
              </div>
              <Paras text={s("about.teachers")} />
            </div>
          </div>
        </section>

        {/* ── 7. Commitments ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-4">
            <div style={{ background: C.dark, borderRadius: 20, padding: "2.5rem 3rem", color: "#fff" }}>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 26, color: "#fff", marginBottom: "0.6rem", textAlign: "center" }}>
                {isRtl ? "التزامات الأفق العالمية" : "The Horizon Commitment"}
              </h2>
              <p style={{ color: "rgba(255,255,255,.75)", textAlign: "center", marginBottom: "1.75rem", fontSize: 14 }}>
                {s("about.commitments.intro")}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0.85rem", marginBottom: "1.5rem" }}>
                {commitmentItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "rgba(255,255,255,.09)", borderRadius: 12, padding: "0.9rem 1.25rem" }}>
                    <span style={{ color: C.gold, fontSize: 17, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,.92)", lineHeight: 1.65 }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,.65)", textAlign: "center", fontSize: 13.5, fontStyle: "italic" }}>
                {s("about.commitments.closing")}
              </p>
            </div>
          </div>
        </section>

        {/* ── 8. University guidance ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-2">
            <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#EEF7F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎓</div>
                <div>
                  <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>
                    {isRtl ? "الإرشاد الجامعي" : "UNIVERSITY GUIDANCE"}
                  </div>
                  <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginTop: 4 }}>
                    {isRtl ? "مسارات جامعية وآفاق مستقبل عالمية" : "University Pathways & Global Future Prospects"}
                  </h3>
                </div>
              </div>
              <Paras text={s("about.university")} />
            </div>
          </div>
        </section>

        {/* ── 9. Holistic education ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
              <div style={{ background: C.card, borderRadius: 20, padding: "2.25rem", border: `1px solid ${C.border}` }} className="reveal reveal-3">
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: "0.75rem" }}>
                  {isRtl ? "تعليم شامل" : "HOLISTIC EDUCATION"}
                </div>
                <h3 style={{ fontFamily: "Amiri,serif", fontSize: 20, color: C.dark, marginBottom: "1rem", lineHeight: 1.5 }}>
                  {isRtl ? "مستوحًى من أفضل تقاليد التعليم البريطاني المستقل" : "Inspired by the Finest British Independent Traditions"}
                </h3>
                <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.85, marginBottom: "1.25rem" }}>
                  {s("about.holistic.intro")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {holisticItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1rem", background: C.bg, borderRadius: 10 }}>
                      <span style={{ color: C.gold, fontWeight: 800, fontSize: 14 }}>◆</span>
                      <span style={{ fontSize: 14, color: C.dark, fontWeight: 600 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: C.dark, borderRadius: 20, padding: "2.25rem", color: "#fff" }} className="reveal reveal-4">
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: "0.75rem" }}>
                  {isRtl ? "تصنع التاريخ" : "MAKING HISTORY"}
                </div>
                <h3 style={{ fontFamily: "Amiri,serif", fontSize: 20, color: "#fff", marginBottom: "1rem", lineHeight: 1.5 }}>
                  {isRtl ? "مدرسة تصنع التاريخ" : "A School That Makes History"}
                </h3>
                <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.85)", lineHeight: 1.85 }}>
                  {s("about.history")}
                </p>
                <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "rgba(179,0,196,.15)", borderRadius: 12, borderRight: `3px solid ${C.gold}` }}>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>
                    {s("about.legacy")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. Alumni ── */}
        <section style={{ padding: "3rem 2rem 0" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }} className="reveal reveal-2">
            <div style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }}>
              <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <div style={{ color: C.gold, fontSize: 11, fontWeight: 800, letterSpacing: 2, marginBottom: "0.5rem" }}>
                  {isRtl ? "شبكة الخريجين" : "ALUMNI NETWORK"}
                </div>
                <h2 style={{ fontFamily: "Amiri,serif", fontSize: 26, color: C.dark, marginBottom: "0.5rem" }}>
                  {isRtl ? "شبكة خريجين عالمية لمدى الحياة" : "A Lifelong Global Alumni Network"}
                </h2>
              </div>
              <Paras text={s("about.alumni")} />
            </div>
          </div>
        </section>

        {/* ── 11. Videos ── */}
        {videoUrls.length > 0 && (
          <section style={{ padding: "3rem 2rem 0" }}>
            <div style={{ maxWidth: 940, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "Amiri,serif", fontSize: 26, color: C.dark, marginBottom: "1.5rem", textAlign: "center" }} className="reveal reveal-1">
                {isRtl ? "فيديوهات المدرسة" : "School Videos"}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: videoUrls.length === 1 ? "1fr" : "repeat(auto-fill,minmax(400px,1fr))", gap: "1.25rem" }}>
                {videoUrls.map((url: string, i: number) => {
                  const id = ytId(url);
                  if (!id) return null;
                  return (
                    <div key={i} className={`reveal reveal-${i + 1}`}
                      style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", background: "#000" }}>
                      <iframe src={`https://www.youtube.com/embed/${id}`}
                        style={{ width: "100%", height: "100%", border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── 12. Safeguarding ── */}
        <section style={{ padding: "3rem 2rem 5rem" }}>
          <div style={{ maxWidth: 940, margin: "0 auto" }}>
            <div id="safeguarding" style={{ background: C.card, borderRadius: 20, padding: "2.5rem", border: `1px solid ${C.border}` }} className="reveal reveal-3">
              <h3 style={{ fontFamily: "Amiri,serif", fontSize: 22, color: C.dark, marginBottom: "1rem" }}>
                {isRtl ? "الحماية والرعاية الطلابية (Safeguarding)" : "Safeguarding"}
              </h3>
              <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.9 }}>
                {isRtl
                  ? "مدارس الأفق العالمية ملتزمة بتوفير بيئة آمنة ومحمية لجميع الطلاب. لدينا سياسات شاملة لحماية الطلاب وضمان رفاهيتهم وسلامتهم داخل الحرم المدرسي وخارجه."
                  : "Horizon International Schools is committed to providing a safe and protected environment for all students. We have comprehensive policies to protect students and ensure their wellbeing and safety inside and outside the school premises."}
              </p>
            </div>
          </div>
        </section>

      </div>
    </SubPage>
  );
}
