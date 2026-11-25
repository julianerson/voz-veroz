// 1. Transformamos a função para retornar uma Promise


function obterLocalizacao() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Quando der certo, criamos e retornamos o dicionário via resolve()
          const geoloc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            precisao: position.coords.accuracy
          };
          resolve(geoloc);
        },
        (error) => {
          console.error(`Erro ao obter localização: ${error.message}`);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Ajustado para 10 segundos (um valor realista)
          maximumAge: 0
        }
      );
    } else {
      reject(new Error("Geolocalização não é suportada por este navegador."));
    }
  });
}

async function inicializarMapa() {
  let mapa;

  // Tenta usar o GPS; se falhar, usa uma posição padrão
  try {
    const localizacao = await obterLocalizacao();
    mapa = L.map('mapa').setView([localizacao.latitude, localizacao.longitude], 13);
  } catch (erro) {
    console.error("Sem GPS, usando posição padrão:", erro.message);
    mapa = L.map('mapa').setView([-19.8749, -43.9233], 13);
  }

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapa);

  // Agora sim, busca as reclamações e coloca os marcadores
  try {
    const resposta = await fetch('/api/reclamacoes');
    if (!resposta.ok) throw new Error(`Erro no servidor: ${resposta.status}`);
    const pont = await resposta.json();
    const carcador = L.marker([ -19.8749 , -43.9233 ])
      .addTo(mapa)
      .bindPopup('Sua Localização');
    carcador.bindPopup(`
      <strong>Comentário sobre o local:</strong><br>
      gente maluca, atendimento horrivel, parece que colocam a una inteira para so uma pessoa atender, pessimos equipamentos, anao pera essa e minha faculdade ne.... desculpe achei que era uma escola publica.
    `);


    for (const ponto of pont) {
      L.marker([ponto.latitude, ponto.longitude])
        .addTo(mapa)
        .bindPopup(`<strong>user?: ${ponto.nome}</strong><br>reclamação: ${ponto.reclamacao}<br><small>email: ${ponto.email}</small>`);
    }
  } catch (erro) {
    console.error("Erro ao carregar reclamações:", erro.message);
  }
}

// 3. Executa o fluxo
inicializarMapa();
export { obterLocalizacao };