import { obterLocalizacao } from "./app.js";

async function enviarDados(dadosParaEnviar) {
  const resposta = await fetch('/api/reclamacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosParaEnviar)
  });

  if (!resposta.ok) {
    throw new Error(`Erro no servidor: ${resposta.status}`);
  }

  const resultado = await resposta.json();
  console.log('Resposta do Flask:', resultado);
  return resultado;
}

async function receber_dados(evento) {
  evento.preventDefault();

  try {
    const localizacao = await obterLocalizacao();
    const reclame_aqui = document.getElementById("reclamacao");
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");

    await enviarDados({
      latitude: localizacao.latitude,
      longitude: localizacao.longitude,
      nome: nome.value,
      email: email.value,
      reclamacao: reclame_aqui.value
    });

    // Redireciona para a rota '/' do Flask apenas após confirmar o envio
    window.location.href = "/";

  } catch (erro) {
    console.error("Erro ao processar envio:", erro);
    alert("Não foi possível enviar sua reclamação. Verifique a permissão de localização.");
  }
}

const formulario = document.getElementById("meuFormulario");
formulario.addEventListener("submit", receber_dados);
