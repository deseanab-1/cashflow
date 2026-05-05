export function TransactionsPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Scaffold page. Add filters, table, and create/edit transaction forms.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400">
          Add transaction
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-4 gap-0 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
          <div>Date</div>
          <div>Category</div>
          <div>Account</div>
          <div className="text-right">Amount</div>
        </div>
        <div className="px-4 py-6 text-sm text-slate-300">
          No transactions yet.
        </div>
      </div>
    </div>
  );
}

