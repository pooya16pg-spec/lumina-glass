"use client";

import React from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import SmartAssetImage from "./SmartAssetImage";
import { ExternalLink, Award, Layers, Sparkles, Terminal } from "lucide-react";

export default function EcosystemShowcase() {
  const { lang, theme, blurPx } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  const PROJECTS = [
    {
      num: "01",
      name: "Pooya.OS — Spatial Portfolio OS",
      styleTag: "3D Spatial WebOS & Window Manager",
      desc: {
        fa: "سیستم‌عامل تحت وب تعاملی با پنجره‌های شناور، ترمینال دستورپذیر و معرفی جامع مهارت‌های مهندسی کامپیوتر.",
        en: "Interactive desktop WebOS featuring draggable windows, terminal CLI, and engineering showcase.",
      },
      url: "https://pooya16pg-spec.github.io/pooya-os/",
      accent: "from-cyan-400 to-blue-500",
    },
    {
      num: "02",
      name: "AuraPulse — Quant FinTech Terminal",
      styleTag: "SVG Charting & Paper Trading Demo",
      desc: {
        fa: "داشبورد بازار با چارت SVG، دفتر سفارشات شبیه‌سازی‌شده و معاملات آزمایشی محلی؛ قیمت عمومی بایننس در صورت دسترسی شبکه.",
        en: "Market dashboard with SVG candles, a simulated order book, and local paper trading; public Binance tickers when reachable.",
      },
      url: "https://pooya16pg-spec.github.io/aurapulse/",
      accent: "from-emerald-400 to-teal-500",
    },
    {
      num: "03",
      name: "NexusCanvas — Distributed Arch Studio",
      styleTag: "Interactive Node-Graph & IaC Generator",
      desc: {
        fa: "استودیوی طراحی معماری میکروسرویس و کلود با قابلیت درگ‌و‌دراپ نودها، شبیه‌سازی بار ترافیک و تولید کد Docker Compose.",
        en: "Cloud system architecture node-graph editor with live traffic simulation and Docker Compose export.",
      },
      url: "https://pooya16pg-spec.github.io/nexus-canvas/",
      accent: "from-indigo-400 to-purple-500",
    },
    {
      num: "04",
      name: "LuminaGlass — Liquid Glass Optical Studio",
      styleTag: "Apple visionOS Liquid Glass & DSP Audio",
      desc: {
        fa: "سوپر-اپلیکیشن شیشه مایع (Liquid Glass) با ۳ اتمسفر نوری، سنتز سه‌بعدی، اکولایزر پارامتریک فرکانسی و برد مدیریت پروژه.",
        en: "Apple visionOS-inspired Liquid Glass suite featuring optical caustics, parametric vocal EQ & sprint board.",
      },
      url: "https://pooya16pg-spec.github.io/lumina-glass/",
      accent: "from-pink-400 to-indigo-500",
    },
  ];

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      style={{
        backdropFilter: `blur(${blurPx}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
      }}
      className={`${shellClass} rounded-[32px] p-6 md:p-8 space-y-6`}
    >
      {/* هدر معرفی پویا گودرزی */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/30 pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div
            style={{ width: 108, height: 108, minWidth: 108, maxWidth: 108 }}
            className="rounded-[28px] overflow-hidden border-2 border-white shadow-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shrink-0 flex items-center justify-center text-white"
          >
            <SmartAssetImage
              baseName="pooya-liquid"
              alt="Pooya Goodarzi"
              style={{
                width: "108px",
                height: "108px",
                objectFit: "cover",
                objectPosition: "top center",
              }}
              fallback={
                <span className="font-mono font-black text-3xl">PG</span>
              }
            />
          </div>
          <div className="text-center sm:text-start">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-400/30">
              COMPLETE 4-PROJECT ENGINEERING ECOSYSTEM
            </span>
            <h2 className="text-xl md:text-3xl font-black mt-2">
              {lang === "fa"
                ? "پویا گودرزی — مهندس کامپیوتر و معمار سیستم‌های مدرن وب"
                : "Pooya Goodarzi — Computer Engineer & Full-Stack UI Architect"}
            </h2>
            <p className="text-xs md:text-sm opacity-80 mt-1 max-w-2xl leading-relaxed">
              {lang === "fa"
                ? "مجموعه ۴ پروژه فلگ‌شیپ با ۴ سبک طراحی و معماری کاملاً متفاوت (Spatial OS، FinTech Terminal، Node-Graph Studio و Liquid Glass Optical Lab) برای نمایش تسلط کامل بر مهندسی نرم‌افزار و UI/UX."
                : "A quartet of flagship web applications demonstrating mastery across Spatial WebOS, Quantitative FinTech, Distributed Node-Graphs, and Liquid Glass Optical UI."}
            </p>
          </div>
        </div>
      </div>

      {/* کارت‌های ۴ پروژه */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PROJECTS.map((proj) => (
          <div
            key={proj.num}
            className={`${btnClass} rounded-[28px] p-5 flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-xs font-black px-3 py-1 rounded-full text-white bg-gradient-to-r ${proj.accent}`}
                >
                  PROJECT #{proj.num}
                </span>
                <span className="font-mono text-[11px] opacity-75">
                  {proj.styleTag}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black pt-1">
                {proj.name}
              </h3>
              <p className="text-xs opacity-80 leading-relaxed">
                {proj.desc[lang]}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href={proj.url}
                target="_blank"
                rel="noreferrer"
                className="btn-liquid-primary px-4 py-2 rounded-full text-xs flex items-center gap-1.5"
              >
                <span>
                  {lang === "fa" ? "اجرای زنده پروژه" : "Launch Live App"}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}