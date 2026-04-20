document.addEventListener('DOMContentLoaded', () => {

    
   // ================= 1. modal categoria =================  
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