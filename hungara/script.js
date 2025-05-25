const promocoes = [
    { nome: "2 Italianos", preco: 25.00 },
    { nome: "2 Italianos + Refri", preco: 25.00 },
    { nome: "Combo do seu Zé", preco: 25.00 },
    { nome: "Combo Italiano", preco: 25.00 }
];

const classicos = [
    { nome: "Italiano de Queijo e Presunto", preco: 10.50 },
    { nome: "Italiano de Queijo, Presunto c/ Cebola", preco: 10.50 },
    { nome: "Italiano de Cababresa", preco: 11.50 },
    { nome: "Italiano de Cababresa c/ Cebola", preco: 11.50 },
    { nome: "Italiano Napolitano", preco: 11.50 },
    { nome: "Italiano Napolitano c/ Cebola", preco: 11.50 }
];

const gourmet = [
    { nome: "Italiano de Costela", preco: 15.50 },
    { nome: "Italiano de Carne Seca", preco: 15.50 },
    { nome: "Italiano de Quatro Queijos", preco: 12.50 },
    { nome: "Italiano de Bacon c/ Ovos", preco: 11.50 },
    { nome: "Italiano Frango c/ Cream Cheese", preco: 12.50 },
    { nome: "blablabla", preco: 12.50 }
];

let carrinho = [];

function criarListaItens(lista, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Limpa o conteúdo antes de renderizar

    lista.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
            <p>${item.nome} - <strong>R$ ${item.preco.toFixed(2)}</strong></p>
            <button class="adicionar" data-nome="${item.nome}" data-preco="${item.preco}">Adicionar</button>
        `;

        container.appendChild(div);
    });

    // Chama a ativação dos botões aqui, após a criação dos itens.
    ativarBotoesAdicionar();
}

function ativarBotoesAdicionar() {
    // Aqui, ao invés de adicionar o evento em todos os botões de forma geral,
    // vamos garantir que o evento seja apenas associado uma vez.
    document.querySelectorAll(".adicionar").forEach(botao => {
        botao.removeEventListener("click", handleAdicionarClick); // Remove qualquer ouvinte anterior
        botao.addEventListener("click", handleAdicionarClick); // Adiciona o ouvinte de forma única
    });
}

function handleAdicionarClick() {
    let nome = this.getAttribute("data-nome");
    let preco = parseFloat(this.getAttribute("data-preco"));
    adicionarAoCarrinho(nome, preco);
}

function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const container = document.getElementById("carrinho-container");
    const totalElemento = document.getElementById("total");
    const botaoFinalizar = document.getElementById("finalizar-pedido");

    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalElemento.innerHTML = "<strong>Total: R$ 0,00</strong>";
        botaoFinalizar.disabled = true;
        return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
        total += item.preco;

        const div = document.createElement("div");
        div.classList.add("carrinho-item");
        div.innerHTML = `
            <p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>
            <button class="remover" data-index="${index}">❌</button>
        `;
        container.appendChild(div);
    });

    totalElemento.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
    botaoFinalizar.disabled = false;

    ativarBotoesRemover();
}

function ativarBotoesRemover() {
    document.querySelectorAll(".remover").forEach(botao => {
        botao.addEventListener("click", function() {
            let index = this.getAttribute("data-index");
            carrinho.splice(index, 1); 
            atualizarCarrinho();
        });
    });
}

document.getElementById("finalizar-pedido").addEventListener("click", function() {
    if (carrinho.length === 0) return;

    let numeroWhatsApp = "5521966207951"; 
    let mensagem = "Olá, quero fazer um pedido:\n\n";
    
    carrinho.forEach(item => {
        mensagem += `- ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });

    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    mensagem += `\nTotal: R$ ${total.toFixed(2)}`;

    let link = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");

    // Limpar carrinho após envio
    carrinho = [];
    atualizarCarrinho();
});

// Chama as funções para preencher os itens ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    criarListaItens(promocoes, "promocoes-container");
    criarListaItens(classicos, "classicos-container");
    criarListaItens(gourmet, "gourmet-container");
    atualizarCarrinho();
});
