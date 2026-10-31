"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import { Volume2, VolumeX, RotateCcw, Mic, Upload } from "lucide-react";

type AudioSourceMode = "SYNTH" | "FILE" | "MIC";

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
    applyEqPreset,
  } = useLuminaStore();

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  const [sourceMode, setSourceMode] = useState<AudioSourceMode>("SYNTH");
  const [fileName, setFileName] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);
  const oscsRef = useRef<OscillatorNode[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const operationIdRef = useRef(0);

  const stopAllAudio = useCallback(() => {
    // Invalidate pending permission, resume, and play promises before releasing resources.
    operationIdRef.current += 1;
    oscsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch {}
    });
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.removeAttribute("src");
      audioElRef.current.load();
      audioElRef.current.onerror = null;
      audioElRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    filtersRef.current = [];
    oscsRef.current = [];
    setAudioPlaying(false);
  }, [setAudioPlaying]);

  const createAudioContext = () => {
    const AudioContextConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) {
      throw new Error("Web Audio API is not supported in this browser.");
    }
    return new AudioContextConstructor();
  };

  const buildFilterChain = (ctx: AudioContext) => {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.22;

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

    for (let i = 0; i < createdFilters.length - 1; i++) {
      createdFilters[i].connect(createdFilters[i + 1]);
    }
    createdFilters[createdFilters.length - 1].connect(masterGain);
    masterGain.connect(ctx.destination);
    filtersRef.current = createdFilters;
    return createdFilters[0];
  };

  const startSynthMode = async () => {
    stopAllAudio();
    const operationId = operationIdRef.current;
    try {
      const ctx = createAudioContext();
      audioCtxRef.current = ctx;
      await ctx.resume();
      if (operationId !== operationIdRef.current) return;

      const firstFilter = buildFilterChain(ctx);
      const freqs = [62, 124, 248, 372, 992];
      const createdOscs: OscillatorNode[] = freqs.map((hz, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i === 0 ? "sine" : i % 2 === 0 ? "triangle" : "sawtooth";
        osc.frequency.value = hz;
        oscGain.gain.value = i === 0 ? 0.55 : 0.18 / i;
        osc.connect(oscGain);
        oscGain.connect(firstFilter);
        osc.start();
        return osc;
      });

      if (operationId !== operationIdRef.current) {
        createdOscs.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        return;
      }
      oscsRef.current = createdOscs;
      setSourceMode("SYNTH");
      setAudioPlaying(true);
    } catch {
      if (operationId === operationIdRef.current) {
        stopAllAudio();
        alert(
          lang === "fa"
            ? "مرورگر نتوانست صدای Web Audio را راه‌اندازی کند."
            : "The browser could not start Web Audio."
        );
      }
    }
  };

  // پردازش ورودی واقعی میکروفون کاربر از طریق ۵ فیلتر Biquad (پاسخ به نقد ChatGPT)
  const startMicMode = async () => {
    stopAllAudio();
    const operationId = operationIdRef.current;
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone capture is unavailable in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (operationId !== operationIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      mediaStreamRef.current = stream;

      const ctx = createAudioContext();
      audioCtxRef.current = ctx;
      await ctx.resume();
      if (operationId !== operationIdRef.current) return;

      const firstFilter = buildFilterChain(ctx);
      const micSource = ctx.createMediaStreamSource(stream);
      micSource.connect(firstFilter);
      setSourceMode("MIC");
      setAudioPlaying(true);
    } catch {
      if (operationId === operationIdRef.current) {
        stopAllAudio();
        alert(
          lang === "fa"
            ? "میکروفون در دسترس نیست یا مجوز آن داده نشد. برای حفظ حریم خصوصی، منبع صوتی دیگری به‌صورت خودکار پخش نمی‌شود."
            : "Microphone access is unavailable or was denied. No other audio source will start automatically."
        );
      }
    }
  };

  // پردازش فایل صوتی انتخابی کاربر (MP3/WAV) از طریق اکولایزر ۵ بانده
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    stopAllAudio();
    const operationId = operationIdRef.current;
    setFileName(file.name);
    try {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      const audio = new Audio(url);
      audio.loop = true;
      audio.preload = "auto";
      audioElRef.current = audio;

      const ctx = createAudioContext();
      audioCtxRef.current = ctx;
      const firstFilter = buildFilterChain(ctx);
      const mediaNode = ctx.createMediaElementSource(audio);
      mediaNode.connect(firstFilter);

      await ctx.resume();
      if (operationId !== operationIdRef.current) return;
      await audio.play();
      if (operationId !== operationIdRef.current) return;

      setSourceMode("FILE");
      setAudioPlaying(true);
    } catch {
      if (operationId === operationIdRef.current) {
        stopAllAudio();
        alert(
          lang === "fa"
            ? "فایل صوتی پخش نشد. فرمت فایل و مجوز پخش مرورگر را بررسی کن."
            : "The audio file could not be played. Check the file format and browser playback permission."
        );
      }
    } finally {
      // Allow selecting the same file again after stopping or an error.
      input.value = "";
    }
  };

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

  // رفع باگ خروج از تب صدا: هنگام unmount شدن کامپوننت، هم AudioContext بسته می‌شود و هم isAudioPlaying=false می‌شود
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

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
            REAL WEB AUDIO API • SYNTH + MICROPHONE + AUDIO FILE DSP
          </span>
          <h2 className="text-base sm:text-2xl font-black mt-2 flex items-center gap-2">
            <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 shrink-0" />
            <span>
              {lang === "fa"
                ? "استودیوی پردازش صدای واقعی (سینت‌سایزر، میکروفون و فایل صوتی)"
                : "Real Web Audio DSP Equalizer (Synth, Live Mic & Audio File)"}
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {isAudioPlaying ? (
            <button
              onClick={stopAllAudio}
              className="btn-liquid-primary min-h-11 px-4 py-2.5 rounded-full text-xs flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>
                {lang === "fa"
                  ? `توقف صدا (${sourceMode})`
                  : `Stop Audio (${sourceMode})`}
              </span>
            </button>
          ) : (
            <button
              onClick={startSynthMode}
              className="btn-liquid-primary px-4 py-2.5 rounded-full text-xs flex items-center gap-2"
            >
              <VolumeX className="w-4 h-4" />
              <span>
                {lang === "fa" ? "پخش سینت‌سایزر ۶۲Hz" : "Play 62Hz Synth"}
              </span>
            </button>
          )}

          <button
            onClick={startMicMode}
            className={`${btnClass} min-h-11 px-3.5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5`}
          >
            <Mic className="w-3.5 h-3.5 text-pink-500" />
            <span>{lang === "fa" ? "ورودی میکروفون" : "Live Mic Input"}</span>
          </button>

          <label
            className={`${btnClass} px-3.5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {fileName
                ? fileName.slice(0, 14)
                : lang === "fa"
                ? "آپلود فایل صوتی"
                : "Upload MP3/WAV"}
            </span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={resetEqBands}
            className={`${btnClass} min-h-11 px-3.5 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold">{lang === "fa" ? "پروفایل‌های آماده اکولایزر" : "EQ Starting Presets"}</div>
          <div className="text-[10px] opacity-65">{lang === "fa" ? "یک نقطه شروع انتخاب کن، سپس هر باند را دستی تنظیم کن." : "Choose a starting curve, then fine-tune each band."}</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([
            { id: "FLAT", fa: "تخت", en: "Flat" },
            { id: "WARM", fa: "گرم", en: "Warm" },
            { id: "CLARITY", fa: "وضوح", en: "Clarity" },
            { id: "CINEMATIC", fa: "سینمایی", en: "Cinematic" },
          ] as const).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyEqPreset(preset.id)}
              className={`${btnClass} px-3 py-2 rounded-full text-[11px] font-bold`}
            >
              {lang === "fa" ? preset.fa : preset.en}
            </button>
          ))}
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