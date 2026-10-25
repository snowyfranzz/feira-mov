const etapa1 = document.getElementById('etapa1');
const etapa2 = document.getElementById('etapa2');
const passo = document.getElementById('passo');
const produtor = document.getElementById('produtor');
const tenda = document.getElementById('tenda');
const erroEtapa1 = document.getElementById('erro-etapa1');

function lerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch {
        return [];
    }
}

document.getElementById('continuar').addEventListener('click', () => {
    erroEtapa1.hidden = true;
    if (!etapa1.reportValidity()) return;

    const username = document.getElementById('username').value.trim().toLowerCase();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const usuarios = lerUsuarios();

    if (usuarios.some(u => u.username.toLowerCase() === username)) {
        erroEtapa1.textContent = 'Esse username já está em uso.';
        erroEtapa1.hidden = false;
        return;
    }

    if (usuarios.some(u => u.email === email)) {
        erroEtapa1.textContent = 'Já existe uma conta com esse e-mail.';
        erroEtapa1.hidden = false;
        return;
    }

    etapa1.hidden = true;
    etapa2.hidden = false;
    passo.textContent = 'Passo 2 de 2';
});

produtor.addEventListener('change', () => {
    tenda.disabled = !produtor.checked;
    tenda.required = produtor.checked;
    if (!produtor.checked) tenda.value = '';
});

etapa2.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const novoUsuario = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: document.getElementById('senha').value,
        nome: document.getElementById('nome').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        complemento: document.getElementById('complemento').value.trim(),
        produtor: produtor.checked,
        tenda: produtor.checked ? tenda.value.trim() : ''
    };

    const usuarios = lerUsuarios();
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    window.location.href = 'login.html?cadastro=ok';
});
