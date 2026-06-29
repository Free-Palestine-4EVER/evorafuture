import { redirect } from "next/navigation";

/* /portal is the human-friendly entry people type — send them to the branded
   front door at /login (loginSpec: "/portal redirects to /login"). */
export default function PortalEntry() {
  redirect("/login");
}
