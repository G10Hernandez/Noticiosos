let data = {};
let carrito = [];

// ====== Cargar data.json ======
fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    mostrarCategorias();
    mostrarNegocios(data.negocios);
    cargarNoticias();
  });

// ====== Categorías ======
function mostrarCategorias() {
  const categorias = [...new Set(data.negocios.map(n => n.categoria))];
  const div = document.getElementById("categoryButtons");
  div.innerHTML = "";

  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Todos";
  btnTodos.onclick = () => mostrarNegocios(data.negocios);
  div.appendChild(btnTodos);

  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => filtrarNegocios(cat);
    div.appendChild(btn);
  });
}

function filtrarNegocios(categoria) {
  const filtrados = data.negocios.filter(n => n.categoria === categoria);
  mostrarNegocios(filtrados);
}

// ====== Negocios ======
function mostrarNegocios(lista) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  lista.forEach(negocio => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${negocio.imagen}" alt="${negocio.nombre}">
      <h3>${negocio.nombre}</h3>
      <p>Categoría: ${negocio.categoria}</p>
      <button onclick="abrirPopup('${negocio.nombre}')">Ver artículos</button>
    `;
    container.appendChild(card);
  });
}

// ====== Popup Artículos ======
function abrirPopup(nombreNegocio) {
  const negocio = data.negocios.find(n => n.nombre === nombreNegocio);
  document.getElementById("popup-titulo").textContent = negocio.nombre;

  const contenedor = document.getElementById("popup-articulos");
  contenedor.innerHTML = "";
  negocio.articulos.forEach(art => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${art.nombre} - $${art.precio}</p>
      <button onclick="agregarAlCarrito('${art.nombre}', ${art.precio}, '${negocio.telefono}')">Agregar</button>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("popup").style.display = "block";
}

function cerrarPopup() {
  document.getElementById("popup").style.display = "none";
}

// ====== Carrito ======
function agregarAlCarrito(nombre, precio, telefono) {
  carrito.push({ nombre, precio, telefono });
  mostrarCarrito();
}

function mostrarCarrito() {
  const div = document.getElementById("cartContainer");
  div.innerHTML = carrito.map(item => `<p>${item.nombre} - $${item.precio}</p>`).join("");
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  div.innerHTML += `<h4>Total: $${total}</h4>
    <button onclick="enviarWhatsApp()">Enviar por WhatsApp</button>`;
}

function enviarWhatsApp() {
  if (carrito.length === 0) return;
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  let mensaje = "Pedido:%0A";
  carrito.forEach(item => {
    mensaje += `${item.nombre} - $${item.precio}%0A`;
  });
  mensaje += `Total: $${total}`;
  const telefono = carrito[0].telefono;
  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
}

// ===================
// Cargar Noticias BBC Mundo con rss2json y mostrar como Ticker
// ===================
function cargarNoticias() {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const noticias = data.items.slice(0, 10); // hasta 10 noticias
      const newsContainer = document.getElementById("newsContainer");
      newsContainer.innerHTML = "";

      const ticker = document.createElement("div");
      ticker.classList.add("ticker");

      // concatenamos todas las noticias en una sola línea desplazable
      ticker.innerHTML = noticias
        .map(n => `<span class="noticia"><a href="${n.link}" target="_blank">${n.title}</a></span>`)
        .join(" • ");

      newsContainer.appendChild(ticker);
    })
    .catch(err => {
      console.error("Error cargando noticias:", err);
      document.getElementById("newsContainer").innerHTML = "<p>No se pudieron cargar las noticias.</p>";
    });
}

// Llamar la función al cargar la página
cargarNoticias();
