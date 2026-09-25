<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>FeiraMov</title>

    <style>

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #222;
            color: #1c1c1c;
        }

        .container {
            max-width: 420px;
            margin: auto;
            background: #fffaf4;
            min-height: 100vh;
            position: relative;
        }


        /* =========================
           HEADER
        ========================= */

        header {
            height: 70px;
            background: #173728;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0 15px;

            color: white;

            position: relative;
            z-index: 1100;
        }

        .menu {
            border: none;
            background: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }

        .logo {
            font-size: 25px;
            font-weight: bold;
        }

        .logo span {
            color: #82c735;
        }

        .header-icons {
            display: flex;
            gap: 12px;
            font-size: 20px;
        }


        /* =========================
           MENU LATERAL
        ========================= */

        .menu-lateral {

            position: fixed;

            top: 70px;

            width: 195px;

            height: calc(100vh - 70px);

            background: #1f4332;

            z-index: 1000;

            display: flex;

            flex-direction: column;

            justify-content: space-between;

            padding: 18px 10px;

            transform: translateX(-100%);

            transition: 0.3s;

            box-shadow: 4px 0 12px rgba(0,0,0,.25);
        }

        .menu-lateral.aberto {
            transform: translateX(0);
        }

        .menu-superior,
        .menu-inferior {
            display: flex;
            flex-direction: column;
        }

        .menu-superior {
            border-bottom: 1px solid rgba(255,255,255,.15);
            padding-bottom: 12px;
        }

        .menu-inferior {
            border-top: 1px solid rgba(255,255,255,.15);
            padding-top: 12px;
        }

        .menu-item {

            display: flex;

            align-items: center;

            gap: 12px;

            padding: 10px 8px;

            color: #eee;

            text-decoration: none;

            font-size: 14px;

            border-radius: 7px;
        }

        .menu-item:hover,
        .menu-item.ativo {

            color: #8bc83f;

            background: rgba(255,255,255,.06);
        }

        .menu-icone {
            width: 20px;
            text-align: center;
            font-size: 18px;
        }


        /* FUNDO ESCURO */

        .menu-overlay {

            position: fixed;

            top: 70px;
            left: 0;

            width: 100%;
            height: calc(100vh - 70px);

            background: rgba(0,0,0,.65);

            z-index: 900;

            opacity: 0;

            visibility: hidden;

            transition: .3s;
        }

        .menu-overlay.ativo {

            opacity: 1;

            visibility: visible;
        }


        /* =========================
           BANNER
        ========================= */

        .banner {

            min-height: 190px;

            padding: 25px 15px;

            color: white;

            background:
                linear-gradient(
                    rgba(0,40,20,.55),
                    rgba(0,40,20,.55)
                ),
                url("imagens/banner.jpg");

            background-size: cover;

            background-position: center;
        }

        .banner h1 {
            font-size: 42px;
        }

        .banner h1 span {
            color: #82c735;
        }

        .banner h2 {
            font-size: 20px;
            margin-top: 5px;
        }

        .banner p {
            font-size: 12px;
            margin-top: 5px;
            width: 280px;
        }


        /* =========================
           PESQUISA
        ========================= */

        .pesquisa {

            display: flex;

            align-items: center;

            background: white;

            margin-top: 18px;

            border-radius: 30px;

            padding: 5px 7px 5px 15px;

            color: #333;
        }

        .pesquisa input {

            flex: 1;

            border: none;

            outline: none;

            padding: 10px;

            font-size: 12px;
        }

        .pesquisa button {

            border: none;

            width: 42px;
            height: 32px;

            border-radius: 20px;

            background: #83c738;

            font-size: 22px;

            cursor: pointer;
        }


        /* =========================
           CATEGORIAS
        ========================= */

        .categorias {

            display: flex;

            gap: 16px;

            padding: 14px 12px;

            overflow-x: auto;

            background: white;
        }

        .categoria {

            min-width: 50px;

            text-align: center;

            font-size: 11px;
        }

        .categoria .icone {

            width: 50px;
            height: 50px;

            border-radius: 50%;

            background: #173728;

            display: flex;

            justify-content: center;
            align-items: center;

            margin-bottom: 6px;

            font-size: 24px;
        }


        /* =========================
           CONTEÚDO
        ========================= */

        main {
            padding: 0 12px 25px;
        }

        section {
            margin-bottom: 25px;
        }

        section h2 {
            font-size: 18px;
            margin-bottom: 10px;
        }


        /* =========================
           FEIRAS
        ========================= */

        .feiras {

            display: flex;

            gap: 12px;

            overflow-x: auto;
        }

        .feira-card {

            min-width: 198px;

            background: white;

            border-radius: 15px;

            overflow: hidden;

            box-shadow: 0 2px 5px rgba(0,0,0,.08);
        }

        .feira-card img {

            width: 100%;

            height: 110px;

            object-fit: cover;
        }

        .feira-info {
            padding: 10px;
        }

        .feira-info h3 {
            font-size: 14px;
            margin-bottom: 6px;
        }

        .feira-info p {
            font-size: 12px;
            margin: 5px 0;
        }

        .verde {
            color: #78bd2f;
        }


        /* =========================
           PRODUTORES
        ========================= */

        .produtor-card {

            background: white;

            border-radius: 18px;

            padding: 12px;

            margin-bottom: 12px;

            display: flex;

            align-items: center;

            gap: 12px;

            box-shadow: 0 2px 5px rgba(0,0,0,.05);
        }

        .produtor-card img {

            width: 60px;

            height: 60px;

            border-radius: 12px;

            object-fit: cover;
        }

        .produtor-info h3 {
            font-size: 14px;
        }

        .produtor-info p {

            font-size: 12px;

            color: #777;

            margin-top: 4px;
        }

        .avaliacao {
            color: #e6a900;
            font-weight: bold;
        }


        /* =========================
           PRODUTOS
        ========================= */

        .produtos-grid {

            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 12px;
        }

        .produto-card {

            background: white;

            border-radius: 15px;

            overflow: hidden;

            box-shadow: 0 2px 6px rgba(0,0,0,.08);
        }

        .produto-card img {

            width: 100%;

            height: 120px;

            object-fit: cover;
        }

        .produto-info {
            padding: 10px;
        }

        .produto-info h3 {

            font-size: 13px;

            margin-bottom: 10px;

            min-height: 30px;
        }

        .peso {

            color: #777;

            font-size: 11px;

            margin-bottom: 8px;
        }

        .preco {

            font-size: 16px;

            font-weight: bold;

            margin-bottom: 10px;
        }

        .produto-info button {

            width: 100%;

            border: none;

            padding: 9px;

            border-radius: 20px;

            background: #84c63d;

            color: #173728;

            font-weight: bold;

            cursor: pointer;
        }


        /* =========================
           FOOTER
        ========================= */

        footer {

            background: #173728;

            color: white;

            padding: 30px 15px;

            text-align: center;
        }

        .footer-links {

            display: flex;

            justify-content: space-between;

            gap: 10px;

            margin-bottom: 25px;
        }

        .footer-links a {

            color: white;

            text-decoration: none;

            font-size: 10px;
        }

        footer p {

            font-size: 9px;

            color: #83c738;
        }

    </style>

