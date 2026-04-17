import { FileUp, UploadCloud } from "lucide-react";
import styled from "styled-components";

const UploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 54px;
  padding: 0 24px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent} 0%,
    ${({ theme }) => theme.colors.accentDeep} 100%
  );
  color: white;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const IconButtonLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: white;
  color: ${({ theme }) => theme.colors.accentDeep};
  cursor: pointer;
`;

const DropzoneLabel = styled.label`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 34px 24px;
  border: 1px dashed ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.md};
  background:
    radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 30%),
    rgba(255, 255, 255, 0.84);
  text-align: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const DropzoneTitle = styled.strong`
  font-size: 1.02rem;
`;

const DropzoneText = styled.span`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 42ch;
`;

const HiddenInput = styled.input`
  display: none;
`;

function FileUploader({ fileName, onChange, variant = "button" }) {
  if (variant === "icon") {
    return (
      <IconButtonLabel title={fileName ? "Trocar CSV" : "Carregar CSV"}>
        <FileUp size={18} strokeWidth={2.2} />
        <HiddenInput type="file" accept=".csv" onChange={onChange} />
      </IconButtonLabel>
    );
  }

  if (variant === "dropzone") {
    return (
      <DropzoneLabel>
        <UploadCloud size={28} strokeWidth={2} />
        <DropzoneTitle>Selecionar ou arrastar arquivo CSV</DropzoneTitle>
        <DropzoneText>
          Envie o export do CRM para liberar o dashboard, as estatísticas e as
          negociações.
        </DropzoneText>
        <HiddenInput type="file" accept=".csv" onChange={onChange} />
      </DropzoneLabel>
    );
  }

  return (
    <UploadLabel>
      {fileName ? "Trocar arquivo CSV" : "Carregar CSV"}
      <HiddenInput type="file" accept=".csv" onChange={onChange} />
    </UploadLabel>
  );
}

export default FileUploader;
