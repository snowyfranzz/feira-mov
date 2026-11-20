# Mudanças no login, cadastro e páginas de conta

Este documento explica o que foi alterado no sistema de contas da FeiraMov e como o código novo funciona.

> **Importante:** por ser um projeto acadêmico, não existe servidor nem banco de dados. Tudo (contas e sessão) fica salvo no **localStorage** do navegador. Ou seja: as contas existem só no navegador onde foram criadas, e limpar os dados do site apaga tudo.

---

## 1. Resumo do que mudou

| Antes | Depois |
|---|---|
| Havia duas cópias do site: a organizada (`src/html`, `src/js`, `src/css`) e um upload na raiz de `src/` com caminhos de imagem quebrados (`IMAGENS PI/`). | Ficou só a versão organizada. As melhorias do upload (campos de produtor, página do produtor e foto) foram trazidas para ela. |
| Cada arquivo JS tinha a própria função para ler o localStorage. | Um arquivo central, `js/auth.js`, cuida das contas e da sessão para todas as páginas. |
| O cadastro de produtor pedia só o nome da tenda. | Agora pede tenda, slogan (opcional), telefone, CNPJ e descrição. |
| Depois do cadastro, a pessoa precisava fazer login. | A conta é criada e a pessoa já entra logada, direto na página dela. |
| O produtor não tinha página própria. | Página nova: `html/minha-barraca.html`. |
| Não existia "sair da conta". | Botão **Sair da conta** nas duas páginas de conta. |
| O botão "Editar Endereço" não fazia nada. | Agora abre um formulário e salva o endereço novo. |
| O ícone "Minha conta" sempre levava para o login. | Com a sessão aberta, leva direto para a página da conta. |
| As páginas de conta abriam mesmo sem login. | Sem login, elas mandam a pessoa para o login. |

### Arquivos novos
- `src/js/auth.js`: guarda as contas e a sessão.
- `src/html/minha-barraca.html`: página do produtor logado.
- `src/js/perfil_produtor.js`: script da página do produtor.

### Arquivos alterados
- `src/js/login.js`, `src/js/cadastro.js`, `src/js/perfil_usuario.js`: reescritos para usar o `auth.js`.
- `src/html/cadastro.html`: campos de produtor novos, botão "Voltar" e área de erro do passo 2.
- `src/html/perfil-usuario.html`: botão "Sair da conta" e formulário de endereço.
- `src/css/style_login.css`: estilo da caixa de descrição, das mensagens de erro e sucesso, dos botões "Voltar" e "Criar conta" e da grade do passo 2.
- `src/css/style_perfil.css`: estilo do formulário de endereço, do botão de foto e do aviso de "lista vazia".
- Todas as páginas em `src/html/`: passaram a carregar `<script src="../js/auth.js"></script>` antes do `menu.js`.

### Arquivos apagados (duplicados)
Da raiz de `src/`: `cadastro.html`, `login.html`, `index.html`, `perfil-produtor.html`, `perfil-produtor1.html`, `perfil-usuario.html`, `cadastro.js`, `login.js`, `menu.js`, `perfil_produtor.js`, `perfil_usuario.js`, `style_index.css`, `style_login.css`, `style_perfil.css` e `style_principal.css`.

Os arquivos da raiz que **não** tinham cópia foram mantidos: `area.js`, `carrinho.html`, `eventos.html` (uma página de eventos diferente da que está em `html/`), `evento1.html` e `evento2.html`. Eles ainda precisam ser movidos para a estrutura organizada (veja a seção 6).

---

## 2. Como os dados ficam salvos

O localStorage guarda duas chaves:

**`usuarios`**: lista (array) com todas as contas cadastradas.

```json
[
  {
    "username": "joao.horta",
    "email": "joao@horta.com",
    "senha": "senha1234",
    "nome": "João da Horta",
    "cpf": "111.444.777-35",
    "endereco": "Feira de Pinheiros",
    "complemento": "",
    "criadoEm": "2026-11-20T13:00:00.000Z",
    "produtor": true,
    "tenda": "Horta do João",
    "slogan": "",
    "telefone": "(11) 91234-5678",
    "cnpj": "12.345.678/0001-90",
    "descricao": "Orgânicos frescos",
    "foto": "data:image/jpeg;base64,..."
  }
]
```

