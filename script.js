let businessesData = [];

// === Cargar negocios desde data.json ===
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    businessesData = data.negocios;

    // Crear botones de categorías
    const categories = [...new Set(businessesData.map(b => b.categoria))];
    const buttonsContainer = document.getElementById("categoryButtons");

    // Botón "Todos"
    const allBtn = document.createElement("button");
    allBtn.textContent = "Todos";
    allBtn.classList.add("active");
    allBtn.addEventListener("click", () => filterBusinesses("Todos", allBtn));
    buttonsContainer.appendChild(allBtn);

    // Botones de cada categoría
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.addEventListener("click", () => filterBusinesses(cat, btn));
      buttonsContainer.appendChild(btn);
    });

    // Mostrar todos al inicio
    renderBusinesses(businessesData);
  });

// === Renderizar negocios ===
function renderBusinesses(businesses) {
  const cardsContainer = document.getElementById("cardsContainer");
  cardsContainer.innerHTML = "";
  businesses.forEach(business => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${business.imagen}" alt="${business.nombre}">
      <h3>${business.nombre}</h3>
      <p><strong>${business.categoria}</strong></p>
      <p>${business.descripcion}</p>
    `;
    cardsContainer.appendChild(card);
  });
}

// === Filtro por categorías ===
function filterBusinesses(category, clickedBtn) {
  const buttons = document.querySelectorAll("#categoryButtons button");
  buttons.forEach(btn => btn.classList.remove("active"));
  clickedBtn.classList.add("active");

  if (category === "Todos") {
    renderBusinesses(businessesData);
  } else {
    const filtered = businessesData.filter(b => b.categoria === category);
    renderBusinesses(filtered);
  }
}

// === Noticias RSS ===
async function fetchNews() {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const newsContainer = document.getElementById("newsContainer");
    newsContainer.innerHTML = "";

    data.items.slice(0, 6).forEach(article => {
      const newsItem = document.createElement("div");
      newsItem.className = "news-item";
      newsItem.innerHTML = `<a href="${article.link}" target="_blank" style="color:white; text-decoration:none;">${article.title}</a>`;
      newsContainer.appendChild(newsItem);
    });
  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
}

fetchNews();

// === Carrusel automático ===
let slideIndex = 0;
showSlides();

function showSlides() {
  const slides = document.getElementsByClassName("carousel-slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 4000); // cambia cada 4s
}
