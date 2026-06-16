"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const bodyTrasacoes = document.getElementById("tbody-todas-transacoes");
    const inputBusca = document.getElementById("busca-descricao");
    const selectFiltroTipo = document.getElementById("filtro-tipo");
    let transacoes = JSON.parse(localStorage.getItem('jovemMilionarioDados') || "[]");
    const renderizarTabelaCompleta = () => {
        bodyTrasacoes.innerHTML = "";
        const ValueBusca = inputBusca.value.toLowerCase();
        const ValueFiltroTipo = selectFiltroTipo.value;
        const transacoesFiltradas = transacoes.filter(transacao => {
            const descricaoMatch = transacao.descricao.toLowerCase().includes(ValueBusca);
            const tipoMatch = ValueFiltroTipo === "TODOS" || transacao.tipo === ValueFiltroTipo;
            return descricaoMatch && tipoMatch;
        });
        transacoesFiltradas.forEach(transacao => {
            const linha = document.createElement("tr");
            let sinal = transacao.tipo === 'RECEITA' ? '+' : (transacao.tipo === 'DESPESA' ? '-' : '$');
            let cor = transacao.tipo === 'RECEITA' ? 'var(--color-success)' : (transacao.tipo === 'DESPESA' ? 'var(--color-danger)' : 'var(--color-warning)');
            linha.innerHTML = `
                <td>${formatarData(transacao.data)}</td>
                <td><strong>${transacao.descricao}</strong></td> 
                <td>${transacao.categoria}</td>
                <td><span class="badge ${transacao.tipo.toLowerCase()}">${transacao.tipo}</span></td>
                <td style="color: ${cor}; font-weight: 600;">${sinal} ${formatarMoeda(transacao.valor)}</td>
                <td style="text-align: center;">
                    <button class="btn-icon" style="color: var(--color-danger); background: none; border: none; cursor: pointer; font-size: 1.1rem;" onclick="deletarTransacao(${transacao.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            bodyTrasacoes.prepend(linha);
        });
        if (transacoesFiltradas.length === 0) {
            bodyTrasacoes.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-secondary);">
                        Nenhuma transação encontrada.
                    </td>
                </tr>
            `;
        }
    };
    window.deletarTransacao = (id) => {
        if (confirm("Tem certeza que deseja apagar esta transação? Isso mudará seu saldo!")) {
            transacoes = transacoes.filter((t) => t.id !== id);
            localStorage.setItem('jovemMilionarioDados', JSON.stringify(transacoes));
            renderizarTabelaCompleta();
        }
    };
    inputBusca.addEventListener('input', renderizarTabelaCompleta);
    selectFiltroTipo.addEventListener('change', renderizarTabelaCompleta);
    renderizarTabelaCompleta();
});
