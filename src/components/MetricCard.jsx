import styled from "styled-components";

const Card = styled.article`
  padding: 18px 18px 16px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Label = styled.span`
  display: block;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
`;

const Value = styled.strong`
  display: block;
  font-size: clamp(1.35rem, 2.1vw, 2.05rem);
  line-height: 1.1;
`;

function MetricCard({ label, value }) {
  return (
    <Card>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Card>
  );
}

export default MetricCard;
