import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import styled from "styled-components";

const Page = styled.main`
  width: min(1280px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 22px 0 40px;
`;

const TopBar = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  font-weight: 700;
`;

const Hero = styled.section`
  display: grid;
  gap: 12px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(242, 247, 255, 0.88) 100%);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.35rem);
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.55;
  font-size: 0.96rem;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 6px 10px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.accentDeep};
  font-weight: 700;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  font-weight: 700;
`;

const SecondaryAction = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: white;
  color: ${({ theme }) => theme.colors.ink};
  font-weight: 700;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin-top: 18px;
`;

const Card = styled.article`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(255, 255, 255, 0.92);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Label = styled.div`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Value = styled.div`
  font-weight: 700;
  line-height: 1.45;
  font-size: 0.96rem;
  word-break: break-word;
`;

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

function NegotiationDetailPage({ dashboardData }) {
  const { leadId } = useParams();

  if (!dashboardData) {
    return <Navigate to="/" replace />;
  }

  const lead = dashboardData.leads.find((entry) => entry.id === leadId);

  if (!lead) {
    return <Navigate to="/negotiations" replace />;
  }

  const infoCards = [
    { label: "Contato", value: lead.contactName || "Não informado" },
    { label: "Responsável", value: lead.owner || "Não informado" },
    { label: "Fonte", value: lead.source || "Não informada" },
    { label: "Etapa", value: lead.stage || "Não informada" },
    { label: "Estado", value: lead.state || "Não informado" },
    {
      label: "Qualificação",
      value:
        lead.qualification != null
          ? `${lead.qualification} • ${lead.qualificationLabel}`
          : "Não informada",
    },
    { label: "Telefone", value: lead.phone || "Não informado" },
    { label: "Email", value: lead.email || "Não informado" },
    { label: "Data de criação", value: lead.createdDate || "Não informada" },
    { label: "Próxima tarefa", value: lead.nextTaskDate || "Não informada" },
    { label: "Valor único", value: formatCurrency(lead.oneTimeValue) },
    { label: "Valor recorrente", value: formatCurrency(lead.recurringValue) },
  ];

  return (
    <Page>
      <TopBar>
        <BackButton
          to="/negotiations"
          aria-label="Voltar para negociações"
          title="Voltar para negociações"
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
        </BackButton>
      </TopBar>

      <Hero>
        <div>
          <Title>{lead.name}</Title>
          <Subtitle>
            {lead.pipeline || "Pipeline não informado"}
            {lead.company ? ` • ${lead.company}` : ""}
          </Subtitle>
        </div>

        <BadgeRow>
          {lead.categories.map((category) => (
            <Badge key={category}>{category}</Badge>
          ))}
        </BadgeRow>

        <ActionRow>
          {lead.primaryAction && (
            <ActionLink href={lead.primaryAction.href} target="_blank" rel="noreferrer">
              {lead.primaryAction.label}
            </ActionLink>
          )}
          {lead.email && (
            <SecondaryAction href={`mailto:${lead.email}`}>Abrir email</SecondaryAction>
          )}
          {lead.phone && (
            <SecondaryAction href={`tel:${lead.phone}`}>Ligar agora</SecondaryAction>
          )}
        </ActionRow>
      </Hero>

      <Grid>
        {infoCards.map((item) => (
          <Card key={item.label}>
            <Label>{item.label}</Label>
            <Value>{item.value}</Value>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}

export default NegotiationDetailPage;
