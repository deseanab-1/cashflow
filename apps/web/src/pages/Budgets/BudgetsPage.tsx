export function BudgetsPage() {
  return (
    <div className="text-zinc-950">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Budgets</h1>
          <p className="mt-3 max-w-2xl">
            Scaffold page. Add per-category monthly limits and “remaining” views.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">
          Set budgets
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-950">
        Choose a month and set category limits.
      </div>
    </div>
  );
}