- Para contas comuns, `produtor` é `false` e os campos de produtor ficam vazios.
- `foto` só existe depois que o produtor escolhe uma foto.
- `compras` (lista) guarda o histórico de compras da conta. Uma conta nova não tem esse campo, então o histórico começa vazio. Cada compra tem o formato `{ "nome": "Morangos orgânicos", "detalhe": "250g - Barraca do João", "preco": "R$ 9,45", "imagem": "../../assets/imagens-produtos/morango.jpg", "entregue": true }`.
- `username` e `email` são sempre salvos em letras minúsculas, para que "Maria" e "maria" contem como a mesma conta.

**`usuarioLogado`**: quem está com a sessão aberta. Guarda só o username:

```json
{ "username": "joao.horta" }
```

Por que guardar só o username, e não uma cópia da conta inteira? Porque toda página busca os dados atualizados na lista `usuarios`. Assim, ao trocar o endereço ou a foto, a mudança aparece em todo lugar, e não fica uma cópia desatualizada na sessão.

---

## 3. O que cada arquivo faz

### `js/auth.js`: contas e sessão

É carregado em **todas** as páginas, antes dos outros scripts. Ele cria o objeto global `Auth`, com estas funções:

| Função | O que faz |
|---|---|
| `Auth.lerUsuarios()` | Lê a lista de contas. Se o localStorage estiver vazio ou com dado inválido, devolve `[]` em vez de travar a página. |
| `Auth.salvarUsuarios(lista)` | Salva a lista. Devolve `false` se o navegador não deixar salvar (por exemplo, sem espaço), para a página mostrar um erro. |
| `Auth.buscarPorUsername(lista, username)` | Procura a conta pelo username, sem diferenciar maiúsculas de minúsculas. |
| `Auth.buscarPorEmail(lista, email)` | Mesma coisa, pelo e-mail. |
| `Auth.usuarioLogado()` | Devolve a conta de quem está logado, ou `null`. |
| `Auth.entrar(usuario)` | Abre a sessão (grava `usuarioLogado`). |
| `Auth.sair()` | Fecha a sessão e volta para o `login.html`. |
| `Auth.paginaDaConta(usuario)` | Diz qual é a página da conta: `minha-barraca.html` para produtor e `perfil-usuario.html` para os demais. |
| `Auth.exigirLogin()` | Usada nas páginas restritas. Sem sessão, manda para o login. |

Ao carregar, o `auth.js` também procura os links `href="login.html"` da topbar e do menu lateral. Se houver alguém logado, troca esses links pela página da conta, para que o ícone "Minha conta" leve direto ao perfil. Os links dentro dos formulários de login e cadastro (área `.auth`) não são alterados.

O código usa uma *IIFE* (`(function () { ... })()`), o mesmo padrão do `menu.js` e do `carrinho.js`: as variáveis internas ficam escondidas e só o objeto `Auth` fica visível para as outras páginas.

### `js/cadastro.js`: criar conta

1. **Se já estiver logado**, a pessoa vai direto para a página da conta.
2. **Passo 1** (username, e-mail e senha), ao clicar em "Continuar":
   - o navegador confere os campos obrigatórios, o formato do e-mail e a senha com no mínimo 8 caracteres;
   - o username precisa ter de 3 a 20 caracteres, só com letras minúsculas, números, `_` ou `.`;
   - o script confere se o username e o e-mail já existem.
3. **Botão "Voltar"**: volta para o passo 1 sem perder o que foi digitado.
4. **Interruptor "Conta de produtor?"**: liga ou desliga os campos de produtor (`atualizarCamposProdutor`). Desligado, os campos ficam bloqueados e vazios. Ligado, viram obrigatórios, menos o slogan.
5. **Passo 2**, ao clicar em "Criar conta":
   - o CPF precisa ter 11 dígitos e ser **um CPF válido** (veja abaixo);
   - se for produtor: telefone com DDD (10 ou 11 dígitos) e CNPJ com 14 dígitos;
   - confere de novo se a conta já existe, caso outra aba tenha criado a mesma conta nesse meio-tempo;
   - salva com `Auth.salvarUsuarios`. Se der erro, mostra a mensagem;
   - abre a sessão com `Auth.entrar` e leva para a página da conta.

