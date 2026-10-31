"use client";

import React from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import { AudioWaveform, Play, Pause, RotateCcw, Mic, Sparkles } from "lucide-react";

export default function AcousticEqLab() {
  const {
    lang,
    theme,
    blurPx,
    isAudioPlaying,
    eqBands,
    toggleAudioPlaying,
    updateEqBand,
    resetEqBands,
  } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      style={{
        backdropFilter: `blur(${blurPx}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
      }}
      className={`${shellClass} rounded-[32px] p-5 md:p-7 space-y-6`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/25 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-pink-500/15 text-pink-500 border border-pink-400/30">
            PARAMETRIC DSP RESONANCE ENGINE
          </span>
          <h2 className="text-lg md:text-2xl font-black mt-2 flex items-center gap-2">
            <Mic className="w-6 h-6 text-indigo-500" />
            <span>
              {lang === "fa"
                ? "استودیوی مهندسی رزونانس صدا و اکولایزر پارامتریک (Vocal & Acoustic Lab)"
                : "Parametric Vocal Resonance & Spatial Audio Equalizer"}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudioPlaying}
            className="btn-liquid-primary px-5 py-2.5 rounded-full text-xs flex items-center gap-2"
          >
            {isAudioPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>
                  {lang === "fa" ? "موتور طیف‌سنج: فعال" : "Analyzer: Running"}
                </span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>
                  {lang === "fa" ? "شروع تحلیل فرکانس" : "Start DSP Stream"}
                </span>
              </>
            )}
          </button>

          <button
            onClick={resetEqBands}
            className={`${btnClass} px-4 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === "fa" ? "ریست کالیبراسیون" : "Reset (+0.3dB @ 62Hz)"}</span>
          </button>
        </div>
      </div>

      {/* منحنی پاسخ فرکانسی برداری (Frequency Response Curve) */}
      <div
        dir="ltr"
        className="relative h-48 w-full rounded-[24px] bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/15 border border-white/40 p-4 overflow-hidden flex flex-col justify-between"
      >
        <div className="flex justify-between text-[11px] font-mono opacity-75">
          <span>20 Hz — SUB-CHEST RESONANCE</span>
          <span>HARMONIC CLARITY — 20,000 Hz</span>
        </div>

        <svg viewBox="0 0 800 120" className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="60"
            x2="800"
            y2="60"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="4 4"
          />
          {(() => {
            const pts = eqBands.map((b, i) => {
              const x = 80 + i * 160;
              const y = 60 - b.gainDb * 9;
              return { x, y };
            });
            const poly = `0,115 ${pts.map((p) => `${p.x},${p.y}`).join(" ")} 800,115`;
            const line = `0,60 ${pts.map((p) => `${p.x},${p.y}`).join(" ")} 800,60`;
            return (
              <>
                <polygon points={poly} fill="url(#eqFill)" />
                <polyline
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                  points={line}
                />
                {pts.map((p, idx) => (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="7"
                      fill="#EC4899"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="11"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {eqBands[idx].gainDb >= 0 ? "+" : ""}
                      {eqBands[idx].gainDb} dB
                    </text>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>
      </div>

      {/* ۵ اسلایدر باندهای اکولایزر (شامل باند 62Hz روی +0.3dB پیش‌فرض) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {eqBands.map((band, idx) => (
          <div
            key={band.freq}
            className={`${btnClass} rounded-[24px] p-4 flex flex-col justify-between space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-indigo-500">
                {band.freq}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600">
                {band.gainDb >= 0 ? "+" : ""}
                {band.gainDb} dB
              </span>
            </div>

            <div className="text-[11px] opacity-80 leading-snug">
              {band.label[lang]}
            </div>

            <input
              type="range"
              min={-6}
              max={6}
              step={0.1}
              value={band.gainDb}
              onChange={(e) => updateEqBand(idx, parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}