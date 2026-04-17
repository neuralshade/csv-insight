import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDashboardData,
  getQualificationLabel,
  normalizeCsvText,
  parseCurrencyValue,
} from "./analytics.js";

test("normalizeCsvText removes sep line and BOM", () => {
  const raw = "\uFEFFsep=,\nNome,Etapa,Estado\nLead,Negociação,Em Andamento\n";
  const normalized = normalizeCsvText(raw);

  assert.equal(normalized.startsWith("Nome,Etapa,Estado"), true);
  assert.equal(normalized.includes("sep=,"), false);
});

test("getQualificationLabel maps business labels", () => {
  assert.equal(getQualificationLabel(1), "Muito frio");
  assert.equal(getQualificationLabel(5), "Venda certa");
  assert.equal(getQualificationLabel(42), "Não classificado");
});

test("parseCurrencyValue handles localized formats", () => {
  assert.equal(parseCurrencyValue("1.234,56"), 1234.56);
  assert.equal(parseCurrencyValue("R$ 259,00"), 259);
  assert.equal(parseCurrencyValue(""), 0);
});

test("buildDashboardData builds commercial metrics from rows", () => {
  const rows = [
    {
      Nome: "Lead Frio",
      Contatos: "Lead Frio",
      Etapa: "Qualificado — Descoberta da dor",
      Estado: "Em Andamento",
      Fonte: "Redes Sociais",
      Qualificação: "1",
      "Valor Único": "0",
      "Valor Recorrente": "0",
      Telefone: "+5511999999999",
      Email: "",
      "Data da próxima tarefa": "",
      "Temperatura do lead": "",
      Responsável: "Equipe A",
    },
    {
      Nome: "Lead Quente",
      Contatos: "Lead Quente",
      Etapa: "Negociação",
      Estado: "Em Andamento",
      Fonte: "Indicação",
      Qualificação: "4",
      "Valor Único": "0",
      "Valor Recorrente": "259,00",
      Telefone: "+5511888888888",
      Email: "quente@teste.com",
      "Data da próxima tarefa": "18/04/2026",
      "Temperatura do lead": "",
      Responsável: "Equipe A",
    },
  ];

  const dashboardData = buildDashboardData(rows);

  assert.equal(dashboardData.summary.totalLeads, 2);
  assert.equal(dashboardData.summary.hotLeadCount, 1);
  assert.equal(dashboardData.summary.missingNextActionCount, 1);
  assert.equal(dashboardData.summary.totalRecurring, 259);
  assert.deepEqual(
    dashboardData.leadCollections.byQualification.map((item) => item.name),
    ["Muito frio", "Quente"],
  );
  assert.equal(dashboardData.leadCollections.topHotLeads[0].name, "Lead Quente");
});
