let DATA = {};
let total = 0;

// ================== CARGAR DATA ==================
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    DATA = data;
    cargarCarrusel(DATA.banners);
    cargarNegocios(DATA.negocios);
    cargarNoticias(DATA.noticias);
  })
  .catch(err => console.error("Error cargando data.json:", err));

// ================== CARRUSEL ==================
function cargarCarrusel(banners) {
  const carrusel = document.getElementById("carrusel");
  if (!carrusel) return;

  let i = 0;
  const img = document.createElement("img");
  img.src = banners[0].imagen;
  carrusel.appendChild(img);

  setInterval(() => {
    i = (i + 1) % banners.length;
    img.src = banners[i].imagen;
  }, 3000);
}

// ================== NEGOCIOS ==================
function cargarNegocios(negocios) {
  const contenedor = document.getElementById("tarjetas-negocios");
  contenedor.innerHTML = "";

  negocios.forEach(n => {
    const card = document.createElement("div");
    card.classList.add("tarjeta-negocio");

    card.innerHTML = `
      <img src="${n.imagen}" alt="${n.nombre}">
      <h3>${n.nombre}</h3>
      <p>${n.descripcion}</p>
      <button onclick="abrirPopup('${n.id}')">Ver artículos</button>
    `;

    contenedor.appendChild(card);
  });
}

// ================== NOTICIAS ==================
function cargarNoticias(noticias) {
  const contenedor = document.getElementById("contenedor-noticias");
  contenedor.innerHTML = "";

  noticias.forEach(n => {
    const card = document.createElement("div");
    card.classList.add("tarjeta-noticia");

    card.innerHTML = `
      <img src="${n.imagen}" alt="noticia">
      <div>
        <h4>${n.titulo}</h4>
        <p>${n.descripcion}</p>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// ================== POPUP COMPRAS ==================
function abrirPopup(idNegocio) {
  const negocio = DATA.negocios.find(n => n.id === idNegocio);
  if (!negocio) return;

  total = 0;
  document.getElementById("popup-titulo").innerText = negocio.nombre;
  const divArt = document.getElementById("popup-articulos");
  divArt.innerHTML = "";

  negocio.articulos.forEach(a => {
    const fila = document.createElement("div");

    fila.innerHTML = `
      <span>${a.nombre} ($${a.precio})</span>
      <input type="number" min="0" value="0" onchange="actualizarTotal(${a.precio}, this)">
    `;

    divArt.appendChild(fila);
  });

  document.getElementById("popup-total").innerText = total;
  document.getElementById("popup").classList.remove("hidden");
}

function actualizarTotal(precio, input) {
  const cantidad = parseInt(input.value) || 0;
  let subtotal = precio * cantidad;

  // recalcular total sumando todos los inputs
  total = 0;
  document.querySelectorAll("#popup-articulos input").forEach(inp => {
    let cant = parseInt(inp.value) || 0;
    let prec = parseInt(inp.getAttribute("onchange").match(/\d+/)[0]);
    total += cant * prec;
  });

  document.getElementById("popup-total").innerText = total;
}

document.getElementById("cerrar-popup").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

document.getElementById("enviar-whatsapp").onclick = () => {
  let mensaje = `Hola, quiero hacer un pedido. Total: $${total}`;
  window.open(`https://wa.me/5210000000000?text=${encodeURIComponent(mensaje)}`, "_blank");
};
