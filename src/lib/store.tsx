"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { RequestKind, ServiceRequest } from "./types";

type Draft = {
  kind: RequestKind;
  title: string;
  detail: string;
  status?: ServiceRequest["status"];
};

type Store = {
  requests: ServiceRequest[];
  addRequest: (draft: Draft) => ServiceRequest;
  compare: string[];
  toggleCompare: (slug: string) => void;
  bids: Record<string, number>;
  placeBid: (slug: string, amount: number) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [bids, setBids] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bhd-store") || "{}") as Partial<Store>;
      if (saved.requests) setRequests(saved.requests);
      if (saved.compare) setCompare(saved.compare);
      if (saved.bids) setBids(saved.bids);
    } catch {
      localStorage.removeItem("bhd-store");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("bhd-store", JSON.stringify({ requests, compare, bids }));
  }, [requests, compare, bids, ready]);

  const value: Store = {
    requests,
    addRequest: (draft) => {
      const created: ServiceRequest = {
        id: crypto.randomUUID(),
        ref: `BHD-${draft.kind.slice(0, 3).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        kind: draft.kind,
        title: draft.title,
        detail: draft.detail,
        status: draft.status ?? "submitted",
        createdAt: new Date().toISOString(),
      };
      setRequests((current) => [created, ...current]);
      return created;
    },
    compare,
    toggleCompare: (slug) => {
      setCompare((current) => {
        if (current.includes(slug)) return current.filter((item) => item !== slug);
        if (current.length >= 3) return [...current.slice(1), slug];
        return [...current, slug];
      });
    },
    bids,
    placeBid: (slug, amount) => {
      setBids((current) => ({ ...current, [slug]: amount }));
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within StoreProvider");
  return value;
}
