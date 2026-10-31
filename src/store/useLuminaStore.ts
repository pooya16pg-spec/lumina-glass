"use client";

import { useState, useEffect } from "react";

export type Lang = "fa" | "en";
export type LiquidTheme = "PEARL" | "AURORA" | "TITANIUM";
export type StudioTab = "SYNTHESIS" | "ACOUSTIC" | "WORKFLOW" | "ECOSYSTEM";

export interface EqBand {
  freq: string;
  label: { fa: string; en: string };
  gainDb: number;
}

export interface SpatialTask {
  id: string;
  title: { fa: string; en: string };
  tag: string;
  status: "TODO" | "DOING" | "DONE";
}

export interface GeneratedCreation {
  id: string;
  title: string;
  prompt: string;
  refractionIndex: string;
  timestamp: string;
  gradient: string;
}

interface LuminaState {
  lang: Lang;
  theme: LiquidTheme;
  activeTab: StudioTab;
  blurPx: number;
  specularLevel: number;
  // پارامترهای استودیوی سه‌بعدی و هوش مصنوعی
  orbComplexity: number;
  orbFluidity: number;
  orbIridescence: number;
  promptText: string;
  creations: GeneratedCreation[];
  // پارامترهای استودیوی صوتی و رزونانس فرکانسی
  isAudioPlaying: boolean;
  vocalWarmth: number;
  spatialReverb: number;
  eqBands: EqBand[];
  // تسک‌های کانبان شیشه‌ای
  tasks: SpatialTask[];
}

const INITIAL_EQ: EqBand[] = [
  {
    freq: "62 Hz",
    label: { fa: "حجم و گرمای بم (Sub-Chest)", en: "Sub-Bass & Chest Warmth" },
    gainDb: 0.3,
  },
  {
    freq: "250 Hz",
    label: { fa: "رزونانس پایه صدا (Fundamental)", en: "Vocal Body & Depth" },
    gainDb: 1.4,
  },
  {
    freq: "1 kHz",
    label: { fa: "وضوح میانی (Mid Presence)", en: "Core Mid Clarity" },
    gainDb: 0.8,
  },
  {
    freq: "4 kHz",
    label: { fa: "شفافیت و تفکیک (Articulation)", en: "Harmonic Definition" },
    gainDb: 2.1,
  },
  {
    freq: "12 kHz",
    label: { fa: "درخشش هوایی (Spatial Air)", en: "Crystal Air & Brilliance" },
    gainDb: 1.8,
  },
];

let globalState: LuminaState = {
  lang: "fa",
  theme: "PEARL",
  activeTab: "SYNTHESIS",
  blurPx: 32,
  specularLevel: 88,
  orbComplexity: 78,
  orbFluidity: 64,
  orbIridescence: 92,
  promptText:
    "Iridescent liquid glass torus floating in pearl daylight studio, refractive caustics, 8k spatial UI",
  creations: [
    {
      id: "GEN-401",
      title: "Refractive Pearl Torus",
      prompt: "Apple visionOS liquid glass geometry with soft rose-cyan caustics",
      refractionIndex: "1.52 IOR",
      timestamp: "10:15",
      gradient: "from-indigo-400 via-pink-300 to-cyan-300",
    },
    {
      id: "GEN-402",
      title: "Acoustic Resonance Wave",
      prompt: "3D harmonic fluid ribbon vibrating at 62Hz chest resonance",
      refractionIndex: "1.68 IOR",
      timestamp: "09:48",
      gradient: "from-sky-400 via-purple-400 to-emerald-300",
    },
  ],
  isAudioPlaying: true,
  vocalWarmth: 84,
  spatialReverb: 42,
  eqBands: INITIAL_EQ,
  tasks: [
    {
      id: "TSK-1",
      title: {
        fa: "طراحی موتور شیشه مایع (Liquid Glass Shader) با شکست نور زنده",
        en: "Engineer Real-Time Liquid Glass Specular Shader",
      },
      tag: "UI/UX CORE",
      status: "DONE",
    },
    {
      id: "TSK-2",
      title: {
        fa: "کالیبراسیون اکولایزر فرکانس ۶۲ هرتز و تحلیلگر رزونانس صدا",
        en: "Calibrate 62Hz Vocal Resonance Parametric EQ",
      },
      tag: "DSP AUDIO",
      status: "DOING",
    },
    {
      id: "TSK-3",
      title: {
        fa: "اتصال یکپارچه ۴ پروژه فلگ‌شیپ در هاب رزومه پویا گودرزی",
        en: "Unify All 4 Flagship Projects in Executive Hub",
      },
      tag: "ARCHITECTURE",
      status: "TODO",
    },
  ],
};

