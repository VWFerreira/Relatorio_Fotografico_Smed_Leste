function adicionarFotos() {
    const container = document.getElementById("fotos-container");

    const bloco = document.createElement("div");
    bloco.className = "bloco-4-fotos page-break"; // força nova página na impressão

    for (let i = 0; i < 4; i++) {
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
        label.className = "upload-label";
        label.setAttribute("for", inputId);

        input.addEventListener("change", () => preview(input));

        const img = document.createElement("img");
        img.style.display = "none";

        const textarea = document.createElement("textarea");
        textarea.rows = 2;
        textarea.placeholder = "Observações...";

        card.appendChild(descricaoInput);
        card.appendChild(label);
        card.appendChild(input);
        card.appendChild(img);
        card.appendChild(textarea);

        bloco.appendChild(card);
    }

    container.appendChild(bloco);
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
            img.style.maxHeight = `${8 * 37.8}px`; // 8cm em px (~302)
            img.style.objectFit = "contain";
            img.style.marginBottom = "10px";
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

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

function atualizarEndereco() {
    const escolaSelecionada = document.getElementById("obra").value;
    const enderecoCampo = document.getElementById("local");
    const empresaCampo = document.getElementById("empresa");

    let enderecoBase = enderecosEscolas[escolaSelecionada] || "";

    if (enderecoBase && !enderecoBase.toLowerCase().includes("porto alegre")) {
        enderecoBase += " – Porto Alegre, RS";
    }

    enderecoCampo.value = enderecoBase;
    empresaCampo.value = "ENGPAC";
}
