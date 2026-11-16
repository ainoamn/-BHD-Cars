import type { ReactNode } from "react";

const SCENE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80";

export function PortalEntrance({
  eyebrow,
  title,
  lead,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  hint?: string;
  children?: ReactNode;
}) {
  return (
    <section className="portal-entrance">
      <img className="portal-entrance__photo" src={SCENE} alt="" />
      <div className="portal-entrance__shade" />
      <div className="portal-entrance__stage">
        <p className="portal-entrance__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p className="portal-entrance__lead">{lead}</p> : null}
        {hint ? <p className="portal-entrance__hint">{hint}</p> : null}
        {children}
      </div>
    </section>
  );
}
