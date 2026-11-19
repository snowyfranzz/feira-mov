// Login — FeiraMov

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

    const usuario = lerUsuarios().find(u =>
        ((u.email || '').toLowerCase() === login ||
         (u.username || '').toLowerCase() === login) &&
        u.senha === senha
    );

    if (!usuario) {
        mostrarErro('E-mail/username ou senha incorretos.');
        return;
    }

    // Guarda a identificação da conta que está usando o sistema.
    localStorage.setItem('usuarioLogado', JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        username: usuario.username,
        produtor: Boolean(usuario.produtor)
    }));

    // Produtores vão para o perfil de produtor; demais usuários seguem para o perfil comum.
    window.location.href = usuario.produtor
        ? 'perfil-produtor1.html'
        : 'perfil-usuario.html';
});

[campoLogin, campoSenha].forEach(campo =>
    campo.addEventListener('input', limparErro)
);

if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
        alert('Agradecemos ao login!');
    });
}

if (linkEsqueci) {
    linkEsqueci.addEventListener('click', evento => {
        evento.preventDefault();
        alert('Recuperação de senha em breve!');
    });
}
