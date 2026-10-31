"use client";

import { useState, useEffect } from "react";

export type Lang = "fa" | "en";
export type LiquidTheme = "PEARL" | "AURORA" | "TITANIUM";
export type StudioTab = "SYNTHESIS" | "ACOUSTIC" | "WORKFLOW" | "ECOSYSTEM";
export type EqPreset = "FLAT" | "WARM" | "CLARITY" | "CINEMATIC";

export interface EqBand {
  freq: string;
  hz: number;
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
  params: {
    orbComplexity: number;
    orbFluidity: number;
    orbIridescence: number;
  };
}

interface LuminaState {
  lang: Lang;
  theme: LiquidTheme;
  activeTab: StudioTab;
  blurPx: number;
  orbComplexity: number;
  orbFluidity: number;
  orbIridescence: number;
  promptText: string;
  creations: GeneratedCreation[];
  isAudioPlaying: boolean;
  eqBands: EqBand[];
  tasks: SpatialTask[];
  isPreferencesHydrated: boolean;
}

const INITIAL_EQ: EqBand[] = [
  {
    freq: "62 Hz",
    hz: 62,
    label: { fa: "حجم و گرمای بم (Sub-Chest)", en: "Sub-Bass & Chest Warmth" },
    gainDb: 0.3,
  },
  {
    freq: "250 Hz",
    hz: 250,
    label: { fa: "رزونانس پایه صدا (Fundamental)", en: "Vocal Body & Depth" },
    gainDb: 1.4,
  },
  {
    freq: "1 kHz",
    hz: 1000,
    label: { fa: "وضوح میانی (Mid Presence)", en: "Core Mid Clarity" },
    gainDb: 0.8,
  },
  {
    freq: "4 kHz",
    hz: 4000,
    label: { fa: "شفافیت و تفکیک (Articulation)", en: "Harmonic Definition" },
    gainDb: 2.1,
  },
  {
    freq: "12 kHz",
    hz: 12000,
    label: { fa: "درخشش هوایی (Spatial Air)", en: "Crystal Air & Brilliance" },
    gainDb: 1.8,
  },
];

let globalState: LuminaState = {
  lang: "fa",
  theme: "PEARL",
  activeTab: "SYNTHESIS",
  blurPx: 32,
  orbComplexity: 78,
  orbFluidity: 64,
  orbIridescence: 92,
  promptText:
    "Iridescent liquid glass torus floating in pearl daylight studio, refractive caustics",
  creations: [
    {
      id: "GEN-401",
      title: "Refractive Pearl Torus",
      prompt: "Apple visionOS liquid glass geometry with soft rose-cyan caustics",
      refractionIndex: "1.67 IOR",
      timestamp: "Preset #1",
      gradient: "from-indigo-400 via-pink-300 to-cyan-300",
      params: { orbComplexity: 78, orbFluidity: 64, orbIridescence: 92 },
    },
    {
      id: "GEN-402",
      title: "Acoustic Resonance Wave",
      prompt: "3D harmonic fluid ribbon vibrating at 62Hz chest resonance",
      refractionIndex: "1.48 IOR",
      timestamp: "Preset #2",
      gradient: "from-sky-400 via-purple-400 to-emerald-300",
      params: { orbComplexity: 45, orbFluidity: 88, orbIridescence: 54 },
    },
  ],
  isAudioPlaying: false,
  eqBands: INITIAL_EQ,
  isPreferencesHydrated: false,
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
        fa: "پیاده‌سازی موتور صدای واقعی Web Audio API روی اکولایزر ۵ بانده",
        en: "Implement Real Web Audio API BiquadFilter DSP Chain",
      },
      tag: "WEB-AUDIO DSP",
      status: "DONE",
    },
    {
      id: "TSK-3",
      title: {
        fa: "بهینه‌سازی کامل ریسپانسیو هدر و پروفایل برای نمایشگرهای اندروید",
        en: "Optimize Mobile Viewport Containment for Android Devices",
      },
      tag: "MOBILE UX",
      status: "DOING",
    },
  ],
};

const listeners = new Set<() => void>();
const STORAGE_KEY = "lumina-glass:workspace:v1";
let hasHydratedPreferences = false;

function persistPreferences(state: LuminaState) {
  if (typeof window === "undefined" || !hasHydratedPreferences) return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        theme: state.theme,
        blurPx: state.blurPx,
        orbComplexity: state.orbComplexity,
        orbFluidity: state.orbFluidity,
        orbIridescence: state.orbIridescence,
        promptText: state.promptText,
        creations: state.creations.slice(0, 24),
        eqBands: state.eqBands,
        tasks: state.tasks.slice(0, 100),
      })
    );
  } catch {
    // Storage may be unavailable in private browsing; keep the current session usable.
  }
}

function setState(updater: (prev: LuminaState) => Partial<LuminaState>) {
  globalState = { ...globalState, ...updater(globalState) };
  persistPreferences(globalState);
  listeners.forEach((l) => l());
}

