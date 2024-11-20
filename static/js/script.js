const diceContainer = document.getElementById("dice-container");
const resultsDiv = document.getElementById("results");

const diceResults = {
    normal: {
        1: "static/img/normal-fail.png",
        2: "static/img/normal-fail.png",
        3: "static/img/normal-fail.png",
        4: "static/img/normal-fail.png",
        5: "static/img/normal-fail.png",
        6: "static/img/normal-success.png",
        7: "static/img/normal-success.png",
        8: "static/img/normal-success.png",
        9: "static/img/normal-success.png",
        10: "static/img/normal-crit.png"
    },
    fome: {
        1: "static/img/bestial-fail.png",
        2: "static/img/red-fail.png",
        3: "static/img/red-fail.png",
        4: "static/img/red-fail.png",
        5: "static/img/red-fail.png",
        6: "static/img/red-success.png",
        7: "static/img/red-success.png",
        8: "static/img/red-success.png",
        9: "static/img/red-success.png",
        10: "static/img/red-crit.png"
    }
};

function criarDado(tipo, valor) {
    const dice = document.createElement("div");
    dice.classList.add("dice", tipo);

    const diceResult = document.createElement("div");
    diceResult.classList.add("dice-result");
    diceResult.style.backgroundImage = `url(${diceResults[tipo][valor]})`;

    dice.appendChild(diceResult);
    diceContainer.appendChild(dice);

    setTimeout(() => {
        dice.style.animation = "none"; // Para a animação
        diceResult.style.display = "block"; // Mostra o resultado no centro
    }, 1000);

    return valor;
}


function typeWriterEffect(elementId, text, delay = 50) {
    const element = document.getElementById(elementId);
    element.textContent = ""; // Limpa o conteúdo inicial

    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, delay); // Adiciona o próximo caractere após um atraso
        }
    }

    type();
}

function rollDice() {
    const totalDados = parseInt(document.getElementById("dados").value) || 0;
    const dadosFome = parseInt(document.getElementById("fome").value) || 0;
    const dificuldade = parseInt(document.getElementById("dificuldade").value) || 0;

    if (dadosFome > totalDados) {
        alert("Os dados de fome não podem exceder o total de dados.");
        return;
    }

    diceContainer.innerHTML = ""; // Limpa os dados anteriores
    resultsDiv.style.opacity = "0"; // Esconde os resultados inicialmente

    const resultados = [];
    const resultadosFome = [];
    let sucessosNormais = 0;
    let criticos = 0;
    let falhasBestiais = 0;

    // Rolagem de dados normais
    for (let i = 0; i < totalDados - dadosFome; i++) {
        const roll = Math.floor(Math.random() * 10) + 1;
        criarDado("normal", roll);
        resultados.push(roll);
        if (roll >= 6 && roll < 10) sucessosNormais++; // Sucessos normais (6-9)
        if (roll === 10) criticos++; // Sucessos críticos (10)
    }

    // Rolagem de dados de fome
    for (let i = 0; i < dadosFome; i++) {
        const roll = Math.floor(Math.random() * 10) + 1;
        criarDado("fome", roll);
        resultadosFome.push(roll);
        if (roll >= 6 && roll < 10) sucessosNormais++; // Sucessos normais (6-9)
        if (roll === 10) criticos++; // Sucessos críticos (10)
        if (roll === 1) falhasBestiais++; // Falhas bestiais (1)
    }

    // Calcular sucessos críticos
    const paresCriticos = Math.floor(criticos / 2); // Cada par de 10 conta como 4 sucessos
    const sucessosCriticos = paresCriticos * 4; 
    const criticosRestantes = criticos % 2; // Críticos sobrando fora dos pares (1 sucesso cada)

    // Sucessos totais
    const sucessosTotais = sucessosNormais + sucessosCriticos + criticosRestantes;

    // Mensagem de resultado
    const mensagemFinal = sucessosTotais >= dificuldade
        ? `<div class="message success">Você atingiu a dificuldade, parabéns!</div>`
        : `<div class="message failure">Você não atingiu a dificuldade, tente novamente.</div>`;

    // Exibir resultados após 2 segundos
    setTimeout(() => {
        resultsDiv.innerHTML = `
            <div><strong>Total de Dados Rolados:</strong> ${totalDados}</div>
            <div><strong>Dados Normais:</strong> ${resultados.join(", ")}</div>
            <div><strong>Dados de Fome:</strong> ${resultadosFome.join(", ")}</div>
            <div><strong>Sucessos Normais:</strong> ${sucessosNormais}</div>
            <div><strong>Sucessos Críticos:</strong> ${sucessosCriticos} (Pares de 10)</div>
            <div><strong>Críticos Restantes:</strong> ${criticosRestantes}</div>
            <div><strong>Falhas Bestiais:</strong> ${falhasBestiais}</div>
            <div><strong>Total de Sucessos:</strong> ${sucessosTotais}</div>
            ${mensagemFinal}
        `;
        resultsDiv.style.opacity = "1"; // Torna o contêiner visível
    }, 2000);
}
