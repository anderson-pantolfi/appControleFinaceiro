"use strict";
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c;
    // ================= 1. modal categoria =================  
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
    // ================= 2. modal receita =================
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
    // ================= 3. modal despesas =================
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
    // ================= 4. modal investimentos =================    
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
