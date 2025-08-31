let businessesData = [];
let cart = [];

// ================= CARGAR DATA.JSON =================
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    businessesData = data.negocios;
    mostrarCategorias(data.categorias);
    mostrarNegocios(businessesData);
  });

// ================= MOSTRAR CATEGORÍAS =================
function mostrarCategorias(categorias) {
  const cont = document.getElementById("categoryButtons");
  cont.innerHTML = "";
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => filtrarNegocios(cat);
    cont.appendChild(btn);
  });
}
function filtrarNegocios(cat) {
  const filtrados = businessesData.filter(n => n.categoria === cat);
  mostrarNegocios(filtrados);
}

// ================= MOSTRAR NEGOCIOS =================
function mostrarNegocios(negocios) {
  const cont = document.getElementById("cardsContainer");
  cont.innerHTML = "";
  negocios.forEach((n, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${n.imagen}" alt="${n.nombre}">
      <h3>${n.nombre}</h3>
      <p>${n.descripcion}</p>
      <button onclick="abrirPopupArticulos(${i})">Ver artículos / servicios</button>
    `;
    cont.appendChild(card);
  });
}

// ================= POPUP DE ARTÍCULOS =================
function abrirPopupArticulos(index) {
  const negocio = businessesData[index];
  document.getElementById("popupTitulo").textContent = negocio.nombre;

  const cont = document.getElementById("popupArticulos");
  cont.innerHTML = "";
  negocio.articulos.forEach(a => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${a.nombre} - $${a.precio}
      <button onclick="addToCart('${a.nombre}', ${a.precio})">🛒</button>
    `;
    cont.appendChild(div);
  });

  document.getElementById("articulosPopup").style.display = "flex";
}
document.getElementById("closeArticulosPopup").onclick = () => {
  document.getElementById("articulosPopup").style.display = "none";
};

// ================= CARRITO =================
function addToCart(nombre, precio) {
  cart.push({ nombre, precio });
  renderCart();
}
function renderCart() {
  const cont = document.getElementById("cartContainer");
  cont.innerHTML = "";
  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.nombre} - $${item.precio}`;
    cont.appendChild(div);
  });
}

// ================= WHATSAPP =================
document.getElementById("whatsappButton").onclick = () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  let mensaje = "Hola, quiero comprar:\n";
  cart.forEach(item => {
    mensaje += `- ${item.nombre} $${item.precio}\n`;
  });
  const url = `https://wa.me/521234567890?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
};

// ================= CARRUSEL =================
let slideIndex = 0;
function showSlides() {
  const slides = document.getElementsByClassName("carousel-slide");
  for (let i=0; i<slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 4000);
}
showSlides();

// ================= NOTICIAS (RSS BBC) =================
async function fetchNews() {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const cont = document.getElementById("newsContainer");
    cont.innerHTML = "";
    data.items.slice(0, 5).forEach(n => {
      const div = document.createElement("div");
      div.innerHTML = `<a href="${n.link}" target="_blank">${n.title}</a>`;
      cont.appendChild(div);
    });
  } catch (e) {
    console.error("Error cargando noticias", e);
  }
}
fetchNews();
