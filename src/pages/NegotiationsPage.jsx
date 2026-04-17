import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import styled from "styled-components";

const Page = styled.main`
  width: min(1280px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 22px 0 40px;
`;

const Hero = styled.section`
  display: grid;
  gap: 10px;
  padding: 20px;
  margin-bottom: 18px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    radial-gradient(circle at top right, rgba(15, 118, 110, 0.14), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(242, 247, 255, 0.88) 100%);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.55rem, 3vw, 2.25rem);
`;

const Description = styled.p`
  margin: 0;
  max-width: 64ch;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.55;
  font-size: 0.96rem;
`;

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
`;

const FiltersBar = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(255, 255, 255, 0.84);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const FilterField = styled.label`
  display: grid;
  gap: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

const Select = styled.select`
  min-height: 40px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: white;
`;

const SearchInput = styled.input`
  min-height: 40px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: white;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

const StatCard = styled.article`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(255, 255, 255, 0.82);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 10px;
`;

const StatValue = styled.strong`
  font-size: 1.45rem;
`;

const SectionTitle = styled.h2`
  margin: 22px 0 12px;
  font-size: 1.12rem;
`;

const CategoryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
`;

const CategoryCard = styled.article`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(255, 248, 239, 0.88);
`;

const CategoryList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 10px;
`;

const CategoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;

const LeadGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
  margin-top: 12px;
`;

const PriorityGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
`;

const PriorityCard = styled(Link)`
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 24%),
    rgba(255, 255, 255, 0.94);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const PriorityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
`;

const PriorityValue = styled.strong`
  color: ${({ theme }) => theme.colors.accentDeep};
`;

const LeadCard = styled(Link)`
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(255, 255, 255, 0.92);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const LeadHeader = styled.div`
  display: grid;
  gap: 8px;
`;

const LeadName = styled.h3`
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.3;
`;

const LeadMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.92rem;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Badge = styled.span`
  padding: 6px 9px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  color: ${({ theme }) => theme.colors.accentDeep};
  font-size: 0.82rem;
  font-weight: 700;
`;

const LeadFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`;

function NegotiationsPage({ dashboardData }) {
  const leads = useMemo(() => dashboardData?.leads || [], [dashboardData]);
  const leadCollections = useMemo(
    () =>
      dashboardData?.leadCollections || {
        byStage: [],
        bySource: [],
        byQualification: [],
        crmCoverage: [],
        topHotLeads: [],
      },
    [dashboardData],
  );
  const [stageFilter, setStageFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [onlyMissingNextAction, setOnlyMissingNextAction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filterOptions = useMemo(
    () => ({
      stages: leadCollections.byStage.map((item) => item.name),
      sources: leadCollections.bySource.map((item) => item.name),
      qualification: leadCollections.byQualification.map((item) => item.name),
    }),
    [leadCollections],
  );

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        if (stageFilter !== "all" && lead.stage !== stageFilter) return false;
        if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
        if (qualificationFilter !== "all" && lead.qualificationLabel !== qualificationFilter) {
          return false;
        }
        if (onlyMissingNextAction && lead.nextTaskDate) return false;

        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (!normalizedSearch) return true;

        return [
          lead.name,
          lead.contactName,
          lead.phone,
          lead.email,
          lead.source,
          lead.stage,
        ].some((value) => String(value ?? "").toLowerCase().includes(normalizedSearch));
      }),
    [leads, onlyMissingNextAction, qualificationFilter, searchTerm, sourceFilter, stageFilter],
  );

  const filteredHotLeads = useMemo(
    () =>
      leadCollections.topHotLeads.filter((lead) =>
        filteredLeads.some((filteredLead) => filteredLead.id === lead.id),
      ),
    [filteredLeads, leadCollections.topHotLeads],
  );

  if (!dashboardData) {
    return <Navigate to="/" replace />;
  }

  const stats = [
    {
      label: "Total de negociações",
      value: filteredLeads.length.toLocaleString("pt-BR"),
    },
    {
      label: "Negociações com ação rápida",
      value: filteredLeads
        .filter((lead) => lead.primaryAction)
        .length.toLocaleString("pt-BR"),
    },
    {
      label: "Etapas mapeadas",
      value: new Set(filteredLeads.map((lead) => lead.stage)).size.toLocaleString("pt-BR"),
    },
    {
      label: "Fontes identificadas",
      value: new Set(filteredLeads.map((lead) => lead.source)).size.toLocaleString("pt-BR"),
    },
    {
      label: "Negociações quentes",
      value: filteredLeads
        .filter((lead) => (lead.qualification || 0) >= 4)
        .length.toLocaleString("pt-BR"),
    },
    {
      label: "Sem próxima ação",
      value: filteredLeads
        .filter((lead) => !lead.nextTaskDate)
        .length.toLocaleString("pt-BR"),
    },
  ];

  const categorySections = [
    { title: "Por etapa", items: leadCollections.byStage },
    { title: "Por fonte", items: leadCollections.bySource },
    { title: "Por qualificação", items: leadCollections.byQualification },
    { title: "Cobertura CRM", items: leadCollections.crmCoverage },
  ];

  return (
    <Page>
      <StatsGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue>{stat.value}</StatValue>
          </StatCard>
        ))}
      </StatsGrid>

      <FiltersBar>
        <FilterField>
          Buscar negociação
          <SearchInput
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nome, telefone, email..."
          />
        </FilterField>

        <FilterField>
          Etapa
          <Select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
            <option value="all">Todas</option>
            {filterOptions.stages.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FilterField>

        <FilterField>
          Fonte
          <Select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
            <option value="all">Todas</option>
            {filterOptions.sources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FilterField>

        <FilterField>
          Temperatura
          <Select
            value={qualificationFilter}
            onChange={(event) => setQualificationFilter(event.target.value)}
          >
            <option value="all">Todas</option>
            {filterOptions.qualification.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FilterField>

        <ToggleLabel>
          <input
            type="checkbox"
            checked={onlyMissingNextAction}
            onChange={(event) => setOnlyMissingNextAction(event.target.checked)}
          />
          Mostrar apenas negociações sem próxima ação
        </ToggleLabel>
      </FiltersBar>

      <SectionTitle>Categorias que o CSV já suporta</SectionTitle>
      <CategoryGrid>
        {categorySections.map((section) => (
          <CategoryCard key={section.title}>
            <strong>{section.title}</strong>
            <CategoryList>
              {section.items.map((item) => (
                <CategoryRow key={`${section.title}-${item.name}`}>
                  <span>{item.name}</span>
                  <strong>
                    {section.title === "Cobertura CRM"
                      ? `${item.value}/${item.total}`
                      : item.value}
                  </strong>
                </CategoryRow>
              ))}
            </CategoryList>
          </CategoryCard>
        ))}
      </CategoryGrid>

      {filteredHotLeads.length > 0 && (
        <>
          <SectionTitle>Negociações mais quentes</SectionTitle>
          <PriorityGrid>
            {filteredHotLeads.map((lead) => (
              <PriorityCard key={lead.id} to={`/negotiations/${lead.id}`}>
                <PriorityHeader>
                  <LeadName>{lead.name}</LeadName>
                  <PriorityValue>{lead.qualificationLabel}</PriorityValue>
                </PriorityHeader>
                <LeadMeta>
                  {lead.stage} • {lead.source}
                </LeadMeta>
                <LeadFooter>
                  <span>{lead.phone || "Sem telefone"}</span>
                  <strong>
                    {lead.recurringValue > 0
                      ? lead.recurringValue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "Sem receita"}
                  </strong>
                </LeadFooter>
              </PriorityCard>
            ))}
          </PriorityGrid>
        </>
      )}

      <SectionTitle>Todas as negociações</SectionTitle>
      <LeadGrid>
        {filteredLeads.map((lead) => (
          <LeadCard key={lead.id} to={`/negotiations/${lead.id}`}>
            <LeadHeader>
              <LeadName>{lead.name}</LeadName>
              <LeadMeta>
                {lead.contactName}
                {lead.owner ? ` • ${lead.owner}` : ""}
              </LeadMeta>
            </LeadHeader>

            <BadgeRow>
              <Badge>{lead.stage}</Badge>
              <Badge>{lead.source}</Badge>
              <Badge>{lead.qualificationLabel}</Badge>
            </BadgeRow>

            <LeadFooter>
              <span>{lead.phone || lead.email || "Sem contato direto"}</span>
              <strong>{lead.state}</strong>
            </LeadFooter>
          </LeadCard>
        ))}
      </LeadGrid>
    </Page>
  );
}

export default NegotiationsPage;
