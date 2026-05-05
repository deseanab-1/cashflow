export function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-3 max-w-2xl text-slate-300">
        Scaffold page. Add categories/accounts management and profile settings.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="font-medium">Categories</div>
          <div className="mt-1 text-sm text-slate-300">
            Add/edit/remove budget categories.
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="font-medium">Accounts</div>
          <div className="mt-1 text-sm text-slate-300">
            Add/edit checking/credit/cash accounts.
          </div>
        </div>
      </div>
    </div>
  );
}

