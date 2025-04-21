/* divs*/
const body = document.querySelector("body") as HTMLBodyElement;
const divSideBar = document.getElementById("side-bar") as HTMLDivElement;
const divTypeOperation = document.getElementById("typeOperation") as HTMLDivElement;
const pouUpNewTrasacao = document.getElementById("popUpAddreceita") as HTMLDivElement;
const popUpNewCategoria = document.getElementById("popUpNovaCategoria") as HTMLDivElement;

/* buttons */
const buttonCloseSiderBar = document.getElementById("button-close-sider-bar") as HTMLButtonElement;
const buttonOpenSiderBar = document.getElementById("button-open-sider-bar") as HTMLButtonElement;
const buttonNewTrasacaoopen = document.getElementById('buttonTransacaoExpandido') as HTMLButtonElement;
const buttonNewTrasacaoclose = document.getElementById("buttonTransacaoContraido") as HTMLButtonElement;
const linkSiderBar = document.querySelectorAll(".button-side-menu") as NodeListOf<Element>;
const textSiderBar = document.querySelectorAll(".text-button-side") as NodeListOf<Element>;
const buttonReceita = document.getElementById("deposit") as HTMLButtonElement;
const buttonDespesa = document.getElementById("expenses") as HTMLButtonElement;
const buttonclosepouUpNewTrasacao = document.getElementById("buttonclosePopUpAddReceita") as HTMLButtonElement;
const buttonNovaCategoriaTrasacao = document.getElementById("buttonAddNewCategoria") as HTMLButtonElement;
const buttonclosePopUpAddCategoria = document.getElementById("buttonclosePopUpAddCategoria") as HTMLButtonElement;

/* texts */
const textLogo = document.getElementById("text-logo") as HTMLElement;

/*inputs*/
const valor = document.getElementById("Valor") as HTMLInputElement; 
const description = document.getElementById("descriptionReceita") as HTMLTextAreaElement;

/* outros*/
let isWindowOpen = false;

/* event */
buttonCloseSiderBar.addEventListener("click", () =>{
    closeSideBar();
});

buttonOpenSiderBar.addEventListener("click", () => {
    OpenSiderBar();
});

buttonNewTrasacaoopen.addEventListener("click", (event) => {
    isWindowOpen = !isWindowOpen; 
    if (isWindowOpen) {
        divTypeOperation.style.left = "210px"
        divTypeOperation.style.top = "170px"
        newTrasacao(); 
    } else {
        closenewtrasacao(); 
    }
    event.stopPropagation(); 
});

buttonNewTrasacaoclose.addEventListener("click", (event) => {
    isWindowOpen = !isWindowOpen; 
    if (isWindowOpen) {
        divTypeOperation.style.left = "90px"
        divTypeOperation.style.top = "130px"
        newTrasacao(); 
    } else {
        closenewtrasacao(); 
    }
    event.stopPropagation(); 
});

document.addEventListener("click", (event) => {
    if (event.target instanceof Node && isWindowOpen && !divTypeOperation.contains(event.target) && event.target !== buttonNewTrasacaoopen) {
        closenewtrasacao(); 
        isWindowOpen = false; 
    }
});

buttonReceita.addEventListener("click", () =>{
    openPopUpNewtrasacao();
    const titlePopupNewtrasacao = document.getElementById("titleAddTrazacao") as HTMLElement;
    titlePopupNewtrasacao.textContent = "RECEITA";
});

buttonDespesa.addEventListener("click", () =>{
    openPopUpNewtrasacao();
    const titlePopupNewtrasacao = document.getElementById("titleAddTrazacao") as HTMLElement;
    titlePopupNewtrasacao.textContent = "DESPESA";
});

buttonclosepouUpNewTrasacao.addEventListener("click", closePopUpNewtrasacao);

buttonNovaCategoriaTrasacao.addEventListener("click", newCategoriaTrasacao);

buttonclosePopUpAddCategoria.addEventListener("click", closeNewCategoriatrasacao);

/* fuction */

function closeSideBar(){
    divSideBar.style.width = "8vw";

    textLogo.style.display = "none";

    buttonNewTrasacaoopen.style.display = "none";
    buttonNewTrasacaoclose.style.display = "block";
    
    for(let indexTextSiderbar = 0; indexTextSiderbar < textSiderBar.length; indexTextSiderbar++ ){
        (textSiderBar[indexTextSiderbar] as HTMLSpanElement).style.display = "none";
    }

    for(let indexLinkSiderbar = 0; indexLinkSiderbar < linkSiderBar.length; indexLinkSiderbar++){
        (linkSiderBar[indexLinkSiderbar] as HTMLAnchorElement).style.width = "50px" 
    }

    buttonCloseSiderBar.style.display = "none";
    buttonOpenSiderBar.style.display = "block";
};

function OpenSiderBar(){
    divSideBar.style.width = "20vw";

    textLogo.style.display = "block";

    buttonNewTrasacaoopen.style.display = "block";
    buttonNewTrasacaoclose.style.display = "none";
    
    for(let indexTextSiderbar = 0; indexTextSiderbar < textSiderBar.length; indexTextSiderbar++ ){
        (textSiderBar[indexTextSiderbar] as HTMLSpanElement).style.display = "block";
    }

    for(let indexLinkSiderbar = 0; indexLinkSiderbar < linkSiderBar.length; indexLinkSiderbar++){
        (linkSiderBar[indexLinkSiderbar] as HTMLAnchorElement).style.width = "200px" 
    }

    buttonCloseSiderBar.style.display = "block";
    buttonOpenSiderBar.style.display = "none";
}

function newTrasacao(){
    divTypeOperation.style.display = "flex"
}

function closenewtrasacao(){
    divTypeOperation.style.display = "none"
}

function openPopUpNewtrasacao(){
    pouUpNewTrasacao.style.display = "flex";
    closenewtrasacao();
}

function closePopUpNewtrasacao(){
    valor.value = "";
    description.value = "";
    pouUpNewTrasacao.style.display = "none";
}

function newCategoriaTrasacao(){
    popUpNewCategoria.style.display = "flex";
}

function closeNewCategoriatrasacao(){
    popUpNewCategoria.style.display = "none";
}