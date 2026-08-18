export interface Slot {
  key:    string;
  label:  string;
  desc:   string;
  max:    number;
  hint:   string;
}

export interface SlotGroup {
  page:  string;
  icon:  string;
  slots: Slot[];
}

export const IMAGE_SLOT_GROUPS: SlotGroup[] = [
  {
    page: "الصفحة الرئيسية",
    icon: "🏠",
    slots: [
      {
        key:   "home-hero",
        label: "خلفية الهيرو",
        desc:  "الصورة الكبيرة خلف عنوان الصفحة الرئيسية",
        max:   1,
        hint:  "أفضل مقاس: 1920×1080 · أفقي",
      },
      {
        key:   "home-about",
        label: "صورة قسم «عن المدرسة»",
        desc:  "الصورة التي تظهر بجانب نص التعريف بالمدرسة",
        max:   1,
        hint:  "أفضل مقاس: 800×600 · أفقي أو مربع",
      },
      {
        key:   "home-gallery",
        label: "معرض صور الرئيسية",
        desc:  "سلايدر صور يظهر في منتصف الصفحة الرئيسية",
        max:   10,
        hint:  "أفضل مقاس: 1600×700 · أفقي عريض",
      },
    ],
  },
  {
    page: "صفحة عن المدرسة",
    icon: "🏫",
    slots: [
      {
        key:   "about-hero",
        label: "الصورة الرئيسية",
        desc:  "صورة كبيرة في أعلى صفحة التعريف بالمدرسة",
        max:   1,
        hint:  "أفضل مقاس: 1600×700 · أفقي عريض",
      },
      {
        key:   "about-gallery",
        label: "معرض صور الصفحة",
        desc:  "مجموعة صور تُعبّر عن المدرسة وبيئتها",
        max:   6,
        hint:  "أفضل مقاس: 800×600",
      },
    ],
  },
  {
    page: "القبول والتسجيل",
    icon: "📋",
    slots: [
      {
        key:   "admissions-hero",
        label: "صورة صفحة القبول",
        desc:  "الصورة التي تعلو صفحة القبول والتسجيل",
        max:   1,
        hint:  "أفضل مقاس: 1600×600 · أفقي عريض",
      },
    ],
  },
  {
    page: "المنهج الدراسي",
    icon: "📚",
    slots: [
      {
        key:   "curriculum-eyfs",
        label: "ما قبل المدرسة (3-5 سنوات)",
        desc:  "صور تعبّر عن تجربة مرحلة EYFS",
        max:   2,
        hint:  "أفضل مقاس: 800×600",
      },
      {
        key:   "curriculum-ks1",
        label: "المرحلة الأولى (5-7 سنوات)",
        desc:  "صور تعبّر عن تجربة مرحلة KS1",
        max:   2,
        hint:  "أفضل مقاس: 800×600",
      },
      {
        key:   "curriculum-ks2",
        label: "المرحلة الثانية (7-11 سنة)",
        desc:  "صور تعبّر عن تجربة مرحلة KS2",
        max:   2,
        hint:  "أفضل مقاس: 800×600",
      },
      {
        key:   "curriculum-ks3",
        label: "المرحلة الثالثة (11-14 سنة)",
        desc:  "صور تعبّر عن تجربة مرحلة KS3",
        max:   2,
        hint:  "أفضل مقاس: 800×600",
      },
    ],
  },
  {
    page: "الأنشطة",
    icon: "⚽",
    slots: [
      {
        key:   "activities-sports",
        label: "الرياضة في الأفق",
        desc:  "صور الأنشطة الرياضية والملاعب",
        max:   4,
        hint:  "أفضل مقاس: 800×600 · أفقي",
      },
      {
        key:   "activities-arts",
        label: "الموسيقى والمسرح",
        desc:  "صور الفنون الأدائية والموسيقى",
        max:   4,
        hint:  "أفضل مقاس: 800×600",
      },
      {
        key:   "activities-ccas",
        label: "الأنشطة اللامنهجية",
        desc:  "صور الأنشطة المتنوعة خارج الفصل",
        max:   4,
        hint:  "أفضل مقاس: 800×600",
      },
    ],
  },
  {
    page: "شركاؤنا الأكاديميون",
    icon: "🇬🇧",
    slots: [
      {
        key:   "uk-gallery",
        label: "معرض صور الشركاء الأكاديميين",
        desc:  "صور المؤسسات التعليمية الشريكة",
        max:   5,
        hint:  "أفضل مقاس: 1200×800",
      },
    ],
  },
  {
    page: "صفحة التعميم",
    icon: "📢",
    slots: [
      {
        key:   "announcements",
        label: "صور تعاميم",
        desc:  "الصور المرفقة مع كل تعميم — تُدار أيضاً من صفحة «تعاميم» في لوحة الإدارة",
        max:   500,
        hint:  "أفضل مقاس: 1200×800 · أفقي",
      },
    ],
  },
  {
    page: "عام",
    icon: "⚙️",
    slots: [
      {
        key:   "general-logo",
        label: "شعار المدرسة",
        desc:  "اللوجو الرسمي للمدرسة بخلفية شفافة (PNG)",
        max:   1,
        hint:  "PNG بخلفية شفافة · مربع",
      },
      {
        key:   "general-favicon",
        label: "أيقونة المتصفح (Favicon)",
        desc:  "الأيقونة الصغيرة التي تظهر في تاب المتصفح",
        max:   1,
        hint:  "PNG أو SVG · مربع 512×512",
      },
    ],
  },
];

export const ALL_SLOTS: Slot[] = IMAGE_SLOT_GROUPS.flatMap(g => g.slots);
export const SLOT_KEYS = new Set(ALL_SLOTS.map(s => s.key));