#### Como o CPF é verificado
- **Máscara:** enquanto a pessoa digita, `formatarCPF` tira tudo que não é número e coloca os pontos e o traço sozinha. Digitar `52998224725` vira `529.982.247-25`. O campo aceita no máximo 14 caracteres, e o CPF é salvo já formatado.
- **Validação (`cpfValido`):** os dois últimos números do CPF são *dígitos verificadores*, calculados a partir dos 9 primeiros:
  1. Multiplica os 9 primeiros dígitos pelos pesos 10, 9, 8, ..., 2 e soma tudo.
  2. Faz `(soma × 10) % 11`. Se der 10, vira 0. O resultado precisa ser igual ao 10º dígito.
  3. Repete com os 10 primeiros dígitos e os pesos 11, 10, ..., 2. O resultado precisa ser igual ao 11º dígito.
  4. CPFs com todos os números iguais (como `111.111.111-11`) passam nessa conta, mas não são válidos, então são recusados antes.
- O teste confere só se o número é matematicamente válido. Não dá para saber se o CPF existe de verdade ou de quem é sem consultar a Receita Federal.

### `js/login.js`: entrar

1. Se já estiver logado, vai direto para a página da conta.
2. Ao enviar, aceita **e-mail ou username**: se o texto tiver `@`, busca pelo e-mail; se não, pelo username.
3. Se a conta não existir ou a senha estiver errada, mostra a mesma mensagem genérica ("E-mail/username ou senha incorretos."), sem dizer qual dos dois errou.
4. Se der certo: `Auth.entrar(usuario)`, e o produtor vai para `minha-barraca.html` e os demais para `perfil-usuario.html`.
5. "Entrar com o Google" e "Esqueci minha senha" ainda só mostram um aviso de "em breve".

### `js/perfil_usuario.js`: página do usuário comum

1. `Auth.exigirLogin()`: sem sessão, volta para o login.
2. Se a conta for de produtor, vai para `minha-barraca.html`.
3. Mostra nome, @username, e-mail e endereço.
4. **Histórico de compras:** monta um card para cada item de `usuario.compras` e atualiza o contador do topo ("0 compras", "1 compra", "2 compras"...). Sem compras, mostra "Você ainda não fez nenhuma compra." Os cards são criados com `createElement` e `textContent`, sem `innerHTML`.
5. **Senha**: aparece como `••••••••`, e o botão "Mostrar"/"Ocultar" alterna.
6. **Editar Endereço**: troca a linha do endereço por um formulário já preenchido. Ao salvar, altera a conta dentro da lista `usuarios` e grava no localStorage. "Cancelar" fecha sem salvar.
7. **Sair da conta**: chama `Auth.sair()`.

### `js/perfil_produtor.js` e `html/minha-barraca.html`: página do produtor

A página foi feita a partir do modelo das páginas de produtor que já existiam, com os dados preenchidos pelo JavaScript.

1. `Auth.exigirLogin()`. Se a conta não for de produtor, vai para `perfil-usuario.html`.
2. Preenche nome, @username, slogan (escondido se estiver vazio), tenda, endereço, telefone, CNPJ, descrição, e-mail e senha. Campos vazios aparecem como "Não informado".
3. **Foto**: ao clicar na foto ou em "Alterar foto", o produtor escolhe uma imagem. A função `prepararFoto` lê o arquivo, recorta um quadrado no centro, reduz para 400×400 px e converte para JPEG. Isso deixa a imagem pequena o suficiente para caber no localStorage, que tem limite de uns 5 MB. A foto fica salva no campo `foto` da conta.
4. **Produtos**: por enquanto aparece "Você ainda não cadastrou produtos", porque ainda não existe cadastro de produtos.
5. **Sair da conta**: chama `Auth.sair()`.

### Segurança básica que já está no código
- Todo texto digitado pelo usuário é exibido com `textContent`, e nunca com `innerHTML`. Se alguém escrever `<b>oi</b>` na descrição, aparece o texto literal e nenhum código é executado.
- Erros de leitura do localStorage são tratados com `try/catch`, para a página não travar.

---

## 4. Como testar

1. Abra `src/html/cadastro.html` no navegador, de preferência com a extensão Live Server do VS Code.
2. Crie uma conta comum. Você deve cair em `perfil-usuario.html` já logado. O histórico de compras aparece vazio e o topo mostra "0 compras".
   - Para testar, use CPFs válidos de exemplo, como `529.982.247-25` ou `111.444.777-35`. Um CPF inventado, como `123.456.789-00`, é recusado.
