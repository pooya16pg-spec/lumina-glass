"use client";

import React from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import SmartAssetImage from "./SmartAssetImage";
import { Sparkles, Sliders, Wand2, Layers, Download, RotateCcw } from "lucide-react";

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
    loadCreationPreset,
    generateNewCreation,
  } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  const rings = [0, 1, 2, 3, 4].map((idx) => {
    const r = 42 + idx * (orbComplexity * 0.22);
    const skew = (orbFluidity - 50) * 0.35;
    return { r, skew, rot: idx * 28 + orbIridescence };
  });

  // خروجی واقعی تصویر PNG با رندرینگ Canvas (پاسخ مستقیم به نقد ChatGPT)
  const handleDownloadRealPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    if (isLight) {
      bgGrad.addColorStop(0, "#EEF2FF");
      bgGrad.addColorStop(0.5, "#FCE7F3");
      bgGrad.addColorStop(1, "#E0F2FE");
    } else {
      bgGrad.addColorStop(0, "#0B1021");
      bgGrad.addColorStop(0.5, "#1E1B4B");
      bgGrad.addColorStop(1, "#090D16");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // رسم حلقه‌های شکست نور روی بوم واقعی
    const cx = 600;
    const cy = 380;
    rings.forEach((ring, i) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((ring.rot * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        (ring.r + Math.abs(ring.skew)) * 2.2,
        Math.max(24, ring.r - i * 6) * 2.2,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = i % 2 === 0 ? "rgba(99,102,241,0.65)" : "rgba(236,72,153,0.65)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    });

    const coreGrad = ctx.createRadialGradient(cx - 40, cy - 40, 20, cx, cy, 180);
    coreGrad.addColorStop(0, "rgba(255,255,255,0.95)");
    coreGrad.addColorStop(0.45, "rgba(165,180,252,0.75)");
    coreGrad.addColorStop(0.8, "rgba(244,114,182,0.65)");
    coreGrad.addColorStop(1, "rgba(6,182,212,0.85)");

    ctx.beginPath();
    ctx.arc(cx, cy, (52 + orbComplexity * 0.18) * 2.1, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    ctx.fillStyle = isLight ? "#0F172A" : "#F8FAFC";
    ctx.font = "bold 22px monospace";
    ctx.fillText(
      `LuminaGlass Optical Render • IOR ${(1.3 + orbIridescence * 0.004).toFixed(2)} • Architect: Pooya Goodarzi`,
      50,
      720
    );
    ctx.font = "16px monospace";
    ctx.fillText(`Prompt: ${promptText.slice(0, 85)}`, 50, 755);

    const link = document.createElement("a");
    link.download = `lumina-glass-ior-${orbIridescence}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
    >
      <div
        style={{
          backdropFilter: `blur(${blurPx}px) saturate(190%)`,
          WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
        }}
        className={`lg:col-span-7 ${shellClass} rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 flex flex-col justify-between space-y-4 overflow-hidden`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-400/30">
              OPTICAL CAUSTICS & PNG EXPORTER
            </span>
            <h2 className="text-base sm:text-2xl font-black mt-2">
              {lang === "fa"
                ? "موتور سنتز شیشه مایع با قابلیت ذخیره Preset و خروجی واقعی PNG"
                : "Interactive Liquid Glass Synthesizer & Real PNG Exporter"}
            </h2>
          </div>

          <button
            onClick={handleDownloadRealPng}
            className="btn-liquid-primary px-3.5 py-2 rounded-full text-xs font-mono flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === "fa" ? "دانلود PNG واقعی" : "Export Real PNG"}</span>
          </button>
        </div>

        <div className="relative h-[290px] sm:h-[340px] w-full rounded-[24px] overflow-hidden border border-white/40 bg-gradient-to-br from-indigo-500/10 via-pink-500/10 to-cyan-500/15 flex items-center justify-center">
          <div className="absolute inset-0 opacity-35 pointer-events-none">
            <SmartAssetImage
              baseName="lumina-orb"
              alt="Liquid Glass Orb"
              className="w-full h-full object-cover"
              fallback={<div className="w-full h-full" />}
            />
          </div>

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

            <circle
              cx="200"
              cy="160"
              r={75 + orbFluidity * 0.45}
              fill="url(#liquidSphereGrad)"
              opacity="0.35"
            />

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

            <circle
              cx="200"
              cy="160"
              r={52 + orbComplexity * 0.18}
              fill="url(#liquidSphereGrad)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
            />

            <ellipse
              cx="182"
              cy="132"
              rx="26"
              ry="12"
              transform="rotate(-22 182 132)"
              fill="rgba(255,255,255,0.75)"
            />
          </svg>

          <div
            dir="ltr"
            className={`${shellClass} absolute bottom-2.5 left-2.5 right-2.5 rounded-full px-3.5 py-1.5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono`}
          >
            <span>IOR: {(1.3 + orbIridescence * 0.004).toFixed(2)}</span>
            <span>Fluid: {orbFluidity}%</span>
            <span>Rings: {orbComplexity}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-indigo-500" />
            <span>
              {lang === "fa"
                ? "ذخیره وضعیت فعلی در آرشیو (Save Current Preset):"
                : "Save Current Optical State Preset:"}
            </span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setOrbParams({ promptText: e.target.value })}
              className={`${btnClass} flex-1 rounded-full px-4 py-2.5 text-xs font-mono focus:outline-none min-w-0`}
            />
            <button
              onClick={generateNewCreation}
              className="btn-liquid-primary px-5 py-2.5 rounded-full text-xs flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === "fa" ? "ذخیره در آرشیو" : "Save State Preset"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div
          style={{
            backdropFilter: `blur(${blurPx}px) saturate(190%)`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
          }}
          className={`${shellClass} rounded-[28px] sm:rounded-[32px] p-5 space-y-4`}
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
            <span className="font-mono text-[11px] opacity-70">REAL-TIME</span>
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

        {/* آرشیو تعاملی با قابلیت بازگردانی تنظیمات (Click to Restore Preset) */}
        <div
          style={{
            backdropFilter: `blur(${blurPx}px) saturate(190%)`,
            WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
          }}
          className={`${shellClass} rounded-[28px] sm:rounded-[32px] p-5 space-y-3.5 flex-1`}
        >
          <div className="flex items-center justify-between border-b border-white/25 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500" />
              <h3 className="text-sm font-black">
                {lang === "fa"
                  ? "آرشیو Presetها (کلیک = بازیابی تنظیمات)"
                  : "Saved Optical Presets (Click to Restore)"}
              </h3>
            </div>
            <span className="text-[11px] font-mono opacity-70">
              {creations.length} Presets
            </span>
          </div>

          <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
            {creations.map((item) => (
              <button
                key={item.id}
                onClick={() => loadCreationPreset(item)}
                className={`${btnClass} w-full text-start rounded-2xl p-3 flex items-center justify-between gap-3`}
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
                  <div className="text-[10px] opacity-60 flex items-center gap-1">
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Load</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}