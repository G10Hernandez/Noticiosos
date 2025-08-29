let carrito = [];
let datos = { banners: [], noticias: [], negocios: [] };

async function cargarDatos() {
  try {
    const res = await fetch("datos.json");
    datos = await res.json();
    cargarCarrusel();
    cargarNoticias();
    cargarNegocios();

  } catch (err) {
    console.error("❌ Error cargando datos.json:", err);
  }
}

/* ========== CARRUSEL ========== 🎠*/
function cargarCarrusel() {
  const carrusel = document.getElementById("carrusel");
  carrusel.innerHTML = "";

  datos.banners.forEach((banner, i) => {
    const img = document.createElement("img");
    img.src = banner.imagen;
    img.alt = banner.titulo;
    img.classList.add("slide");
    if (i === 0) img.classList.add("activo");
    carrusel.appendChild(img);
  });

  // Rotación automática
  let index = 0;
  setInterval(() => {
    const slides = document.querySelectorAll("#carrusel .slide");
    slides.forEach(s => s.classList.remove("activo"));
    index = (index + 1) % slides.length;
    slides[index].classList.add("activo");
  }, 4000);
}

/* ========== NOTICIAS ========== */
function cargarNoticias() {
  const contenedor = document.getElementById("lista-noticias");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  datos.noticias.forEach(noticia => {
    const div = document.createElement("div");
    div.classList.add("noticia");

    div.innerHTML = `
      <img src="${noticia.imagen}" alt="${noticia.titulo}">
      <h3>${noticia.titulo}</h3>
      <p>${noticia.descripcion}</p>
    `;
    contenedor.appendChild(div);
  });
}

/* ========== NEGOCIOS ========== */
function cargarNegocios(filtroCategoria = "", busqueda = "") {
  const contenedor = document.getElementById("tarjetas-negocios");
  const filtros = document.getElementById("filtros-categorias");

  if (!contenedor) return;

  contenedor.innerHTML = "";
  filtros.innerHTML = "";

  // Crear categorías
  const categorias = [...new Set(datos.negocios.map(n => n.categoria))];
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => cargarNegocios(cat, document.getElementById("buscador").value);
    filtros.appendChild(btn);
  });

  // Filtrar negocios
  let negociosFiltrados = datos.negocios;
  if (filtroCategoria) {
    negociosFiltrados = negociosFiltrados.filter(n => n.categoria === filtroCategoria);
  }
  if (busqueda) {
    negociosFiltrados = negociosFiltrados.filter(n => n.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  }

  // Render tarjetas
  negociosFiltrados.forEach(negocio => {
    const card = document.createElement("div");
    card.classList.add("tarjeta");

    card.innerHTML = `
      <img src="${negocio.imagen}" alt="${negocio.nombre}">
      <h3>${negocio.nombre}</h3>
      <p>${negocio.descripcion}</p>
      <button class="btn-carrito" onclick="abrirPopup('${negocio.nombre}')">🛒 Ver artículos</button>
    `;

    contenedor.appendChild(card);
  });
}

/* ========== CARRITO POPUP ========== */
function abrirPopup(nombreNegocio) {
  const popup = document.getElementById("popup");
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  // Buscar negocio
  const negocio = datos.negocios.find(n => n.nombre === nombreNegocio);
  if (!negocio) return;

  negocio.articulos.forEach(art => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${art.nombre} - $${art.precio} 
      <input type="number" min="1" value="1" id="qty-${art.nombre}">
      <button onclick="agregarAlCarrito('${art.nombre}', ${art.precio})">Agregar</button>
    `;
    lista.appendChild(li);
  });

  popup.style.display = "block";
}

function cerrarPopup() {
  document.getElementById("popup").style.display = "none";
}

function agregarAlCarrito(nombre, precio) {
  const qty = parseInt(document.getElementById(`qty-${nombre}`).value) || 1;
  carrito.push({ nombre, precio, cantidad: qty });
  actualizarTotal();
}

function actualizarTotal() {
  let total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  document.getElementById("total-carrito").textContent = `Total: $${total}`;
}

function enviarWhatsApp() {
  let mensaje = "🛒 Pedido:\n";
  carrito.forEach(item => {
    mensaje += `${item.cantidad} x ${item.nombre} = $${item.precio * item.cantidad}\n`;
  });
  mensaje += document.getElementById("total-carrito").textContent;

  const url = `https://wa.me/5215555555555?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

/* ========== BUSCADOR ========== */
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();

  const buscador = document.getElementById("buscador");
  if (buscador) {
    buscador.addEventListener("input", e => {
      cargarNegocios("", e.target.value);
    });
  }
});
