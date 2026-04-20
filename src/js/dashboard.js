"use strict";
document.addEventListener('DOMContentLoaded', () => {
    // ================= 1. modal categoria =================  
    const PopUpCategoria = document.getElementById("modal-nova-categoria"), ButtonClosePopUpCategoria = document.getElementById("close-nova-categoria"), InputTipoNovaCat = document.getElementById('tipo-nova-categoria');
    const AbrirNewCategoria = (tipo) => {
        InputTipoNovaCat.value = tipo;
        PopUpCategoria.style.display = "flex";
    };
    ButtonClosePopUpCategoria.addEventListener("click", () => {
        PopUpCategoria.style.display = "none";
    });
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
