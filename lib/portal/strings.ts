// Self-contained bilingual strings for the portal, kept separate from the
// shared lib/i18n.tsx so multiple sessions don't collide on that file.
import type { Lang } from "../i18n";

export const P = {
  portal: { en: "Client Portal", ar: "بوابة العملاء" },
  portal_admin: { en: "Admin Dashboard", ar: "لوحة الإدارة" },
  welcome: { en: "Welcome back", ar: "مرحبًا بعودتك" },
  signin_sub: { en: "Sign in to view your Evora designs", ar: "سجّل الدخول لعرض تصاميم إيفورا الخاصة بك" },
  admin_sub: { en: "Studio access — manage client projects", ar: "دخول الاستوديو — إدارة مشاريع العملاء" },
  phone: { en: "Phone number", ar: "رقم الهاتف" },
  password: { en: "Password", ar: "كلمة المرور" },
  signin: { en: "Sign in", ar: "تسجيل الدخول" },
  signing: { en: "Signing in…", ar: "جارٍ الدخول…" },
  signout: { en: "Sign out", ar: "تسجيل الخروج" },
  bad_creds: { en: "Wrong phone number or password.", ar: "رقم الهاتف أو كلمة المرور غير صحيحة." },
  help: { en: "Your login is set up by the Evora team. Contact us if you need access.", ar: "يتم إعداد تسجيل الدخول من قبل فريق إيفورا. تواصل معنا إذا احتجت إلى الوصول." },
  my_designs: { en: "My designs", ar: "تصاميمي" },
  no_projects: { en: "No designs saved yet. Your Evora consultant will publish them here after your session.", ar: "لا توجد تصاميم محفوظة بعد. سينشرها مستشار إيفورا هنا بعد جلستك." },
  view_3d: { en: "View in 3D", ar: "عرض ثلاثي الأبعاد" },
  view_2d: { en: "2D plan", ar: "المخطط ثنائي الأبعاد" },
  approve: { en: "Approve — that's my design", ar: "أوافق — هذا تصميمي" },
  approved_badge: { en: "Approved by you", ar: "تمت موافقتك" },
  updated: { en: "Updated", ar: "آخر تحديث" },
  close: { en: "Close", ar: "إغلاق" },
  // admin
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
  viewer: { en: "Puffer 3D viewer URL", ar: "رابط عارض بافر ثلاثي الأبعاد" },
  client_name: { en: "Client name", ar: "اسم العميل" },
  demo_mode: { en: "Demo mode — using local sample data. Add Firebase keys to go live.", ar: "وضع العرض — بيانات تجريبية محلية. أضف مفاتيح Firebase للتشغيل المباشر." },
  demo_login: { en: "Demo: 0790000000 · evora123", ar: "تجريبي: 0790000000 · evora123" },
  demo_admin: { en: "Demo admin: 0791111111 · admin123", ar: "مشرف تجريبي: 0791111111 · admin123" },
  not_admin: { en: "This account is not an administrator.", ar: "هذا الحساب ليس مشرفًا." },
  back_site: { en: "Back to site", ar: "العودة للموقع" },
} as const;

export type PKey = keyof typeof P;
export const tp = (key: PKey, lang: Lang) => P[key][lang];
