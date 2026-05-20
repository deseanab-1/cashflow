export function DashboardPage() {
  return (
    <div className="text-zinc-950">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 max-w-2xl ">
        Scaffold page. Add month summary, category breakdown, and trends here.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3 ">
        {[
          { title: "Cashflow", desc: "Income vs spending for the month" },
          { title: "Top categories", desc: "Where you spend most" },
          { title: "Remaining", desc: "Budget remaining by category" },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-xl border border-white/10 bg-white/5 p-4 "
          >
            <div className="font-medium">{c.title}</div>
            <div className="mt-1 text-sm text-zinc-950">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

