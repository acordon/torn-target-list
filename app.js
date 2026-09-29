const nomeInput = document.getElementById("nome");
const linkInput = document.getElementById("link");

const btnAdicionar = document.getElementById("btnAdicionar");

const lista = document.getElementById("lista");
const contador = document.getElementById("contador");

let alvos = carregarAlvos();

renderizar();

btnAdicionar.addEventListener("click", adicionarAlvo);

linkInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        adicionarAlvo();
    }

});

function adicionarAlvo() {

    const nome = nomeInput.value.trim();
    const link = linkInput.value.trim();

    if (!link) {

        alert("Informe o link do alvo.");
        return;

    }

    const alvo = {

        id: crypto.randomUUID(),

        nome: nome || `Alvo ${alvos.length + 1}`,

        link: link

    };

    alvos.push(alvo);

    salvarAlvos();

    nomeInput.value = "";
    linkInput.value = "";

    renderizar();

    linkInput.focus();
}

function excluirAlvo(id) {

    alvos = alvos.filter(alvo => alvo.id !== id);

    salvarAlvos();

    renderizar();
}

function abrirAlvo(link) {

    window.open(
        link,
        "_blank",
        "noopener,noreferrer"
    );
}

function salvarAlvos() {

    localStorage.setItem(
        "lista-alvos",
        JSON.stringify(alvos)
    );
}

function carregarAlvos() {

    const dados = localStorage.getItem("lista-alvos");

    if (!dados) {
        return [];
    }

    return JSON.parse(dados);
}

function renderizar() {

    lista.innerHTML = "";

    contador.textContent =
        `${alvos.length} ${alvos.length === 1 ? "alvo" : "alvos"}`;

    if (alvos.length === 0) {

        lista.innerHTML = `
            <p style="color:#9ca3af">
                Nenhum alvo salvo ainda.
            </p>
        `;

        return;
    }

    alvos.forEach(alvo => {

        const elemento = document.createElement("div");

        elemento.className = "alvo";

        elemento.innerHTML = `

            <div class="alvo-info">

                <div class="alvo-nome">
                    ${escaparHtml(alvo.nome)}
                </div>

                <div class="alvo-link">
                    ${escaparHtml(alvo.link)}
                </div>

            </div>

            <div class="acoes">

                <button
                    class="abrir"
                    onclick="abrirAlvo('${escaparAtributo(alvo.link)}')"
                >
                    Abrir
                </button>

                <button
                    class="excluir"
                    onclick="excluirAlvo('${alvo.id}')"
                >
                    Excluir
                </button>

            </div>

        `;

        lista.appendChild(elemento);
    });
}

function escaparHtml(texto) {

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}

function escaparAtributo(texto) {

    return texto
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");
}