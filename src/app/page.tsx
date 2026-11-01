"use client";

import React, { useEffect } from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import LiquidHeader from "../components/LiquidHeader";
import AiSynthesisStudio from "../components/AiSynthesisStudio";
import AcousticEqLab from "../components/AcousticEqLab";
import LiquidTaskBoard from "../components/LiquidTaskBoard";
import EcosystemShowcase from "../components/EcosystemShowcase";

export default function LuminaGlassPage() {
  const { lang, theme, activeTab, hydrateLuminaPreferences } = useLuminaStore();

  useEffect(() => {
    hydrateLuminaPreferences();
  }, [hydrateLuminaPreferences]);

  const envClass

  useEffect(() => {
    document.documentElement.lang = lang === "fa" ? "fa" : "en";
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  }, [lang]); =
    theme === "PEARL"
      ? "liquid-env-pearl"
      : theme === "AURORA"
      ? "liquid-env-aurora"
      : "liquid-env-titanium";

  return (
    <div className={`lumina-page min-h-[100svh] min-h-[100dvh] ${envClass} relative flex flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))]`}>
      {/* گوی‌های نوری سیال در پس‌زمینه برای ایجاد شکست نور واقعی زیر شیشه مایع */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="liquid-blob absolute -top-20 left-10 w-80 h-80 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="liquid-blob absolute top-40 right-12 w-96 h-96 rounded-full bg-pink-400/25 blur-3xl" />
        <div className="liquid-blob absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-cyan-400/25 blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col space-y-6">
        <LiquidHeader />

        <main className="max-w-[1680px] w-full mx-auto px-3 sm:px-4 lg:px-8 flex-1 min-w-0 pb-4">
          {activeTab === "SYNTHESIS" && <AiSynthesisStudio />}
          {activeTab === "ACOUSTIC" && <AcousticEqLab />}
          {activeTab === "WORKFLOW" && <LiquidTaskBoard />}
          {activeTab === "ECOSYSTEM" && <EcosystemShowcase />}
        </main>
      </div>
    </div>
  );
}