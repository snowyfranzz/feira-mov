// Login — FeiraMov

const form = document.getElementById('form-login');
const campoLogin = document.getElementById('login');
const campoSenha = document.getElementById('senha');
const erro = document.getElementById('erro-login');
const msgSucesso = document.getElementById('msg-sucesso');
const btnGoogle = document.querySelector('.btn-google');
const linkEsqueci = document.querySelector('.esqueci');

// Quem já está logado não precisa ver o login de novo.
const jaLogado = Auth.usuarioLogado();
if (jaLogado) {
    window.location.replace(Auth.paginaDaConta(jaLogado));
}

function mostrarErro(mensagem) {
    erro.textContent = mensagem;
    erro.hidden = false;
}

function limparErro() {
    erro.textContent = '';
    erro.hidden = true;
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (new URLSearchParams(window.location.search).get('cadastro') === 'ok') {
    msgSucesso.hidden = false;
}

form.addEventListener('submit', evento => {
    evento.preventDefault();
    limparErro();

    const login = campoLogin.value.trim().toLowerCase();
    const senha = campoSenha.value;

    if (!login || !senha) {
        mostrarErro('Preencha todos os campos.');
        return;
    }

    if (login.includes('@') && !emailValido(login)) {
        mostrarErro('E-mail inválido.');
        return;
    }

    const usuarios = Auth.lerUsuarios();
    const usuario = login.includes('@')
        ? Auth.buscarPorEmail(usuarios, login)
        : Auth.buscarPorUsername(usuarios, login);

    if (!usuario || usuario.senha !== senha) {
        mostrarErro('E-mail/username ou senha incorretos.');
        return;
    }

    Auth.entrar(usuario);

    // Produtores vão para a própria barraca; demais usuários seguem para o perfil comum.
    window.location.href = Auth.paginaDaConta(usuario);
});

[campoLogin, campoSenha].forEach(campo =>
    campo.addEventListener('input', limparErro)
);

if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
        alert('Login com o Google em breve!');
    });
}

if (linkEsqueci) {
    linkEsqueci.addEventListener('click', evento => {
        evento.preventDefault();
        alert('Recuperação de senha em breve!');
    });
}
