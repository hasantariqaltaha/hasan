import { PatientRecord } from "./types";

export const TRANSLATIONS = {
  en: {
    title: "Family History Analyzer",
    subtitle: "AI-Powered Clinical Decision Support (Synthetic Data Only)",
    loginTitle: "Physician Access",
    loginDesc: "Secure access for authorized personnel only.",
    disclaimerTitle: "Mandatory Disclaimer & Safety Notice",
    disclaimerText: "This application is a demonstration of AI technology for family history analysis. It is NOT a diagnostic tool and is NOT Software as a Medical Device (SaMD). All data processed must be SYNTHETIC or DE-IDENTIFIED. Do not upload Protected Health Information (PHI). Outputs are for educational/decision-support purposes only.",
    accept: "I Accept & Confirm No PHI Usage",
    dashboard: "Physician Dashboard",
    import: "Import Patient Data",
    export: "Export Results",
    analyze: "Analyze History",
    analyzing: "Processing...",
    audioRec: "Record Audio Note",
    stopRec: "Stop Recording",
    clear: "Clear All",
    results: "Analysis Results",
    risk: "Risk Assessment",
    rec: "Recommendations",
    summary: "Summary",
    example1: "Load Example: Cardiac",
    example2: "Load Example: Diabetes",
    example3: "Load Example: Complex",
    bulkUpload: "Bulk Upload (CSV/JSON)",
    language: "Language",
    logout: "Log Out",
    waiting: "Waiting for input...",
    dropFile: "Drop file here or click to upload"
  },
  ar: {
    title: "محلل التاريخ العائلي",
    subtitle: "نظام دعم القرار السريري بالذكاء الاصطناعي (بيانات اصطناعية فقط)",
    loginTitle: "دخول الأطباء",
    loginDesc: "دخول آمن للموظفين المصرح لهم فقط.",
    disclaimerTitle: "إخلاء مسؤولية إلزامي وإشعار سلامة",
    disclaimerText: "هذا التطبيق هو عرض توضيحي لتكنولوجيا الذكاء الاصطناعي لتحليل التاريخ العائلي. إنها ليست أداة تشخيصية وليست برنامجًا كجهاز طبي (SaMD). يجب أن تكون جميع البيانات المعالجة اصطناعية أو مجهولة المصدر. لا تقم بتحميل معلومات صحية محمية (PHI). المخرجات للأغراض التعليمية / دعم القرار فقط.",
    accept: "أوافق وأؤكد عدم استخدام بيانات صحية شخصية",
    dashboard: "لوحة تحكم الطبيب",
    import: "استيراد بيانات",
    export: "تصدير النتائج",
    analyze: "تحليل التاريخ",
    analyzing: "جاري المعالجة...",
    audioRec: "تسجيل ملاحظة صوتية",
    stopRec: "إيقاف التسجيل",
    clear: "مسح الكل",
    results: "نتائج التحليل",
    risk: "تقييم المخاطر",
    rec: "توصيات",
    summary: "ملخص",
    example1: "مثال: القلب",
    example2: "مثال: السكري",
    example3: "مثال: معقد",
    bulkUpload: "تحميل جماعي (CSV/JSON)",
    language: "اللغة",
    logout: "تسجيل خروج",
    waiting: "في انتظار المدخلات...",
    dropFile: "أفلت الملف هنا أو انقر للتحميل"
  }
};

export const SAMPLE_PATIENTS: Record<string, PatientRecord> = {
  cardiac: {
    id: "SYNTH-001",
    name: "John Doe (Synthetic)",
    age: 45,
    gender: "Male",
    familyHistoryText: "Patient's father died of myocardial infarction at age 52. Paternal grandfather had a stroke at 60. Mother is alive and well, 70. No siblings."
  },
  diabetes: {
    id: "SYNTH-002",
    name: "Jane Smith (Synthetic)",
    age: 32,
    gender: "Female",
    familyHistoryText: "Both parents have Type 2 Diabetes. Maternal aunt has gestational diabetes history. Patient is concerned about her own risk."
  },
  complex: {
    id: "SYNTH-003",
    name: "Alex Roe (Synthetic)",
    age: 28,
    gender: "Non-binary",
    familyHistoryText: "Maternal grandmother had breast cancer at 45. Mother diagnosed with ovarian cancer at 50. Paternal side has history of Lynch syndrome confirmed genetically."
  }
};
