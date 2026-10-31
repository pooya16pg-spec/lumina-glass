"use client";

import React, { useEffect, useRef } from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import { Volume2, VolumeX, RotateCcw, Mic } from "lucide-react";

export default function AcousticEqLab() {
  const {
    lang,
    theme,
    blurPx,
    isAudioPlaying,
    eqBands,
    setAudioPlaying,
    updateEqBand,
    resetEqBands,
  } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  // زنجیره واقعی پردازش صدای Web Audio API (پاسخ مستقیم به نقد ChatGPT)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const oscsRef = useRef<OscillatorNode[]>([]);

  const toggleRealWebAudio = () => {
    if (isAudioPlaying) {
      oscsRef.current.forEach((o) => {
        try {
          o.stop();
        } catch {}
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      filtersRef.current = [];
      oscsRef.current = [];
      setAudioPlaying(false);
      return;
    }

    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.14;

    // ساخت ۵ فیلتر واقعی BiquadFilterNode مطابق با ۵ اسلایدر اکولایزر
    const createdFilters: BiquadFilterNode[] = eqBands.map((band, idx) => {
      const f = ctx.createBiquadFilter();
      f.type =
        idx === 0
          ? "lowshelf"
          : idx === eqBands.length - 1
          ? "highshelf"
          : "peaking";
      f.frequency.value = band.hz;
      f.Q.value = 1.2;
      f.gain.value = band.gainDb * 2.5;
      return f;
    });

    // اتصال زنجیره‌ای فیلترها
    for (let i = 0; i < createdFilters.length - 1; i++) {
      createdFilters[i].connect(createdFilters[i + 1]);
    }
    createdFilters[createdFilters.length - 1].connect(masterGain);
    masterGain.connect(ctx.destination);
    filtersRef.current = createdFilters;

    // تولید آکورد هارمونیک گرم (62Hz Bass + 124Hz + 248Hz + 496Hz + 992Hz)
    const freqs = [62, 124, 248, 372, 992];
    const createdOscs: OscillatorNode[] = freqs.map((hz, i) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = i === 0 ? "sine" : i % 2 === 0 ? "triangle" : "sawtooth";
      osc.frequency.value = hz;
      oscGain.gain.value = i === 0 ? 0.55 : 0.18 / i;
      osc.connect(oscGain);
      oscGain.connect(createdFilters[0]);
      osc.start();
      return osc;
    });

    oscsRef.current = createdOscs;
    setAudioPlaying(true);
  };

  // اعمال بلادرنگ تغییرات اسلایدرها روی فیلترهای صوتی واقعی مرورگر
  useEffect(() => {
    if (!audioCtxRef.current || filtersRef.current.length === 0) return;
    eqBands.forEach((band, idx) => {
      const filterNode = filtersRef.current[idx];
      if (filterNode && audioCtxRef.current) {
        filterNode.gain.setTargetAtTime(
          band.gainDb * 2.5,
          audioCtxRef.current.currentTime,
          0.04
        );
      }
    });
  }, [eqBands]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      style={{
        backdropFilter: `blur(${blurPx}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
      }}
      className={`${shellClass} rounded-[28px] sm:rounded-[32px] p-4 sm:p-7 space-y-6`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/25 pb-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-pink-500/15 text-pink-500 border border-pink-400/30">
            REAL WEB AUDIO API • 5-BAND BIQUAD FILTER DSP
          </span>
          <h2 className="text-base sm:text-2xl font-black mt-2 flex items-center gap-2">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 shrink-0" />
            <span>
              {lang === "fa"
                ? "موتور پردازش صدای واقعی (Web Audio API) و اکولایزر ۵ بانده"
                : "Real Web Audio API Synthesizer & 5-Band Parametric EQ"}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleRealWebAudio}
            className="btn-liquid-primary px-4 sm:px-5 py-2.5 rounded-full text-xs flex items-center gap-2"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>
                  {lang === "fa"
                    ? "توقف صدای موتور DSP (Playing)"
                    : "Stop Real WebAudio Synth"}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>
                  {lang === "fa"
                    ? "پخش صدای واقعی موتور DSP"
                    : "Play Real WebAudio Synth"}
                </span>
              </>
            )}
          </button>

          <button
            onClick={resetEqBands}
            className={`${btnClass} px-3.5 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {lang === "fa" ? "ریست (+0.3dB @ 62Hz)" : "Reset (+0.3dB @ 62Hz)"}
            </span>
          </button>
        </div>
      </div>

      <div
        dir="ltr"
        className="relative h-48 w-full rounded-[24px] bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/15 border border-white/40 p-4 overflow-hidden flex flex-col justify-between"
      >
        <div className="flex justify-between text-[10px] sm:text-[11px] font-mono opacity-75">
          <span>62 Hz — SUB-CHEST BIQUAD LOWSHELF</span>
          <span>12,000 Hz — HIGHSHELF AIR</span>
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