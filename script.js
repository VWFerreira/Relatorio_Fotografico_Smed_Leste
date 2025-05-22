let formularios = [];

const BIN_ID = "682f9e008960c979a59fafc3";
const API_KEY = "$2a$10$c05DFLTv7rO5jr0vEr8gfOtadh6z6ztWedJjNr.k/m0tMCP5oXEdi";

async function carregarFormularios() {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            headers: {
                "X-Master-Key": API_KEY,
            },
        });
        const data = await res.json();
        formularios = data.record || [];
        atualizarLista();
    } catch (err) {
        console.error("Erro ao carregar dados:", err);
    }
}

let idAtual = null;

window.onload = () => {
    carregarFormularios();
};

function salvarFormulario() {
    const dados = {
        id: idAtual || Date.now(),
        obra: document.getElementById("obra").value,
        local: document.getElementById("local").value,
        medicao: document.getElementById("medicao").value,
        empresa: document.getElementById("empresa").value,
        data: document.getElementById("data").value,
        fotos: [],
    };

    if (!dados.obra.trim()) {
        alert("Preencha o campo OBRA antes de salvar.");
        return;
    }

    document.querySelectorAll(".bloco-4-fotos .foto-card").forEach((card) => {
        const descricao = card.querySelector("textarea[placeholder='Descrição do Serviço']").value;
        const img = card.querySelector("img");
        dados.fotos.push({
            descricao,
            imagem: img && img.src && img.style.display !== "none" ? img.src : null,
        });
    });

    const existente = formularios.findIndex((f) => f.id === dados.id);
    if (existente !== -1) {
        formularios[existente] = dados;
    } else {
        formularios.push(dados);
        if (formularios.length > 10) formularios.shift();
    }

    fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
            "X-Bin-Versioning": false
        },
        body: JSON.stringify(formularios),
    }).then(() => {
        idAtual = null;
        atualizarLista();
        limparFormulario();
    }).catch((err) => {
        console.error("Erro ao salvar:", err);
    });
}

function limparFormulario() {
    document.getElementById("obra").value = "";
    document.getElementById("local").value = "";
    document.getElementById("medicao").value = "";
    document.getElementById("empresa").value = "ENGPAC";
    document.getElementById("data").value = "";
    document.getElementById("fotos-container").innerHTML = "";
    idAtual = null;
}

function novoFormulario() {
    limparFormulario();
}

function excluirFormulario(id) {
    formularios = formularios.filter((f) => f.id !== id);

    fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
            "X-Bin-Versioning": false,
        },
        body: JSON.stringify(formularios),
    }).then(() => atualizarLista());
}

function atualizarLista() {
    const lista = document.getElementById("lista-formularios");
    lista.innerHTML = "";
    formularios.forEach((form) => {
        const li = document.createElement("li");
        li.className = "mb-3";

        const info = document.createElement("div");
        info.innerHTML = `<strong>${form.obra}</strong><br><small>${form.data}</small>`;

        const botoes = document.createElement("div");
        botoes.className = "d-flex gap-2 mt-2";

        const abrirBtn = document.createElement("button");
        abrirBtn.className = "btn btn-sm btn-success";
        abrirBtn.innerText = "Abrir";
        abrirBtn.onclick = () => abrirFormulario(form.id);

        const excluirBtn = document.createElement("button");
        excluirBtn.className = "btn btn-sm btn-danger";
        excluirBtn.innerText = "Excluir";
        excluirBtn.onclick = () => excluirFormulario(form.id);

        const imprimirBtn = document.createElement("button");
        imprimirBtn.className = "btn btn-sm btn-secondary";
        imprimirBtn.innerText = "Imprimir";
        imprimirBtn.onclick = () => {
            abrirFormulario(form.id);
            setTimeout(() => window.print(), 500);
        };

        botoes.appendChild(abrirBtn);
        botoes.appendChild(excluirBtn);
        botoes.appendChild(imprimirBtn);
        li.appendChild(info);
        li.appendChild(botoes);
        lista.appendChild(li);
    });
}

function abrirFormulario(id) {
    const form = formularios.find((f) => f.id === id);
    if (!form) return;

    document.getElementById("obra").value = form.obra;
    document.getElementById("local").value = form.local;
    document.getElementById("medicao").value = form.medicao;
    document.getElementById("empresa").value = form.empresa;
    document.getElementById("data").value = form.data;
    document.getElementById("fotos-container").innerHTML = "";

    form.fotos?.forEach((foto) => {
        adicionarFotos();
        const ultimoCard = document.querySelector(".bloco-4-fotos:last-child .foto-card:last-child");
        if (!ultimoCard) return;
        ultimoCard.querySelector("textarea[placeholder='Descrição do Serviço']").value = foto.descricao || "";
        if (foto.imagem) {
            const img = ultimoCard.querySelector("img");
            img.src = foto.imagem;
            img.style.display = "block";
        }
    });
    ajustarAlturaTextareas();
    idAtual = id;
}

