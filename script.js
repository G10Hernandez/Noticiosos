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
function renderNegocios(negocios) {
  const container = document.getElementById("negocios");
  container.innerHTML = "";
  negocios.forEach(negocio => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${negocio.imagen}" alt="${negocio.nombre}" style="width:100%; border-radius:10px;">
      <h3>${negocio.nombre}</h3>
      <p>${negocio.descripcion}</p>
      <p><strong>$${negocio.precio}</strong></p>
      <button onclick="addToCart('${negocio.nombre}', ${negocio.precio})">🛒 Comprar</button>
    `;
    container.appendChild(div);
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

let cart = [];

// === Función para añadir al carrito ===
function addToCart(nombre, precio) {
  cart.push({ nombre, precio });
  updateCart();
  document.getElementById("cartPopup").style.display = "block"; // abre popup
}

// === Actualizar carrito ===
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

// === Quitar producto del carrito ===
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// === Cerrar popup ===
document.getElementById("closePopup").onclick = function() {
  document.getElementById("cartPopup").style.display = "none";
};

// === Enviar a WhatsApp ===
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

  const phone = "5211234567890"; // <-- coloca tu número de WhatsApp aquí
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
