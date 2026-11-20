// Contas e sessão — FeiraMov
// Tudo fica no localStorage: 'usuarios' guarda as contas cadastradas
// e 'usuarioLogado' guarda o username de quem está com a sessão aberta.
const Auth = (function () {
    var CHAVE_USUARIOS = 'usuarios';
    var CHAVE_SESSAO = 'usuarioLogado';

    function lerJSON(chave, padrao) {
        try {
            return JSON.parse(localStorage.getItem(chave)) ?? padrao;
        } catch (e) {
            return padrao;
        }
    }

    function lerUsuarios() {
        var usuarios = lerJSON(CHAVE_USUARIOS, []);
        return Array.isArray(usuarios) ? usuarios : [];
    }

    // Devolve false se o navegador não deixar salvar (ex.: espaço cheio).
    function salvarUsuarios(usuarios) {
        try {
            localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
            return true;
        } catch (e) {
            return false;
        }
    }

    function buscarPorUsername(usuarios, username) {
        var alvo = (username || '').toLowerCase();
        return usuarios.find(function (u) {
            return (u.username || '').toLowerCase() === alvo;
        });
    }

    function buscarPorEmail(usuarios, email) {
        var alvo = (email || '').toLowerCase();
        return usuarios.find(function (u) {
            return (u.email || '').toLowerCase() === alvo;
        });
    }

    // Conta da sessão atual, ou null se ninguém estiver logado.
    function usuarioLogado() {
        var sessao = lerJSON(CHAVE_SESSAO, null);
        if (!sessao || !sessao.username) return null;
        return buscarPorUsername(lerUsuarios(), sessao.username) || null;
    }

    function entrar(usuario) {
        localStorage.setItem(CHAVE_SESSAO, JSON.stringify({ username: usuario.username }));
    }

    function sair() {
        localStorage.removeItem(CHAVE_SESSAO);
        window.location.href = 'login.html';
    }

    // Página "minha conta" de acordo com o tipo de conta.
    function paginaDaConta(usuario) {
        return usuario.produtor ? 'minha-barraca.html' : 'perfil-usuario.html';
    }

    // Usado nas páginas restritas: sem sessão volta para o login.
    function exigirLogin() {
        var usuario = usuarioLogado();
        if (!usuario) window.location.replace('login.html');
        return usuario;
    }

    // Com sessão aberta, os links "Minha conta" levam direto à página da conta.
    var atual = usuarioLogado();
    if (atual) {
        document.querySelectorAll('a[href="login.html"]').forEach(function (link) {
            if (link.closest('.auth')) return; // links dentro dos formulários continuam iguais
            link.href = paginaDaConta(atual);
        });
    }

    return {
        lerUsuarios: lerUsuarios,
        salvarUsuarios: salvarUsuarios,
        buscarPorUsername: buscarPorUsername,
        buscarPorEmail: buscarPorEmail,
        usuarioLogado: usuarioLogado,
        entrar: entrar,
        sair: sair,
        paginaDaConta: paginaDaConta,
        exigirLogin: exigirLogin
    };
})();