function atualizarEndereco() {
    const escolaSelecionada = document.getElementById("obra").value;
    const enderecoCampo = document.getElementById("local");
    const empresaCampo = document.getElementById("empresa");

    const enderecosEscolas = {
        "EMEEF Prof. Luiz Francisco Lucena Borges":
            "Rua Cláudio Manoel da Costa, 270 – Jardim Itu Sabará – CEP 91210-250",
        "EMEF Nossa Senhora de Fátima":
            "Rua A, nº 15 – Vila Nossa Senhora de Fátima – Bom Jesus – CEP 91420-701",
        "EMEF José Mariano Beck":
            "Rua Joaquim Porto Villanova, 135 – Jardim Carvalho – CEP 91410-400",
        "EMEF América":
            "Rua Padre Ângelo Costa, 175 – Vila Vargas – Partenon – CEP 91520-161",
        "EMEF Prof. Judith Macedo de Araújo":
            "Rua Saul Constantino, 100 – Vila São José – CEP 91520-716",
        "EMEF Dep. Marcírio Goulart Loureiro":
            "Rua Saibreira, 1 – Bairro Coronel Aparício Borges – CEP 91510-350",
        "EMEF Morro da Cruz":
            "Rua Santa Teresa, 541 – Bairro São José – CEP 91520-713",
        "EMEF Heitor Villa Lobos":
            "Avenida Santo Dias da Silva, s/nº – Lomba do Pinheiro – CEP 91550-240",
        "EMEF Rincão":
            "Rua Luiz Otávio, 347 - Belém Velho, Porto Alegre - RS, 91787-330",
        "EMEF Afonso Guerreiro Lima":
            "R. Guaíba, 203 - Lomba do Pinheiro, Porto Alegre - RS, 91560-640",
        "EMEF Saint Hilaire":
            "R. Gervazio Braga Pinheiro, 427 - Lomba do Pinheiro, Porto Alegre - RS, 91570-490",
        "EMEI Protásio Alves":
            "Rua Aracy Fróes, 210 – Jardim Sabará – CEP 91210-230",
        "EMEI Vale Verde": "Rua Franklin, 270 – Jardim Sabará – CEP 91210-060",
        "EMEI Jardim Bento Gonçalves":
            "Rua Sargento Expedicionário Geraldo Santana, 40 – Partenon – CEP 91530-640",
        "EMEI Padre Ângelo Costa":
            "Rua Primeiro de Março, 300 – Bairro Partenon – CEP 91520-620",
        "EMEI Dr. Walter Silber":
            "Rua Frei Clemente, 150 – Vila São José – CEP 91520-260",
        "EMEI Maria Marques Fernandes":
            "Avenida Santo Dias da Silva, 550 – Lomba do Pinheiro – CEP 91550-500",
        "EMEI Vila Mapa II":
            "Rua Pedro Golombiewski, 100 – Lomba do Pinheiro – CEP 91550-230",
        "EMEI Vila Nova São Carlos":
            "DR. Darcy Reis Nunes, 30 - Lomba do Pinheiro, Porto Alegre - RS, 91560-570",
    };

    let enderecoBase = enderecosEscolas[escolaSelecionada] || "";
    if (enderecoBase && !enderecoBase.toLowerCase().includes("porto alegre")) {
        enderecoBase += " – Porto Alegre, RS";
    }

    enderecoCampo.value = enderecoBase;
    empresaCampo.value = "ENGPAC";
}


function adicionarFotos() {
    const container = document.getElementById("fotos-container");
    let blocos = container.querySelectorAll(".bloco-4-fotos");
    let ultimoBloco = blocos[blocos.length - 1];

    if (!ultimoBloco || ultimoBloco.children.length >= 4) {
        ultimoBloco = document.createElement("div");
        ultimoBloco.className = "bloco-4-fotos";
        if (blocos.length > 0) ultimoBloco.classList.add("quebra-pagina");
        container.appendChild(ultimoBloco);
    }

    const card = document.createElement("div");
    card.className = "foto-card";

    const descricaoInput = document.createElement("textarea");
    descricaoInput.rows = 2;
    descricaoInput.placeholder = "Descrição do Serviço";
    descricaoInput.className = "descricao-servico";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    const inputId = `upload-${Math.random().toString(36).substr(2, 9)}`;
    input.id = inputId;
    input.style.display = "none";

    const label = document.createElement("label");
    label.textContent = "Selecionar Imagem";
    label.className = "btn btn-sm btn-selecionar-imagem no-print";
    label.setAttribute("for", inputId);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "btn btn-sm btn-excluir";
    btnExcluir.type = "button";
    btnExcluir.onclick = () => card.remove();

    const botoes = document.createElement("div");
    botoes.className = "d-flex gap-2 mt-2 mb-2 justify-content-center";
    botoes.appendChild(label);
    botoes.appendChild(btnExcluir);

    const img = document.createElement("img");
    img.style.display = "none";

    input.addEventListener("change", () => preview(input));

    card.appendChild(descricaoInput);
    card.appendChild(botoes);
    card.appendChild(input);
    card.appendChild(img);
    ultimoBloco.appendChild(card);
}

function preview(input) {
    const img = input.nextElementSibling;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        img.onload = () => {
            img.style.display = "block";
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.maxHeight = `${8 * 37.8}px`;
            img.style.objectFit = "contain";
            img.style.marginBottom = "10px";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

document.addEventListener("input", function (event) {
    if (event.target.tagName.toLowerCase() === "textarea") {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + 2 + "px";
    }
});

function ajustarAlturaTextareas() {
    document.querySelectorAll("textarea").forEach((el) => {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + 2 + "px";
    });
}