const hydrateLuminaPreferences = () => {
  if (hasHydratedPreferences || typeof window === "undefined") return;
  hasHydratedPreferences = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as {
        version?: number;
        theme?: LiquidTheme;
        blurPx?: number;
        orbComplexity?: number;
        orbFluidity?: number;
        orbIridescence?: number;
        promptText?: string;
        creations?: GeneratedCreation[];
        eqBands?: EqBand[];
        tasks?: SpatialTask[];
      };

      const patch: Partial<LuminaState> = {};
      if (saved.version === 1) {
        if (saved.theme && ["PEARL", "AURORA", "TITANIUM"].includes(saved.theme)) patch.theme = saved.theme;
        if (typeof saved.blurPx === "number" && Number.isFinite(saved.blurPx)) patch.blurPx = Math.max(12, Math.min(48, saved.blurPx));
        if (typeof saved.orbComplexity === "number" && Number.isFinite(saved.orbComplexity)) patch.orbComplexity = Math.max(30, Math.min(100, saved.orbComplexity));
        if (typeof saved.orbFluidity === "number" && Number.isFinite(saved.orbFluidity)) patch.orbFluidity = Math.max(15, Math.min(95, saved.orbFluidity));
        if (typeof saved.orbIridescence === "number" && Number.isFinite(saved.orbIridescence)) patch.orbIridescence = Math.max(20, Math.min(100, saved.orbIridescence));
        if (typeof saved.promptText === "string") patch.promptText = saved.promptText.slice(0, 240);
        if (Array.isArray(saved.creations)) {
          patch.creations = saved.creations.filter((item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.prompt === "string" &&
            item.params &&
            Number.isFinite(item.params.orbComplexity) &&
            Number.isFinite(item.params.orbFluidity) &&
            Number.isFinite(item.params.orbIridescence)
          ).slice(0, 24);
        }
        if (
          Array.isArray(saved.eqBands) &&
          saved.eqBands.length === INITIAL_EQ.length &&
          saved.eqBands.every((band, index) =>
            band &&
            band.hz === INITIAL_EQ[index].hz &&
            typeof band.gainDb === "number" &&
            Number.isFinite(band.gainDb)
          )
        ) {
          patch.eqBands = saved.eqBands.map((band, index) => ({
            ...INITIAL_EQ[index],
            gainDb: Math.max(-6, Math.min(6, Number(band.gainDb.toFixed(1)))),
          }));
        }
        if (Array.isArray(saved.tasks)) {
          patch.tasks = saved.tasks.filter((task) =>
            task &&
            typeof task.id === "string" &&
            task.title &&
            typeof task.title.fa === "string" &&
            typeof task.title.en === "string" &&
            ["TODO", "DOING", "DONE"].includes(task.status)
          ).slice(0, 100);
        }
      }
      globalState = { ...globalState, ...patch, isAudioPlaying: false, isPreferencesHydrated: true };
    } else {
      globalState = { ...globalState, isAudioPlaying: false, isPreferencesHydrated: true };
    }
  } catch {
    globalState = { ...globalState, isAudioPlaying: false, isPreferencesHydrated: true };
  }
  listeners.forEach((l) => l());
};

const toggleLang = () =>
  setState((s) => ({ lang: s.lang === "fa" ? "en" : "fa" }));

const setTheme = (theme: LiquidTheme) => setState(() => ({ theme }));

const setActiveTab = (activeTab: StudioTab) => setState(() => ({ activeTab }));

const setBlurPx = (blurPx: number) => setState(() => ({ blurPx }));

const setOrbParams = (
  patch: Partial<
    Pick<
      LuminaState,
      "orbComplexity" | "orbFluidity" | "orbIridescence" | "promptText"
    >
  >
) => setState(() => patch);

const loadCreationPreset = (item: GeneratedCreation) =>
  setState(() => ({
    promptText: item.prompt,
    orbComplexity: item.params.orbComplexity,
    orbFluidity: item.params.orbFluidity,
    orbIridescence: item.params.orbIridescence,
  }));

const generateNewCreation = () =>
  setState((s) => {
    const gradients = [
      "from-indigo-400 via-fuchsia-300 to-cyan-300",
      "from-rose-400 via-amber-200 to-sky-300",
      "from-emerald-300 via-cyan-300 to-indigo-400",
    ];
    const ior = (1.3 + s.orbIridescence * 0.004).toFixed(2);
    const item: GeneratedCreation = {
      id: `GEN-${Date.now()}`,
      title: s.promptText.trim().slice(0, 42) || `Optical Preset ${s.creations.length + 1}`,
      prompt: s.promptText || "Custom Liquid Glass Synthesis",
      refractionIndex: `${ior} IOR`,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      gradient: gradients[s.creations.length % gradients.length],
      params: {
        orbComplexity: s.orbComplexity,
        orbFluidity: s.orbFluidity,
        orbIridescence: s.orbIridescence,
      },
    };
    return { creations: [item, ...s.creations.slice(0, 6)] };
  });

const deleteCreationPreset = (id: string) =>
  setState((s) => ({ creations: s.creations.filter((item) => item.id !== id) }));

const applyEqPreset = (preset: EqPreset) => {
  const profiles: Record<EqPreset, number[]> = {
    FLAT: [0, 0, 0, 0, 0],
    WARM: [3, 2, 0, -1, -2],
    CLARITY: [-2, -1, 1.5, 3, 1.5],
    CINEMATIC: [2.5, 1.5, 0, 1.5, 2.5],
  };
  setState((s) => ({
    eqBands: s.eqBands.map((band, index) => ({
      ...band,
      gainDb: profiles[preset][index],
    })),
  }));
};

const setAudioPlaying = (playing: boolean) =>
  setState(() => ({ isAudioPlaying: playing }));

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

const deleteTask = (id: string) =>
  setState((s) => ({ tasks: s.tasks.filter((task) => task.id !== id) }));

const addTask = (titleText: string) =>
  setState((s) => {
    if (!titleText.trim()) return {};
    const newTask: SpatialTask = {
      id: `TSK-${Date.now()}`,
      title: { fa: titleText, en: titleText },
      tag: "CUSTOM",
      status: "TODO",
    };
    return { tasks: [newTask, ...s.tasks].slice(0, 100) };
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
    loadCreationPreset,
    generateNewCreation,
    setAudioPlaying,
    updateEqBand,
    resetEqBands,
    cycleTaskStatus,
    deleteTask,
    addTask,
    hydrateLuminaPreferences,
    deleteCreationPreset,
    applyEqPreset,
  };
}