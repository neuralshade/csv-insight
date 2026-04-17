import { useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./App.css"; // Mantemos a importação, mas a estilização principal será inline para facilitar

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#ff7300",
];

function App() {
  const [stats, setStats] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("Failed to parse the CSV file.");
      },
    });
  };

  const processData = (data) => {
    let totalOneTime = 0;
    let totalRecurring = 0;
    let leadsByStage = {};
    let leadsByState = {};

    data.forEach((row) => {
      // Parse values (Handling potential empty or missing values)
      const oneTimeValue = parseFloat(row["Valor Único"]) || 0;
      const recurringValue = parseFloat(row["Valor Recorrente"]) || 0;

      totalOneTime += oneTimeValue;
      totalRecurring += recurringValue;

      // Group by Stage (Etapa)
      const stage = row["Etapa"] || "Unknown Stage";
      leadsByStage[stage] = (leadsByStage[stage] || 0) + 1;

      // Group by State (Estado - e.g., "Em Andamento")
      const state = row["Estado"] || "Unknown State";
      leadsByState[state] = (leadsByState[state] || 0) + 1;
    });

    // Format data for Recharts
    const stageDataChart = Object.keys(leadsByStage).map((key) => ({
      name: key,
      count: leadsByStage[key],
    }));

    const stateDataChart = Object.keys(leadsByState).map((key) => ({
      name: key,
      count: leadsByState[key],
    }));

    setStats({
      totalLeads: data.length,
      totalOneTime,
      totalRecurring,
      stageDataChart,
      stateDataChart,
    });
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "#333",
      }}
    >
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ color: "#1a1a1a", margin: "0 0 10px 0" }}>
          Sales Pipeline Dashboard
        </h1>
        <p style={{ color: "#666", margin: "0 0 20px 0" }}>
          Upload your CRM deal export to view key metrics.
        </p>

        {/* Upload Button */}
        <label
          style={{
            backgroundColor: "#646cff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          {fileName ? "Upload a different file" : "Upload CSV File"}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>
        {fileName && (
          <p style={{ fontSize: "0.9em", color: "#888", marginTop: "10px" }}>
            Loaded: {fileName}
          </p>
        )}
      </header>

      {stats && (
        <main>
          {/* Key Metrics Cards */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "20px",
                background: "#f9f9f9",
                borderRadius: "12px",
                border: "1px solid #eee",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1rem",
                  color: "#666",
                }}
              >
                Total Leads
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#1a1a1a",
                }}
              >
                {stats.totalLeads}
              </p>
            </div>
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "20px",
                background: "#f9f9f9",
                borderRadius: "12px",
                border: "1px solid #eee",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1rem",
                  color: "#666",
                }}
              >
                Total One-time Value
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#00C49F",
                }}
              >
                $
                {stats.totalOneTime.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "20px",
                background: "#f9f9f9",
                borderRadius: "12px",
                border: "1px solid #eee",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "1rem",
                  color: "#666",
                }}
              >
                Total Recurring Value
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#0088FE",
                }}
              >
                $
                {stats.totalRecurring.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {/* Bar Chart: Leads by Stage */}
            <div
              style={{
                flex: "2",
                minWidth: "400px",
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #eee",
                height: "400px",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#333" }}>
                Leads by Sales Stage
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={stats.stageDataChart}
                  margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip cursor={{ fill: "#f5f5f5" }} />
                  <Bar
                    dataKey="count"
                    name="Number of Leads"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Status Overview */}
            <div
              style={{
                flex: "1",
                minWidth: "300px",
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #eee",
                height: "400px",
              }}
            >
              <h3 style={{ marginTop: 0, color: "#333" }}>Current State</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={stats.stateDataChart}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="name"
                  >
                    {stats.stateDataChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltips />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
