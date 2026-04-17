import styled from "styled-components";
import ChartTile from "../components/ChartTile.jsx";
import FileUploader from "../components/FileUploader.jsx";
import MetricCard from "../components/MetricCard.jsx";

const Page = styled.main`
  width: min(1280px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 22px 0 44px;
`;

const ErrorBanner = styled.p`
  margin: 0;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(180, 35, 24, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
`;

const MetricsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 18px;
`;

const SectionHeading = styled.h2`
  margin: 28px 0 12px;
  font-size: 1.2rem;
`;

const ChartsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const InsightsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 14px;
  margin-top: 16px;
`;

const InsightCard = styled.article`
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(255, 255, 255, 0.88);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const InsightTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 1rem;
`;

const InsightText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.55;
  font-size: 0.94rem;
`;

const EmptyState = styled.section`
  margin-top: 16px;
  display: grid;
  gap: 16px;
  justify-items: center;
`;

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

function DashboardPage({ dashboardData, errorMessage, fileName, onFileUpload }) {
  const metrics = dashboardData
    ? [
        {
          label: "Total de Negociações",
          value: dashboardData.summary.totalLeads.toLocaleString("pt-BR"),
        },
        {
          label: "Valor Único",
          value: formatCurrency(dashboardData.summary.totalOneTime),
        },
        {
          label: "Receita Recorrente",
          value: formatCurrency(dashboardData.summary.totalRecurring),
        },
        {
          label: "Ticket Recorrente Médio",
          value: formatCurrency(dashboardData.summary.averageTicket),
        },
        {
          label: "Etapas Ativas",
          value: dashboardData.summary.activeStages.toLocaleString("pt-BR"),
        },
        {
          label: "Estados Ativos",
          value: dashboardData.summary.activeStates.toLocaleString("pt-BR"),
        },
        {
          label: "Negociações com Ação Rápida",
          value: dashboardData.summary.actionableLeads.toLocaleString("pt-BR"),
        },
        {
          label: "Negociações Quentes",
          value: dashboardData.summary.hotLeadCount.toLocaleString("pt-BR"),
        },
        {
          label: "Sem Próxima Ação",
          value: dashboardData.summary.missingNextActionCount.toLocaleString("pt-BR"),
        },
        {
          label: "Saúde do CRM",
          value: `${dashboardData.summary.crmCoverageScore}%`,
        },
      ]
    : [];

  const insights = dashboardData
    ? [
        {
          title: "Prioridade comercial",
          text: `${dashboardData.summary.hotLeadCount} negociações já estão em Quente ou Venda certa. Esse é o grupo mais natural para virar fila de ação imediata.`,
        },
        {
          title: "Gargalo operacional",
          text: `${dashboardData.summary.missingNextActionCount} negociações estão sem próxima ação cadastrada. Isso normalmente vale um quadro próprio de follow-up.`,
        },
        {
          title: "Leitura do CRM",
          text: `A cobertura média dos campos-chave ficou em ${dashboardData.summary.crmCoverageScore}%. Telefone está forte, mas email, temperatura nativa e próxima ação ainda têm espaço.`,
        },
      ]
    : [];

  return (
    <Page>
      {dashboardData ? (
        <>
          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}

          <MetricsGrid>
            {metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </MetricsGrid>

          <InsightsGrid>
            {insights.map((insight) => (
              <InsightCard key={insight.title}>
                <InsightTitle>{insight.title}</InsightTitle>
                <InsightText>{insight.text}</InsightText>
              </InsightCard>
            ))}
          </InsightsGrid>

          <SectionHeading>Explorar gráficos</SectionHeading>
          <ChartsGrid>
            {dashboardData.charts.map((chart) => (
              <ChartTile key={chart.id} chart={chart} />
            ))}
          </ChartsGrid>
        </>
      ) : (
        <EmptyState>
          <FileUploader fileName={fileName} onChange={onFileUpload} variant="dropzone" />
          {errorMessage && <ErrorBanner>{errorMessage}</ErrorBanner>}
        </EmptyState>
      )}
    </Page>
  );
}

export default DashboardPage;
