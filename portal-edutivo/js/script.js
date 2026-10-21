
document.addEventListener("DOMContentLoaded", function () {

    // Destaca o link da seção selecionada no menu
    const linksMenu = document.querySelectorAll("nav a");

    linksMenu.forEach(function (link) {
        link.addEventListener("click", function () {

            linksMenu.forEach(function (item) {
                item.classList.remove("selecionado");
            });

            link.classList.add("selecionado");
        });
    });


    // Cria uma mensagem quando o usuário pesquisa um conteúdo
    const formulario = document.createElement("form");
    formulario.classList.add("formulario-pesquisa");

    const campoPesquisa = document.createElement("input");
    campoPesquisa.type = "search";
    campoPesquisa.placeholder = "Pesquisar conteúdo...";
    campoPesquisa.setAttribute("aria-label", "Pesquisar conteúdo");

    const botaoPesquisa = document.createElement("button");
    botaoPesquisa.type = "submit";
    botaoPesquisa.textContent = "Buscar";

    formulario.appendChild(campoPesquisa);
    formulario.appendChild(botaoPesquisa);

    const topo = document.querySelector(".topo");

    if (topo) {
        topo.appendChild(formulario);
    }

    const conteudo = document.querySelector("main");

    function limparDestaques() {
        if (!conteudo) {
            return;
        }

        conteudo.querySelectorAll(".busca-destaque").forEach(function (destaque) {
            destaque.replaceWith(document.createTextNode(destaque.textContent));
        });

        conteudo.normalize();
    }

    campoPesquisa.addEventListener("input", function () {
        if (campoPesquisa.value.trim() === "") {
            limparDestaques();
        }
    });

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const pesquisa = campoPesquisa.value.trim();

        if (pesquisa === "") {
            alert("Digite um assunto para pesquisar.");
            return;
        }

        limparDestaques();

        if (!conteudo) {
            return;
        }

        const partes = pesquisa.split(/\s+/).map(function (parte) {
            return parte.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        });
        const expressao = new RegExp(partes.join("\\s+"), "gi");
        const leitor = document.createTreeWalker(conteudo, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                return node.parentElement.closest("script, style, .busca-destaque")
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT;
            }
        });
        const textos = [];
        let no;

        while ((no = leitor.nextNode())) {
            textos.push(no);
        }

        let primeiroDestaque = null;

        textos.forEach(function (textoNode) {
            const texto = textoNode.nodeValue;
            const fragmento = document.createDocumentFragment();
            let posicao = 0;
            let correspondencia;

            expressao.lastIndex = 0;
            while ((correspondencia = expressao.exec(texto))) {
                fragmento.appendChild(document.createTextNode(texto.slice(posicao, correspondencia.index)));

                const destaque = document.createElement("mark");
                destaque.classList.add("busca-destaque");
                destaque.textContent = correspondencia[0];
                fragmento.appendChild(destaque);
                primeiroDestaque = primeiroDestaque || destaque;
                posicao = correspondencia.index + correspondencia[0].length;
            }

            if (posicao > 0) {
                fragmento.appendChild(document.createTextNode(texto.slice(posicao)));
                textoNode.replaceWith(fragmento);
            }
        });

        if (primeiroDestaque) {
            primeiroDestaque.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        } else {
            alert("Nenhum conteúdo encontrado para: " + pesquisa);
        }
    });


    // Botão para voltar ao início da página
    const botaoTopo = document.createElement("button");

    botaoTopo.textContent = "↑";
    botaoTopo.classList.add("botao-topo");
    botaoTopo.setAttribute("aria-label", "Voltar ao início");
    botaoTopo.title = "Voltar ao início";

    document.body.appendChild(botaoTopo);

    botaoTopo.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // Mostra o botão quando a página é rolada
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            botaoTopo.classList.add("visivel");
        } else {
            botaoTopo.classList.remove("visivel");
        }
    });


    // Aviso no console para conferir se o arquivo carregou
    console.log("Portal Educativo carregado com sucesso.");

});
