console.log("ok")
document.addEventListener("DOMContentLoaded", () => {
    iniciarMenuLateral();
    iniciarFiltroEventos();
});

/**
 * Controla a abertura e o fecho do menu lateral (mobile)
 */
function iniciarMenuLateral() {
    const menuBtn = document.getElementById("menu-btn");
    const sidebarOverlay = document.getElementById("sidebar-overlay");

    if (!menuBtn || !sidebarOverlay) return;

    const abrirMenu = () => {
        sidebarOverlay.classList.add("ativo");
        sidebarOverlay.style.display = "block";
        menuBtn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    };

    const fecharMenu = () => {
        sidebarOverlay.classList.remove("ativo");
        sidebarOverlay.style.display = "none";
        menuBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    };

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const estaAberto = menuBtn.getAttribute("aria-expanded") === "true";
        if (estaAberto) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    });

    // Fechar ao clicar fora da barra lateral (no overlay)
    sidebarOverlay.addEventListener("click", (e) => {
        if (e.target === sidebarOverlay) {
            fecharMenu();
        }
    });

    // Fechar ao clicar numa ligação dentro do menu lateral
    const linksSidebar = sidebarOverlay.querySelectorAll("a");
    linksSidebar.forEach((link) => {
        link.addEventListener("click", () => {
            fecharMenu();
        });
    });

    // Fechar com a tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
            fecharMenu();
        }
    });
}

/**
 * Cria e gere um filtro de pesquisa rápida para os cartões de eventos
 */
function iniciarFiltroEventos() {
    const secaoEventos = document.getElementById("eventos");
    const grid = secaoEventos?.querySelector(".produtores-grid");

    if (!secaoEventos || !grid) return;

    // Captura os elementos <a> que envolvem cada <article>
    const itensEvento = Array.from(grid.querySelectorAll(":scope > a"));
    if (itensEvento.length === 0) return;

    // Cria a barra de pesquisa no topo da secção de eventos
    const barraFiltro = document.createElement("div");
    barraFiltro.className = "eventos-filtro";
    barraFiltro.style.marginBottom = "1.25rem";
    barraFiltro.style.display = "flex";
    barraFiltro.style.gap = "0.5rem";
    barraFiltro.style.alignItems = "center";

    const inputPesquisa = document.createElement("input");
    inputPesquisa.type = "search";
    inputPesquisa.id = "pesquisa-eventos";
    inputPesquisa.placeholder = "Pesquisar evento, categoria ou feira...";
    inputPesquisa.setAttribute("aria-label", "Pesquisar eventos");
    inputPesquisa.style.padding = "0.5rem 0.75rem";
    inputPesquisa.style.borderRadius = "8px";
    inputPesquisa.style.border = "1px solid #ccc";
    inputPesquisa.style.flex = "1";
    inputPesquisa.style.maxWidth = "420px";

    const mensagemVazia = document.createElement("p");
    mensagemVazia.className = "eventos-sem-resultados";
    mensagemVazia.textContent = "Nenhum evento encontrado para a sua pesquisa.";
    mensagemVazia.style.display = "none";
    mensagemVazia.style.marginTop = "1rem";

    const titulo = secaoEventos.querySelector("h2");
    if (titulo) {
        titulo.insertAdjacentElement("afterend", barraFiltro);
    } else {
        secaoEventos.prepend(barraFiltro);
    }

    barraFiltro.appendChild(inputPesquisa);
    grid.insertAdjacentElement("afterend", mensagemVazia);

    inputPesquisa.addEventListener("input", () => {
        const termo = inputPesquisa.value.trim().toLowerCase();
        let visiveis = 0;

        itensEvento.forEach((item) => {
            const textoCard = item.textContent.toLowerCase();
            const corresponde = textoCard.includes(termo);
            item.style.display = corresponde ? "" : "none";
            if (corresponde) visiveis++;
        });

        mensagemVazia.style.display = visiveis === 0 ? "block" : "none";
    });
}