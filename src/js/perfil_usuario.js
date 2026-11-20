// Perfil do usuário — FeiraMov

const usuario = Auth.exigirLogin();

// Conta de produtor tem a própria página.
if (usuario && usuario.produtor) {
    window.location.replace(Auth.paginaDaConta(usuario));
} else if (usuario) {
    document.title = 'FeiraMov — ' + usuario.nome;
    document.getElementById('perfil-nome').textContent = usuario.nome;
    document.getElementById('perfil-arroba').textContent = '@' + usuario.username;
    document.getElementById('info-username').textContent = usuario.username;
    document.getElementById('info-email').textContent = usuario.email;

    function mostrarEndereco() {
        document.getElementById('info-endereco').textContent = usuario.complemento
            ? `${usuario.endereco} - ${usuario.complemento}`
            : usuario.endereco;
    }

    mostrarEndereco();

    // ---------- histórico de compras ----------
    // Conta nova começa sem compras; cada compra salva em usuario.compras vira um card.
    const compras = Array.isArray(usuario.compras) ? usuario.compras : [];
    const listaCompras = document.getElementById('lista-compras');

    document.getElementById('perfil-compras').textContent =
        compras.length === 1 ? '1 compra' : `${compras.length} compras`;

    function criarElemento(tag, classe, texto) {
        const elemento = document.createElement(tag);
        if (classe) elemento.className = classe;
        if (texto !== undefined) elemento.textContent = texto;
        return elemento;
    }

    compras.forEach(compra => {
        const card = document.createElement('article');

        const imagem = document.createElement('img');
        imagem.src = compra.imagem || '';
        imagem.alt = '';

        const titulo = criarElemento('div');
        titulo.append(criarElemento('h3', '', compra.nome), criarElemento('p', '', compra.detalhe || ''));
        const linhaTitulo = criarElemento('div', 'linha');
        linhaTitulo.append(titulo);

        const linhaPreco = criarElemento('div', 'linha');
        linhaPreco.append(
            criarElemento('strong', '', compra.preco),
            criarElemento('span', compra.entregue ? 'selo selo--destaque' : 'selo selo--alerta',
                compra.entregue ? 'Entregue' : 'Não Entregue')
        );

        const info = criarElemento('div', 'card-info');
        info.append(linhaTitulo, linhaPreco);
        card.append(imagem, info);
        listaCompras.append(card);
    });

    listaCompras.hidden = compras.length === 0;
    document.getElementById('compras-vazio').hidden = compras.length > 0;

    // ---------- senha ----------
    const spanSenha = document.getElementById('info-senha');
    const btnSenha = document.getElementById('btn-senha');
    let senhaVisivel = false;

    function atualizarSenha() {
        spanSenha.textContent = senhaVisivel
            ? usuario.senha
            : '•'.repeat(usuario.senha.length);
        btnSenha.textContent = senhaVisivel ? 'Ocultar' : 'Mostrar';
    }

    btnSenha.addEventListener('click', () => {
        senhaVisivel = !senhaVisivel;
        atualizarSenha();
    });

    atualizarSenha();

    // ---------- editar endereço ----------
    const btnEndereco = document.getElementById('btn-endereco');
    const linhaEndereco = document.getElementById('linha-endereco');
    const formEndereco = document.getElementById('form-endereco');
    const campoEndereco = document.getElementById('novo-endereco');
    const campoComplemento = document.getElementById('novo-complemento');
    const erroEndereco = document.getElementById('erro-endereco');

    function editarEndereco(editando) {
        formEndereco.hidden = !editando;
        linhaEndereco.hidden = editando;
        btnEndereco.hidden = editando;
        erroEndereco.hidden = true;

        if (editando) {
            campoEndereco.value = usuario.endereco;
            campoComplemento.value = usuario.complemento || '';
            campoEndereco.focus();
        }
    }

    btnEndereco.addEventListener('click', () => editarEndereco(true));
    document.getElementById('cancelar-endereco').addEventListener('click', () => editarEndereco(false));

    formEndereco.addEventListener('submit', evento => {
        evento.preventDefault();
        if (!formEndereco.reportValidity()) return;

        // Altera a conta salva (e não só a cópia desta página).
        const usuarios = Auth.lerUsuarios();
        const conta = Auth.buscarPorUsername(usuarios, usuario.username);
        conta.endereco = campoEndereco.value.trim();
        conta.complemento = campoComplemento.value.trim();

        if (!Auth.salvarUsuarios(usuarios)) {
            erroEndereco.textContent = 'Não foi possível salvar o endereço neste navegador.';
            erroEndereco.hidden = false;
            return;
        }

        usuario.endereco = conta.endereco;
        usuario.complemento = conta.complemento;
        mostrarEndereco();
        editarEndereco(false);
    });

    document.getElementById('btn-sair').addEventListener('click', Auth.sair);
}
