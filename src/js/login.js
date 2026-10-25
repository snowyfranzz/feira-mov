const form = document.getElementById('form-login');
const campoLogin = document.getElementById('login');
const campoSenha = document.getElementById('senha');
const erro = document.getElementById('erro-login');
const msgSucesso = document.getElementById('msg-sucesso');
const btnGoogle = document.querySelector('.btn-google');
const linkEsqueci = document.querySelector('.esqueci');

function mostrarErro(mensagem) {
    erro.textContent = mensagem;
    erro.hidden = false;
}

function limparErro() {
    erro.textContent = '';
    erro.hidden = true;
}

function lerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch {
        return [];
    }
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (new URLSearchParams(window.location.search).get('cadastro') === 'ok') {
    msgSucesso.hidden = false;
}

form.addEventListener('submit', (evento) => {
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

    const usuario = lerUsuarios().find(u =>
        (u.email === login || u.username.toLowerCase() === login) && u.senha === senha
    );

    if (!usuario) {
        mostrarErro('E-mail/username ou senha incorretos.');
        return;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        username: usuario.username
    }));

    window.location.href = 'perfil-usuario.html';
});

[campoLogin, campoSenha].forEach(campo =>
    campo.addEventListener('input', limparErro)
);

btnGoogle.addEventListener('click', () => {
    alert('Agradecemos ao login!');
});

linkEsqueci.addEventListener('click', (evento) => {
    evento.preventDefault();
    alert('Recuperação de senha em breve!');
});
