"use client";

import React from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import LiquidHeader from "../components/LiquidHeader";
import AiSynthesisStudio from "../components/AiSynthesisStudio";
import AcousticEqLab from "../components/AcousticEqLab";
import LiquidTaskBoard from "../components/LiquidTaskBoard";
import EcosystemShowcase from "../components/EcosystemShowcase";

export default function LuminaGlassPage() {
  const { theme, activeTab } = useLuminaStore();

  const envClass =
    theme === "PEARL"
      ? "liquid-env-pearl"
      : theme === "AURORA"
      ? "liquid-env-aurora"
      : "liquid-env-titanium";

  return (
    <div className={`min-h-screen ${envClass} relative overflow-hidden flex flex-col pb-10`}>
      {/* گوی‌های نوری سیال در پس‌زمینه برای ایجاد شکست نور واقعی زیر شیشه مایع */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="liquid-blob absolute -top-20 left-10 w-80 h-80 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="liquid-blob absolute top-40 right-12 w-96 h-96 rounded-full bg-pink-400/25 blur-3xl" />
        <div className="liquid-blob absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-cyan-400/25 blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col space-y-6">
        <LiquidHeader />

        <main className="max-w-[1680px] w-full mx-auto px-3 lg:px-8 flex-1">
          {activeTab === "SYNTHESIS" && <AiSynthesisStudio />}
          {activeTab === "ACOUSTIC" && <AcousticEqLab />}
          {activeTab === "WORKFLOW" && <LiquidTaskBoard />}
          {activeTab === "ECOSYSTEM" && <EcosystemShowcase />}
        </main>
      </div>
    </div>
  );
}