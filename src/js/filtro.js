// Filtro de pesquisa rápida dos cards (eventos, produtores e produtos).
// Baseado no iniciarFiltroEventos() do Giorgio: cria uma barra de pesquisa abaixo do título
// da seção e esconde, enquanto a pessoa digita, os cards que não têm o texto procurado.
// Para ligar numa grade, basta colocar nela o atributo data-filtro com o texto do placeholder:
//   <div class="produtores-grid" data-filtro="Pesquisar produtor ou categoria...">
(function () {
    // deixa o texto em minúsculas e sem acentos, para "pao" encontrar "Pão"
    function normalizar(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    }

    // junta o nome (h3) e as linhas de informação (p) do card, sem o texto dos botões
    function textoDoCard(item) {
        var partes = [];
        item.querySelectorAll('h3, p').forEach(function (el) { partes.push(el.textContent); });
        return normalizar(partes.join(' '));
    }

    function iniciarFiltro(grid) {
        // cada card é um filho direto da grade: um <a> em volta do <article>, ou o <article> sozinho
        var itens = Array.prototype.slice.call(grid.children).filter(function (el) {
            return el.matches('a, article');
        });
        if (itens.length === 0) return;

        var textos = itens.map(textoDoCard);
        var secao = grid.closest('section') || grid.parentElement;
        var titulo = secao.querySelector('h2');
        var nomeSecao = titulo ? titulo.textContent.trim() : 'itens';

        var barra = document.createElement('div');
        barra.className = 'filtro-barra';

        var campo = document.createElement('input');
        campo.type = 'search';
        campo.className = 'filtro-input';
        campo.placeholder = grid.getAttribute('data-filtro') || 'Pesquisar...';
        campo.setAttribute('aria-label', 'Pesquisar em ' + nomeSecao);
        barra.appendChild(campo);

        var vazio = document.createElement('p');
        vazio.className = 'filtro-vazio';
        vazio.setAttribute('role', 'status');
        vazio.hidden = true;

        if (titulo) {
            titulo.insertAdjacentElement('afterend', barra);
        } else {
            secao.prepend(barra);
        }
        grid.insertAdjacentElement('afterend', vazio);

        function filtrar() {
            var termo = normalizar(campo.value);
            var visiveis = 0;

            itens.forEach(function (item, i) {
                var corresponde = textos[i].indexOf(termo) !== -1;
                item.style.display = corresponde ? '' : 'none';
                if (corresponde) visiveis++;
            });

            vazio.textContent = 'Nenhum resultado para "' + campo.value.trim() + '".';
            vazio.hidden = visiveis !== 0;
        }

        campo.addEventListener('input', filtrar);
    }

    document.querySelectorAll('[data-filtro]').forEach(iniciarFiltro);
})();
