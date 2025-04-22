"use strict";
/* divs*/
const body = document.querySelector("body");
const divSideBar = document.getElementById("side-bar");
const divTypeOperation = document.getElementById("typeOperation");
const pouUpNewTrasacao = document.getElementById("popUpAddreceita");
const popUpNewCategoria = document.getElementById("popUpNovaCategoria");
const divAlert = document.getElementById("alert");
const divperfil = document.getElementById("perfil");
const divsubMenuPerfil = document.getElementById("subMenuPerfil");
/* buttons */
const buttonCloseSiderBar = document.getElementById("button-close-sider-bar");
const buttonOpenSiderBar = document.getElementById("button-open-sider-bar");
const buttonNewTrasacaoopen = document.getElementById('buttonTransacaoExpandido');
const buttonNewTrasacaoclose = document.getElementById("buttonTransacaoContraido");
const linkSiderBar = document.querySelectorAll(".button-side-menu");
const textSiderBar = document.querySelectorAll(".text-button-side");
const buttonReceita = document.getElementById("deposit");
const buttonDespesa = document.getElementById("expenses");
const buttonclosepouUpNewTrasacao = document.getElementById("buttonclosePopUpAddReceita");
const buttonNovaCategoriaTrasacao = document.getElementById("buttonAddNewCategoria");
const buttonclosePopUpAddCategoria = document.getElementById("buttonclosePopUpAddCategoria");
const buttonAdicionarcategoria = document.getElementById("adicionarCatecoria");
const buttonclosePopUpAviso = document.getElementById("okAlert");
/* texts */
const textLogo = document.getElementById("text-logo");
const textAlert = document.getElementById("alertText");
/*inputs*/
const valor = document.getElementById("Valor");
const description = document.getElementById("descriptionReceita");
const nameCategoria = document.getElementById("inputnameCategoria");
/* outros*/
let isWindowOpen = false;
/* event */
divperfil.addEventListener("click", openSubMenuPerfil);
buttonCloseSiderBar.addEventListener("click", () => {
    closeSideBar();
});
buttonOpenSiderBar.addEventListener("click", () => {
    OpenSiderBar();
});
buttonNewTrasacaoopen.addEventListener("click", (event) => {
    isWindowOpen = !isWindowOpen;
    if (isWindowOpen) {
        divTypeOperation.style.left = "210px";
        divTypeOperation.style.top = "170px";
        newTrasacao();
    }
    else {
        closenewtrasacao();
    }
    event.stopPropagation();
});
buttonNewTrasacaoclose.addEventListener("click", (event) => {
    isWindowOpen = !isWindowOpen;
    if (isWindowOpen) {
        divTypeOperation.style.left = "90px";
        divTypeOperation.style.top = "130px";
        newTrasacao();
    }
    else {
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
buttonReceita.addEventListener("click", () => {
    openPopUpNewtrasacao();
    const titlePopupNewtrasacao = document.getElementById("titleAddTrazacao");
    titlePopupNewtrasacao.textContent = "RECEITA";
});
buttonDespesa.addEventListener("click", () => {
    openPopUpNewtrasacao();
    const titlePopupNewtrasacao = document.getElementById("titleAddTrazacao");
    titlePopupNewtrasacao.textContent = "DESPESA";
});
buttonclosepouUpNewTrasacao.addEventListener("click", closePopUpNewtrasacao);
buttonNovaCategoriaTrasacao.addEventListener("click", newCategoriaTrasacao);
buttonclosePopUpAddCategoria.addEventListener("click", closeNewCategoriatrasacao);
buttonAdicionarcategoria.addEventListener("click", () => {
    let categoria = nameCategoria.value;
    AddNewCategoria(categoria);
});
buttonclosePopUpAviso.addEventListener("click", closeAviso);
/* fuction */
function openSubMenuPerfil() {
    divsubMenuPerfil.style.display = "block";
}
function closeSideBar() {
    divSideBar.style.width = "8vw";
    textLogo.style.display = "none";
    buttonNewTrasacaoopen.style.display = "none";
    buttonNewTrasacaoclose.style.display = "block";
    for (let indexTextSiderbar = 0; indexTextSiderbar < textSiderBar.length; indexTextSiderbar++) {
        textSiderBar[indexTextSiderbar].style.display = "none";
    }
    for (let indexLinkSiderbar = 0; indexLinkSiderbar < linkSiderBar.length; indexLinkSiderbar++) {
        linkSiderBar[indexLinkSiderbar].style.width = "50px";
    }
    buttonCloseSiderBar.style.display = "none";
    buttonOpenSiderBar.style.display = "block";
}
;
function OpenSiderBar() {
    divSideBar.style.width = "20vw";
    textLogo.style.display = "block";
    buttonNewTrasacaoopen.style.display = "block";
    buttonNewTrasacaoclose.style.display = "none";
    for (let indexTextSiderbar = 0; indexTextSiderbar < textSiderBar.length; indexTextSiderbar++) {
        textSiderBar[indexTextSiderbar].style.display = "block";
    }
    for (let indexLinkSiderbar = 0; indexLinkSiderbar < linkSiderBar.length; indexLinkSiderbar++) {
        linkSiderBar[indexLinkSiderbar].style.width = "200px";
    }
    buttonCloseSiderBar.style.display = "block";
    buttonOpenSiderBar.style.display = "none";
}
function newTrasacao() {
    divTypeOperation.style.display = "flex";
}
function closenewtrasacao() {
    divTypeOperation.style.display = "none";
}
function openPopUpNewtrasacao() {
    pouUpNewTrasacao.style.display = "flex";
    closenewtrasacao();
}
function closePopUpNewtrasacao() {
    valor.value = "";
    description.value = "";
    pouUpNewTrasacao.style.display = "none";
}
function newCategoriaTrasacao() {
    buttonclosepouUpNewTrasacao.disabled = true;
    popUpNewCategoria.style.display = "flex";
}
function closeNewCategoriatrasacao() {
    popUpNewCategoria.style.display = "none";
    buttonclosepouUpNewTrasacao.disabled = false;
}
function AddNewCategoria(valorOption) {
    textAlert.textContent = "";
    const selectCategoria = document.getElementById("categoria");
    if (nameCategoria.value !== "") {
        const option = document.createElement("option");
        option.value = valorOption;
        option.textContent = valorOption;
        selectCategoria.appendChild(option);
        closeNewCategoriatrasacao();
    }
    else {
        buttonclosePopUpAddCategoria.disabled = true;
        textAlert.textContent = "o nome da categoria esta vazio, digite um nome";
        divAlert.style.display = "flex";
    }
}
function closeAviso() {
    buttonclosePopUpAddCategoria.disabled = false;
    textAlert.textContent = "";
    divAlert.style.display = "none";
}
