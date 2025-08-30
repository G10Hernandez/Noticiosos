let businessesData = [];

// === Cargar negocios desde data.json ===
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    businessesData = data.businesses;

    // Crear botones únicos de categorías
    const categories = [...new Set(businessesData.map(b => b.category))];
    const buttonsContainer = document.getElementById('categoryButtons');

    // Botón "Todos"
    const allBtn = document.createElement('button');
    allBtn.textContent = "Todos";
    allBtn.classList.add("active");
    allBtn.addEventListener('click', () => filterBusinesses("Todos", allBtn));
    buttonsContainer.appendChild(allBtn);

    // Botones de cada categoría
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.textContent = cat;
      btn.addEventListener('click', () => filterBusinesses(cat, btn));
      buttonsContainer.appendChild(btn);
    });

    // Mostrar todos al inicio
    renderBusinesses(businessesData);
  });

// === Función para mostrar negocios ===
function renderBusinesses(businesses) {
  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = "";
  businesses.forEach(business => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${business.image}" alt="${business.name}">
      <h3>${business.name}</h3>
      <p>${business.category}</p>
      <p>${business.address}</p>
    `;
    cardsContainer.appendChild(card);
  });
}

// === Filtro por categoría ===
function filterBusinesses(category, btn) {
  document.querySelectorAll("#categoryButtons button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  if (category === "Todos") {
    renderBusinesses(businessesData);
  } else {
    const filtered = businessesData.filter(b => b.category === category);
    renderBusinesses(filtered);
  }
}

// === Noticias en tiempo real desde BBC Mundo (sin API Key) ===
async function fetchNews() {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const newsContainer = document.getElementById('newsContainer');

    data.items.slice(0, 6).forEach(article => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';
      newsItem.innerHTML = `<a href="${article.link}" target="_blank" style="color:white; text-decoration:none;">${article.title}</a>`;
      newsContainer.appendChild(newsItem);

      // Animación de rebote
      let direction = 1;
      let pos = Math.random() * (newsContainer.clientHeight - 30);
      newsItem.style.top = pos + 'px';

      function animate() {
        pos += direction * 1.2;
        if (pos > newsContainer.clientHeight - 30 || pos < 0) direction *= -1;
        newsItem.style.top = pos + 'px';
        requestAnimationFrame(animate);
      }
      animate();
    });
  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
}

// Iniciar noticias
fetchNews();
