// Busca geral do site (página busca.html?q=termo).
// Abre as páginas do site, junta os cards de eventos, produtores e produtos que existem nelas
// e mostra os que têm todas as palavras pesquisadas.
(function () {
    // páginas lidas pela busca; para uma página nova entrar na busca, basta colocar o nome dela aqui
    var PAGINAS = [
        'index.html',
        'eventos.html',
        'produtores.html',
        'evento1.html',
        'evento2.html',
        'perfil-produtor1.html',
        'perfil-produtor2.html',
        'perfil-produtor3.html',
        'perfil-produtor4.html'
    ];

    var titulo = document.getElementById('busca-titulo');
    var aviso = document.getElementById('busca-aviso');
    var secoes = {
        eventos: document.getElementById('resultado-eventos'),
        produtores: document.getElementById('resultado-produtores'),
        produtos: document.getElementById('resultado-produtos')
    };

    var termo = (new URLSearchParams(window.location.search).get('q') || '').trim();

    // mesmo jeito do filtro.js: minúsculas e sem acentos, para "pao" encontrar "Pão"
    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    }

    // nome (h3), linhas de informação (p) e preço (strong) do card, sem o texto dos botões
    function textoDoCard(card) {
        var partes = [];
        card.querySelectorAll('h3, p, strong').forEach(function (el) { partes.push(el.textContent); });
        return normalizar(partes.join(' '));
    }

    function mostrarAviso(texto) {
        aviso.textContent = texto;
        aviso.hidden = false;
    }

    // produto da página de perfil: o card tem outro formato, então é montado no formato da página inicial
    // (o mesmo que o carrinho.js sabe ler), com o nome do produtor e o link para o perfil
    function cardDoPerfil(article, produtor, pagina) {
        var nome = article.querySelector('h3');
        var detalhe = article.querySelector('h3 + p');
        var preco = article.querySelector('strong');
        var foto = article.querySelector('img');

        var card = document.createElement('article');

        var img = document.createElement('img');
        if (foto) img.setAttribute('src', foto.getAttribute('src'));
        img.alt = nome ? nome.textContent.trim() : '';
        card.appendChild(img);

        var info = document.createElement('div');
        info.className = 'card-info';

        var h3 = document.createElement('h3');
        h3.textContent = nome ? nome.textContent.trim() : '';
        info.appendChild(h3);

        if (detalhe) {
            var p = document.createElement('p');
            p.textContent = detalhe.textContent.trim();
            info.appendChild(p);
        }

        var pProdutor = document.createElement('p');
        pProdutor.className = 'produto-produtor';
        var link = document.createElement('a');
        link.href = pagina;
        link.textContent = produtor;
        pProdutor.appendChild(link);
        info.appendChild(pProdutor);

        var pPreco = document.createElement('p');
        pPreco.className = 'preco';
        pPreco.textContent = preco ? preco.textContent.trim() : '';
        info.appendChild(pPreco);

        var botao = document.createElement('button');
        botao.type = 'button';
        botao.setAttribute('data-adicionar-carrinho', '');
        botao.textContent = 'Adicionar';
        info.appendChild(botao);

        card.appendChild(info);
        return card;
    }

    // separa os cards de uma página em eventos, produtores e produtos
    function cardsDaPagina(doc, pagina) {
        var achados = { eventos: [], produtores: [], produtos: [] };

        doc.querySelectorAll('.feiras-grid > article').forEach(function (card) {
            achados.eventos.push(card);
        });
        doc.querySelectorAll('.produtores-grid > a, .produtores-grid > article').forEach(function (card) {
            achados.produtores.push(card);
        });
        doc.querySelectorAll('.produtos-grid > article').forEach(function (card) {
            achados.produtos.push(card);
        });

        // páginas de perfil: os produtos ficam em .lista-produtos e o produtor é o título da página
        var banner = doc.querySelector('.perfil-banner h1');
        if (banner) {
            doc.querySelectorAll('.lista-produtos > article').forEach(function (article) {
                achados.produtos.push(cardDoPerfil(article, banner.textContent.trim(), pagina));
            });
        }
        return achados;
    }

    function lerPagina(pagina) {
        return fetch(pagina).then(function (resposta) {
            if (!resposta.ok) throw new Error(pagina + ': ' + resposta.status);
            return resposta.text();
        }).then(function (html) {
            return cardsDaPagina(new DOMParser().parseFromString(html, 'text/html'), pagina);
        });
    }

    function mostrarResultados(paginas) {
        var palavras = normalizar(termo).split(/\s+/);
        var total = 0;

        Object.keys(secoes).forEach(function (tipo) {
            var grade = secoes[tipo].querySelector('div');
            var vistos = {};
            var quantidade = 0;

            paginas.forEach(function (achados) {
                achados[tipo].forEach(function (card) {
                    var texto = textoDoCard(card);
                    // o mesmo card aparece em várias páginas (ex.: produtor na inicial e em produtores.html)
                    if (vistos[texto]) return;
                    vistos[texto] = true;

                    var corresponde = palavras.every(function (p) { return texto.indexOf(p) !== -1; });
                    if (!corresponde) return;

                    grade.appendChild(document.importNode(card, true));
                    quantidade++;
                });
            });

            secoes[tipo].querySelector('h2').textContent =
                secoes[tipo].querySelector('h2').textContent + ' (' + quantidade + ')';
            secoes[tipo].hidden = quantidade === 0;
            total += quantidade;
        });

        if (total === 0) {
            mostrarAviso('Nenhum resultado. Tente outra palavra, como o nome de um produto, produtor ou bairro.');
        } else {
            aviso.hidden = true;
        }
    }

    // deixa o termo na lupa e na barra do topo da página, para a pessoa poder corrigir e pesquisar de novo
    document.querySelectorAll('#busca-input, .busca-pagina-barra input').forEach(function (campo) {
        campo.value = termo;
    });

    if (!termo) {
        titulo.textContent = 'Busca';
        // texto sem citar "a barra acima", porque no celular ela fica escondida e só a lupa aparece
        mostrarAviso('Digite o que você procura para ver eventos, produtores e produtos.');
        return;
    }

    titulo.textContent = 'Resultados para "' + termo + '"';
    document.title = 'FeiraMov — Busca: ' + termo;

    Promise.all(PAGINAS.map(lerPagina))
        .then(mostrarResultados)
        .catch(function (erro) {
            console.error('Busca: não deu para ler uma das páginas.', erro);
            mostrarAviso('Não foi possível carregar os resultados. Confira se todas as páginas da lista PAGINAS (js/busca.js) existem.');
        });
})();
