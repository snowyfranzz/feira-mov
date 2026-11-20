// Fale Conosco — FeiraMov
// Sem servidor, as mensagens enviadas ficam guardadas no localStorage em 'mensagensContato'.

const CHAVE_MENSAGENS = 'mensagensContato';

const formContato = document.getElementById('form-contato');
const campoNome = document.getElementById('contato-nome');
const campoEmail = document.getElementById('contato-email');
const campoAssunto = document.getElementById('contato-assunto');
const campoMensagem = document.getElementById('contato-mensagem');
const erroContato = document.getElementById('contato-erro');
const sucessoContato = document.getElementById('contato-sucesso');

// Quem está logado não precisa digitar nome e e-mail de novo.
const contaLogada = Auth.usuarioLogado();
if (contaLogada) {
    campoNome.value = contaLogada.nome || '';
    campoEmail.value = contaLogada.email || '';
}

function lerMensagens() {
    try {
        const mensagens = JSON.parse(localStorage.getItem(CHAVE_MENSAGENS));
        return Array.isArray(mensagens) ? mensagens : [];
    } catch {
        return [];
    }
}

function mostrarErroContato(mensagem, campo) {
    erroContato.textContent = mensagem;
    erroContato.hidden = false;
    if (campo) campo.focus();
}

formContato.addEventListener('submit', evento => {
    evento.preventDefault();
    erroContato.hidden = true;
    sucessoContato.hidden = true;

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim().toLowerCase();
    const mensagem = campoMensagem.value.trim();

    if (!nome) return mostrarErroContato('Informe o seu nome.', campoNome);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarErroContato('Informe um e-mail válido.', campoEmail);
    if (!campoAssunto.value) return mostrarErroContato('Escolha um assunto.', campoAssunto);
    if (mensagem.length < 10) return mostrarErroContato('Escreva uma mensagem com pelo menos 10 caracteres.', campoMensagem);

    const mensagens = lerMensagens();
    mensagens.push({
        nome,
        email,
        assunto: campoAssunto.value,
        mensagem,
        username: contaLogada ? contaLogada.username : null,
        enviadaEm: new Date().toISOString()
    });

    try {
        localStorage.setItem(CHAVE_MENSAGENS, JSON.stringify(mensagens));
    } catch {
        return mostrarErroContato('Não foi possível enviar a mensagem neste navegador.');
    }

    // Mantém nome e e-mail para uma próxima mensagem; limpa só o conteúdo.
    campoAssunto.value = '';
    campoMensagem.value = '';
    sucessoContato.hidden = false;
});

[campoNome, campoEmail, campoAssunto, campoMensagem].forEach(campo =>
    campo.addEventListener('input', () => { erroContato.hidden = true; })
);

// As redes sociais ainda não existem de verdade.
document.querySelectorAll('[data-rede]').forEach(link =>
    link.addEventListener('click', evento => {
        evento.preventDefault();
        alert('Nossas redes sociais estão chegando em breve!');
    })
);
