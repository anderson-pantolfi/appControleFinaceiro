"use strict";
const formatarMoeda = (valor, moeda = 'BRL') => {
    let formato = moeda === 'BRL' ? 'pt-BR' : (moeda === 'USD' ? 'en-US' : 'de-DE');
    return valor.toLocaleString(formato, { style: 'currency', currency: moeda });
};
const formatarData = (dataAlvo) => {
    const dataObj = typeof dataAlvo === 'string' ? new Date(dataAlvo) : dataAlvo;
    return dataObj.toLocaleDateString('pt-BR');
};
