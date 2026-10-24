(function () {
    var CHAVE = 'feiramov-carrinho';
    var lista = document.getElementById('carrinho-itens');
    var vazio = document.getElementById('carrinho-vazio');
    var total = document.getElementById('carrinho-total');
    var botoesAdicionar = document.querySelectorAll('[data-adicionar-carrinho]');
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

    // monta a lista do pop-up a partir dos itens salvos
    function desenhar() {
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

    botoesAdicionar.forEach(function (botao) {
        botao.addEventListener('click', function () {
            adicionar(lerProduto(botao));

            // aviso rápido no próprio botão
            botao.textContent = 'Adicionado!';
            botao.disabled = true;
            setTimeout(function () {
                botao.textContent = 'Adicionar';
                botao.disabled = false;
            }, 900);
        });
    });

    // se o carrinho mudar em outra aba, atualiza esta também
    window.addEventListener('storage', function (e) {
        if (e.key !== CHAVE) return;
        itens = carregar();
        desenhar();
    });

    desenhar();
})();
