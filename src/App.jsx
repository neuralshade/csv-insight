import { useMemo, useState } from "react";
import Papa from "papaparse";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import ChartDetailPage from "./pages/ChartDetailPage.jsx";
import NegotiationsPage from "./pages/NegotiationsPage.jsx";
import NegotiationDetailPage from "./pages/NegotiationDetailPage.jsx";
import AppShell from "./components/AppShell.jsx";
import {
  EXPECTED_COLUMNS,
  buildDashboardData,
  normalizeCsvText,
} from "./data/analytics.js";

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const chartMap = useMemo(
    () =>
      new Map(
        (dashboardData?.charts || []).map((chartDefinition) => [
          chartDefinition.id,
          chartDefinition,
        ]),
      ),
    [dashboardData],
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setDashboardData(null);
    setErrorMessage("");

    file
      .text()
      .then((text) => {
        const normalizedText = normalizeCsvText(text);

        Papa.parse(normalizedText, {
          header: true,
          skipEmptyLines: true,
          delimiter: ",",
          transformHeader: (header) => header.trim(),
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error("CSV parsing warnings:", results.errors);
            }

            const validRows = results.data.filter(
              (row) =>
                row &&
                typeof row === "object" &&
                Object.values(row).some((value) => String(value ?? "").trim() !== ""),
            );

            if (validRows.length === 0) {
              setErrorMessage(
                "O CSV foi carregado, mas nao ha linhas validas para analisar.",
              );
              return;
            }

            const hasExpectedColumns = EXPECTED_COLUMNS.every((columnName) =>
              Object.prototype.hasOwnProperty.call(validRows[0], columnName),
            );

            if (!hasExpectedColumns) {
              setErrorMessage(
                "Estrutura de CSV nao reconhecida. Verifique se o arquivo contem as colunas Etapa e Estado.",
              );
              return;
            }

            setDashboardData(buildDashboardData(validRows));
            setErrorMessage("");
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setErrorMessage("Nao foi possivel ler o arquivo CSV.");
          },
        });
      })
      .catch((error) => {
        console.error("Error reading CSV:", error);
        setErrorMessage("Nao foi possivel abrir o arquivo selecionado.");
      });
  };

  return (
    <Routes>
      <Route element={<AppShell fileName={fileName} onFileUpload={handleFileUpload} />}>
        <Route
          path="/"
          element={
            <DashboardPage
              dashboardData={dashboardData}
              errorMessage={errorMessage}
              fileName={fileName}
              onFileUpload={handleFileUpload}
            />
          }
        />
        <Route
          path="/negotiations"
          element={
            <NegotiationsPage dashboardData={dashboardData} fileName={fileName} />
          }
        />
        <Route
          path="/negotiations/:leadId"
          element={
            <NegotiationDetailPage
              dashboardData={dashboardData}
              fileName={fileName}
            />
          }
        />
        <Route
          path="/grafico/:chartId"
          element={<ChartDetailPage chartMap={chartMap} fileName={fileName} />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
