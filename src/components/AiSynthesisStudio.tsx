"use client";

import React from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import SmartAssetImage from "./SmartAssetImage";
import { Sparkles, Sliders, Wand2, Layers, Eye } from "lucide-react";

export default function AiSynthesisStudio() {
  const {
    lang,
    theme,
    blurPx,
    orbComplexity,
    orbFluidity,
    orbIridescence,
    promptText,
    creations,
    setOrbParams,
    generateNewCreation,
  } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  // محاسبه شعاع و حلقه‌های گوی شیشه مایع بر اساس اسلایدرهای کاربر
  const rings = [0, 1, 2, 3, 4].map((idx) => {
    const r = 42 + idx * (orbComplexity * 0.22);
    const skew = (orbFluidity - 50) * 0.35;
    return { r, skew, rot: idx * 28 + orbIridescence };
  });

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
    >
      {/* بوم مرکزی: گوی کریستالی شیشه مایع (Interactive Morphing Liquid Orb) */}
      <div
        style={{
          backdropFilter: `blur(${blurPx}px) saturate(190%)`,
          WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
        }}
        className={`lg:col-span-7 ${shellClass} rounded-[32px] p-5 md:p-6 flex flex-col justify-between space-y-5`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-400/30">
              APPLE VISION-OS INSPIRED SHADER
            </span>
            <h2 className="text-lg md:text-2xl font-black mt-2">
              {lang === "fa"
                ? "موتور سنتز شیشه مایع و شکست نور منشوری (Real-Time Caustics)"
                : "Interactive Liquid Glass & Refractive Caustics Studio"}
            </h2>
          </div>
          <span className="font-mono text-xs opacity-75">
            IOR: {(1.3 + orbIridescence * 0.004).toFixed(2)} • 120FPS SVG
          </span>
        </div>

        {/* ویترین گرافیکی گوی شیشه‌ای تعاملی */}
        <div className="relative h-[310px] sm:h-[340px] w-full rounded-[28px] overflow-hidden border border-white/40 bg-gradient-to-br from-indigo-500/10 via-pink-500/10 to-cyan-500/15 flex items-center justify-center">
          {/* تصویر پس‌زمینه اختیاری با فال‌بک کریستالی */}
          <div className="absolute inset-0 opacity-35 pointer-events-none">
            <SmartAssetImage
              baseName="lumina-orb"
              alt="Liquid Glass Orb"
              className="w-full h-full object-cover"
              fallback={<div className="w-full h-full" />}
            />
          </div>

          {/* گوی برداری زنده که با اسلایدرها تغییر شکل می‌دهد */}
          <svg
            viewBox="0 0 400 320"
            className="relative z-10 w-full h-full max-w-[440px]"
          >
            <defs>
              <radialGradient id="liquidSphereGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#A5B4FC" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#F472B6" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.75" />
              </radialGradient>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* هاله نورانی پشت گوی */}
            <circle
              cx="200"
              cy="160"
              r={75 + orbFluidity * 0.45}
              fill="url(#liquidSphereGrad)"
              opacity="0.35"
            />

            {/* لایه‌های منشوری چرخان */}
            {rings.map((ring, idx) => (
              <ellipse
                key={idx}
                cx="200"
                cy="160"
                rx={ring.r + Math.abs(ring.skew)}
                ry={Math.max(24, ring.r - idx * 6)}
                transform={`rotate(${ring.rot} 200 160)`}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth={2.2 - idx * 0.25}
              />
            ))}

            {/* هسته مرکزی شیشه مایع */}
            <circle
              cx="200"
              cy="160"
              r={52 + orbComplexity * 0.18}
              fill="url(#liquidSphereGrad)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
            />

            {/* بازتاب آینه‌ای بالای گوی (Specular Highlight) */}
            <ellipse
              cx="182"
              cy="132"
              rx="26"
              ry="12"
              transform="rotate(-22 182 132)"
              fill="rgba(255,255,255,0.75)"
            />
          </svg>

          {/* کپسول شناور مشخصات شیشه روی بوم */}
          <div
            dir="ltr"
            className={`${shellClass} absolute bottom-3 left-3 right-3 rounded-full px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-mono`}
          >
            <span>Refraction: {orbIridescence}%</span>
            <span>Fluid Morph: {orbFluidity}%</span>
            <span>Harmonic Rings: {orbComplexity}%</span>
          </div>
        </div>

        {/* جعبه پرامپت تولید صحنه شیشه‌ای */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-indigo-500" />
            <span>
              {lang === "fa"
                ? "پرامپت موتور سنتز فضایی (Spatial Prompt):"
                : "Spatial Synthesis Prompt:"}
            </span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setOrbParams({ promptText: e.target.value })}
              className={`${btnClass} flex-1 rounded-full px-4 py-2.5 text-xs font-mono focus:outline-none`}
            />
            <button
              onClick={generateNewCreation}
              className="btn-liquid-primary px-6 py-2.5 rounded-full text-xs flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === "fa" ? "تولید بلور جدید" : "Synthesize Glass"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ستون سمت چپ/راست: کنترلرهای فیزیک شیشه و گالری خروجی‌ها */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div
          style={{
            backdropFilter: `blur(${blurPx}px) saturate(190%)`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
          }}
          className={`${shellClass} rounded-[32px] p-5 space-y-4`}
        >
          <div className="flex items-center justify-between border-b border-white/25 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-black">
                {lang === "fa"
                  ? "تنظیم‌کننده زنده فیزیک شیشه مایع"
                  : "Live Liquid Glass Physics Inspector"}
              </h3>
            </div>
            <span className="font-mono text-[11px] opacity-70">OPTICAL LAB</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>
                  {lang === "fa"
                    ? "ضریب شکست منشوری (Iridescence):"
                    : "Prismatic Iridescence:"}
                </span>
                <span className="font-mono">{orbIridescence}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={orbIridescence}
                onChange={(e) =>
                  setOrbParams({ orbIridescence: Number(e.target.value) })
                }
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>
                  {lang === "fa"
                    ? "سیالیت و تغییر شکل ارگانیک (Fluidity):"
                    : "Organic Fluidity Morph:"}
                </span>
                <span className="font-mono">{orbFluidity}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={95}
                value={orbFluidity}
                onChange={(e) =>
                  setOrbParams({ orbFluidity: Number(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>
                  {lang === "fa"
                    ? "تراکم لایه‌های کریستالی (Harmonic Rings):"
                    : "Crystal Layer Complexity:"}
                </span>
                <span className="font-mono">{orbComplexity}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={orbComplexity}
                onChange={(e) =>
                  setOrbParams({ orbComplexity: Number(e.target.value) })
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* گالری بلورهای ساخته‌شده */}
        <div
          style={{
            backdropFilter: `blur(${blurPx}px) saturate(190%)`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
          }}
          className={`${shellClass} rounded-[32px] p-5 space-y-3.5 flex-1`}
        >
          <div className="flex items-center justify-between border-b border-white/25 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500" />
              <h3 className="text-sm font-black">
                {lang === "fa"
                  ? "آرشیو رندرهای شیشه مایع"
                  : "Recent Spatial Glass Renders"}
              </h3>
            </div>
            <span className="text-[11px] font-mono opacity-70">
              {creations.length} Objects
            </span>
          </div>

          <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
            {creations.map((item) => (
              <div
                key={item.id}
                className={`${btnClass} rounded-2xl p-3 flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.gradient} shrink-0 shadow-inner border border-white/80`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] opacity-75 truncate">
                      {item.prompt}
                    </div>
                  </div>
                </div>
                <div className="text-end font-mono shrink-0">
                  <div className="text-[11px] font-bold text-indigo-500">
                    {item.refractionIndex}
                  </div>
                  <div className="text-[10px] opacity-60">{item.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}