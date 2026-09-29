const nomeInput = document.getElementById("nome");
const linkInput = document.getElementById("link");
const descricaoInput = document.getElementById("descricao");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnCancelar = document.getElementById("btnCancelar");

const modal = document.getElementById("modal");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const busca = document.getElementById("busca");
const btnBuscar = document.getElementById("btnBuscar");

let alvos = carregarAlvos();
let filtroStatus = "all";

renderizar();

btnAdicionar.addEventListener("click", adicionarAlvo);
btnAbrirModal.addEventListener("click", abrirModal);
btnFecharModal.addEventListener("click", fecharModal);
btnCancelar.addEventListener("click", fecharModal);

document.querySelector(".modal-backdrop").addEventListener("click", fecharModal);

linkInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        adicionarAlvo();
    }
});

busca.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        renderizar();
    }
});

btnBuscar.addEventListener("click", renderizar);

document.querySelectorAll('input[name="statusFilter"]').forEach(input => {
    input.addEventListener("change", function () {
        filtroStatus = this.value;

        document.querySelectorAll(".filter").forEach(filter => {
            filter.classList.remove("active");
        });

        this.closest(".filter").classList.add("active");

        renderizar();
    });
});


function abrirModal() {
    modal.classList.remove("hidden");

    setTimeout(() => {
        nomeInput.focus();
    }, 50);
}


function fecharModal() {
    modal.classList.add("hidden");
}


function adicionarAlvo() {

    const nome = nomeInput.value.trim();
    const link = linkInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (!link) {
        alert("Please enter the target profile link.");
        linkInput.focus();
        return;
    }

    const alvo = {
        id: crypto.randomUUID(),
        nome: nome || `Target ${alvos.length + 1}`,
        link: link,
        descricao: descricao || "",
        level: "",
        status: "Okay"
    };

    alvos.push(alvo);

    salvarAlvos();

    nomeInput.value = "";
    linkInput.value = "";
    descricaoInput.value = "";

    fecharModal();
    renderizar();
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

    try {
        return JSON.parse(dados);
    } catch {
        return [];
    }
}


function renderizar() {

    lista.innerHTML = "";

    const termo = busca.value.trim().toLowerCase();

    const filtrados = alvos.filter(alvo => {

        const correspondeStatus =
            filtroStatus === "all" ||
            (alvo.status || "Okay") === filtroStatus;

        const correspondeBusca =
            !termo ||
            alvo.nome.toLowerCase().includes(termo) ||
            alvo.link.toLowerCase().includes(termo) ||
            (alvo.descricao || "").toLowerCase().includes(termo);

        return correspondeStatus && correspondeBusca;
    });

    contador.textContent =
        `${alvos.length} ${alvos.length === 1 ? "target" : "targets"}`;

    if (filtrados.length === 0) {

        lista.innerHTML = `
            <div class="empty-state">
                No targets found.
            </div>
        `;

        return;
    }

    filtrados.forEach(alvo => {

        const elemento = document.createElement("div");

        elemento.className = "target-row";

        const status = alvo.status || "Okay";
        const statusClass = status.toLowerCase();

        elemento.innerHTML = `

            <div class="col-name name-cell">
                <span class="row-toggle">−</span>

                <div class="name-content">
                    <strong>${escaparHtml(alvo.nome)}</strong>
                    <a
                        href="${escaparAtributo(alvo.link)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escaparHtml(alvo.link)}
                    </a>
                </div>
            </div>

            <div class="col-level level-cell">
                ${alvo.level || "—"}
            </div>

            <div class="col-description description-cell">
                ${escaparHtml(alvo.descricao || "")}
            </div>

            <div class="col-status status-cell ${statusClass}">
                ${escaparHtml(status)}
            </div>

            <div class="col-actions actions-cell">

                <button
                    class="icon-button open"
                    title="Open TORN profile"
                    onclick="abrirAlvo('${escaparAtributo(alvo.link)}')"
                >
                    ↗
                </button>

                <button
                    class="icon-button delete"
                    title="Delete target"
                    onclick="excluirAlvo('${alvo.id}')"
                >
                    ×
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
