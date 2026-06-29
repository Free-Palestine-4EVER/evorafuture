// Self-contained bilingual strings for the portal, kept separate from the
// shared lib/i18n.tsx so multiple sessions don't collide on that file.
import type { Lang } from "../i18n";

export const P = {
  // ── Lockups ────────────────────────────────────────────────
  portal: { en: "Client Portal", ar: "بوابة العملاء" },
  portal_admin: { en: "Admin Dashboard", ar: "لوحة الإدارة" },
  team_lockup: { en: "Evora Future Studio · Team", ar: "استوديو إيفورا المستقبلي · الفريق" },
  // ── Sign in ────────────────────────────────────────────────
  welcome_home: { en: "Welcome home", ar: "أهلًا بعودتك" },
  signin_sub: { en: "Sign in to see your designs", ar: "سجّل الدخول لتشاهد تصاميمك" },
  team_sub: { en: "Staff sign-in — manage client projects", ar: "دخول الفريق — إدارة مشاريع العملاء" },
  phone: { en: "Phone number", ar: "رقم الهاتف" },
  admin_id_label: { en: "Email / phone", ar: "البريد الإلكتروني / الهاتف" },
  password: { en: "Password", ar: "كلمة المرور" },
  signin: { en: "Sign in", ar: "تسجيل الدخول" },
  signing: { en: "Signing in…", ar: "جارٍ الدخول…" },
  signout: { en: "Sign out", ar: "تسجيل الخروج" },
  bad_creds: { en: "Wrong phone number or password.", ar: "رقم الهاتف أو كلمة المرور غير صحيحة." },
  login_help_wa: { en: "Can't sign in? Message us on WhatsApp", ar: "لا تستطيع الدخول؟ راسلنا على واتساب" },
  wa_help_prefill: { en: "Hi Evora — I can't sign in to my client portal.", ar: "مرحبًا إيفورا — لا أستطيع تسجيل الدخول إلى بوابتي." },
  not_admin: { en: "This account is not an administrator.", ar: "هذا الحساب ليس مشرفًا." },
  tagline: { en: "Your Future Home", ar: "بيت المستقبل" },
  // ── Client dashboard ───────────────────────────────────────
  my_designs: { en: "My designs", ar: "تصاميمي" },
  no_projects: { en: "No designs saved yet. Your Evora consultant will publish them here after your session.", ar: "لا توجد تصاميم محفوظة بعد. سينشرها مستشار إيفورا هنا بعد جلستك." },
  view_3d: { en: "View in 3D", ar: "عرض ثلاثي الأبعاد" },
  view_2d: { en: "2D plan", ar: "المخطط ثنائي الأبعاد" },
  approve: { en: "Approve — that's my design", ar: "أوافق — هذا تصميمي" },
  approved_badge: { en: "Approved by you", ar: "تمت موافقتك" },
  updated: { en: "Updated", ar: "آخر تحديث" },
  close: { en: "Close", ar: "إغلاق" },
  // ── Admin ──────────────────────────────────────────────────
  projects: { en: "Projects", ar: "المشاريع" },
  clients: { en: "Clients", ar: "العملاء" },
  add_project: { en: "Add project", ar: "إضافة مشروع" },
  add_client: { en: "Add client", ar: "إضافة عميل" },
  edit: { en: "Edit", ar: "تعديل" },
  del: { en: "Delete", ar: "حذف" },
  save: { en: "Save", ar: "حفظ" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  owner: { en: "Client", ar: "العميل" },
  title: { en: "Title", ar: "العنوان" },
  room: { en: "Room", ar: "الغرفة" },
  status: { en: "Status", ar: "الحالة" },
  notes: { en: "Notes", ar: "ملاحظات" },
  thumb: { en: "Thumbnail / 2D image URL", ar: "رابط الصورة المصغّرة / المخطط" },
  model: { en: "3D model URL (.glb)", ar: "رابط النموذج ثلاثي الأبعاد (.glb)" },
  viewer: { en: "Studio 3D viewer URL", ar: "رابط عارض الاستوديو ثلاثي الأبعاد" },
  client_name: { en: "Client name", ar: "اسم العميل" },
  back_site: { en: "Back to site", ar: "العودة للموقع" },
  // ── Registration ───────────────────────────────────────────
  first_time: { en: "First time? Create your account", ar: "أوّل مرة؟ أنشئ حسابك" },
  have_account: { en: "Already have an account? Sign in", ar: "لديك حساب؟ سجّل الدخول" },
  create_account: { en: "Create account", ar: "إنشاء حساب" },
  register_sub: { en: "Enter your phone number — the same one Evora used for your project — and set a password.", ar: "أدخل رقم هاتفك — نفس الرقم الذي استخدمته إيفورا لمشروعك — واختر كلمة مرور." },
  full_name: { en: "Full name", ar: "الاسم الكامل" },
  creating: { en: "Creating…", ar: "جارٍ الإنشاء…" },
  already_registered: { en: "This number already has an account — sign in instead.", ar: "هذا الرقم لديه حساب — سجّل الدخول بدلاً من ذلك." },
  // ── Journey ────────────────────────────────────────────────
  journey: { en: "Your project journey", ar: "رحلة مشروعك" },
  updates: { en: "Updates", ar: "التحديثات" },
  no_updates: { en: "No updates yet — we'll post progress here.", ar: "لا توجد تحديثات بعد — سننشر التقدم هنا." },
  // ── Admin manage ───────────────────────────────────────────
  manage: { en: "Manage", ar: "إدارة" },
  current_stage: { en: "Current stage", ar: "المرحلة الحالية" },
  post_update: { en: "Post an update", ar: "نشر تحديث" },
  post: { en: "Post", ar: "نشر" },
  leads: { en: "Leads", ar: "الطلبات" },
  assign_phone: { en: "Customer phone", ar: "هاتف العميل" },
  share_link: { en: "Customer sign-up link", ar: "رابط تسجيل العميل" },
  copy: { en: "Copy", ar: "نسخ" },
  copied: { en: "Copied", ar: "تم النسخ" },
} as const;

export type PKey = keyof typeof P;
export const tp = (key: PKey, lang: Lang) => P[key][lang];
