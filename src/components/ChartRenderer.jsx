import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#1d4ed8",
  "#0ea5e9",
  "#14b8a6",
  "#7c3aed",
  "#93c5fd",
];

function ChartRenderer({ chart, fullHeight = false }) {
  if (!chart) return null;

  if (chart.type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chart.data}
            dataKey={chart.dataKey}
            nameKey="name"
            cx="50%"
            cy="46%"
            innerRadius={fullHeight ? 100 : 70}
            outerRadius={fullHeight ? 150 : 105}
            paddingAngle={4}
          >
            {chart.data.map((entry, index) => (
              <Cell
                key={`${chart.id}-${entry.name}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={44} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === "area") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chart.data} margin={{ top: 10, right: 16, left: 0, bottom: 36 }}>
          <defs>
            <linearGradient id={`gradient-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chart.color} stopOpacity={0.42} />
              <stop offset="95%" stopColor={chart.color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-25} textAnchor="end" height={56} interval={0} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={chart.dataKey}
            stroke={chart.color}
            fill={`url(#gradient-${chart.id})`}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chart.data} margin={{ top: 10, right: 16, left: 0, bottom: 52 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} interval={0} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey={chart.dataKey} fill={chart.color} radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChartRenderer;
