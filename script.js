function preencherCampos() {
  const texto = document.getElementById("inputTexto").value;

  const nomeMatch = texto.match(/se chama ([^,]+)/i);
  const estadoCivilMatch = texto.match(/, ([^,]+), [^,]+,/);
  const profissaoMatch = texto.match(/, ([^,]+), CPF/);
  const cpfMatch = texto.match(/CPF ([\d.-]+)/i);
  const rgMatch = texto.match(/RG (\d+)/i);
  const enderecoMatch = texto.match(/mora na ([^\.]+)/i);
  const dataMatch = texto.match(/dia (\d{2}\/\d{2}\/\d{4})/i);
  const pacoteMatch = texto.match(/pacote ([^ (]+)/i);
  const coberturaMatch = texto.match(/\(([^)]+)\)/);
  const valorMatch = texto.match(/Pagará R\$(\d+[.,]?\d*)/i);
  const entradaMatch = texto.match(/entrada de R\$(\d+[.,]?\d*)/i);
  const parcelasMatch = texto.match(/(\d+)x de R\$(\d+[.,]?\d*)/i);
  const formaPagamentoMatch = texto.match(/por ([a-zA-Z]+)/i);

  document.getElementById("nome").value = nomeMatch?.[1] || "";
  document.getElementById("estadoCivil").value = estadoCivilMatch?.[1] || "";
  document.getElementById("profissao").value = profissaoMatch?.[1] || "";
  document.getElementById("cpf").value = cpfMatch?.[1] || "";
  document.getElementById("rg").value = rgMatch?.[1] || "";
  document.getElementById("endereco").value = enderecoMatch?.[1] || "";
  document.getElementById("dataEvento").value = formatarDataISO(dataMatch?.[1]) || "";
  document.getElementById("pacote").value = pacoteMatch?.[1] || "";
  document.getElementById("cobertura").value = coberturaMatch?.[1] || "";
  document.getElementById("valorTotal").value = valorMatch?.[1] || "";
  document.getElementById("entrada").value = entradaMatch?.[1] || "";
  document.getElementById("parcelas").value = parcelasMatch?.[1] || "";
  document.getElementById("valorParcela").value = parcelasMatch?.[2] || "";
  document.getElementById("formaPagamento").value = formaPagamentoMatch?.[1] || "";
}

function formatarDataISO(dataBR) {
  if (!dataBR) return "";
  const [dia, mes, ano] = dataBR.split("/");
  return ${ano}-${mes}-${dia};
}

function gerarContrato() {
  const nome = document.getElementById("nome").value;
  const estadoCivil = document.getElementById("estadoCivil").value;
  const profissao = document.getElementById("profissao").value;
  const rg = document.getElementById("rg").value;
  const cpf = document.getElementById("cpf").value;
  const endereco = document.getElementById("endereco").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const data = document.getElementById("dataEvento").value;
  const pacote = document.getElementById("pacote").value;
  const cobertura = document.getElementById("cobertura").value;
  const valorTotal = document.getElementById("valorTotal").value;
  const entrada = document.getElementById("entrada").value;
  const parcelas = document.getElementById("parcelas").value;
  const valorParcela = document.getElementById("valorParcela").value;
  const formaPagamento = document.getElementById("formaPagamento").value;

  if (!nome || !data || !pacote || !valorTotal) {
    alert("Por favor, preencha ao menos nome, data do evento, pacote e valor total antes de gerar o contrato.");
    return;
  }

  const contrato = 
Contrato de Prestação de Serviço Fotográfico

Contratante: ${nome}, ${estadoCivil || '[estado civil]'}, ${profissao || '[profissão]'}, portador do RG nº ${rg || '[RG]'} e CPF nº ${cpf || '[CPF]'}, residente em ${endereco || '[endereço]'}, telefone ${telefone || '[telefone]'}, e-mail ${email || '[e-mail]'}.

Evento: Casamento agendado para ${data}, com o pacote "${pacote}" incluindo: ${cobertura || '[itens incluídos]'}.

Valor do serviço: R$${valorTotal}, sendo R$${entrada || '0,00'} de entrada e ${parcelas || '0'} parcelas de R$${valorParcela || '0,00'} via ${formaPagamento || '[forma de pagamento]'}.

Ambas as partes concordam com os termos acima e assinam este contrato.
;

  document.getElementById("contrato").textContent = contrato.trim();
}

function baixarPDF() {
  const contrato = document.getElementById("contrato");

  if (!contrato.textContent.trim()) {
    alert("Gere o contrato antes de baixar.");
    return;
  }

  // Cria um clone do contrato para evitar falhas de renderização
  const clone = contrato.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  document.body.appendChild(clone);

  html2pdf()
    .set({
      margin: 1,
      filename: 'Contrato-de-Casamento.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    })
    .from(clone)
    .save()
    .then(() => {
      document.body.removeChild(clone); // remove o clone após gerar o PDF
    });
  }

  setTimeout(() => {
    html2pdf()
      .set({
        margin: 1,
        filename: 'Contrato-de-Casamento.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
      })
      .from(contrato)
      .save();
  }, 100);
}
