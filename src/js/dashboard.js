"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    let transacoes = JSON.parse(localStorage.getItem('jovemMilionarioDados')) || [];
    // ================= 1. CÂMBIO AUTOMÁTICO (API REAL) =================
    let txCambio = { BRL: 1, USD: 5.00, EUR: 5.40 };
    let moedaAtual = 'BRL';
    const buscarCotacoes = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            document.getElementById('display-patrimonio').textContent = 'Atualizando...';
            const response = yield fetch('https://open.er-api.com/v6/latest/BRL');
            const data = yield response.json();
            txCambio.USD = 1 / data.rates.USD;
            txCambio.EUR = 1 / data.rates.EUR;
            atualizarInterface();
        }
        catch (error) {
            console.error("Sem internet. Usando cotação offline.");
            atualizarInterface();
        }
    });
    // ================= 2. ESTADOS DE VISUALIZAÇÃO =================
    let filtroPatrimonio = 'liquido';
    let visualizacaoGrafico = 'patri_inv';
    const displayPatrimonio = document.getElementById('display-patrimonio');
    const displaySaldoLivre = document.getElementById('display-saldo-livre');
    const displayReceitas = document.getElementById('display-receitas');
    const displayDespesas = document.getElementById('display-despesas');
    const displayInvestimentos = document.getElementById('display-investimentos');
    const tableBody = document.getElementById('table-body');
    const formatarMoeda = (valor, moeda = 'BRL') => {
        let formato = moeda === 'BRL' ? 'pt-BR' : (moeda === 'USD' ? 'en-US' : 'de-DE');
        return valor.toLocaleString(formato, { style: 'currency', currency: moeda });
    };
    const formatarData = (dataIso) => new Date(dataIso).toLocaleDateString('pt-BR');
    // ================= 3. LÓGICA DE ATUALIZAÇÃO DA TELA =================
    const atualizarInterface = () => {
        let totalReceitas = 0, totalDespesas = 0, totalInvestimentos = 0;
        tableBody.innerHTML = '';
        transacoes.forEach(t => {
            if (t.tipo === 'receita')
                totalReceitas += t.valor;
            if (t.tipo === 'despesa')
                totalDespesas += t.valor;
            if (t.tipo === 'investimento')
                totalInvestimentos += t.valor;
            const tr = document.createElement('tr');
            let sinal = t.tipo === 'receita' ? '+' : (t.tipo === 'despesa' ? '-' : '✦');
            let cor = t.tipo === 'receita' ? 'var(--color-success)' : (t.tipo === 'despesa' ? 'var(--color-danger)' : 'var(--color-warning)');
            tr.innerHTML = `<td>${formatarData(t.data)}</td><td><strong>${t.descricao}</strong></td><td>${t.categoria}</td><td><span class="badge ${t.tipo}">${t.tipo.toUpperCase()}</span></td><td style="color: ${cor}; font-weight: 600;">${sinal} ${formatarMoeda(t.valor)}</td>`;
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
        displayPatrimonio.textContent = formatarMoeda(valorConvertido, moedaAtual);
        displaySaldoLivre.textContent = `Saldo Livre: ${formatarMoeda(saldoLivreBRL)}`;
        displayReceitas.textContent = formatarMoeda(totalReceitas);
        displayDespesas.textContent = formatarMoeda(totalDespesas);
        displayInvestimentos.textContent = formatarMoeda(totalInvestimentos);
        displayPatrimonio.style.color = valorConvertido < 0 ? 'var(--color-danger)' : 'var(--text-primary)';
        displaySaldoLivre.style.color = saldoLivreBRL < 0 ? 'var(--color-danger)' : 'var(--text-secondary)';
        atualizarGraficoEvolucao(transacoes);
        atualizarGraficoCarteira(transacoes);
    };
    document.getElementById('currency-selector').addEventListener('change', (e) => { moedaAtual = e.target.value; atualizarInterface(); });
    document.getElementById('filter-patrimonio').addEventListener('change', (e) => { filtroPatrimonio = e.target.value; atualizarInterface(); });
    document.getElementById('chart-view-selector').addEventListener('change', (e) => { visualizacaoGrafico = e.target.value; atualizarGraficoEvolucao(transacoes); });
    // ================= 4. GRÁFICOS DINÂMICOS =================
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
    let investmentChart = new Chart(ctxInvestment, { type: 'doughnut', data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '75%' } });
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
    // ================= 5. LÓGICAS DE SALVAR E CATEGORIAS =================
    const adicionarTransacao = (tipo, descricao, categoria, valor) => { transacoes.push({ id: Date.now(), data: new Date().toISOString(), tipo, descricao, categoria, valor }); localStorage.setItem('jovemMilionarioDados', JSON.stringify(transacoes)); atualizarInterface(); };
    const configForm = (fId, t, mId) => { document.getElementById(fId).addEventListener('submit', function (e) { e.preventDefault(); adicionarTransacao(t, document.getElementById(`desc-${t.substring(0, 6)}`).value, document.getElementById(`cat-${t.substring(0, 6)}`).value, parseFloat(document.getElementById(`valor-${t.substring(0, 6)}`).value)); this.reset(); document.getElementById(mId).style.display = 'none'; }); };
    configForm('form-receita', 'receita', 'modal-receita');
    configForm('form-despesa', 'despesa', 'modal-despesa');
    configForm('form-investimento', 'investimento', 'modal-investimento');
    let catsReceita = JSON.parse(localStorage.getItem('catsReceita')) || ["Salário", "Investimentos", "Serviços", "Outros"];
    let catsDespesa = JSON.parse(localStorage.getItem('catsDespesa')) || ["Moradia", "Alimentação", "Transporte", "Lazer", "Saúde"];
    let catsInvest = JSON.parse(localStorage.getItem('catsInvest')) || ["Renda Fixa", "Ações (Bolsa)", "FIIs", "Criptomoedas"];
    const renderizarCategorias = () => {
        const popular = (id, lista) => { const sel = document.getElementById(id); sel.innerHTML = ''; lista.forEach(cat => sel.add(new Option(cat, cat))); };
        popular('cat-receita', catsReceita);
        popular('cat-despesa', catsDespesa);
        popular('cat-invest', catsInvest);
    };
    const modalNovaCat = document.getElementById('modal-nova-categoria'), inputNomeNovaCat = document.getElementById('nome-nova-categoria'), inputTipoNovaCat = document.getElementById('tipo-nova-categoria');
    const abrirModalNovaCat = (tipo) => { inputTipoNovaCat.value = tipo; inputNomeNovaCat.value = ''; document.getElementById('cat-error-msg').style.display = 'none'; modalNovaCat.style.display = 'flex'; inputNomeNovaCat.focus(); };
    document.getElementById('btn-add-cat-receita').onclick = () => abrirModalNovaCat('receita');
    document.getElementById('btn-add-cat-despesa').onclick = () => abrirModalNovaCat('despesa');
    document.getElementById('btn-add-cat-invest').onclick = () => abrirModalNovaCat('invest');
    document.getElementById('form-nova-categoria').addEventListener('submit', (e) => {
        e.preventDefault();
        const novaCat = inputNomeNovaCat.value.trim(), tipo = inputTipoNovaCat.value;
        const listas = { receita: catsReceita, despesa: catsDespesa, invest: catsInvest }, storageKeys = { receita: 'catsReceita', despesa: 'catsDespesa', invest: 'catsInvest' };
        if (listas[tipo].some(cat => cat.toLowerCase() === novaCat.toLowerCase())) {
            document.getElementById('cat-error-msg').style.display = 'block';
            return;
        }
        listas[tipo].push(novaCat);
        localStorage.setItem(storageKeys[tipo], JSON.stringify(listas[tipo]));
        renderizarCategorias();
        modalNovaCat.style.display = 'none';
        document.getElementById(`cat-${tipo}`).value = novaCat;
    });
    const modalConfirmDel = document.getElementById('modal-confirm-delete');
    const abrirModalDeleteCat = (tipo) => {
        const catAtual = document.getElementById(`cat-${tipo}`).value, listas = { receita: catsReceita, despesa: catsDespesa, invest: catsInvest };
        if (listas[tipo].length <= 1) {
            alert("Mantenha pelo menos uma categoria!");
            return;
        }
        document.getElementById('delete-cat-name').textContent = catAtual;
        document.getElementById('delete-cat-type').value = tipo;
        modalConfirmDel.style.display = 'flex';
    };
    document.getElementById('btn-rm-cat-receita').onclick = () => abrirModalDeleteCat('receita');
    document.getElementById('btn-rm-cat-despesa').onclick = () => abrirModalDeleteCat('despesa');
    document.getElementById('btn-rm-cat-invest').onclick = () => abrirModalDeleteCat('invest');
    document.getElementById('btn-confirm-delete').addEventListener('click', () => {
        const tipo = document.getElementById('delete-cat-type').value, catNome = document.getElementById('delete-cat-name').textContent;
        if (tipo === 'receita') {
            catsReceita = catsReceita.filter(c => c !== catNome);
            localStorage.setItem('catsReceita', JSON.stringify(catsReceita));
        }
        if (tipo === 'despesa') {
            catsDespesa = catsDespesa.filter(c => c !== catNome);
            localStorage.setItem('catsDespesa', JSON.stringify(catsDespesa));
        }
        if (tipo === 'invest') {
            catsInvest = catsInvest.filter(c => c !== catNome);
            localStorage.setItem('catsInvest', JSON.stringify(catsInvest));
        }
        renderizarCategorias();
        modalConfirmDel.style.display = 'none';
    });
    renderizarCategorias();
    const mRec = document.getElementById('modal-receita'), mDesp = document.getElementById('modal-despesa'), mInv = document.getElementById('modal-investimento');
    document.getElementById('btn-open-receita').onclick = () => mRec.style.display = 'flex';
    document.getElementById('btn-open-despesa').onclick = () => mDesp.style.display = 'flex';
    document.getElementById('btn-open-invest').onclick = () => mInv.style.display = 'flex';
    document.getElementById('close-receita').onclick = () => mRec.style.display = 'none';
    document.getElementById('close-despesa').onclick = () => mDesp.style.display = 'none';
    document.getElementById('close-invest').onclick = () => mInv.style.display = 'none';
    document.getElementById('close-nova-categoria').onclick = () => modalNovaCat.style.display = 'none';
    document.getElementById('btn-cancel-delete').onclick = () => modalConfirmDel.style.display = 'none';
    window.onclick = (e) => { [mRec, mDesp, mInv, modalNovaCat, modalConfirmDel].forEach(m => { if (e.target === m)
        m.style.display = 'none'; }); };
    document.getElementById('btn-clear-data').onclick = () => { if (confirm("Apagar tudo?")) {
        localStorage.clear();
        location.reload();
    } };
    buscarCotacoes();
});
