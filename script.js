function preencherCampos() {
  const texto = document.getElementById("inputTexto").value;

  const nomeMatch = texto.match(/se chama ([^,.\n]+)/i);
  const estadoCivilMatch = texto.match(/,\s*([^,]+),\s*[^,]+,/);
  const profissaoMatch = texto.match(/, ([^,]+), CPF/i);
  const cpfMatch = texto.match(/CPF\s*([\d.\-]+)/i);
  const rgMatch = texto.match(/RG\s*([\d.\-]+)/i);
  const enderecoMatch = texto.match(/mora na ([^.\n]+)/i);
  const dataMatch = texto.match(/dia (\d{2}\/\d{2}\/\d{4})/i);
  const pacoteMatch = texto.match(/pacote ([^\s(]+)/i);
  const coberturaMatch = texto.match(/\(([^)]+)\)/);
  const valorMatch = texto.match(/Pagará R\$ ?([\d.,]+)/i);
  const entradaMatch = texto.match(/entrada de R\$ ?([\d.,]+)/i);
  const parcelasMatch = texto.match(/(\d+)x de R\$ ?([\d.,]+)/i);
  const formaPagamentoMatch = texto.match(/por ([a-zA-Z]+)/i);

  document.getElementById("nome").value = nomeMatch?.[1]?.trim() || "";
  document.getElementById("estadoCivil").value = estadoCivilMatch?.[1]?.trim() || "";
  document.getElementById("profissao").value = profissaoMatch?.[1]?.trim() || "";
  document.getElementById("cpf").value = cpfMatch?.[1]?.trim() || "";
  document.getElementById("rg").value = rgMatch?.[1]?.trim() || "";
  document.getElementById("endereco").value = enderecoMatch?.[1]?.trim() || "";
  document.getElementById("dataEvento").value = formatarDataISO(dataMatch?.[1]) || "";
  document.getElementById("pacote").value = pacoteMatch?.[1]?.trim() || "";
  document.getElementById("cobertura").value = coberturaMatch?.[1]?.trim() || "";
  document.getElementById("valorTotal").value = valorMatch?.[1]?.trim() || "";
  document.getElementById("entrada").value = entradaMatch?.[1]?.trim() || "";
  document.getElementById("parcelas").value = parcelasMatch?.[1]?.trim() || "";
  document.getElementById("valorParcela").value = parcelasMatch?.[2]?.trim() || "";
  document.getElementById("formaPagamento").value = formaPagamentoMatch?.[1]?.trim() || "";
}

function formatarDataISO(dataBR) {
  if (!dataBR) return "";
  const partes = dataBR.split("/");
  if (partes.length !== 3) return "";
  const [dia, mes, ano] = partes;
  // Validação simples de dia, mês e ano numéricos
  if (
    isNaN(dia) || isNaN(mes) || isNaN(ano) ||
    dia.length !== 2 || mes.length !== 2 || ano.length !== 4
  ) return "";
  return `${ano}-${mes}-${dia}`;
}

function gerarContrato() {
  const nome = document.getElementById("nome").value.trim();
  const estadoCivil = document.getElementById("estadoCivil").value.trim();
  const profissao = document.getElementById("profissao").value.trim();
  const rg = document.getElementById("rg").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const data = document.getElementById("dataEvento").value.trim();
  const pacote = document.getElementById("pacote").value.trim();
  const cobertura = document.getElementById("cobertura").value.trim();
  const valorTotal = document.getElementById("valorTotal").value.trim();
  const entrada = document.getElementById("entrada").value.trim();
  const parcelas = document.getElementById("parcelas").value.trim();
  const valorParcela = document.getElementById("valorParcela").value.trim();
  const formaPagamento = document.getElementById("formaPagamento").value.trim();

  if (!nome || !data || !pacote || !valorTotal) {
    alert("Por favor, preencha ao menos nome, data do evento, pacote e valor total antes de gerar o contrato.");
    return;
  }

  const contrato = `
Contrato de Prestação de Serviço Fotográfico

Contratante: ${nome}, ${estadoCivil || '[estado civil]'}, ${profissao || '[profissão]'}, portador do RG nº ${rg || '[RG]'} e CPF nº ${cpf || '[CPF]'}, residente em ${endereco || '[endereço]'}, telefone ${telefone || '[telefone]'}, e-mail ${email || '[e-mail]'}.

Evento: Casamento agendado para ${data}, com o pacote "${pacote}" incluindo: ${cobertura || '[itens incluídos]'}.

Valor do serviço: R$ ${valorTotal}, sendo R$ ${entrada || '0,00'} de entrada e ${parcelas || '0'} parcelas de R$ ${valorParcela || '0,00'} via ${formaPagamento || '[forma de pagamento]'}.

Ambas as partes concordam com os termos acima e assinam este contrato.
`.trim();

  document.getElementById("contrato").textContent = contrato;
}

function baixarPDF() {
  const contrato = document.getElementById("contrato");

  if (!contrato.textContent.trim()) {
    alert("Gere o contrato antes de baixar.");
    return;
  }

  // Cria um clone para gerar PDF
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
      document.body.removeChild(clone);
    });
}
