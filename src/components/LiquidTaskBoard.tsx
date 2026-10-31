"use client";

import React, { useState } from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import { CheckCircle2, Circle, Clock, Plus } from "lucide-react";

export default function LiquidTaskBoard() {
  const { lang, theme, blurPx, tasks, cycleTaskStatus, addTask } =
    useLuminaStore();
  const [newTitle, setNewTitle] = useState("");

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle);
    setNewTitle("");
  };

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      style={{
        backdropFilter: `blur(${blurPx}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
      }}
      className={`${shellClass} rounded-[32px] p-5 md:p-7 space-y-5`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/25 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 border border-cyan-400/30">
            SPATIAL PRODUCTIVITY WORKFLOW
          </span>
          <h2 className="text-lg md:text-2xl font-black mt-2">
            {lang === "fa"
              ? "برد مدیریت اسپرینت و تسک‌های مهندسی (Liquid Glass Kanban)"
              : "Liquid Glass Engineering Sprint & Task Flow"}
          </h2>
        </div>

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={
              lang === "fa"
                ? "عنوان تسک جدید را بنویس..."
                : "Add new spatial task..."
            }
            className={`${btnClass} rounded-full px-4 py-2 text-xs focus:outline-none`}
          />
          <button
            type="submit"
            className="btn-liquid-primary px-4 py-2 rounded-full text-xs flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === "fa" ? "افزودن" : "Add"}</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["TODO", "DOING", "DONE"] as const).map((col) => {
          const colTasks = tasks.filter((t) => t.status === col);
          return (
            <div
              key={col}
              className="rounded-[24px] p-4 bg-white/10 border border-white/30 space-y-3"
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold">
                <span>
                  {col === "TODO"
                    ? lang === "fa"
                      ? "در صف انجام (BACKLOG)"
                      : "BACKLOG"
                    : col === "DOING"
                    ? lang === "fa"
                      ? "در حال اجرا (IN PROGRESS)"
                      : "IN PROGRESS"
                    : lang === "fa"
                    ? "تکمیل‌شده (COMPLETED)"
                    : "COMPLETED"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => cycleTaskStatus(t.id)}
                    className={`${btnClass} cursor-pointer rounded-2xl p-3.5 space-y-2`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 font-bold">
                        {t.tag}
                      </span>
                      <span className="opacity-65">Click to advance ➔</span>
                    </div>
                    <div className="text-xs font-bold leading-relaxed flex items-start gap-2">
                      {col === "DONE" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : col === "DOING" ? (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      )}
                      <span>{t.title[lang]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}