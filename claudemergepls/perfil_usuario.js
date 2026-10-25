
function lerJSON(chave, padrao) {
    try {
        return JSON.parse(localStorage.getItem(chave)) || padrao;
    } catch {
        return padrao;
    }
}
 
const sessao = lerJSON('usuarioLogado', null);
const usuarios = lerJSON('usuarios', []);
const usuario = sessao && usuarios.find(u => u.email === sessao.email);
 
if (!usuario) {
    window.location.href = 'login.html';
} else {
    document.getElementById('perfil-nome').textContent = usuario.nome;
    document.getElementById('perfil-arroba').textContent = '@' + usuario.username;
    document.getElementById('info-username').textContent = usuario.username;
    document.getElementById('info-email').textContent = usuario.email;
 
    const endereco = usuario.complemento
        ? `${usuario.endereco} - ${usuario.complemento}`
        : usuario.endereco;
    document.getElementById('info-endereco').textContent = endereco;
 
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
}
 