// Cadastro de usuários e produtores — FeiraMov

const etapa1 = document.getElementById('etapa1');
const etapa2 = document.getElementById('etapa2');
const passo = document.getElementById('passo');
const produtor = document.getElementById('produtor');
const erroEtapa1 = document.getElementById('erro-etapa1');

const camposProdutor = [
    document.getElementById('tenda'),
    document.getElementById('slogan'),
    document.getElementById('telefone'),
    document.getElementById('cnpj'),
    document.getElementById('descricao')
];

function lerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem('usuarios')) || [];
    } catch {
        return [];
    }
}

// Ativa ou desativa todos os campos específicos do produtor.
function atualizarCamposProdutor() {
    camposProdutor.forEach(campo => {
        campo.disabled = !produtor.checked;
        campo.required = produtor.checked;

        if (!produtor.checked) {
            campo.value = '';
        }
    });
}

produtor.addEventListener('change', atualizarCamposProdutor);
atualizarCamposProdutor();

// Primeira etapa: valida os dados de acesso e avança para a segunda etapa.
document.getElementById('continuar').addEventListener('click', () => {
    erroEtapa1.hidden = true;

    if (!etapa1.reportValidity()) return;

    const username = document.getElementById('username').value.trim().toLowerCase();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const usuarios = lerUsuarios();

    if (usuarios.some(usuario =>
        (usuario.username || '').toLowerCase() === username
    )) {
        erroEtapa1.textContent = 'Esse username já está em uso.';
        erroEtapa1.hidden = false;
        return;
    }

    if (usuarios.some(usuario =>
        (usuario.email || '').toLowerCase() === email
    )) {
        erroEtapa1.textContent = 'Já existe uma conta com esse e-mail.';
        erroEtapa1.hidden = false;
        return;
    }

    etapa1.hidden = true;
    etapa2.hidden = false;
    passo.textContent = 'Passo 2 de 2';
});

// Segunda etapa: reúne e salva os dados pessoais e, se aplicável, os dados do produtor.
etapa2.addEventListener('submit', evento => {
    evento.preventDefault();

    if (!etapa2.reportValidity()) return;

    const novoUsuario = {
        username: document.getElementById('username').value.trim().toLowerCase(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: document.getElementById('senha').value,
        nome: document.getElementById('nome').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        complemento: document.getElementById('complemento').value.trim(),

        // Dados específicos do produtor.
        produtor: produtor.checked,
        tenda: produtor.checked ? document.getElementById('tenda').value.trim() : '',
        slogan: produtor.checked ? document.getElementById('slogan').value.trim() : '',
        telefone: produtor.checked ? document.getElementById('telefone').value.trim() : '',
        cnpj: produtor.checked ? document.getElementById('cnpj').value.trim() : '',
        descricao: produtor.checked ? document.getElementById('descricao').value.trim() : ''
    };

    const usuarios = lerUsuarios();

    // Verificação adicional antes de salvar.
    if (usuarios.some(usuario => usuario.email === novoUsuario.email ||
        (usuario.username || '').toLowerCase() === novoUsuario.username)) {
        alert('Já existe uma conta com esse e-mail ou username. Volte à primeira etapa e confira os dados.');
        return;
    }

    usuarios.push(novoUsuario);

    try {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        window.location.href = 'login.html?cadastro=ok';
    } catch {
        alert('Não foi possível salvar o cadastro neste navegador. Verifique o espaço disponível.');
    }
});
