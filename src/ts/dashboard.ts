declare var Chart: any;

document.addEventListener('DOMContentLoaded', () => {

    type Transacao = {
        data: string;
        descricao: string;
        categoria: string;
        tipo: 'receita' | 'despesa' | 'investimento';
        valor: number;
    };

    type SiglaMoedaAceita = 'BRL' | 'USD' | 'EUR';

    let transacoes: Transacao[] = JSON.parse(localStorage.getItem('jovemMilionarioDados') || "[]");

    let filtroPatrimonio = 'liquido'; 
    let visualizacaoGrafico = 'patri_inv'; 

    const PDisplayPatrimonio = document.getElementById('display-patrimonio') as HTMLParagraphElement;
    const DisplaySaldoLivre = document.getElementById('display-saldo-livre') as HTMLElement;
    const PDisplayReceitas = document.getElementById('display-receitas') as HTMLParagraphElement;
    const PDisplayDespesas = document.getElementById('display-despesas') as HTMLParagraphElement;
    const PDisplayInvestimentos = document.getElementById('display-investimentos') as HTMLParagraphElement;
    const tableBody = document.getElementById('table-body') as HTMLElement;
    
    // ================= 1. CÂMBIO AUTOMÁTICO (API REAL) =================
    let txCambio = { BRL: 1, USD: 4.96, EUR: 5.84 }; 
    let moedaAtual : SiglaMoedaAceita = 'BRL';

    const buscarCotacoes = async () => {
        try {
            PDisplayPatrimonio.textContent = 'Atualizando...';
            const response = await fetch('https://open.er-api.com/v6/latest/BRL');
            const data = await response.json();
            txCambio.USD = 1 / data.rates.USD; 
            txCambio.EUR = 1 / data.rates.EUR;
            atualizarInterface();
        } catch (error) {
            console.error("Sem internet. Usando cotação offline.");
            atualizarInterface();
        }
    };

    // ================= 2. LÓGICA DE ATUALIZAÇÃO DA TELA =================
    const atualizarInterface = () => {
        let totalReceitas = 0, totalDespesas = 0, totalInvestimentos = 0;
        tableBody.innerHTML = '';

        transacoes.forEach((t : Transacao) => {
            if (t.tipo === 'receita') totalReceitas += t.valor;
            if (t.tipo === 'despesa') totalDespesas += t.valor;
            if (t.tipo === 'investimento') totalInvestimentos += t.valor;

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
        if (filtroPatrimonio === 'liquido') valorBasePatrimonio = totalReceitas - totalDespesas;
        if (filtroPatrimonio === 'rec_inv') valorBasePatrimonio = totalReceitas + totalInvestimentos;
        if (filtroPatrimonio === 'inv') valorBasePatrimonio = totalInvestimentos;
        if (filtroPatrimonio === 'rec') valorBasePatrimonio = totalReceitas;

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


    (document.getElementById("currency-selector")as HTMLSelectElement).addEventListener("change", (event)=>
        {
            const TargetElement = event.target as HTMLSelectElement
            moedaAtual = TargetElement.value as SiglaMoedaAceita; 
            atualizarInterface();
        }
    );

    (document.getElementById("filter-patrimonio") as HTMLSelectElement).addEventListener("change", (event)=>
        {
            const TargetElement = event.target as HTMLSelectElement
            filtroPatrimonio = TargetElement.value;
            atualizarInterface();
        }
    );

    (document.getElementById("chart-view-selector") as HTMLSelectElement).addEventListener("change", (event) => 
        {
            const TargetElement = event.target as HTMLSelectElement;
            visualizacaoGrafico = TargetElement.value;
            atualizarInterface();
        }
    );
    // ================= 3. GRÁFICOS DINÂMICOS ===========================

    const ctxFinance = (document.getElementById('financeChart') as HTMLCanvasElement).getContext('2d');

    let financeChart = new Chart(ctxFinance, {
        type: 'line', 
        data: { labels: [], datasets: [] }, 
        options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false } }
    });

    type LinhaDoGrafico = {
        label: string;
        data: number[];
        borderColor: string;
        borderWidth: number;
        fill: boolean;
        tension: number;
    };

    const atualizarGraficoEvolucao = (dados:Transacao[]) => {
        let nomes = ['Início'], histPatri = [0], histInvest = [0], histRec = [0], histDesp = [0];
        let sRec = 0, sDesp = 0, sInv = 0;

        dados.forEach(t => {
            nomes.push(t.descricao);
            if(t.tipo === 'receita') sRec += t.valor;
            if(t.tipo === 'despesa') sDesp += t.valor;
            if(t.tipo === 'investimento') sInv += t.valor;
            histRec.push(sRec); histDesp.push(sDesp); histInvest.push(sInv); histPatri.push(sRec - sDesp);
        });

        // Cores com base na nova paleta Enterprise
        const dsPatri = { label: 'Patrimônio', data: histPatri, borderColor: '#4f46e5', borderWidth: 3, fill: false, tension: 0.3 };
        const dsInvest = { label: 'Investimentos', data: histInvest, borderColor: '#f59e0b', borderWidth: 2, fill: false, tension: 0.3 };
        const dsRec = { label: 'Receitas', data: histRec, borderColor: '#10b981', borderWidth: 2, fill: false, tension: 0.3 };
        const dsDesp = { label: 'Despesas', data: histDesp, borderColor: '#ef4444', borderWidth: 2, fill: false, tension: 0.3 };

        let datasetsSelecionados: LinhaDoGrafico[] = [];
        if (visualizacaoGrafico === 'patri_inv') datasetsSelecionados = [dsPatri, dsInvest];
        else if (visualizacaoGrafico === 'rec_desp') datasetsSelecionados = [dsRec, dsDesp];
        else if (visualizacaoGrafico === 'all') datasetsSelecionados = [dsPatri, dsInvest, dsRec, dsDesp];

        financeChart.data.labels = nomes;
        financeChart.data.datasets = datasetsSelecionados;
        financeChart.update();
    };

    const ctxInvestment = (document.getElementById('investmentChart')as HTMLCanvasElement).getContext('2d');

    let investmentChart = new Chart(ctxInvestment, 
        { 
            type: 'doughnut', 
            data: 
                { 
                    labels: [], 
                    datasets: [
                    { 
                        data: [], 
                        backgroundColor: [], 
                        borderWidth: 0 
                    }] 
                },
                options: 
                    { 
                        responsive: true, 
                        maintainAspectRatio: false, 
                        plugins: 
                        { 
                            legend: 
                                { 
                                    position: 'bottom' 
                                } 
                        }, 
                        cutout: '75%' 
                    } 
        });

    const atualizarGraficoCarteira = (dados : Transacao[]) => {
        const investDados = dados.filter(t => t.tipo === 'investimento');
        const categorias: Record<string, number> = {};

        investDados.forEach(t => { categorias[t.categoria] = (categorias[t.categoria] || 0) + t.valor; });

        if (Object.keys(categorias).length === 0) {
            investmentChart.data.labels = ['Vazio']; investmentChart.data.datasets[0].data = [1]; investmentChart.data.datasets[0].backgroundColor = ['#e2e8f0'];
        } else {
            investmentChart.data.labels = Object.keys(categorias); 
            investmentChart.data.datasets[0].data = Object.values(categorias); 
            investmentChart.data.datasets[0].backgroundColor = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
        }

        investmentChart.update();
    };

   // ================= 4. modal categoria ================================  
    const PopUpCategoria = document.getElementById("modal-nova-categoria") as HTMLDivElement, 
    
    ButtonClosePopUpCategoria = document.getElementById("close-nova-categoria") as HTMLButtonElement,
    
    InputTipoNovaCat = document.getElementById('tipo-nova-categoria') as HTMLInputElement,
    
    InputNomenovaCategoria = document.getElementById("nome-nova-categoria") as HTMLInputElement, 
    
    DivErros = document.getElementById('cat-error-msg') as HTMLDivElement,
    
    FormNovacategoria = document.getElementById("form-nova-categoria") as HTMLFormElement; 

    let catsReceita = JSON.parse(localStorage.getItem('catsReceita') ?? "null") || ["SALÁRIO", "INVESTIMENTOS", "SERVIÇOS", "OUTROS"];

    let catsDespesa = JSON.parse(localStorage.getItem('catsDespesa') ?? "null") || ["MORADIA", "ALIMENTAÇÃO", "TRANSPORTE", "LAZER", "SAUDE"];

    let catsInvest = JSON.parse(localStorage.getItem('catsInvest') ?? "null") || ["RENDA FIXA", "AÇÕES (BOLSA)", "FIIS", "CRIPTOMOEDAS"];

    const AbrirNewCategoria = (tipo:string) => {
      InputTipoNovaCat.value = tipo;
      InputNomenovaCategoria.value = "";
      PopUpCategoria.style.display = "flex";
      InputNomenovaCategoria.focus();
      DivErros.style.display = "none";
    }

    const RenderizarCategoria = () =>{
        
        const Popular = (id:string, lista: string[]) => {
            const SelectCategoria = document.getElementById(id) as HTMLSelectElement;

            SelectCategoria.innerHTML = "";

            lista.forEach( categoria => {
                SelectCategoria.add(
                    new Option(categoria, categoria)
                )
            });
        }

        Popular('cat-receita', catsReceita); 
        
        Popular('cat-despesa', catsDespesa); 
    
        Popular('cat-invest', catsInvest);
        
    }

    FormNovacategoria.addEventListener("submit", (event)=>{
        event.preventDefault();
        type Movimentacao = 'RECEITA' | 'DESPESA' | 'INVESTIMENTO';
        const Categoria:string = InputNomenovaCategoria.value.trim().toUpperCase(), 
        Tipo = InputTipoNovaCat.value.toLocaleUpperCase() as Movimentacao;

        if(Categoria === ""){
            DivErros.style.display  = "block";
            DivErros.textContent = "input esta Nullo, por favor preencher!";
            return;
        }

        const Listas: Record<Movimentacao, string[]> = {
            RECEITA: catsReceita, 
            DESPESA: catsDespesa, 
            INVESTIMENTO: catsInvest
        }, storageKeys: Record<Movimentacao, string> = { 
                RECEITA: 'catsReceita', 
                DESPESA: 'catsDespesa', 
                INVESTIMENTO: 'catsInvest' };

        if(Listas[Tipo].some(categoria => categoria.toUpperCase() === Categoria)){
            DivErros.style.display  = "block";
            DivErros.textContent = "Esta categoria já existe!";
            return;
        }

        Listas[Tipo].push(Categoria);
        localStorage.setItem(storageKeys[Tipo], JSON.stringify(Listas[Tipo]));
        RenderizarCategoria();
        PopUpCategoria.style.display = "none";
        const sufixoId = Tipo === 'INVESTIMENTO' ? 'invest' : Tipo.toLowerCase();
        (document.getElementById(`cat-${sufixoId}`)as HTMLSelectElement).value = Categoria;
    })

    ButtonClosePopUpCategoria.addEventListener("click", ()=>{
      PopUpCategoria.style.display = "none";
    })

    RenderizarCategoria();

     // ================= 5. modal receita =================
     const PopUpReceita = document.getElementById("modal-receita") as HTMLDivElement, 
     ButtonAddReceita = document.getElementById("btn-open-receita") as HTMLButtonElement, 
     ButtonClosePopUpRceita = document.getElementById("close-receita") as HTMLButtonElement,
     ButtonAddCategoriaReceita = document.getElementById("btn-add-cat-receita") as HTMLButtonElement;

     ButtonAddReceita.addEventListener("click", ()=>{
        PopUpReceita.style.display = "flex";
     });

     ButtonClosePopUpRceita.addEventListener("click", ()=>{
        PopUpReceita.style.display = "none";
     } );

     ButtonAddCategoriaReceita.addEventListener("click", ()=>{
         AbrirNewCategoria("RECEITA");
     });


     // ================= 6. modal despesas =================
     const PopUpDespesa = document.getElementById("modal-despesa") as HTMLDivElement,
     ButtonAddDespesa = document.getElementById("btn-open-despesa") as HTMLButtonElement,
     ButtonClosePopUpDespesa = document.getElementById("close-despesa") as HTMLButtonElement,
     ButtonAddCategoriaDespesa= document.getElementById("btn-add-cat-despesa") as HTMLButtonElement;

     ButtonAddDespesa.addEventListener("click", ()=>{
        PopUpDespesa.style.display =  "flex";
     })

     ButtonClosePopUpDespesa.addEventListener("click", ()=>{
        PopUpDespesa.style.display = "none";
     })

     ButtonAddCategoriaDespesa.addEventListener("click", ()=>{
         AbrirNewCategoria("DESPESA");
     });

    // ================= 7. modal investimentos =================    
    const PopUpInvestimento = document.getElementById("modal-investimento") as HTMLDivElement,
    ButtonAddInvestmento = document.getElementById("btn-open-invest") as HTMLButtonElement,
    ButtonClosePopUpInvestimento = document.getElementById("close-invest") as HTMLButtonElement,
    ButtonAddCategoriaInvestimento= document.getElementById("btn-add-cat-invest") as HTMLButtonElement;

    ButtonAddInvestmento.addEventListener("click", ()=>{
        PopUpInvestimento.style.display = "flex";
    });

    ButtonClosePopUpInvestimento.addEventListener("click", ()=>{
        PopUpInvestimento.style.display = "none";
    })

    ButtonAddCategoriaInvestimento.addEventListener("click", ()=>{
         AbrirNewCategoria("INVESTIMENTO");
     });

     buscarCotacoes();
}); 