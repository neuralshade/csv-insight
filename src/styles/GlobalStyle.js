import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

  :root {
    font-family: "Roboto", "Segoe UI", sans-serif;
    color: ${({ theme }) => theme.colors.ink};
    background:
      radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 30%),
      linear-gradient(180deg, #f6faff 0%, #eef5ff 48%, #f8fbff 100%);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }

  body {
    min-height: 100vh;
  }

  button,
  input {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export default GlobalStyle;
