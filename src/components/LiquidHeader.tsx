"use client";

import React from "react";
import {
  useLuminaStore,
  LiquidTheme,
  StudioTab,
} from "../store/useLuminaStore";
import SmartAssetImage from "./SmartAssetImage";
import {
  AudioWaveform,
  CheckSquare,
  Compass,
  Droplets,
  Globe,
  Sparkles,
  Sun,
} from "lucide-react";

export default function LiquidHeader() {
  const {
    lang,
    theme,
    activeTab,
    blurPx,
    toggleLang,
    setTheme,
    setActiveTab,
    setBlurPx,
  } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  const THEMES: { id: LiquidTheme; fa: string; en: string; dot: string }[] = [
    {
      id: "PEARL",
      fa: "مرواریدی",
      en: "Pearl",
      dot: "bg-gradient-to-tr from-indigo-400 to-pink-300",
    },
    {
      id: "AURORA",
      fa: "شفق قطبی",
      en: "Aurora",
      dot: "bg-gradient-to-tr from-cyan-400 to-indigo-500",
    },
    {
      id: "TITANIUM",
      fa: "تیتانیوم",
      en: "Titanium",
      dot: "bg-gradient-to-tr from-rose-400 to-amber-300",
    },
  ];

  const TABS: { id: StudioTab; fa: string; en: string; icon: any }[] = [
    {
      id: "SYNTHESIS",
      fa: "شیشه مایع و AI",
      en: "Liquid AI Studio",
      icon: Sparkles,
    },
    {
      id: "ACOUSTIC",
      fa: "استودیو صدا (WebAudio)",
      en: "Real WebAudio EQ",
      icon: AudioWaveform,
    },
    {
      id: "WORKFLOW",
      fa: "برد مدیریت تسک",
      en: "Sprint Workflow",
      icon: CheckSquare,
    },
    {
      id: "ECOSYSTEM",
      fa: "هاب ۴ پروژه (پویا)",
      en: "4-Project Hub",
      icon: Compass,
    },
  ];

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      className="sticky top-2 z-40 max-w-[1680px] w-full mx-auto px-2.5 sm:px-4 lg:px-8"
    >
      <header
        style={{
          backdropFilter: `blur(${blurPx}px) saturate(190%)`,
          WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
        }}
        className={`${shellClass} rounded-[24px] sm:rounded-[28px] p-2.5 sm:px-5 sm:py-3 transition-all overflow-hidden`}
      >
        {/* ردیف بالا: کاملاً ضد بیرون‌زدگی در اندروید */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <div className="btn-liquid-primary flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs shrink-0">
              <Droplets className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono font-black tracking-wide text-xs sm:text-sm">
                LuminaGlass
              </span>
            </div>

            {/* کادر پروفایل بهینه‌شده برای موبایل اندروید */}
            <button
              onClick={() => setActiveTab("ECOSYSTEM")}
              className={`${btnClass} flex items-center gap-2 px-2.5 py-1 rounded-full text-xs min-w-0 overflow-hidden`}
            >
              <div
                style={{ width: 32, height: 32, minWidth: 32, maxWidth: 32 }}
                className="rounded-full overflow-hidden border border-white/90 shadow-sm shrink-0 flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-pink-500 text-white"
              >
                <SmartAssetImage
                  baseName="pooya-liquid"
                  alt="Pooya Goodarzi"
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                  fallback={
                    <span className="font-mono font-black text-[10px]">PG</span>
                  }
                />
              </div>
              <div className="text-start min-w-0 pr-0.5">
                <div className="font-extrabold text-[11px] sm:text-xs truncate leading-tight">
                  {lang === "fa" ? "پویا گودرزی" : "Pooya Goodarzi"}
                </div>
                <div className="hidden sm:block text-[10px] opacity-75 font-mono truncate">
                  {lang === "fa"
                    ? "معمار سیستم و Liquid UI"
                    : "System & UI Architect"}
                </div>
              </div>
            </button>
          </div>

          {/* کنترل تم و زبان در موبایل و دسکتاپ */}
          <div className="flex items-center gap-1.5 max-w-full overflow-x-auto py-0.5">
            <div className="flex items-center gap-1 p-1 rounded-full bg-black/5 border border-white/30 shrink-0">
              <Sun className="w-3.5 h-3.5 mx-1 opacity-70 hidden md:inline" />
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    theme === t.id ? "btn-liquid-primary" : btnClass
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full border border-white shrink-0 ${t.dot}`}
                  />
                  <span>{lang === "fa" ? t.fa : t.en}</span>
                </button>
              ))}
            </div>

            <div
              className={`${btnClass} hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono shrink-0`}
            >
              <span>Blur: {blurPx}px</span>
              <input
                type="range"
                min={12}
                max={48}
                value={blurPx}
                onChange={(e) => setBlurPx(Number(e.target.value))}
                className="w-16 accent-indigo-500 cursor-pointer"
              />
            </div>

            <button
              onClick={toggleLang}
              className={`${btnClass} flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-mono font-bold shrink-0`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === "fa" ? "EN" : "FA"}</span>
            </button>
          </div>
        </div>

        {/* نوار سوییچ ۴ استودیوی داخلی */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 mt-2.5 pt-2.5 border-t border-white/25">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-4 rounded-full text-[11px] sm:text-xs font-bold transition-all min-w-0 ${
                  active ? "btn-liquid-primary" : btnClass
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {lang === "fa" ? tab.fa : tab.en}
                </span>
              </button>
            );
          })}
        </div>
      </header>
    </div>
  );
}