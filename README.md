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