const listeners = new Set<() => void>();

function setState(updater: (prev: LuminaState) => Partial<LuminaState>) {
  globalState = { ...globalState, ...updater(globalState) };
  listeners.forEach((l) => l());
}

const toggleLang = () =>
  setState((s) => ({ lang: s.lang === "fa" ? "en" : "fa" }));

const setTheme = (theme: LiquidTheme) => setState(() => ({ theme }));

const setActiveTab = (activeTab: StudioTab) => setState(() => ({ activeTab }));

const setBlurPx = (blurPx: number) => setState(() => ({ blurPx }));

const setOrbParams = (patch: Partial<Pick<LuminaState, "orbComplexity" | "orbFluidity" | "orbIridescence" | "promptText">>) =>
  setState(() => patch);

const generateNewCreation = () =>
  setState((s) => {
    const gradients = [
      "from-indigo-400 via-fuchsia-300 to-cyan-300",
      "from-rose-400 via-amber-200 to-sky-300",
      "from-emerald-300 via-cyan-300 to-indigo-400",
    ];
    const item: GeneratedCreation = {
      id: `GEN-${Math.floor(403 + Math.random() * 500)}`,
      title: `Spatial Glass Morph #${s.creations.length + 1}`,
      prompt: s.promptText || "Custom Liquid Glass Synthesis",
      refractionIndex: `${(1.45 + Math.random() * 0.35).toFixed(2)} IOR`,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      gradient: gradients[s.creations.length % gradients.length],
    };
    return { creations: [item, ...s.creations.slice(0, 5)] };
  });

const toggleAudioPlaying = () =>
  setState((s) => ({ isAudioPlaying: !s.isAudioPlaying }));

const updateEqBand = (index: number, gainDb: number) =>
  setState((s) => ({
    eqBands: s.eqBands.map((b, i) =>
      i === index ? { ...b, gainDb: Number(gainDb.toFixed(1)) } : b
    ),
  }));

const resetEqBands = () =>
  setState(() => ({
    eqBands: INITIAL_EQ.map((b) => ({ ...b })),
  }));

const cycleTaskStatus = (id: string) =>
  setState((s) => ({
    tasks: s.tasks.map((t) => {
      if (t.id !== id) return t;
      const next =
        t.status === "TODO" ? "DOING" : t.status === "DOING" ? "DONE" : "TODO";
      return { ...t, status: next };
    }),
  }));

const addTask = (titleText: string) =>
  setState((s) => {
    if (!titleText.trim()) return {};
    const newTask: SpatialTask = {
      id: `TSK-${Date.now()}`,
      title: { fa: titleText, en: titleText },
      tag: "CUSTOM",
      status: "TODO",
    };
    return { tasks: [newTask, ...s.tasks] };
  });

export function useLuminaStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return {
    ...globalState,
    toggleLang,
    setTheme,
    setActiveTab,
    setBlurPx,
    setOrbParams,
    generateNewCreation,
    toggleAudioPlaying,
    updateEqBand,
    resetEqBands,
    cycleTaskStatus,
    addTask,
  };
}