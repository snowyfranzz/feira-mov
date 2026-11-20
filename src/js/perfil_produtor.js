// Página da barraca do produtor logado — FeiraMov

const FOTO_PADRAO = '../../assets/imagens-produtores/produtorural.png';
const TAMANHO_FOTO = 400;

const usuario = Auth.exigirLogin();

// Conta comum não tem barraca: vai para o perfil de usuário.
if (usuario && !usuario.produtor) {
    window.location.replace(Auth.paginaDaConta(usuario));
} else if (usuario) {
    const foto = document.getElementById('perfil-foto');
    const entradaFoto = document.getElementById('foto-input');
    const erroFoto = document.getElementById('erro-foto');

    function preencherCampo(id, valor, padrao = 'Não informado') {
        document.getElementById(id).textContent =
            valor && String(valor).trim() ? valor : padrao;
    }

    document.title = 'FeiraMov — ' + (usuario.tenda || usuario.nome);

    foto.src = usuario.foto || FOTO_PADRAO;
    foto.alt = 'Foto de ' + usuario.nome;

    preencherCampo('perfil-nome', usuario.nome);
    preencherCampo('perfil-arroba', '@' + usuario.username);

    if (usuario.slogan) {
        const slogan = document.getElementById('perfil-slogan');
        slogan.textContent = usuario.slogan;
        slogan.hidden = false;
    }

    const enderecoCompleto = [usuario.endereco, usuario.complemento]
        .filter(parte => parte && parte.trim())
        .join(' - ');

    preencherCampo('info-tenda', usuario.tenda);
    preencherCampo('info-endereco', enderecoCompleto);
    preencherCampo('info-telefone', usuario.telefone);
    preencherCampo('info-cnpj', usuario.cnpj);
    preencherCampo('info-descricao', usuario.descricao, 'Sem descrição.');
    preencherCampo('info-username', usuario.username);
    preencherCampo('info-email', usuario.email);

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

    document.getElementById('btn-sair').addEventListener('click', Auth.sair);

    // ---------- foto ----------
    function mostrarErroFoto(mensagem) {
        erroFoto.textContent = mensagem;
        erroFoto.hidden = false;
    }

    // Recorta a imagem em um quadrado de 400px para caber no localStorage.
    function prepararFoto(arquivo, aoTerminar) {
        const leitor = new FileReader();

        leitor.onerror = () => aoTerminar(null);
        leitor.onload = () => {
            const imagem = new Image();

            imagem.onerror = () => aoTerminar(null);
            imagem.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = TAMANHO_FOTO;
                canvas.height = TAMANHO_FOTO;

                const lado = Math.min(imagem.width, imagem.height);
                const origemX = (imagem.width - lado) / 2;
                const origemY = (imagem.height - lado) / 2;
                const contexto = canvas.getContext('2d');

                contexto.fillStyle = '#ffffff';
                contexto.fillRect(0, 0, TAMANHO_FOTO, TAMANHO_FOTO);
                contexto.drawImage(
                    imagem,
                    origemX, origemY, lado, lado,
                    0, 0, TAMANHO_FOTO, TAMANHO_FOTO
                );

                aoTerminar(canvas.toDataURL('image/jpeg', 0.85));
            };

            imagem.src = leitor.result;
        };

        leitor.readAsDataURL(arquivo);
    }

    foto.addEventListener('click', () => entradaFoto.click());

    entradaFoto.addEventListener('change', () => {
        erroFoto.hidden = true;

        const arquivo = entradaFoto.files[0];
        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {
            mostrarErroFoto('Escolha um arquivo de imagem.');
            entradaFoto.value = '';
            return;
        }

        prepararFoto(arquivo, imagemSalva => {
            entradaFoto.value = '';

            if (!imagemSalva) {
                mostrarErroFoto('Não foi possível ler essa imagem. Tente outro arquivo.');
                return;
            }

            // Altera a conta salva (e não só a cópia desta página).
            const usuarios = Auth.lerUsuarios();
            const conta = Auth.buscarPorUsername(usuarios, usuario.username);
            conta.foto = imagemSalva;

            if (!Auth.salvarUsuarios(usuarios)) {
                mostrarErroFoto('Não foi possível salvar a foto. Tente uma imagem menor.');
                return;
            }

            usuario.foto = imagemSalva;
            foto.src = imagemSalva;
        });
    });
}
