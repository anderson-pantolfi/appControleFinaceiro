 const formatarMoeda = (valor: number, moeda:string = 'BRL') => {
        let formato = moeda === 'BRL' ? 'pt-BR' : (moeda === 'USD' ? 'en-US' : 'de-DE');
        return valor.toLocaleString(formato, { style: 'currency', currency: moeda });
};
    
const formatarData = (dataAlvo: string | Date) => {
    
    const dataObj = typeof dataAlvo === 'string' ? new Date(dataAlvo) : dataAlvo;
    
    return dataObj.toLocaleDateString('pt-BR');
};