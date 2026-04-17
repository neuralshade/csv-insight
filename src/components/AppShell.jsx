import { NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import FileUploader from "./FileUploader.jsx";

const Shell = styled.div`
  min-height: 100vh;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(255, 250, 243, 0.84);
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`;

const HeaderInner = styled.div`
  width: min(1280px, calc(100vw - 32px));
  margin: 0 auto;
  min-height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const Brand = styled(NavLink)`
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accentDeep};
`;

const RightCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Separator = styled.div`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.colors.line};
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(255, 255, 255, 0.72);
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.88rem;
  white-space: nowrap;
`;

const StatusDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${({ $active, theme }) =>
    $active ? "#22c55e" : theme.colors.muted};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 0 4px rgba(34, 197, 94, 0.12)" : "none"};
`;

const NavItem = styled(NavLink)`
  padding: 10px 14px;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 700;
  transition:
    background 160ms ease,
    color 160ms ease;

  &.active {
    background: ${({ theme }) => theme.colors.surfaceStrong};
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const Content = styled.div`
  padding-bottom: 36px;
`;

function AppShell({ fileName, onFileUpload }) {
  const hasFile = Boolean(fileName);

  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand to="/">CSV Insight</Brand>

          <RightCluster>
            <Nav>
              <NavItem to="/" end>
                Home
              </NavItem>
              <NavItem to="/negotiations">Negociações</NavItem>
            </Nav>
            <Separator />
            <StatusPill aria-label={hasFile ? "CSV" : "Nenhum CSV carregado"}>
              <StatusDot $active={hasFile} />
              {hasFile ? "CSV" : "Sem CSV"}
            </StatusPill>
            <FileUploader fileName={fileName} onChange={onFileUpload} variant="icon" />
          </RightCluster>
        </HeaderInner>
      </Header>

      <Content>
        <Outlet />
      </Content>
    </Shell>
  );
}

export default AppShell;
