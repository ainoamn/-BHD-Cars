"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { markets } from "./data";
import type { Copy, Currency, Locale, MarketId } from "./types";

const rates: Record<Currency, number> = {
  OMR: 1,
  AED: 9.55,
  SAR: 9.75,
  QAR: 9.46,
  BHD: 0.977,
  KWD: 0.798,
  USD: 2.6,
  EUR: 2.4,
};

type Prefs = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  marketId: MarketId;
  setMarketId: (id: MarketId) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  tx: (copy: Copy) => string;
  money: (omr: number) => string;
  number: (value: number) => string;
};

const PrefsContext = createContext<Prefs | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [marketId, setMarketId] = useState<MarketId>("om");
  const [currency, setCurrency] = useState<Currency>("OMR");

  useEffect(() => {
    const raw = localStorage.getItem("bhd-prefs");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { locale?: Locale; marketId?: MarketId; currency?: Currency };
      if (saved.locale) setLocale(saved.locale);
      if (saved.marketId) setMarketId(saved.marketId);
      if (saved.currency) setCurrency(saved.currency);
    } catch {
      localStorage.removeItem("bhd-prefs");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    localStorage.setItem("bhd-prefs", JSON.stringify({ locale, marketId, currency }));
  }, [locale, marketId, currency]);

  const value = useMemo<Prefs>(() => {
    const numberLocale = locale === "ar" ? "ar-u-nu-latn" : "en";
    return {
      locale,
      setLocale,
      marketId,
      setMarketId: (id) => {
        setMarketId(id);
        const market = markets.find((item) => item.id === id);
        if (market) setCurrency(market.currency);
      },
      currency,
      setCurrency,
      tx: (copy) => copy[locale],
      money: (omr) =>
        new Intl.NumberFormat(numberLocale, {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(Math.round(omr * rates[currency])),
      number: (amount) => new Intl.NumberFormat(numberLocale).format(amount),
    };
  }, [locale, marketId, currency]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const value = useContext(PrefsContext);
  if (!value) throw new Error("usePrefs must be used within PrefsProvider");
  return value;
}
