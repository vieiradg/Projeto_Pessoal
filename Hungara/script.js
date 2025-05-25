let carrinho = [];

// Atualiza o carrinho na tela
function atualizarCarrinho() {
    const itensCarrinho = document.getElementById("itens-carrinho");
    itensCarrinho.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-carrinho");

        itemDiv.innerHTML = `
            <p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>
            <button onclick="removerDoCarrinho(${index})">Remover</button>
        `;
        itensCarrinho.appendChild(itemDiv);
        total += item.preco;
    });

    document.getElementById("total-carrinho").innerText = `Total: R$ ${total.toFixed(2)}`;
}

// Adiciona item ao carrinho
document.querySelectorAll(".adicionar").forEach(button => {
    button.addEventListener("click", (e) => {
        const produto = e.target.closest(".produto");
        const nome = produto.getAttribute("data-nome");
        const preco = parseFloat(produto.getAttribute("data-preco"));
        
        carrinho.push({ nome, preco });
        atualizarCarrinho();
    });
});

// Remove item do carrinho
function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Finalizar pedido
document.getElementById("finalizar-pedido").addEventListener("click", () => {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let resumoHTML = "";
    let total = 0;

    carrinho.forEach(item => {
        resumoHTML += `<p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>`;
        total += item.preco;
    });

    document.getElementById("resumo-pedido").innerHTML = resumoHTML;
    document.getElementById("total-pedido").innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;

    document.getElementById("modal").style.display = "flex";
});

document.getElementById("cancelar-pedido").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

document.getElementById("confirmar-pedido").addEventListener("click", () => {
    let pedidoTexto = "Olá! Gostaria de fazer um pedido:\n";

    carrinho.forEach(item => {
        pedidoTexto += `- ${item.nome}: R$ ${item.preco.toFixed(2)}\n`;
    });

    let total = carrinho.reduce((acc, item) => acc + item.preco, 0);
    let taxaEntrega = parseFloat(sessionStorage.getItem("taxaEntrega")) || 0;
    let totalFinal = total + taxaEntrega;

    pedidoTexto += `\n🚚 Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
    pedidoTexto += `\n💰 Total: R$ ${totalFinal.toFixed(2)}`;

    let numeroWhatsApp = "558899999999"; // Altere para o número da loja
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(pedidoTexto)}`;

    window.open(url, "_blank");

    carrinho = [];
    sessionStorage.setItem("taxaEntrega", 0);
    atualizarCarrinho();
    document.getElementById("modal").style.display = "none";
});

// Calcular frete baseado no CEP
document.getElementById("calcular-frete").addEventListener("click", async () => {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
        document.getElementById("frete").innerHTML = "❌ CEP inválido!";
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            document.getElementById("frete").innerHTML = "❌ CEP não encontrado!";
            return;
        }

        const bairro = data.bairro || "Desconhecido";
        const cidade = data.localidade;
        let taxa = 5.00; // Taxa base

        if (cidade !== "Fortaleza") {
            taxa = 15.00; // Para outras cidades
        } else if (bairro.includes("Centro")) {
            taxa = 3.00; // Bairro Centro tem taxa menor
        } else if (bairro.includes("Praia")) {
            taxa = 10.00; // Taxa maior para regiões litorâneas
        }

        document.getElementById("frete").innerHTML = `📍 Entrega para ${bairro}, ${cidade}. Taxa: R$ ${taxa.toFixed(2)}`;

        sessionStorage.setItem("taxaEntrega", taxa);
    } catch (error) {
        document.getElementById("frete").innerHTML = "⚠️ Erro ao buscar o CEP!";
    }
});
