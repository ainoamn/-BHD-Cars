import Link from "next/link";
import { cookies } from "next/headers";
import { PortalGate } from "@/components/portal/portal-gate";
import { resolvePortalViewer } from "@/lib/portal/access";
import { SwitchOrgButton } from "@/components/portal/switch-org-button";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function PortalChooserPage() {
  const jar = await cookies();
  const ar = jar.get("bhd_locale")?.value !== "en";
  const result = await resolvePortalViewer();
  if (result.kind !== "ok") {
    return <PortalGate locale={ar ? "ar" : "en"} reason={result.kind} />;
  }

  const { session, memberships } = result.viewer;
  const orgs = memberships.filter((row) => row.status === "active");

  return (
    <div className="portal-entrance portal-entrance--chooser">
      <div className="portal-entrance__stage">
        <img className="portal-entrance__mark" src="/brand/bhd-mark.svg" alt="BHD" />
        <p className="portal-entrance__house">Bin Hamood</p>
        <p className="portal-entrance__product">BHD Cars</p>
        <span className="portal-entrance__rule" aria-hidden />
        <h1>{ar ? "اختر مساحة التحكم" : "Choose your control space"}</h1>
        <p className="portal-entrance__lead">
          {ar ? `مرحبًا ${session.name}` : `Welcome ${session.name}`}
        </p>

        <div className="portal-rooms">
          <section className="portal-room">
            <p className="portal-room__kicker">{ar ? "شخصي" : "Personal"}</p>
            <h2>{ar ? "حساب المستخدم" : "Personal account"}</h2>
            <p className="portal-room__lead">
              {ar
                ? "مركباتك الشخصية وطلباتك فقط — معزولة عن بيانات المعارض."
                : "Your personal vehicles and requests only — isolated from dealer data."}
            </p>
            <div className="portal-room__foot">
              <Link className="portal-room__link" href="/account">
                {ar ? "فتح لوحة المستخدم" : "Open user desk"}
              </Link>
            </div>
          </section>

          <section className="portal-room">
            <p className="portal-room__kicker">{ar ? "معرض" : "House"}</p>
            <h2>{ar ? "المعارض والشركات" : "Dealers & companies"}</h2>
            {orgs.length === 0 ? (
              <p className="portal-room__empty">
                {ar
                  ? "لست عضوًا في أي معرض بعد. اطلب دعوة من المالك."
                  : "You are not a member of any dealership yet. Ask an owner for an invite."}
              </p>
            ) : (
              <div className="portal-orgs">
                {orgs.map((org) => (
                  <div className="portal-org" key={org.org_id}>
                    <div>
                      <strong>{ar ? org.org_name_ar : org.org_name_en}</strong>
                      <span>
                        {org.org_kind} · {org.role}
                      </span>
                    </div>
                    <SwitchOrgButton
                      night
                      orgId={org.org_id}
                      label={ar ? "دخول" : "Enter"}
                      next="/workspace"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
