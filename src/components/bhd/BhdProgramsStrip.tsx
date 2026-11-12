"use client";

import { useEffect, useState } from "react";
import type { BhdApp } from "@/lib/bhd/apps";
import { fetchIdentityCatalog } from "@/lib/bhd/catalog";
import { DEFAULT_IDENTITY_ISSUER } from "@/lib/bhd/identity-public";

function launchHref(app: BhdApp): string {
  if (app.mode === "identity") return `${DEFAULT_IDENTITY_ISSUER}${app.workspacePath}`;
  if (app.startUrl) return app.startUrl;
  return app.origin;
}

type Variant = "header" | "footer";

export default function BhdProgramsStrip({ variant = "header" }: { variant?: Variant }) {
  const [apps, setApps] = useState<BhdApp[]>([]);

  useEffect(() => {
    let alive = true;
    const load = () => {
      void fetchIdentityCatalog().then((list) => {
        if (alive) setApps(list.filter((a) => a.enabled && a.id !== "bhd-cars"));
      });
    };
    load();
    window.addEventListener("bhd-catalog", load);
    return () => {
      alive = false;
      window.removeEventListener("bhd-catalog", load);
    };
  }, []);

  if (!apps.length) return null;

  if (variant === "footer") {
    return (
      <div aria-label="برامج BHD" dir="rtl">
        <p className="text-xs tracking-[0.18em] text-brass">برامج BHD</p>
        <ul className="mt-3 space-y-2 text-sm text-ivory/80">
          {apps.map((app) => (
            <li key={app.id}>
              <a href={launchHref(app)} className="inline-flex items-center gap-2 hover:text-ivory">
                {app.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={app.logoUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
                ) : (
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                    style={{ backgroundColor: app.accent }}
                  >
                    {app.mark.slice(0, 2)}
                  </span>
                )}
                <span>{app.nameAr}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section
      className="border-b border-line/70 bg-soft/60"
      aria-label="برامج BHD"
      dir="rtl"
    >
      <div className="page-wrap flex items-center gap-2 overflow-x-auto py-2">
        <span className="shrink-0 text-[11px] font-medium tracking-wide text-muted">برامج BHD</span>
        <div className="flex items-center gap-1.5">
          {apps.map((app) => (
            <a
              key={app.id}
              href={launchHref(app)}
              title={app.nameAr}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] text-ink/80 transition hover:border-night/30 hover:text-night"
              style={{ borderColor: `${app.accent}33` }}
            >
              {app.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.logoUrl} alt="" className="h-4 w-4 rounded-full object-cover" />
              ) : (
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
                  style={{ backgroundColor: app.accent }}
                >
                  {app.mark.slice(0, 2)}
                </span>
              )}
              <span className="whitespace-nowrap">{app.nameAr}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
