// essa constante deixa o valor da minha chave salvo para ser substituida nas urls, sem ela a api não funciona
const apiKey = 'dc3c568392e54b488af07e161bd17bfb';

// Através dessa função você consegue a descrição do jogo através do id dele
async function getGameDescription(gameId) {
  //endereço da api + interpolação das const
  const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;
  //O await só funciona por causa da função assicrona li em cima, para o fetch funcionar não pode trocar
  try {
    //fetch faz a conexão do código com a api
    const response = await fetch(apiUrl);
    if (!response.ok) {

      throw new Error(`Erro de rede - Código: ${response.status}`);
    }
    //depois de obter a resposta do json, a função armazena ela na const data
    const data = await response.json();
    //resposta caso o resumo do jogo não exista
    return data.description || 'Descrição não disponível.';
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Função para configurar a avaliação do usuário
function setupRating(gameId) {
  //elementos DOM para criar o cotainer, label e afins do rating
  const ratingContainer = document.createElement('div');
  ratingContainer.classList.add('rating-container');

  const ratingLabel = document.createElement('p');
  ratingLabel.textContent = 'Avalie o jogo:';
  ratingContainer.appendChild(ratingLabel);

  // Cria uma lista de estrelas para a avaliação de 1 a 5
  for (let i = 1; i <= 5; i++) {
    //O span ajuda a  manipular partes específicas de texto
    const star = document.createElement('span');
    star.textContent = '★';
    star.classList.add('star');

    // Adiciona um evento toda vez que uma estrela é clicada
    star.addEventListener('click', () => handleRating(gameId, i));
//adiciona a estrela clicada ao container
    ratingContainer.appendChild(star);
  }

  // Adiciona o contêiner de avaliação ao game card
  const gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
  gameCard.appendChild(ratingContainer);
}

// Função para aplicar a avaliação no jogo específico
function handleRating(gameId, rating) {
  console.log(`Você atribuiu uma avaliação de ${rating} ao jogo com ID ${gameId}.`);

  // Atualiza a interface do usuário com a avaliação
  const ratingContainer = document.querySelector(`[data-game-id="${gameId}"] .rating-container`);
  ratingContainer.innerHTML = `<p>Você avaliou este jogo como ${rating} estrelas.</p>`;
}
//função para o usuário pesquisar o jogo
function searchGames() {
  const searchTerm = document.getElementById('searchInput').value;

  // api que pega o game card, nome do jogo e onde ele roda
  const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${searchTerm}`;

  fetch(apiUrl)
    .then(response => {
      //deu certo
      if (!response.ok) {
        //deu ruim
        throw new Error(`Erro de rede - Código: ${response.status}`);
      }
      return response.json();
    })
      // mostra os resultados se o json der certo
    .then(data => {
      displaySearchResults(data.results);
    })
    .catch(error => {
      //mostra os erros se tiver
      console.error('Erro:', error);
    });
}
//mostra os resultados da pesquisa
async function displaySearchResults(results) {

  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = ''; // Limpa resultados anteriores
//caso não ache resultados
  if (results.length === 0) {
    searchResultsDiv.innerHTML = 'Nenhum resultado encontrado.';
    return;
  }
// Itera sobre cada jogo nos resultados da pesquisa
  for (const game of results) {
    //cria uma dic pra cada card
    const gameCard = document.createElement('div');
    gameCard.classList.add('game-card');
    gameCard.setAttribute('data-game-id', game.id);

    // Adicione as informações do jogo diretamente no game card
    const gameImage = document.createElement('img');
    gameImage.classList.add('game-image');
    gameImage.src = game.background_image;
    gameCard.appendChild(gameImage);

    const gameTitle = document.createElement('h3');
    gameTitle.textContent = game.name;
    gameCard.appendChild(gameTitle);

    const genreParagraph = document.createElement('p');
    genreParagraph.textContent = `Gênero: ${game.genres.map(genre => genre.name).join(', ')}`;
    gameCard.appendChild(genreParagraph);

    const platformParagraph = document.createElement('p');
    platformParagraph.textContent = `Plataformas: ${game.platforms.map(platform => platform.platform.name).join(', ')}`;
    gameCard.appendChild(platformParagraph);

    // Adiciona a descrição do jogo 
    const description = await getGameDescription(game.id);
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = description;
    gameCard.appendChild(descriptionParagraph);

    // Adiciona o game card à lista de resultados
    searchResultsDiv.appendChild(gameCard);

    // Chama a função setupRating com o ID do jogo
    setupRating(game.id);
  }
}


searchGames();
