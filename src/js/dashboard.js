"use strict";
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c;
    let transacoes = JSON.parse(localStorage.getItem('jovemMilionarioDados') || "[]");
    let filtroPatrimonio = 'liquido';
    let visualizacaoGrafico = 'patri_inv';
    const PDisplayPatrimonio = document.getElementById('display-patrimonio');
    const DisplaySaldoLivre = document.getElementById('display-saldo-livre');
    const PDisplayReceitas = document.getElementById('display-receitas');
    const PDisplayDespesas = document.getElementById('display-despesas');
    const PDisplayInvestimentos = document.getElementById('display-investimentos');
    const tableBody = document.getElementById('table-body');
    // ================= 1. CÂMBIO AUTOMÁTICO (API REAL) =================
    let txCambio = { BRL: 1, USD: 4.96, EUR: 5.84 };
    let moedaAtual = 'BRL';
    const buscarCotacoes = async () => {
        try {
            PDisplayPatrimonio.textContent = 'Atualizando...';
            const response = await fetch('https://open.er-api.com/v6/latest/BRL');
            const data = await response.json();
            txCambio.USD = 1 / data.rates.USD;
            txCambio.EUR = 1 / data.rates.EUR;
            atualizarInterface();
        }
        catch (error) {
            console.error("Sem internet. Usando cotação offline.");
            atualizarInterface();
        }
    };
    // ================= 2. LÓGICA DE ATUALIZAÇÃO DA TELA =================
    const atualizarInterface = () => {
        let totalReceitas = 0, totalDespesas = 0, totalInvestimentos = 0;
        tableBody.innerHTML = '';
        transacoes.forEach((t) => {
            if (t.tipo === 'receita')
                totalReceitas += t.valor;
            if (t.tipo === 'despesa')
                totalDespesas += t.valor;
            if (t.tipo === 'investimento')
                totalInvestimentos += t.valor;
            const tr = document.createElement('tr');
            let sinal = t.tipo === 'receita' ? '+' : (t.tipo === 'despesa' ? '-' : '$');
            let cor = t.tipo === 'receita' ? 'var(--color-success)' : (t.tipo === 'despesa' ? 'var(--color-danger)' : 'var(--color-warning)');
            tr.innerHTML = `<td>${formatarData(t.data)}</td>
            <td><strong>${t.descricao}</strong></td>
            <td>${t.categoria}</td>
            <td><span class="badge ${t.tipo}">${t.tipo.toUpperCase()}</span></td>
            <td style="color: ${cor}; font-weight: 600;">${sinal} ${formatarMoeda(t.valor)}</td>`;
            tableBody.prepend(tr);
        });
        let valorBasePatrimonio = 0;
        if (filtroPatrimonio === 'liquido')
            valorBasePatrimonio = totalReceitas - totalDespesas;
        if (filtroPatrimonio === 'rec_inv')
            valorBasePatrimonio = totalReceitas + totalInvestimentos;
        if (filtroPatrimonio === 'inv')
            valorBasePatrimonio = totalInvestimentos;
        if (filtroPatrimonio === 'rec')
            valorBasePatrimonio = totalReceitas;
        const valorConvertido = valorBasePatrimonio / txCambio[moedaAtual];
        const saldoLivreBRL = (totalReceitas - totalDespesas) - totalInvestimentos;
        PDisplayPatrimonio.textContent = formatarMoeda(valorConvertido, moedaAtual);
        DisplaySaldoLivre.textContent = `Saldo Livre: ${formatarMoeda(saldoLivreBRL, moedaAtual)}`;
        PDisplayReceitas.textContent = formatarMoeda(totalReceitas, moedaAtual);
        PDisplayDespesas.textContent = formatarMoeda(totalDespesas, moedaAtual);
        PDisplayInvestimentos.textContent = formatarMoeda(totalInvestimentos, moedaAtual);
        PDisplayPatrimonio.style.color = valorConvertido < 0 ? 'var(--color-danger)' : 'var(--text-primary)';
        DisplaySaldoLivre.style.color = saldoLivreBRL < 0 ? 'var(--color-danger)' : 'var(--text-secondary)';
        atualizarGraficoEvolucao(transacoes);
        atualizarGraficoCarteira(transacoes);
    };
    document.getElementById("currency-selector").addEventListener("change", (event) => {
        const TargetElement = event.target;
        moedaAtual = TargetElement.value;
        atualizarInterface();
    });
    document.getElementById("filter-patrimonio").addEventListener("change", (event) => {
        const TargetElement = event.target;
        filtroPatrimonio = TargetElement.value;
        atualizarInterface();
    });
    document.getElementById("chart-view-selector").addEventListener("change", (event) => {
        const TargetElement = event.target;
        visualizacaoGrafico = TargetElement.value;
        atualizarInterface();
    });
    // ================= 3. GRÁFICOS DINÂMICOS ===========================
    const ctxFinance = document.getElementById('financeChart').getContext('2d');
    let financeChart = new Chart(ctxFinance, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }
    });
    const atualizarGraficoEvolucao = (dados) => {
        let nomes = ['Início'], histPatri = [0], histInvest = [0], histRec = [0], histDesp = [0];
        let sRec = 0, sDesp = 0, sInv = 0;
        dados.forEach(t => {
            nomes.push(t.descricao);
            if (t.tipo === 'receita')
                sRec += t.valor;
            if (t.tipo === 'despesa')
                sDesp += t.valor;
            if (t.tipo === 'investimento')
                sInv += t.valor;
            histRec.push(sRec);
            histDesp.push(sDesp);
            histInvest.push(sInv);
            histPatri.push(sRec - sDesp);
        });
        // Cores com base na nova paleta Enterprise
        const dsPatri = { label: 'Patrimônio', data: histPatri, borderColor: '#4f46e5', borderWidth: 3, fill: false, tension: 0.3 };
        const dsInvest = { label: 'Investimentos', data: histInvest, borderColor: '#f59e0b', borderWidth: 2, fill: false, tension: 0.3 };
        const dsRec = { label: 'Receitas', data: histRec, borderColor: '#10b981', borderWidth: 2, fill: false, tension: 0.3 };
        const dsDesp = { label: 'Despesas', data: histDesp, borderColor: '#ef4444', borderWidth: 2, fill: false, tension: 0.3 };
        let datasetsSelecionados = [];
        if (visualizacaoGrafico === 'patri_inv')
            datasetsSelecionados = [dsPatri, dsInvest];
        else if (visualizacaoGrafico === 'rec_desp')
            datasetsSelecionados = [dsRec, dsDesp];
        else if (visualizacaoGrafico === 'all')
            datasetsSelecionados = [dsPatri, dsInvest, dsRec, dsDesp];
        financeChart.data.labels = nomes;
        financeChart.data.datasets = datasetsSelecionados;
        financeChart.update();
    };
    const ctxInvestment = document.getElementById('investmentChart').getContext('2d');
    let investmentChart = new Chart(ctxInvestment, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '75%'
        }
    });
    const atualizarGraficoCarteira = (dados) => {
        const investDados = dados.filter(t => t.tipo === 'investimento');
        const categorias = {};
        investDados.forEach(t => { categorias[t.categoria] = (categorias[t.categoria] || 0) + t.valor; });
        if (Object.keys(categorias).length === 0) {
            investmentChart.data.labels = ['Vazio'];
            investmentChart.data.datasets[0].data = [1];
            investmentChart.data.datasets[0].backgroundColor = ['#e2e8f0'];
        }
        else {
            investmentChart.data.labels = Object.keys(categorias);
            investmentChart.data.datasets[0].data = Object.values(categorias);
            investmentChart.data.datasets[0].backgroundColor = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
        }
        investmentChart.update();
    };
    // ================= 4. modal categoria ================================  
    const PopUpCategoria = document.getElementById("modal-nova-categoria"), ButtonClosePopUpCategoria = document.getElementById("close-nova-categoria"), InputTipoNovaCat = document.getElementById('tipo-nova-categoria'), InputNomenovaCategoria = document.getElementById("nome-nova-categoria"), DivErros = document.getElementById('cat-error-msg'), FormNovacategoria = document.getElementById("form-nova-categoria");
    let catsReceita = JSON.parse((_a = localStorage.getItem('catsReceita')) !== null && _a !== void 0 ? _a : "null") || ["SALÁRIO", "INVESTIMENTOS", "SERVIÇOS", "OUTROS"];
    let catsDespesa = JSON.parse((_b = localStorage.getItem('catsDespesa')) !== null && _b !== void 0 ? _b : "null") || ["MORADIA", "ALIMENTAÇÃO", "TRANSPORTE", "LAZER", "SAUDE"];
    let catsInvest = JSON.parse((_c = localStorage.getItem('catsInvest')) !== null && _c !== void 0 ? _c : "null") || ["RENDA FIXA", "AÇÕES (BOLSA)", "FIIS", "CRIPTOMOEDAS"];
    const AbrirNewCategoria = (tipo) => {
        InputTipoNovaCat.value = tipo;
        InputNomenovaCategoria.value = "";
        PopUpCategoria.style.display = "flex";
        InputNomenovaCategoria.focus();
        DivErros.style.display = "none";
    };
    const RenderizarCategoria = () => {
        const Popular = (id, lista) => {
            const SelectCategoria = document.getElementById(id);
            SelectCategoria.innerHTML = "";
            lista.forEach(categoria => {
                SelectCategoria.add(new Option(categoria, categoria));
            });
        };
        Popular('cat-receita', catsReceita);
        Popular('cat-despesa', catsDespesa);
        Popular('cat-invest', catsInvest);
    };
    FormNovacategoria.addEventListener("submit", (event) => {
        event.preventDefault();
        const Categoria = InputNomenovaCategoria.value.trim().toUpperCase(), Tipo = InputTipoNovaCat.value.toLocaleUpperCase();
        if (Categoria === "") {
            DivErros.style.display = "block";
            DivErros.textContent = "input esta Nullo, por favor preencher!";
            return;
        }
        const Listas = {
            RECEITA: catsReceita,
            DESPESA: catsDespesa,
            INVESTIMENTO: catsInvest
        }, storageKeys = {
            RECEITA: 'catsReceita',
            DESPESA: 'catsDespesa',
            INVESTIMENTO: 'catsInvest'
        };
        if (Listas[Tipo].some(categoria => categoria.toUpperCase() === Categoria)) {
            DivErros.style.display = "block";
            DivErros.textContent = "Esta categoria já existe!";
            return;
        }
        Listas[Tipo].push(Categoria);
        localStorage.setItem(storageKeys[Tipo], JSON.stringify(Listas[Tipo]));
        RenderizarCategoria();
        PopUpCategoria.style.display = "none";
        const sufixoId = Tipo === 'INVESTIMENTO' ? 'invest' : Tipo.toLowerCase();
        document.getElementById(`cat-${sufixoId}`).value = Categoria;
    });
    ButtonClosePopUpCategoria.addEventListener("click", () => {
        PopUpCategoria.style.display = "none";
    });
    RenderizarCategoria();
    // ================= 5. modal receita =================
    const PopUpReceita = document.getElementById("modal-receita"), ButtonAddReceita = document.getElementById("btn-open-receita"), ButtonClosePopUpRceita = document.getElementById("close-receita"), ButtonAddCategoriaReceita = document.getElementById("btn-add-cat-receita");
    ButtonAddReceita.addEventListener("click", () => {
        PopUpReceita.style.display = "flex";
    });
    ButtonClosePopUpRceita.addEventListener("click", () => {
        PopUpReceita.style.display = "none";
    });
    ButtonAddCategoriaReceita.addEventListener("click", () => {
        AbrirNewCategoria("RECEITA");
    });
    // ================= 6. modal despesas =================
    const PopUpDespesa = document.getElementById("modal-despesa"), ButtonAddDespesa = document.getElementById("btn-open-despesa"), ButtonClosePopUpDespesa = document.getElementById("close-despesa"), ButtonAddCategoriaDespesa = document.getElementById("btn-add-cat-despesa");
    ButtonAddDespesa.addEventListener("click", () => {
        PopUpDespesa.style.display = "flex";
    });
    ButtonClosePopUpDespesa.addEventListener("click", () => {
        PopUpDespesa.style.display = "none";
    });
    ButtonAddCategoriaDespesa.addEventListener("click", () => {
        AbrirNewCategoria("DESPESA");
    });
    // ================= 7. modal investimentos =================    
    const PopUpInvestimento = document.getElementById("modal-investimento"), ButtonAddInvestmento = document.getElementById("btn-open-invest"), ButtonClosePopUpInvestimento = document.getElementById("close-invest"), ButtonAddCategoriaInvestimento = document.getElementById("btn-add-cat-invest");
    ButtonAddInvestmento.addEventListener("click", () => {
        PopUpInvestimento.style.display = "flex";
    });
    ButtonClosePopUpInvestimento.addEventListener("click", () => {
        PopUpInvestimento.style.display = "none";
    });
    ButtonAddCategoriaInvestimento.addEventListener("click", () => {
        AbrirNewCategoria("INVESTIMENTO");
    });
});
