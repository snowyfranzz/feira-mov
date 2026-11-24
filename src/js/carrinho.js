(function () {
    var CHAVE = 'feiramov-carrinho';
    var lista = document.getElementById('carrinho-itens');
    var vazio = document.getElementById('carrinho-vazio');
    var total = document.getElementById('carrinho-total');
        // tela de pagamento (Pagamento.html): só mostra os itens do carrinho, nada é enviado
    var DESCONTO = 0;   // valor em reais abatido da compra
    var FRETE = 0;      // valor em reais; 0 aparece como "Grátis"
    var pagItens = document.getElementById('pagamento-itens');
    var itens = carregar();

    function carregar() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE)) || [];
        } catch (e) {
            return [];
        }
    }

    function salvar() {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(itens));
        } catch (e) {
            // sem localStorage (ex.: aba anônima) o carrinho só vale para a página atual
        }
    }

    // "R$ 18,90" -> 18.9
    function lerPreco(texto) {
        return parseFloat(texto.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    // 18.9 -> "R$ 18,90"
    function formatarPreco(valor) {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    }

    // pega nome, detalhe, preço e foto do card onde o botão foi clicado
    function lerProduto(botao) {
        var card = botao.closest('article');
        var nome = card.querySelector('h3').textContent.trim();
        var detalhe = card.querySelector('h3 + p');
        var preco = card.querySelector('.preco, strong');
        var foto = card.querySelector('img');
        // produtor: na página inicial vem do próprio card; no perfil, do nome no topo da página
        var produtor = card.querySelector('.produto-produtor a') || document.querySelector('.perfil-banner h1');
        var descricao = detalhe ? detalhe.textContent.trim() : '';

        if (produtor) descricao += (descricao ? ' · ' : '') + produtor.textContent.trim();

        return {
            id: nome + '|' + descricao,
            nome: nome,
            descricao: descricao,
            preco: preco ? lerPreco(preco.textContent) : 0,
            foto: foto ? foto.getAttribute('src') : '',
            quantidade: 1
        };
    }

    function adicionar(produto) {
        var existente = itens.find(function (item) { return item.id === produto.id; });
        if (existente) existente.quantidade += 1;
        else itens.push(produto);
        atualizar();
    }

    function mudarQuantidade(id, diferenca) {
        var item = itens.find(function (i) { return i.id === id; });
        if (!item) return;
        item.quantidade += diferenca;
        if (item.quantidade <= 0) remover(id);
        else atualizar();
    }

    function remover(id) {
        itens = itens.filter(function (item) { return item.id !== id; });
        atualizar();
    }

    function criarBotao(classe, texto, rotulo, acao) {
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.className = classe;
        botao.textContent = texto;
        botao.setAttribute('aria-label', rotulo);
        botao.addEventListener('click', acao);
        return botao;
    }

    // monta o resumo da tela de pagamento (nome + preço de cada item, descontos, frete e total)
    function desenharPagamento() {
        if (!pagItens) return;
        pagItens.innerHTML = '';
        var subtotal = 0;

        itens.forEach(function (item) {
            var valor = item.preco * item.quantidade;
            subtotal += valor;

            var li = document.createElement('li');
            var nome = document.createElement('span');
            nome.textContent = item.nome;
            if (item.quantidade > 1) {
                var qtd = document.createElement('small');
                qtd.textContent = ' × ' + item.quantidade;
                nome.append(qtd);
            }
            var preco = document.createElement('strong');
            preco.textContent = formatarPreco(valor);
            li.append(nome, preco);
            pagItens.append(li);
        });

        var desconto = Math.min(DESCONTO, subtotal);
        var vazioPag = document.getElementById('pagamento-vazio');
        if (vazioPag) vazioPag.hidden = itens.length > 0;
        pagItens.hidden = itens.length === 0;

        document.getElementById('pagamento-subtotal').textContent = formatarPreco(subtotal);
        document.getElementById('pagamento-desconto').textContent = (desconto > 0 ? '− ' : '') + formatarPreco(desconto);
        document.getElementById('pagamento-frete').textContent = FRETE > 0 ? formatarPreco(FRETE) : 'Grátis';
        document.getElementById('pagamento-total').textContent = formatarPreco(subtotal - desconto + FRETE);
    }

    // aviso no canto inferior direito quando algo entra no carrinho
    var aviso = null;
    var avisoTimer = null;

    function mostrarAviso(produto) {
        if (!aviso) {
            aviso = document.createElement('div');
            aviso.className = 'carrinho-aviso';
            aviso.setAttribute('role', 'status');
            aviso.setAttribute('aria-live', 'polite');

            var foto = document.createElement('img');
            foto.alt = '';
            var texto = document.createElement('div');
            texto.className = 'carrinho-aviso-texto';
            var titulo = document.createElement('strong');
            titulo.textContent = 'Adicionado ao carrinho';
            var nome = document.createElement('span');
            texto.append(titulo, nome);

            var ver = document.createElement('button');
            ver.type = 'button';
            ver.className = 'carrinho-aviso-ver';
            ver.textContent = 'Ver carrinho';
            ver.addEventListener('click', function () {
                esconderAviso();
                // reaproveita o botão da topbar (menu.js abre o pop-up); sem ele, vai para o pagamento
                var gatilho = document.querySelector('[data-abrir-carrinho]');
                if (gatilho && document.getElementById('carrinho-overlay')) {
                    if (!document.body.classList.contains('carrinho-aberto')) gatilho.click();
                } else {
                    window.location.href = 'pagamento.html';
                }
            });

            aviso.append(foto, texto, ver);
            document.body.append(aviso);
            // pausa o sumiço enquanto o mouse estiver em cima
            aviso.addEventListener('mouseenter', function () { clearTimeout(avisoTimer); });
            aviso.addEventListener('mouseleave', function () { avisoTimer = setTimeout(esconderAviso, 1500); });
        }

        var img = aviso.querySelector('img');
        img.hidden = !produto.foto;
        if (produto.foto) img.src = produto.foto;
        aviso.querySelector('.carrinho-aviso-texto span').textContent = produto.nome;

        // força o navegador a aplicar o estado inicial antes de animar
        void aviso.offsetWidth;
        aviso.classList.add('visivel');
        clearTimeout(avisoTimer);
        avisoTimer = setTimeout(esconderAviso, 3000);
    }

    function esconderAviso() {
        clearTimeout(avisoTimer);
        if (aviso) aviso.classList.remove('visivel');
    }

    // monta a lista do pop-up a partir dos itens salvos
    function desenhar() {
        document.body.classList.toggle('carrinho-tem-itens', itens.length > 0);
        desenharPagamento();
        if (!lista) return;
        lista.innerHTML = '';
        var soma = 0;

        itens.forEach(function (item) {
            soma += item.preco * item.quantidade;

            var li = document.createElement('li');

            var foto = document.createElement('img');
            foto.src = item.foto;
            foto.alt = item.nome;

            var info = document.createElement('div');
            info.className = 'carrinho-item-info';
            var nome = document.createElement('h3');
            nome.textContent = item.nome;
            var descricao = document.createElement('p');
            descricao.textContent = item.descricao;
            info.append(nome, descricao);

            var quantidade = document.createElement('div');
            quantidade.className = 'carrinho-quantidade';
            var numero = document.createElement('span');
            numero.textContent = item.quantidade;
            quantidade.append(
                criarBotao('carrinho-qtd-btn', '−', 'Diminuir quantidade de ' + item.nome, function () { mudarQuantidade(item.id, -1); }),
                numero,
                criarBotao('carrinho-qtd-btn', '+', 'Aumentar quantidade de ' + item.nome, function () { mudarQuantidade(item.id, 1); })
            );
            info.append(quantidade);

            var lado = document.createElement('div');
            lado.className = 'carrinho-item-lado';
            var preco = document.createElement('strong');
            preco.textContent = formatarPreco(item.preco * item.quantidade);
            var lixeira = criarBotao('carrinho-remover', '', 'Remover ' + item.nome, function () { remover(item.id); });
            var icone = document.createElement('img');
            icone.src = '../../assets/icones/garbage-bin-recycle-bin-svgrepo-com.svg';
            icone.alt = '';
            lixeira.append(icone);
            lado.append(preco, lixeira);

            li.append(foto, info, lado);
            lista.append(li);
        });

        if (vazio) vazio.hidden = itens.length > 0;
        lista.hidden = itens.length === 0;
        if (total) total.textContent = formatarPreco(soma);
    }

    function atualizar() {
        salvar();
        desenhar();
    }

    // um só "ouvinte" na página inteira: assim também funcionam os botões de cards
    // criados depois que a página carregou (como os resultados da busca, em busca.js)
    document.addEventListener('click', function (e) {
        var botao = e.target.closest('[data-adicionar-carrinho]');
        if (!botao || botao.disabled) return;

        var produto = lerProduto(botao);
        adicionar(produto);
        mostrarAviso(produto);

        // aviso rápido no próprio botão
        botao.textContent = 'Adicionado!';
        botao.disabled = true;
        setTimeout(function () {
            botao.textContent = 'Adicionar';
            botao.disabled = false;
        }, 900);
    });

    // se o carrinho mudar em outra aba, atualiza esta também
    window.addEventListener('storage', function (e) {
        if (e.key !== CHAVE) return;
        itens = carregar();
        desenhar();
    });

    desenhar();
})();