3. Teste "Editar Endereço", depois recarregue a página: o endereço novo continua lá.
4. Clique em "Sair da conta" e tente abrir `perfil-usuario.html` direto pela barra de endereço: você volta para o login.
5. Crie uma conta de produtor. Você deve cair em `minha-barraca.html`. Troque a foto e recarregue: a foto continua.
6. Faça login com o e-mail de uma conta e com o username da outra.
7. Para ver os dados salvos: aperte F12, vá em **Application** (ou **Armazenamento**), depois **Local Storage**, e olhe as chaves `usuarios` e `usuarioLogado`. Para recomeçar do zero, apague essas chaves.

---

## 5. Páginas de ajuda, privacidade e contato

Arquivos novos: `src/html/ajuda.html`, `src/html/politica-privacidade.html`, `src/html/fale-conosco.html`, `src/js/fale_conosco.js` e `src/css/style_ajuda.css` (estilo compartilhado pelas três páginas).

**Links do footer** (em todas as páginas): "Suporte e Ajuda" → `ajuda.html`, "Política de Privacidade" → `politica-privacidade.html` e "Fale Conosco" → `fale-conosco.html`. O "Ajuda" da topbar e do menu lateral também leva para `ajuda.html`.

### Ajuda (`ajuda.html`)
- **Índice:** botões no topo levam a cada assunto (conta, compras, produtores, privacidade e contato). A regra `scroll-margin-top` evita que o título do assunto fique escondido atrás da topbar fixa.
- **Perguntas frequentes:** usam a tag `<details>`/`<summary>` do HTML, que já abre e fecha sozinha, **sem JavaScript**. O CSS só troca a setinha padrão por um sinal de `+`/`−`.
- **Contato rápido:** e-mail e linha de suporte, mais um link para o Fale Conosco.

### Política de Privacidade (`politica-privacidade.html`)
Texto baseado na LGPD que descreve o que o site faz de verdade: quais dados são coletados, para que servem, onde ficam guardados (no localStorage, com o aviso de que a senha não é criptografada), compartilhamento (nenhum) e os direitos do usuário. Não tem JavaScript.

### Fale Conosco (`fale-conosco.html` + `js/fale_conosco.js`)
- **Canais:** linha de suporte **(19) 1234-5678** e e-mail **contato@feiramov.com.br**, que podem ser clicados (`tel:` e `mailto:`).
- **Redes sociais (fictícias):** Instagram **@feiramov**, Facebook **/feiramovoficial** e Twitter **@feiramov_**. Os links não levam a sites externos, porque esses perfis podem pertencer a outras pessoas. Ao clicar, aparece o aviso "em breve". Quando a equipe criar os perfis, basta trocar o `href="#"` pelo endereço real e apagar o `data-rede`.
- **Formulário de mensagem:**
  1. Se a pessoa estiver logada, nome e e-mail já vêm preenchidos (`Auth.usuarioLogado()`).
  2. Ao enviar, confere nome, e-mail válido, assunto escolhido e mensagem com pelo menos 10 caracteres.
  3. A mensagem é salva no localStorage, na chave `mensagensContato`, com nome, e-mail, assunto, texto, username (se logado) e data. Não existe servidor, então ninguém recebe a mensagem de verdade. Ela fica no navegador para demonstrar o funcionamento.
  4. Mostra "Mensagem enviada!" e limpa o assunto e o texto.

> Todos os contatos (telefone, e-mail e redes) são **inventados** para o protótipo.

---

## 6. Limitações e próximos passos

- **A senha fica salva como texto puro** no localStorage. Num sistema real, a senha seria protegida (com *hash*) e guardada num servidor. Aqui está assim só por ser um protótipo.
- **As contas só existem no navegador** onde foram criadas.
- **A página do produtor é só para o dono.** Um próximo passo seria uma página pública (por exemplo, `perfil-produtor.html?u=joao.horta`) e listar os produtores cadastrados em `produtores.html`.
- **Histórico de compras:** começa vazio e já sabe mostrar compras salvas em `usuario.compras`, mas ainda não existe a finalização de compra que grava esse histórico. Quando o carrinho tiver um botão "Finalizar compra", basta adicionar os itens em `compras` na conta do usuário logado.
- **Arquivos que faltam organizar:** `carrinho.html`, `eventos.html`, `evento1.html`, `evento2.html` e `area.js` continuam na raiz de `src/`. Eles usam caminhos antigos (`IMAGENS PI/`, `style_principal.css`, `style_eventos.css`) que não existem mais, então aparecem sem imagens e sem estilo até serem movidos para `src/html/` com os caminhos corrigidos. O link "Meu Carrinho" das páginas também aponta para um `carrinho.html` que não existe em `src/html/`.
