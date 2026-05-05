document.addEventListener("DOMContentLoaded", () =>{

    type Movimentacao = "RECEITA" | "DESPESA"| "INVESTIMENTO";

    type Transacao = {
        id: number;
        data: string;
        descricao: String;
        categoria: string;
        tipo: Movimentacao;
        valor: number;
    }

    const bodyTrasacoes = document.getElementById("tbody-todas-transacoes") as HTMLElement;
    const inputBusca = document.getElementById("busca-descricao") as HTMLInputElement;
    const FiltroTipo = document.getElementById("filtro-tipo") as HTMLSelectElement;

    let transacoes: Transacao[] = JSON.parse(localStorage.getItem('jovemMilionarioDados') || "[]")
});