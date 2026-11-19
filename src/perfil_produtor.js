// Perfil do produtor — FeiraMov

const FOTO_PADRAO = 'IMAGENS PI/produtorural.png';
const TAMANHO_FOTO = 400;

function lerJSON(chave, padrao) {
    try {
        const valor = JSON.parse(localStorage.getItem(chave));
        return valor ?? padrao;
    } catch {
        return padrao;
    }
}

const sessao = lerJSON('usuarioLogado', null);
const usuarios = lerJSON('usuarios', []);

// Localiza o cadastro correspondente à conta que iniciou a sessão.
const usuario = sessao
    ? usuarios.find(u => u.email === sessao.email)
    : null;

if (!usuario || !usuario.produtor) {
    window.location.href = 'login.html';
} else {
    const foto = document.getElementById('perfil-foto');
    const entradaFoto = document.getElementById('foto-input');
    const erroFoto = document.getElementById('erro-foto');

    function preencherCampo(id, valor, padrao = 'Não informado') {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor && String(valor).trim()
                ? valor
                : padrao;
        }
    }

    document.title = 'FeiraMov — ' + (usuario.nome || 'Perfil do produtor');

    foto.src = usuario.foto || FOTO_PADRAO;
    foto.alt = 'Foto de ' + (usuario.nome || 'produtor');

    preencherCampo('perfil-nome', usuario.nome);
    preencherCampo('perfil-arroba', '@' + (usuario.username || ''));
    preencherCampo('perfil-slogan', usuario.slogan, '');

    if (!usuario.slogan) {
        document.getElementById('perfil-slogan').style.display = 'none';
    }

    const enderecoCompleto = [usuario.endereco, usuario.complemento]
        .filter(parte => parte && parte.trim())
        .join(' - ');

    preencherCampo('info-tenda', usuario.tenda);
    preencherCampo('info-endereco', enderecoCompleto);
    preencherCampo('info-telefone', usuario.telefone);
    preencherCampo('info-cnpj', usuario.cnpj);
    preencherCampo('info-descricao', usuario.descricao);

    function mostrarErroFoto(mensagem) {
        erroFoto.textContent = mensagem;
        erroFoto.hidden = false;
    }

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

            const fotoAnterior = usuario.foto;
            usuario.foto = imagemSalva;

            try {
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                foto.src = imagemSalva;
            } catch {
                usuario.foto = fotoAnterior;
                mostrarErroFoto('Não foi possível salvar a foto. Tente uma imagem menor.');
            }
        });
    });
}