</head>


<body>


<div class="container">


    <!-- HEADER -->

    <header>

        <button class="menu"
                id="botao-menu">

            ☰

        </button>


        <div class="logo">

            🌿 Feira<span>Mov</span>

        </div>


        <div class="header-icons">

            <span>⌕</span>
            <span>♙</span>
            <span>🛒</span>
            <span>🔔</span>

        </div>

    </header>


    <!-- FUNDO ESCURO -->

    <div class="menu-overlay"
         id="menu-overlay">

    </div>


    <!-- MENU LATERAL -->

    <aside class="menu-lateral"
           id="menu-lateral">


        <nav class="menu-superior">


            <a href="#"
               class="menu-item ativo">

                <span class="menu-icone">⌂</span>

                Início

            </a>


            <a href="#"
               class="menu-item">

                <span class="menu-icone">⌕</span>

                Busca

            </a>


            <a href="#feiras"
               class="menu-item">

                <span class="menu-icone">▣</span>

                Feiras

            </a>


            <a href="#"
               class="menu-item">

                <span class="menu-icone">⌾</span>

                Eventos

            </a>


            <a href="#produtores"
               class="menu-item">

                <span class="menu-icone">♟</span>

                Produtores

            </a>


        </nav>


        <nav class="menu-inferior">


            <a href="#"
               class="menu-item">

                <span class="menu-icone">🔔</span>

                Notificações

            </a>


            <a href="login.html"
               class="menu-item">

                <span class="menu-icone">♙</span>

                Minha Conta

            </a>


            <a href="#"
               class="menu-item">

                <span class="menu-icone">🛒</span>

                Meu Carrinho

            </a>


            <a href="#"
               class="menu-item">

                <span class="menu-icone">?</span>

                Ajuda

            </a>


        </nav>


    </aside>



    <!-- BANNER -->

    <div class="banner">

        <h1>
            🌿 Feira<span>Mov</span>
        </h1>

        <h2>
            Do campo para a sua mesa.
        </h2>

        <p>
            Compre direto de produtores locais e tenha produtos
            frescos, de qualidade e com preço justo.
        </p>


        <div class="pesquisa">

            🔍

            <input
                type="text"
                placeholder="Pesquise por feiras, eventos, produtores..."
            >

            <button>
                ➜
            </button>

        </div>

    </div>



    <!-- CATEGORIAS -->

    <div class="categorias">


        <div class="categoria">

            <div class="icone">🍏</div>

            Frutas

        </div>


        <div class="categoria">

            <div class="icone">🌿</div>

            Verduras

        </div>


        <div class="categoria">

            <div class="icone">🥛</div>

            Laticínios

        </div>


        <div class="categoria">

            <div class="icone">🌾</div>

            Grãos

        </div>


        <div class="categoria">

            <div class="icone">✨</div>

            Orgânicos

        </div>


        <div class="categoria">

            <div class="icone">🧺</div>

            Artesanais

        </div>


    </div>



    <main>


        <!-- FEIRAS -->

        <section id="feiras">

            <h2>
                Feiras em destaque
            </h2>


            <div class="feiras">


                <div class="feira-card">

                    <img
                        src="imagens/feira1.jpg"
                        alt="Feira da Praça"
                    >

                    <div class="feira-info">

                        <h3>Feira da Praça</h3>

                        <p>
                            <span class="verde">▣</span>
                            Sáb 12 · 08:00
                        </p>

                        <p>
                            <span class="verde">◉</span>
                            Centro
                        </p>

                    </div>

                </div>


                <div class="feira-card">

                    <img
                        src="imagens/feira2.jpg"
                        alt="Mercado do Bairro"
                    >

                    <div class="feira-info">

                        <h3>Mercado do Bairro</h3>

                        <p>
                            <span class="verde">▣</span>
                            Dom 14 · 09:00
                        </p>

                        <p>
                            <span class="verde">◉</span>
                            Cidade Jardim
                        </p>

                    </div>

                </div>


            </div>

        </section>



        <!-- PRODUTORES -->

        <section id="produtores">

            <h2>
                Produtores perto de você
            </h2>


            <div class="produtor-card">

                <img
                    src="imagens/produtor1.jpg"
                    alt="João da Horta"
                >

                <div class="produtor-info">

                    <h3>João da Horta</h3>

                    <p>Frutas e legumes</p>

                    <p>
                        <span class="avaliacao">
                            ⭐ 4.9
                        </span>
                        (128)
                    </p>

                </div>

            </div>


            <div class="produtor-card">

                <img
                    src="imagens/produtor2.jpg"
                    alt="Maria Artesanal"
                >

                <div class="produtor-info">

                    <h3>Maria Artesanal</h3>

                    <p>Queijos e pães</p>

                    <p>
                        <span class="avaliacao">
                            ⭐ 4.8
                        </span>
                        (94)
                    </p>

                </div>

            </div>

        </section>



        <!-- PRODUTOS -->

        <section>

            <h2>
                Produtos populares
            </h2>


            <div class="produtos-grid">


                <div class="produto-card">

                    <img
                        src="imagens/morangos.jpg"
                        alt="Morangos orgânicos"
                    >

                    <div class="produto-info">

                        <h3>Morangos orgânicos</h3>

                        <p class="peso">500g</p>

                        <p class="preco">
                            R$ 18,90
                        </p>

                        <button>
                            Adicionar
                        </button>

                    </div>

                </div>


                <div class="produto-card">

                    <img
                        src="imagens/couve.jpg"
                        alt="Couve e espinafre"
                    >

                    <div class="produto-info">

                        <h3>Couve e espinafre</h3>

                        <p class="peso">1 kg</p>

                        <p class="preco">
                            R$ 12,50
                        </p>

                        <button>
                            Adicionar
                        </button>

                    </div>

                </div>


                <div class="produto-card">

                    <img
                        src="imagens/queijo.jpg"
                        alt="Queijo artesanal"
                    >

                    <div class="produto-info">

                        <h3>Queijo cabra artesanal</h3>

                        <p class="peso">200g</p>

                        <p class="preco">
                            R$ 24,00
                        </p>

                        <button>
                            Adicionar
                        </button>

                    </div>

                </div>


                <div class="produto-card">

                    <img
                        src="imagens/pao.jpg"
                        alt="Pão integral artesanal"
                    >

                    <div class="produto-info">

                        <h3>Pão integral artesanal</h3>

                        <p class="peso">
                            1 unidade
                        </p>

                        <p class="preco">
                            R$ 8,90
                        </p>

                        <button>
                            Adicionar
                        </button>

                    </div>

                </div>


            </div>

        </section>


    </main>



    <!-- FOOTER -->

    <footer>

        <div class="footer-links">

            <a href="#">
                Suporte e Ajuda
            </a>

            <a href="#">
                Política de Privacidade
            </a>

            <a href="#">
                Fale Conosco
            </a>

        </div>


        <p>
            © FeiraMov, 2026. Todos os direitos reservados.
        </p>

    </footer>


