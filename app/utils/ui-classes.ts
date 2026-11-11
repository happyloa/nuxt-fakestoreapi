// Class strings shared by several components (auto-imported).

// Form fields: placeholder text and field edges keep WCAG contrast
// (4.5:1 for text, 3:1 for the control's edge).
export const FIELD_LABEL_CLASS =
  "mb-2 block text-xs font-semibold tracking-[0.04em] text-slate-600 dark:text-slate-300";

export const FIELD_CONTROL_CLASS =
  "w-full min-h-12 border border-slate-500 bg-white/70 px-4 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-500 hover:border-slate-700 focus:border-slate-900 focus-visible:outline-offset-0 dark:border-slate-500 dark:bg-slate-900 dark:text-paper dark:placeholder:text-slate-400 dark:hover:border-slate-300 dark:focus:border-paper";

/** Underlined tab or nav item; the active one gets the rust underline. */
export function tabClass(active: boolean): string {
  return active
    ? "text-slate-900 underline decoration-brand decoration-2 dark:text-paper dark:decoration-brand-light"
    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-paper";
}

/** Text link with a heavy underline, used for primary inline calls to action. */
export const UNDERLINE_LINK_CLASS =
  "group inline-flex items-center gap-3 border-b-2 border-slate-900 pb-1.5 text-[15px] font-bold hover:border-brand hover:text-brand dark:border-paper dark:hover:border-brand-light dark:hover:text-brand-light";
