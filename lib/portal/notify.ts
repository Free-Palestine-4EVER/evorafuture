// Server-side push via OneSignal REST API. Inert until the env keys are set:
//   NEXT_PUBLIC_ONESIGNAL_APP_ID  + ONESIGNAL_REST_API_KEY
// Customers are addressed by their portal uid (set as the OneSignal external_id
// in OneSignalInit). Server-only.

const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const REST_KEY = process.env.ONESIGNAL_REST_API_KEY;

async function send(payload: Record<string, unknown>) {
  if (!APP_ID || !REST_KEY) return;
  try {
    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${REST_KEY}` },
      body: JSON.stringify({ app_id: APP_ID, ...payload }),
    });
  } catch { /* never let a notification failure break a write */ }
}

// Notify specific customers by their portal uid (OneSignal external_id).
export function notifyUsers(uids: string[], title: string, message: string, url = "/dashboard") {
  const ids = uids.filter(Boolean);
  if (!ids.length) return;
  return send({ target_channel: "push", include_aliases: { external_id: ids }, headings: { en: title }, contents: { en: message }, url });
}

// Notify the staff (anyone tagged role=admin / in the "Admins" segment).
export function notifyAdmins(title: string, message: string, url = "/admindashboard") {
  return send({ included_segments: ["Admins"], headings: { en: title }, contents: { en: message }, url });
}
