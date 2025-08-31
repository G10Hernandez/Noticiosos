// ========= Estado =========
let businessesData = [];
let cart = [];
let currentBusiness = null;

// ========= Cargar JSON (negocios + categorías) =========
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    businessesData = data.negocios || [];

    // Categorías: si vienen en data.categorias úsalo; si no, derivarlas de los negocios
    const catsFromJson = (data.categorias || []).map(c => c.nombre).filter(Boolean);
    const catsFromBiz  = [...new Set((businessesData || []).map(b => b.categoria).filter(Boolean))];
    const categories   = (catsFromJson.length ? catsFromJson : catsFromBiz);

    // Crear botones de categorías
    const buttonsContainer = document.getElementById("categoryButtons");
    buttonsContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.textContent = "Todos";
    allBtn.classList.add("active");
    allBtn.addEventListener("click", () => filterBusinesses("Todos", allBtn));
    buttonsContainer.appendChild(allBtn);

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.addEventListener("click", () => filterBusinesses(cat, btn));
      buttonsContainer.appendChild(btn);
    });

    // Mostrar todos al inicio
    renderNegocios(businessesData);
  })
  .catch(err => console.error("Error cargando data.json:", err));

// ========= Renderizar tarjetas (solo el botón abre popup) =========
function renderNegocios(negocios) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  negocios.forEach(negocio => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${negocio.imagen}" alt="${negocio.nombre}">
      <h3>${negocio.nombre}</h3>
      <p><strong>Categoría:</strong> ${negocio.categoria}</p>
      <p><strong>Tel:</strong> ${negocio.telefono}</p>
      <button onclick="openItemsPopup('${negocio.nombre}')">Ver artículos / servicios</button>
    `;
    container.appendChild(div);
  });
}

// ========= Filtro por categoría =========
function filterBusinesses(category, clickedBtn) {
  const buttons = document.querySelectorAll("#categoryButtons button");
  buttons.forEach(btn => btn.classList.remove("active"));
  clickedBtn.classList.add("active");

  if (category === "Todos") {
    renderNegocios(businessesData);
  } else {
    const filtered = businessesData.filter(b => b.categoria === category);
    renderNegocios(filtered);
  }
}

// ========= Popup de artículos/servicios =========
function openItemsPopup(nombreNegocio) {
  currentBusiness = businessesData.find(b => b.nombre === nombreNegocio);
  if (!currentBusiness) return;

  const title = document.getElementById("itemsTitle");
  const list  = document.getElementById("itemsList");
  title.textContent = `Artículos / Servicios - ${currentBusiness.nombre}`;
  list.innerHTML = "";

  currentBusiness.articulos.forEach(a => {
    const row = document.createElement("div");
    row.innerHTML = `
      ${a.nombre} - $${a.precio}
      <button onclick="addToCart('${a.nombre}', ${a.precio})">🛒 Agregar</button>
    `;
    list.appendChild(row);
  });

  document.getElementById("itemsPopup").style.display = "flex";
}
document.getElementById("closeItemsPopup").onclick = () => {
  document.getElementById("itemsPopup").style.display = "none";
};

// ========= Carrito =========
function addToCart(nombre, precio) {
  cart.push({ nombre, precio });
  updateCart();
  // abre popup carrito cada vez que se agrega (opcional)
  document.getElementById("cartPopup").style.display = "block";
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.precio;
    const div = document.createElement("div");
    div.innerHTML = `${item.nombre} - $${item.precio} <button onclick="removeFromCart(${index})">❌</button>`;
    cartItems.appendChild(div);
  });
  document.getElementById("cartTotal").textContent = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

document.getElementById("closePopup").onclick = function() {
  document.getElementById("cartPopup").style.display = "none";
};

// ========= WhatsApp =========
// Déjalo editable: te preguntará el número antes de enviar
document.getElementById("sendWhatsapp").onclick = function() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  let message = "🛍️ Pedido desde el Portal:\n";
  cart.forEach(item => {
    message += `- ${item.nombre}: $${item.precio}\n`;
  });
  message += `\nTotal: $${document.getElementById("cartTotal").textContent}`;

  const phone = prompt("Ingresa el número de WhatsApp en formato internacional (ej. 521234567890):");
  if (!phone) return;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

// ========= Noticias (BBC Mundo en vivo) =========
async function fetchNews() {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const newsContainer = document.getElementById("newsContainer");
    newsContainer.innerHTML = "";
    (data.items || []).slice(0, 6).forEach(article => {
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

// ========= Carrusel automático (sin brincos) =========
let slideIndex = 0;
function showSlides() {
  const slides = document.getElementsByClassName("carousel-slide");
  for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 4000);
}
showSlides();
