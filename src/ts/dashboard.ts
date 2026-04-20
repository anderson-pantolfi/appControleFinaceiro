document.addEventListener('DOMContentLoaded', () => {

    
   // ================= 1. modal categoria =================  
    const PopUpCategoria = document.getElementById("modal-nova-categoria") as HTMLDivElement, 
    ButtonClosePopUpCategoria = document.getElementById("close-nova-categoria") as HTMLButtonElement,
    InputTipoNovaCat = document.getElementById('tipo-nova-categoria') as HTMLInputElement;


    const AbrirNewCategoria = (tipo:string) => {
      InputTipoNovaCat.value = tipo;
      PopUpCategoria.style.display = "flex";
    }

    ButtonClosePopUpCategoria.addEventListener("click", ()=>{
      PopUpCategoria.style.display = "none";
    })

     // ================= 2. modal receita =================
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


     // ================= 3. modal despesas =================
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


    // ================= 4. modal investimentos =================    
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
});