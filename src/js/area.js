
const CHAVE_TOKEN = "token";

// Elementos da página
const conteudoRestrito = document.getElementById("conteudo-restrito");
const blocoNegado = document.getElementById("acesso-negado");
const statusAcesso = document.getElementById("status-acesso");
const motivoNegado = document.getElementById("motivo-negado");
const nomeUsuario = document.getElementById("nome-usuario");
const boasVindas = document.getElementById("boas-vindas");
const statusExpiracao = document.getElementById("status-expiracao");
const botaoLogout = document.getElementById("btn-logout");

// Mostra uma mensagem, como: "erro", "sucesso", "aviso" ou "info"
function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensagem " + tipo;
}

// Converte Base64URL em texto. O JWT usa "-" e "_" no lugar de "+" e "/" e não usa "="
function base64UrlParaTexto(base64Url) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const binario = atob(base64); 
  const bytes = Uint8Array.from(binario, function (c) {
    return c.charCodeAt(0); 
  });
  return new TextDecoder("utf-8").decode(bytes); 
}

// Decodifica uma parte (Header ou Payload) e devolve o objeto JSON
function decodificarSegmento(segmento, nome) {
  let texto;
  try {
    texto = base64UrlParaTexto(segmento);
  } catch (erro) {
    throw new Error("Não foi possível decodificar o " + nome + " (Base64URL inválido).");
  }

  let objeto;
  try {
    objeto = JSON.parse(texto); // transforma o texto JSON em objeto JavaScript
  } catch (erro) {
    throw new Error("O " + nome + " decodificado não é um JSON válido.");
  }

  // JSON.parse aceita "123" ou "null", mas um Header/Payload precisa ser um objeto
  if (typeof objeto !== "object" || objeto === null || Array.isArray(objeto)) {
    throw new Error("O " + nome + " não tem o formato de objeto esperado.");
  }
  return objeto;
}

// Divide o token em 3 partes e decodifica Header e Payload
function decodificarJwt(token) {
  const partes = token.split("."); // Separa em Header, Payload e Signature

  if (partes.length !== 3 || partes.includes("")) {
    throw new Error("Estrutura incorreta: um JWT precisa ter 3 partes (Header.Payload.Signature).");
  }

  return {
    header: decodificarSegmento(partes[0], "Header"),
    payload: decodificarSegmento(partes[1], "Payload"),
    assinatura: partes[2]
  };
}



// iat e exp são guardados em segundos
function formatarData(segundos) {
  if (typeof segundos !== "number") {
    return "não informado";
  }
  return new Date(segundos * 1000).toLocaleString("pt-BR");
}

// Compara a data de expiração (exp) com a data atual
function mostrarExpiracao(exp) {
  if (typeof exp !== "number") {
    mostrarMensagem(statusExpiracao, "O Payload não tem a claim exp (sem prazo de validade).", "aviso");
    return;
  }

  const agoraEmSegundos = Math.floor(Date.now() / 1000);

  if (agoraEmSegundos > exp) {
    mostrarMensagem(
      statusExpiracao,
      "Token EXPIRADO. Em um sistema real o acesso seria negado; aqui ele só demonstra a decodificação.",
      "aviso"
    );
  } else {
    mostrarMensagem(
      statusExpiracao,
      "Token dentro do prazo, mas a assinatura não foi verificada (isso exige a chave secreta).",
      "info"
    );
  }
}

// Bloqueia o conteúdo restrito e mostra o motivo
function negarAcesso(motivo) {
  conteudoRestrito.hidden = true; // hidden = true esconde o elemento
  blocoNegado.hidden = false;
  motivoNegado.textContent = motivo;
  mostrarMensagem(statusAcesso, "Acesso negado. Nenhum conteúdo restrito foi carregado.", "erro");
}

// Preenche a página com os dados do token e libera o conteúdo
function liberarAcesso(jwt) {
  const payload = jwt.payload;
  const nome = String(payload.name ?? "usuário sem nome"); // ?? usa o texto da direita se for null/undefined

  nomeUsuario.textContent = nome;
  boasVindas.textContent = "Bem-vindo(a), " + nome + "!";

  document.getElementById("claim-id").textContent = payload.id ?? "não informado";
  document.getElementById("claim-name").textContent = nome;
  document.getElementById("claim-role").textContent = payload.role ?? "não informado";
  document.getElementById("claim-iat").textContent = formatarData(payload.iat);
  document.getElementById("claim-exp").textContent = formatarData(payload.exp);

  // JSON.stringify(objeto, null, 2) gera um JSON indentado e legível
  document.getElementById("jwt-header").textContent = JSON.stringify(jwt.header, null, 2);
  document.getElementById("jwt-payload").textContent = JSON.stringify(payload, null, 2);
  document.getElementById("jwt-signature").textContent = jwt.assinatura;

  mostrarExpiracao(payload.exp);

  // Só no final mostramos o conteúdo: se algo falhar antes, nada vaza para a tela
  blocoNegado.hidden = true;
  conteudoRestrito.hidden = false;
  mostrarMensagem(statusAcesso, "Acesso permitido (simulado): token encontrado e Payload lido.", "sucesso");
}

// Fluxo principal para verificar se o token existe, se é válido e se o acesso é permitido

function verificarAcesso() {
  const token = localStorage.getItem(CHAVE_TOKEN); // devolve null se a chave não existir

  if (token === null) {
    negarAcesso("Nenhum token foi encontrado no navegador.");
    return;
  }
  if (token.trim() === "") {
    negarAcesso("O token armazenado está vazio.");
    return;
  }

  try {
    liberarAcesso(decodificarJwt(token.trim()));
  } catch (erro) {
    // Qualquer problema na decodificação cai aqui, sem erro solto no console
    negarAcesso(erro.message);
  }
}

// ---------- Logout ----------

botaoLogout.addEventListener("click", function () {
  localStorage.removeItem(CHAVE_TOKEN);           // Apaga o token do navegador
  window.location.href = "index.html?logout=1";   // Volta ao login e avisa do logout
});

// Executa a verificação assim que a página carrega 
verificarAcesso();
