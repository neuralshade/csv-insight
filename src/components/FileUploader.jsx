import { useState } from "react"; // 1. Adicionado useState
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
  /* Mudamos a borda e fundo dinamicamente usando uma prop $isDragging */
  border: 2px dashed ${({ theme, $isDragging }) => 
    $isDragging ? theme.colors.accent : theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $isDragging }) => 
    $isDragging 
      ? "rgba(59, 130, 246, 0.15)" 
      : `radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 30%), rgba(255, 255, 255, 0.84)`};
  text-align: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s ease-in-out;
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
  // 2. Estado para feedback visual de drag
  const [isDragging, setIsDragging] = useState(false);

  // 3. Funções de Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault(); // Impede que o navegador abra o arquivo em uma nova aba
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Simula o formato event.target.files que o App.jsx (handleFileUpload) espera
      onChange({ target: { files: e.dataTransfer.files } });
    }
  };

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
      <DropzoneLabel
        $isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud size={28} strokeWidth={2} />
        <DropzoneTitle>
          {isDragging ? "Solte o arquivo aqui..." : "Selecionar ou arrastar arquivo CSV"}
        </DropzoneTitle>
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