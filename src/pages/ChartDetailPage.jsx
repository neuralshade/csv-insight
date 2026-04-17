import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ChartRenderer from "../components/ChartRenderer.jsx";

const Page = styled.main`
  width: min(1280px, calc(100vw - 32px));
  min-height: 100vh;
  margin: 0 auto;
  padding: 22px 0 32px;
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
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border: 1px solid ${({ theme }) => theme.colors.line};
  font-weight: 700;
`;

const HeroCard = styled.section`
  display: grid;
  gap: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 248, 239, 0.88) 100%);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  line-height: 1.05;
`;

const Description = styled.p`
  margin: 0;
  max-width: 60ch;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.55;
  font-size: 0.96rem;
`;

const ChartShell = styled.section`
  height: min(68vh, 720px);
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(255, 255, 255, 0.92);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

function ChartDetailPage({ chartMap }) {
  const { chartId } = useParams();
  const chart = chartMap.get(chartId);

  if (!chart) {
    return <Navigate to="/" replace />;
  }

  return (
    <Page>
      <TopBar>
        <BackButton to="/" aria-label="Voltar para Home" title="Voltar para Home">
          <ArrowLeft size={18} strokeWidth={2.2} />
        </BackButton>
      </TopBar>

      <HeroCard>
        <Title>{chart.title}</Title>
        <Description>{chart.description}</Description>
      </HeroCard>

      <ChartShell>
        <ChartRenderer chart={chart} fullHeight />
      </ChartShell>
    </Page>
  );
}

export default ChartDetailPage;
