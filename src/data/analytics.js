export const EXPECTED_COLUMNS = ["Etapa", "Estado"];

export const QUALIFICATION_LABELS = {
  1: "Muito frio",
  2: "Frio",
  3: "Morno",
  4: "Quente",
  5: "Venda certa",
};

export const normalizeCsvText = (text) =>
  text.replace(/^\uFEFF/, "").replace(/^sep=.*,?\r?\n/i, "");

export const parseCurrencyValue = (value) => {
  if (value == null) return 0;

  const normalized = String(value)
    .trim()
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsedValue = Number.parseFloat(normalized);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const slugify = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const sanitizePhone = (phone) => String(phone ?? "").replace(/[^\d+]/g, "");

export const getQualificationLabel = (qualification) =>
  QUALIFICATION_LABELS[qualification] || "Não classificado";

export const normalizeLead = (row, index) => {
  const name = String(row["Nome"] || row["Contatos"] || `Lead ${index + 1}`).trim();
  const contactName = String(row["Contatos"] || name).trim();
  const email = String(row["Email"] || "").trim();
  const phone = sanitizePhone(row["Telefone"]);
  const stage = String(row["Etapa"] || "Etapa não informada").trim();
  const source = String(row["Fonte"] || "Fonte não informada").trim();
  const state = String(row["Estado"] || "Estado não informado").trim();
  const qualification = Number.parseInt(String(row["Qualificação"] || "").trim(), 10);
  const qualificationLabel = Number.isNaN(qualification)
    ? "Não classificado"
    : getQualificationLabel(qualification);
  const recurringValue = parseCurrencyValue(row["Valor Recorrente"]);
  const oneTimeValue = parseCurrencyValue(row["Valor Único"]);
  const createdDate = String(row["Data de criação"] || "").trim();
  const nextTaskDate = String(row["Data da próxima tarefa"] || "").trim();
  const leadId = `${slugify(name || contactName || `lead-${index + 1}`)}-${index + 1}`;
  const categories = [
    stage,
    source,
    state,
    qualificationLabel,
    recurringValue > 0 || oneTimeValue > 0 ? "Com valor" : "Sem valor",
  ];

  let primaryAction = null;

  if (phone) {
    primaryAction = {
      label: "Chamar no WhatsApp",
      href: `https://wa.me/${phone.replace(/^\+/, "")}`,
    };
  } else if (email) {
    primaryAction = {
      label: "Enviar email",
      href: `mailto:${email}`,
    };
  }

  return {
    id: leadId,
    name,
    contactName,
    company: String(row["Empresa"] || "").trim(),
    qualification: Number.isNaN(qualification) ? null : qualification,
    qualificationLabel,
    pipeline: String(row["Funil de vendas"] || "").trim(),
    stage,
    state,
    lossReason: String(row["Motivo de Perda"] || "").trim(),
    oneTimeValue,
    recurringValue,
    paused: String(row["Pausada"] || "").trim(),
    createdDate,
    createdTime: String(row["Hora de criação"] || "").trim(),
    firstContactDate: String(row["Data do primeiro contato"] || "").trim(),
    firstContactTime: String(row["Hora do primeiro contato"] || "").trim(),
    lastContactDate: String(row["Data do último contato"] || "").trim(),
    lastContactTime: String(row["Hora do último contato"] || "").trim(),
    nextTaskDate,
    nextTaskTime: String(row["Hora da próxima tarefa"] || "").trim(),
    forecastCloseDate: String(row["Previsão de fechamento"] || "").trim(),
    closedDate: String(row["Data de fechamento"] || "").trim(),
    closedTime: String(row["Hora de fechamento"] || "").trim(),
    source,
    campaign: String(row["Campanha"] || "").trim(),
    owner: String(row["Responsável"] || "").trim(),
    products: String(row["Produtos"] || "").trim(),
    ownerTeams: String(row["Equipes do responsável"] || "").trim(),
    lossNotes: String(row["Anotação do motivo de perda"] || "").trim(),
    budget: String(row["Budget"] || "").trim(),
    temperature: String(row["Temperatura do lead"] || "").trim(),
    email,
    phone,
    role: String(row["Cargo"] || "").trim(),
    primaryAction,
    categories,
    raw: row,
  };
};

export const buildCountChartData = (rows, fieldName, fallbackLabel) =>
  Object.entries(
    rows.reduce((accumulator, row) => {
      const key = String(row[fieldName] || fallbackLabel).trim() || fallbackLabel;
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((first, second) => second.value - first.value);

export const buildLeadCountChartData = (leads, selector, fallbackLabel) =>
  Object.entries(
    leads.reduce((accumulator, lead) => {
      const key = String(selector(lead) || fallbackLabel).trim() || fallbackLabel;
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((first, second) => second.value - first.value);

export const buildAverageQualificationByStage = (leads) =>
  Object.entries(
    leads.reduce((accumulator, lead) => {
      if (lead.qualification == null) return accumulator;
      accumulator[lead.stage] ??= { total: 0, count: 0 };
      accumulator[lead.stage].total += lead.qualification;
      accumulator[lead.stage].count += 1;
      return accumulator;
    }, {}),
  )
    .map(([name, value]) => ({
      name,
      value: Number((value.total / value.count).toFixed(2)),
    }))
    .sort((first, second) => second.value - first.value);

export const buildHotLeadsBySource = (leads) =>
  Object.entries(
    leads.reduce((accumulator, lead) => {
      if ((lead.qualification || 0) < 4) return accumulator;
      accumulator[lead.source] = (accumulator[lead.source] || 0) + 1;
      return accumulator;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((first, second) => second.value - first.value);

export const buildDashboardData = (rows) => {
  const leads = rows.map(normalizeLead);
  const totalOneTime = rows.reduce(
    (sum, row) => sum + parseCurrencyValue(row["Valor Único"]),
    0,
  );
  const totalRecurring = rows.reduce(
    (sum, row) => sum + parseCurrencyValue(row["Valor Recorrente"]),
    0,
  );
  const stageData = buildCountChartData(rows, "Etapa", "Etapa não informada");
  const stateData = buildCountChartData(rows, "Estado", "Estado não informado");
  const ownerData = buildCountChartData(
    rows,
    "Responsável",
    "Responsável não informado",
  ).slice(0, 8);
  const sourceData = buildCountChartData(rows, "Fonte", "Fonte não informada").slice(
    0,
    8,
  );
  const qualificationData = buildLeadCountChartData(
    leads,
    (lead) => lead.qualificationLabel,
    "Não classificado",
  );
  const stageQualificationData = buildAverageQualificationByStage(leads);
  const hotLeadsBySource = buildHotLeadsBySource(leads);
  const hotLeads = leads.filter((lead) => (lead.qualification || 0) >= 4);
  const warmLeads = leads.filter((lead) => lead.qualification === 3);
  const missingNextAction = leads.filter((lead) => !lead.nextTaskDate);
  const recurringLeads = leads.filter((lead) => lead.recurringValue > 0);
  const crmCoverage = [
    {
      name: "Telefone",
      value: leads.filter((lead) => lead.phone).length,
      total: leads.length,
    },
    {
      name: "Email",
      value: leads.filter((lead) => lead.email).length,
      total: leads.length,
    },
    {
      name: "Próxima ação",
      value: leads.filter((lead) => lead.nextTaskDate).length,
      total: leads.length,
    },
    {
      name: "Temperatura CRM",
      value: leads.filter((lead) => lead.temperature).length,
      total: leads.length,
    },
  ];

  return {
    rows,
    leads,
    summary: {
      totalLeads: rows.length,
      totalOneTime,
      totalRecurring,
      activeStages: stageData.length,
      activeStates: stateData.length,
      averageTicket: rows.length ? totalRecurring / rows.length : 0,
      actionableLeads: leads.filter((lead) => lead.primaryAction).length,
      hotLeadCount: hotLeads.length,
      warmLeadCount: warmLeads.length,
      missingNextActionCount: missingNextAction.length,
      crmCoverageScore: leads.length
        ? Math.round(
            (crmCoverage.reduce((sum, item) => sum + item.value / item.total, 0) /
              crmCoverage.length) *
              100,
          )
        : 0,
    },
    charts: [
      {
        id: "etapas",
        title: "Negociações por etapa",
        description: "Entenda onde o funil está acumulando oportunidades.",
        type: "bar",
        data: stageData,
        color: "#2563eb",
        dataKey: "value",
      },
      {
        id: "estados",
        title: "Distribuição por estado",
        description: "Veja como a carteira está distribuída entre os estados atuais.",
        type: "pie",
        data: stateData,
        color: "#0f766e",
        dataKey: "value",
      },
      {
        id: "responsaveis",
        title: "Top responsáveis",
        description: "Compare rapidamente o volume de negociações por responsável.",
        type: "bar",
        data: ownerData,
        color: "#2563eb",
        dataKey: "value",
      },
      {
        id: "fontes",
        title: "Principais fontes",
        description: "Confira os canais que mais alimentam o pipeline.",
        type: "area",
        data: sourceData,
        color: "#7c3aed",
        dataKey: "value",
      },
      {
        id: "temperatura-comercial",
        title: "Temperatura comercial",
        description: "Mapa de muito frio até venda certa com base na qualificação do sistema.",
        type: "bar",
        data: qualificationData,
        color: "#1d4ed8",
        dataKey: "value",
      },
      {
        id: "qualificacao-por-etapa",
        title: "Qualificação média por etapa",
        description:
          "Mostra quais etapas concentram negociações mais quentes no pipeline.",
        type: "bar",
        data: stageQualificationData,
        color: "#0f766e",
        dataKey: "value",
      },
      {
        id: "fontes-quentes",
        title: "Fontes com mais negociações quentes",
        description:
          "Conta apenas as negociações classificadas como quente ou venda certa.",
        type: "bar",
        data: hotLeadsBySource,
        color: "#2563eb",
        dataKey: "value",
      },
    ],
    leadCollections: {
      byStage: buildCountChartData(rows, "Etapa", "Etapa não informada"),
      bySource: buildCountChartData(rows, "Fonte", "Fonte não informada"),
      byQualification: qualificationData,
      crmCoverage,
      topHotLeads: hotLeads
        .sort((first, second) => {
          if ((second.recurringValue || 0) !== (first.recurringValue || 0)) {
            return second.recurringValue - first.recurringValue;
          }
          return (second.qualification || 0) - (first.qualification || 0);
        })
        .slice(0, 8),
      recurringLeads,
    },
  };
};