</div>



<script>

    const botaoMenu =
        document.getElementById("botao-menu");

    const menuLateral =
        document.getElementById("menu-lateral");

    const overlay =
        document.getElementById("menu-overlay");


    function abrirMenu() {

        menuLateral.classList.add("aberto");

        overlay.classList.add("ativo");

        botaoMenu.innerHTML = "✕";

    }


    function fecharMenu() {

        menuLateral.classList.remove("aberto");

        overlay.classList.remove("ativo");

        botaoMenu.innerHTML = "☰";

    }


    botaoMenu.addEventListener(
        "click",
        function() {

            if (
                menuLateral.classList.contains("aberto")
            ) {

                fecharMenu();

            } else {

                abrirMenu();

            }

        }
    );


    overlay.addEventListener(
        "click",
        fecharMenu
    );


    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Escape") {

                fecharMenu();

            }

        }
    );


    const itensMenu =
        document.querySelectorAll(".menu-item");


    itensMenu.forEach(
        function(item) {

            item.addEventListener(
                "click",
                function() {

                    itensMenu.forEach(
                        function(outro) {

                            outro.classList.remove("ativo");

                        }
                    );

                    item.classList.add("ativo");

                }
            );

        }
    );


    /* BOTÕES DE ADICIONAR */

    const botoes =
        document.querySelectorAll(".produto-info button");


    botoes.forEach(
        function(botao) {

            botao.addEventListener(
                "click",
                function() {

                    botao.innerText = "Adicionado ✓";

                }
            );

        }
    );

</script>


</body>

</html>
