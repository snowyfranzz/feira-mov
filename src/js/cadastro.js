// Cadastro de usuários e produtores — FeiraMov

const etapa1 = document.getElementById('etapa1');
const etapa2 = document.getElementById('etapa2');
const passo = document.getElementById('passo');
const produtor = document.getElementById('produtor');
const erroEtapa1 = document.getElementById('erro-etapa1');
const erroEtapa2 = document.getElementById('erro-etapa2');

const camposProdutor = ['tenda', 'slogan', 'telefone', 'cnpj', 'descricao']
    .map(id => document.getElementById(id));

// O slogan é opcional; os outros campos do produtor são obrigatórios.
const opcionaisProdutor = ['slogan'];

// Quem já está logado não precisa criar outra conta.
const jaLogado = Auth.usuarioLogado();
if (jaLogado) {
    window.location.replace(Auth.paginaDaConta(jaLogado));
}

function valor(id) {
    return document.getElementById(id).value.trim();
}

function apenasDigitos(texto) {
    return texto.replace(/\D/g, '');
}

// "12345678909" -> "123.456.789-09" (formata também enquanto a pessoa digita)
function formatarCPF(texto) {
    const d = apenasDigitos(texto).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// Confere os dois dígitos verificadores do CPF (os dois últimos números).
function cpfValido(texto) {
    const d = apenasDigitos(texto);

    // Precisa ter 11 dígitos e não pode ser tudo igual (111.111.111-11 passaria na conta).
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

    function digitoVerificador(quantidade) {
        // Multiplica os primeiros dígitos por pesos decrescentes (10, 9, 8... ou 11, 10, 9...).
        let soma = 0;
        for (let i = 0; i < quantidade; i++) {
            soma += Number(d[i]) * (quantidade + 1 - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    }

    return digitoVerificador(9) === Number(d[9]) &&
        digitoVerificador(10) === Number(d[10]);
}

const campoCPF = document.getElementById('cpf');

campoCPF.addEventListener('input', () => {
    campoCPF.value = formatarCPF(campoCPF.value);
    erroEtapa2.hidden = true;
});

function mostrarErro(elemento, mensagem) {
    elemento.textContent = mensagem;
    elemento.hidden = false;
}

// Ativa ou desativa todos os campos específicos do produtor.
function atualizarCamposProdutor() {
    camposProdutor.forEach(campo => {
        campo.disabled = !produtor.checked;
        campo.required = produtor.checked && !opcionaisProdutor.includes(campo.id);

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

    const username = valor('username').toLowerCase();
    const email = valor('email').toLowerCase();
    const usuarios = Auth.lerUsuarios();

    if (!/^[a-z0-9_.]{3,20}$/.test(username)) {
        mostrarErro(erroEtapa1, 'O username deve ter de 3 a 20 caracteres: letras, números, "_" ou ".".');
        return;
    }

    if (Auth.buscarPorUsername(usuarios, username)) {
        mostrarErro(erroEtapa1, 'Esse username já está em uso.');
        return;
    }

    if (Auth.buscarPorEmail(usuarios, email)) {
        mostrarErro(erroEtapa1, 'Já existe uma conta com esse e-mail.');
        return;
    }

    etapa1.hidden = true;
    etapa2.hidden = false;
    passo.textContent = 'Passo 2 de 2';
    document.getElementById('nome').focus();
});

document.getElementById('voltar').addEventListener('click', () => {
    erroEtapa2.hidden = true;
    etapa2.hidden = true;
    etapa1.hidden = false;
    passo.textContent = 'Passo 1 de 2';
});

// Segunda etapa: reúne e salva os dados pessoais e, se aplicável, os dados do produtor.
etapa2.addEventListener('submit', evento => {
    evento.preventDefault();
    erroEtapa2.hidden = true;

    if (!etapa2.reportValidity()) return;

    if (apenasDigitos(valor('cpf')).length !== 11) {
        mostrarErro(erroEtapa2, 'O CPF precisa ter 11 dígitos.');
        return;
    }

    if (!cpfValido(valor('cpf'))) {
        mostrarErro(erroEtapa2, 'CPF inválido. Confira os números digitados.');
        return;
    }

    if (produtor.checked) {
        const digitosTelefone = apenasDigitos(valor('telefone')).length;
        if (digitosTelefone < 10 || digitosTelefone > 11) {
            mostrarErro(erroEtapa2, 'Informe o telefone com DDD (10 ou 11 dígitos).');
            return;
        }

        if (apenasDigitos(valor('cnpj')).length !== 14) {
            mostrarErro(erroEtapa2, 'O CNPJ precisa ter 14 dígitos.');
            return;
        }
    }

    const novoUsuario = {
        username: valor('username').toLowerCase(),
        email: valor('email').toLowerCase(),
        senha: document.getElementById('senha').value,
        nome: valor('nome'),
        cpf: formatarCPF(valor('cpf')),
        endereco: valor('endereco'),
        complemento: valor('complemento'),
        criadoEm: new Date().toISOString(),

        // Dados específicos do produtor.
        produtor: produtor.checked,
        tenda: produtor.checked ? valor('tenda') : '',
        slogan: produtor.checked ? valor('slogan') : '',
        telefone: produtor.checked ? valor('telefone') : '',
        cnpj: produtor.checked ? valor('cnpj') : '',
        descricao: produtor.checked ? valor('descricao') : ''
    };

    const usuarios = Auth.lerUsuarios();

    // Verificação adicional antes de salvar (outra aba pode ter criado a conta nesse meio-tempo).
    if (Auth.buscarPorUsername(usuarios, novoUsuario.username) ||
        Auth.buscarPorEmail(usuarios, novoUsuario.email)) {
        mostrarErro(erroEtapa2, 'Já existe uma conta com esse e-mail ou username. Volte e confira os dados.');
        return;
    }

    usuarios.push(novoUsuario);

    if (!Auth.salvarUsuarios(usuarios)) {
        mostrarErro(erroEtapa2, 'Não foi possível salvar o cadastro neste navegador. Verifique o espaço disponível.');
        return;
    }

    // Conta criada: já abre a sessão e leva para a página da conta.
    Auth.entrar(novoUsuario);
    window.location.href = Auth.paginaDaConta(novoUsuario);
});
