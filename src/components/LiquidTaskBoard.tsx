"use client";

import React, { useState } from "react";
import { useLuminaStore } from "../store/useLuminaStore";
import { CheckCircle2, Circle, Clock, Plus, Trash2, Workflow } from "lucide-react";

export default function LiquidTaskBoard() {
  const { lang, theme, blurPx, tasks, cycleTaskStatus, deleteTask, addTask } =
    useLuminaStore();
  const [newTitle, setNewTitle] = useState("");

  const isLight = theme === "PEARL";
  const shellClass = isLight ? "liquid-shell-light" : "liquid-shell-dark";
  const btnClass = isLight ? "btn-liquid-light" : "btn-liquid-dark";
  const doneCount = tasks.filter((task) => task.status === "DONE").length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim());
    setNewTitle("");
  };

  const columns = [
    { id: "TODO" as const, fa: "در صف انجام", en: "Backlog", icon: Circle },
    { id: "DOING" as const, fa: "در حال انجام", en: "In progress", icon: Clock },
    { id: "DONE" as const, fa: "تکمیل‌شده", en: "Completed", icon: CheckCircle2 },
  ];

  return (
    <section
      dir={lang === "fa" ? "rtl" : "ltr"}
      style={{
        backdropFilter: `blur(${blurPx}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(190%)`,
      }}
      className={`${shellClass} rounded-[32px] p-4 sm:p-5 md:p-7 space-y-5`}
    >
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/25 pb-5">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 border border-cyan-400/30">
            <Workflow className="w-3.5 h-3.5" />
            LOCAL WORKFLOW • SAVED IN THIS BROWSER
          </span>
          <h2 className="text-lg md:text-2xl font-black">
            {lang === "fa" ? "برد کارهای استودیوی LuminaGlass" : "LuminaGlass Studio Workflow"}
          </h2>
          <p className="max-w-2xl text-xs opacity-70 leading-relaxed">
            {lang === "fa"
              ? "کارها را بین سه مرحله جابه‌جا کن؛ تغییرات در همین مرورگر ذخیره می‌شوند و به حساب ابری یا سرور ارسال نمی‌شوند."
              : "Move work through three stages. Changes are stored in this browser only—no cloud account or server is involved."}
          </p>
        </div>

        <div className="min-w-[190px] rounded-2xl border border-white/25 bg-white/10 p-3">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span>{lang === "fa" ? "پیشرفت کارها" : "Workflow progress"}</span>
            <strong>{progress}%</strong>
          </div>
          <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-[10px] opacity-65">
            {doneCount} / {tasks.length} {lang === "fa" ? "تکمیل‌شده" : "completed"}
          </div>
        </div>
      </header>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-stretch gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          maxLength={120}
          placeholder={lang === "fa" ? "یک کار جدید برای استودیو بنویس..." : "Add a studio task..."}
          aria-label={lang === "fa" ? "عنوان کار جدید" : "New task title"}
          className={`${btnClass} flex-1 min-w-0 rounded-full px-4 py-3 text-xs focus:outline-none`}
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="btn-liquid-primary px-5 py-3 rounded-full text-xs flex items-center justify-center gap-1.5 disabled:opacity-45"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === "fa" ? "افزودن کار" : "Add task"}</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);
          const Icon = column.icon;
          return (
            <section key={column.id} className="min-w-0 rounded-[24px] p-3 sm:p-4 bg-white/10 border border-white/30 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Icon className="h-4 w-4 opacity-70" />
                  <h3>{lang === "fa" ? column.fa : column.en}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-600 text-[10px] font-mono font-bold">{columnTasks.length}</span>
              </div>

              <div className="space-y-2.5">
                {columnTasks.map((task) => (
                  <article key={task.id} className={`${btnClass} rounded-2xl p-3 space-y-2`}>
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => cycleTaskStatus(task.id)}
                        aria-label={lang === "fa" ? `تغییر وضعیت کار: ${task.title.fa}` : `Advance task: ${task.title.en}`}
                        className="min-w-0 flex-1 text-start"
                      >
                        <span className="flex items-center justify-between gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 font-bold">{task.tag}</span>
                          <span className="opacity-60">{lang === "fa" ? "تغییر مرحله ←" : "Advance →"}</span>
                        </span>
                        <span className="mt-2 block text-xs font-bold leading-relaxed">{task.title[lang]}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={lang === "fa" ? "حذف کار" : "Delete task"}
                        className="shrink-0 rounded-lg p-1.5 opacity-55 hover:opacity-100 hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
                {columnTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/30 p-4 text-center text-[10px] opacity-55">
                    {lang === "fa" ? "هنوز کاری در این مرحله نیست." : "Nothing in this stage yet."}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
