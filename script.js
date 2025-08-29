let dataJson;
let carrito = [];
const popupOverlay = document.getElementById("popup-overlay");
const popupCerrar = document.getElementById("popup-cerrar");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataJson = data;
    mostrarCarrusel(data.banners);
    mostrarNoticias(data.noticias);
    mostrarNegocios(data.negocios);
  });

// Carrusel
function mostrarCarrusel(banners) {
  const carrusel = document.getElementById("carrusel");
  banners.forEach((url, i) => {
    const img = document.createElement("img");
    img.src = url;
    if (i === 0) img.classList.add("active");
    carrusel.appendChild(img);
  });

  let index = 0;
  setInterval(() => {
    const imgs = carrusel.querySelectorAll("img");
    imgs[index].classList.remove("active");
    index = (index + 1) % imgs.length;
    imgs[index].classList.add("active");
  }, 4000);
}

// Noticias
function mostrarNoticias(noticias) {
  const cont = document.getElementById("lista-noticias");
  noticias.forEach(n => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${n.titulo}</strong><br>${n.contenido}`;
    cont.appendChild(div);
  });
}

// Negocios
function mostrarNegocios(negocios) {
  const cont = document.getElementById("lista-negocios");
  negocios.forEach(n => {
    const card = document.createElement("div");
    card.className = "negocio-card";
    card.innerHTML = `
      <img src="${n.imagen}" alt="${n.nombre}">
      <h3>${n.nombre}</h3>
      <button onclick="abrirPopup('${n.nombre}')">Comprar</button>
    `;
    cont.appendChild(card);
  });
}

// Abrir popup
function abrirPopup(nombre) {
  carrito = [];
  actualizarCarrito();

  const negocio = dataJson.negocios.find(n => n.nombre === nombre);
  if (!negocio) return;

  document.getElementById("popup-titulo").textContent = negocio.nombre;

  const select = document.getElementById("popup-articulo");
  select.innerHTML = "";
  negocio.articulos.forEach(a => {
    const option = document.createElement("option");
    option.value = a.precio;
    option.textContent = `${a.nombre} - $${a.precio}`;
    select.appendChild(option);
  });

  document.getElementById("popup-precio").value = negocio.articulos[0].precio;

  select.onchange = () => {
    document.getElementById("popup-precio").value = select.value;
  };

  document.getElementById("popup-agregar").onclick = () => {
    const articulo = select.options[select.selectedIndex].text;
    const cantidad = parseInt(document.getElementById("popup-cantidad").value);
    const precio = parseInt(document.getElementById("popup-precio").value);
    carrito.push({ articulo, cantidad, precio, subtotal: precio * cantidad });
    actualizarCarrito();
  };

  document.getElementById("popup-enviar").onclick = () => {
    let total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    let mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A`;
    carrito.forEach(item => {
      mensaje += `- ${item.articulo} x${item.cantidad} = $${item.subtotal}%0A`;
    });
    mensaje += `Total: $${total}`;

    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
  };

  popupOverlay.style.display = "flex";
}

// Actualizar carrito en popup
function actualizarCarrito() {
  const lista = document.getElementById("popup-carrito");
  const totalSpan = document.getElementById("popup-total");
  lista.innerHTML = "";
  let total = 0;
  carrito.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.articulo} x${item.cantidad} = $${item.subtotal}`;
    lista.appendChild(li);
    total += item.subtotal;
  });
  totalSpan.textContent = total;
}

// Cerrar popup
popupCerrar.onclick = () => popupOverlay.style.display = "none";
popupOverlay.onclick = e => {
  if (e.target === popupOverlay) popupOverlay.style.display = "none";
};
