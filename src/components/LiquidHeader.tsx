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
  Layers,
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
      fa: "مرواریدی روشن (Daylight)",
      en: "Pearl Daylight",
      dot: "bg-gradient-to-tr from-indigo-400 to-pink-300",
    },
    {
      id: "AURORA",
      fa: "شفق کریستالی (Aurora)",
      en: "Crystal Aurora",
      dot: "bg-gradient-to-tr from-cyan-400 to-indigo-500",
    },
    {
      id: "TITANIUM",
      fa: "تیتانیوم رزگلد (Titanium)",
      en: "Rose Titanium",
      dot: "bg-gradient-to-tr from-rose-400 to-amber-300",
    },
  ];

  const TABS: { id: StudioTab; fa: string; en: string; icon: any }[] = [
    {
      id: "SYNTHESIS",
      fa: "استودیوی شیشه مایع و هوش مصنوعی",
      en: "Liquid AI Synthesis",
      icon: Sparkles,
    },
    {
      id: "ACOUSTIC",
      fa: "آزمایشگاه مهندسی صدا و فرکانس (EQ)",
      en: "Acoustic & Vocal EQ Lab",
      icon: AudioWaveform,
    },
    {
      id: "WORKFLOW",
      fa: "برد مدیریت پروژه شیشه‌ای",
      en: "Liquid Sprint Flow",
      icon: CheckSquare,
    },
    {
      id: "ECOSYSTEM",
      fa: "هاب جامع ۴ پروژه (پویا گودرزی)",
      en: "4-Project Flagship Hub",
      icon: Compass,
    },
  ];

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      className="sticky top-3 z-40 max-w-[1680px] w-full mx-auto px-3 lg:px-8 space-y-3"
    >
      {/* داک کپسولی شیشه مایع (Floating Liquid Glass Capsule Dock) */}
      <header
        style={{
          backdropFilter: `blur(${blurPx}px) saturate(190%)`,
          WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
        }}
        className={`${shellClass} rounded-[28px] px-4 lg:px-6 py-3 transition-all`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* برندینگ و پروفایل پویا گودرزی */}
          <div className="flex items-center gap-3">
            <div className="btn-liquid-primary flex items-center gap-2 px-4 py-2 rounded-full text-xs">
              <Droplets className="w-4 h-4" />
              <span className="font-mono font-black tracking-wide text-sm">
                LuminaGlass
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/25">
                LIQUID OS
              </span>
            </div>

            <button
              onClick={() => setActiveTab("ECOSYSTEM")}
              className={`${btnClass} flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs`}
            >
              <div
                style={{ width: 38, height: 38, minWidth: 38, maxWidth: 38 }}
                className="rounded-full overflow-hidden border-2 border-white/80 shadow-md shrink-0 flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-pink-500 text-white"
              >
                <SmartAssetImage
                  baseName="pooya-liquid"
                  alt="Pooya Goodarzi"
                  style={{
                    width: "38px",
                    height: "38px",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                  fallback={
                    <span className="font-mono font-black text-xs">PG</span>
                  }
                />
              </div>
              <div className="text-start pr-1">
                <div className="font-extrabold leading-tight">
                  {lang === "fa" ? "پویا گودرزی" : "Pooya Goodarzi"}
                </div>
                <div className="text-[10px] opacity-75 font-mono">
                  {lang === "fa"
                    ? "معمار فول‌استک و طراح Liquid UI"
                    : "Creative Technologist & Architect"}
                </div>
              </div>
            </button>
          </div>

          {/* انتخابگر ۳ اتمسفر نوری شیشه مایع */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-black/5 border border-white/30">
            <Sun className="w-3.5 h-3.5 mx-1.5 opacity-70 hidden sm:inline" />
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  theme === t.id ? "btn-liquid-primary" : btnClass
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full border border-white ${t.dot}`}
                />
                <span>{lang === "fa" ? t.fa : t.en}</span>
              </button>
            ))}
          </div>

          {/* کنترل غلظت شیشه و تغییر زبان */}
          <div className="flex items-center gap-2">
            <div
              className={`${btnClass} hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono`}
            >
              <span>Glass Blur: {blurPx}px</span>
              <input
                type="range"
                min={12}
                max={48}
                value={blurPx}
                onChange={(e) => setBlurPx(Number(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
            </div>

            <button
              onClick={toggleLang}
              className={`${btnClass} flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono font-bold`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === "fa" ? "EN" : "FA"}</span>
            </button>
          </div>
        </div>

        {/* نوار سوییچ ۴ استودیوی داخلی */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/25">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold transition-all ${
                  active ? "btn-liquid-primary" : btnClass
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
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