import { meuTexto } from "../../dados.js";
// Usando async/await
async function obterDados() {
    console.log(meuTexto);
    const url = new URL(meuTexto.toString());
    url.searchParams.append('id', 1); // Query params

    const response = await fetch(url);
    const data = await response.json(); // É necessário extrair o JSON explicitamente
    console.log(data,meuTexto);
}
obterDados();