import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Legacy path — permissions live under /admin/delegates. */
export default function AdminStaffRedirectPage() {
  redirect("/admin/delegates");
}
