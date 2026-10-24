// Menu lateral (mobile), tela de busca e pop-up do carrinho: abrem/fecham por botões e se excluem mutuamente
(function () {
    var botao = document.getElementById('menu-btn');
    var overlay = document.getElementById('sidebar-overlay');
    var busca = document.getElementById('busca-overlay');
    var campo = document.getElementById('busca-input');
    var gatilhos = document.querySelectorAll('[data-abrir-busca]');
    var carrinhoOverlay = document.getElementById('carrinho-overlay');
    var gatilhosCarrinho = document.querySelectorAll('[data-abrir-carrinho]');

    function menu(aberto) {
        if (!botao || !overlay) return;
        document.body.classList.toggle('menu-aberto', aberto);
        botao.setAttribute('aria-expanded', aberto);
        botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    }

    function pesquisa(aberta) {
        if (!busca) return;
        document.body.classList.toggle('busca-aberta', aberta);
        gatilhos.forEach(function (g) { g.setAttribute('aria-expanded', aberta); });
        if (aberta && campo) campo.focus();
    }

    function carrinho(aberto) {
        if (!carrinhoOverlay) return;
        document.body.classList.toggle('carrinho-aberto', aberto);
        gatilhosCarrinho.forEach(function (g) { g.setAttribute('aria-expanded', aberto); });
    }

    if (botao && overlay) {
        botao.addEventListener('click', function () {
            var abrir = !document.body.classList.contains('menu-aberto');
            if (abrir) {
                pesquisa(false);
                carrinho(false);
            }
            menu(abrir);
        });

        // clicar na área escurecida fecha o menu
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) menu(false);
        });

        // ao voltar para o desktop, garante que o menu fique fechado
        window.matchMedia('(min-width: 769px)').addEventListener('change', function (e) {
            if (e.matches) menu(false);
        });
    }

    if (busca) {
        gatilhos.forEach(function (g) {
            g.addEventListener('click', function (e) {
                e.preventDefault();
                var abrir = !document.body.classList.contains('busca-aberta');
                if (abrir) {
                    menu(false);
                    carrinho(false);
                }
                pesquisa(abrir);
            });
        });

        // clicar fora da barra (no fundo da tela de busca) fecha
        busca.addEventListener('click', function (e) {
            if (e.target === busca || e.target.classList.contains('busca-painel')) pesquisa(false);
        });
    }

    if (carrinhoOverlay) {
        gatilhosCarrinho.forEach(function (g) {
            g.addEventListener('click', function (e) {
                e.preventDefault();
                var abrir = !document.body.classList.contains('carrinho-aberto');
                if (abrir) {
                    menu(false);
                    pesquisa(false);
                }
                carrinho(abrir);
            });
        });

        // clicar no fundo escurecido ou no "x" fecha o pop-up
        carrinhoOverlay.addEventListener('click', function (e) {
            if (e.target === carrinhoOverlay || e.target.closest('[data-fechar-carrinho]')) carrinho(false);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        menu(false);
        pesquisa(false);
        carrinho(false);
    });
})();
