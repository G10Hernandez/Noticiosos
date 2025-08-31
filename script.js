// ===================
// Carrusel
// ===================
let slideIndex = 0;
function showSlides() {
  const slides = document.getElementsByClassName("carousel-slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1; }
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 4000);
}
showSlides();

// ===================
// Noticias desde BBC Mundo con rss2json
// ===================
function cargarNoticias() {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const noticias = data.items.slice(0, 5);
      const newsContainer = document.getElementById("newsContainer");
      newsContainer.innerHTML = "";

      noticias.forEach(n => {
        const div = document.createElement("div");
        div.classList.add("noticia");
        div.innerHTML = `<a href="${n.link}" target="_blank">${n.title}</a>`;
        newsContainer.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error cargando noticias:", err);
      document.getElementById("newsContainer").innerHTML = "<p>No se pudieron cargar las noticias.</p>";
    });
}
cargarNoticias();

// ===================
// Negocios y Carrito
// ===================
let carrito = [];
let negociosData = [];

function mostrarCategorias() {
  const categorias = [...new Set(negociosData.map(n => n.categoria))];
  const catContainer = document.getElementById("categoryButtons");
  catContainer.innerHTML = "";

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => mostrarNegocios(cat);
    catContainer.appendChild(btn);
  });
}

function mostrarNegocios(categoria) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const filtrados = negociosData.filter(n => n.categoria === categoria);

  filtrados.forEach(negocio => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${negocio.imagen}" alt="${negocio.nombre}">
      <h3>${negocio.nombre}</h3>
      <button onclick="abrirPopup(${negocio.id})">Ver artículos</button>
    `;
    container.appendChild(card);
  });
}

// ===================
// Popup
// ===================
const modal = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const popupTitle = document.getElementById("popupTitle");
const popupItems = document.getElementById("popupItems");

function abrirPopup(idNegocio) {
  const negocio = negociosData.find(n => n.id === idNegocio);
  popupTitle.textContent = negocio.nombre;
  popupItems.innerHTML = "";

  negocio.articulos.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio}
      <button onclick="agregarAlCarrito('${item.nombre}', ${item.precio})">Agregar</button>
    `;
    popupItems.appendChild(li);
  });

  modal.style.display = "block";
}

closePopup.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

// ===================
// Carrito
// ===================
function agregarAlCarrito(nombre, precio) {
  carrito.push({nombre, precio});
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("carritoLista");
  const totalElem = document.getElementById("carritoTotal");
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
    total += item.precio;
  });

  totalElem.textContent = `Total: $${total}`;
}

// ===================
// WhatsApp
// ===================
document.getElementById("whatsappBtn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola, quiero comprar:\n";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} $${item.precio}\n`;
  });
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  mensaje += `\nTotal: $${total}`;

  const url = `https://wa.me/521234567890?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

// ===================
// Cargar datos desde data.json
// ===================
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    negociosData = data.negocios;
    mostrarCategorias();
  })
  .catch(err => console.error("Error cargando data.json:", err));
