import { Area } from "@ant-design/charts";

export function DashboardPage() {

  const axes = [
    { date: '2024-06-01', spend: 18400 },
    { date: '2024-07-01', spend: 21200 },
    { date: '2024-08-01', spend: 19800 },
    { date: '2024-09-01', spend: 23100 },
    { date: '2024-10-01', spend: 25600 },
    { date: '2024-11-01', spend: 31200 },
    { date: '2024-12-01', spend: 38400 },
    { date: '2025-01-01', spend: 22100 },
    { date: '2025-02-01', spend: 20300 },
    { date: '2025-03-01', spend: 24700 },
    { date: '2025-04-01', spend: 27900 },
    { date: '2025-05-01', spend: 29500 },
  ];

  const data = axes.map(d => ({ ...d, date: new Date(d.date) }));

  const config = {
    data,
    encode: {
      x: 'date',
      y: 'spend',
    },
    scale: {
      x: { type: 'time' },
      y: {
        tickCount: 5,
        labelFormatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
      },
    },
    style: {
      fill: '#378ADD',
      fillOpacity: 0.15,
      stroke: '#378ADD',
      lineWidth: 2,
    },
    tooltip: {
      items: [
        {
          channel: 'y',
          name: 'Spend',
          valueFormatter: (v: number) => `$${v.toLocaleString()}`,
        },
      ],
    },
  };

  return (
    <div className="text-zinc-950">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 max-w-2xl ">
        Overview of budget
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
      <Area {...config} />
    </div>
  );
}

