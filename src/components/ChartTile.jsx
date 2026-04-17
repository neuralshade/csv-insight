import { Link } from "react-router-dom";
import styled from "styled-components";
import ChartRenderer from "./ChartRenderer.jsx";

const Tile = styled(Link)`
  display: grid;
  gap: 14px;
  min-height: 320px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(242, 247, 255, 0.88) 100%);
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);
  }
`;

const Header = styled.div`
  display: grid;
  gap: 8px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.08rem;
  line-height: 1.25;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.45;
  font-size: 0.92rem;
`;

const ChartViewport = styled.div`
  min-height: 190px;
`;

const Footer = styled.div`
  color: ${({ theme }) => theme.colors.accentDeep};
  font-weight: 700;
  font-size: 0.92rem;
`;

function ChartTile({ chart }) {
  return (
    <Tile to={`/grafico/${chart.id}`}>
      <Header>
        <Title>{chart.title}</Title>
        <Description>{chart.description}</Description>
      </Header>
      <ChartViewport>
        <ChartRenderer chart={chart} />
      </ChartViewport>
      <Footer>Abrir em tela cheia</Footer>
    </Tile>
  );
}

export default ChartTile;
