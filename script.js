let dataJson;
const popupOverlay = document.getElementById("popup-overlay");
const popupCerrar = document.getElementById("popup-cerrar");

// Cargar datos
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
  banners.forEach((b, i) => {
    const img = document.createElement("img");
    img.src = b;
    if (i === 0) img.classList.add("active");
    carrusel.appendChild(img);
  });

  let index = 0;
  const imgs = carrusel.querySelectorAll("img");
  setInterval(() => {
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
    div.innerHTML = `<strong>${n.titulo}</strong>: ${n.contenido}`;
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

// Abrir popup con múltiples artículos
function abrirPopup(nombre) {
  const negocio = dataJson.negocios.find(n => n.nombre === nombre);
  if (!negocio) return;

  document.getElementById("popup-titulo").textContent = negocio.nombre;

  const contArticulos = document.getElementById("popup-articulos");
  contArticulos.innerHTML = "";

  negocio.articulos.forEach(a => {
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${a.nombre} - $${a.precio}</span>
      <input type="number" value="0" min="0" data-precio="${a.precio}">
    `;
    contArticulos.appendChild(div);
  });

  actualizarTotal();

  contArticulos.oninput = actualizarTotal;

  document.getElementById("popup-enviar").onclick = () => {
    let mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A`;
    let total = 0;
    contArticulos.querySelectorAll("input").forEach(input => {
      const cantidad = parseInt(input.value) || 0;
      const precio = parseFloat(input.dataset.precio);
      if (cantidad > 0) {
        mensaje += `- ${input.previousElementSibling.textContent} x${cantidad} = $${cantidad * precio}%0A`;
        total += cantidad * precio;
      }
    });
    mensaje += `Total: $${total}`;
    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
  };

  popupOverlay.style.display = "flex";
}

function actualizarTotal() {
  let total = 0;
  document.querySelectorAll("#popup-articulos input").forEach(input => {
    const cantidad = parseInt(input.value) || 0;
    const precio = parseFloat(input.dataset.precio);
    total += cantidad * precio;
  });
  document.getElementById("popup-total").textContent = total;
}

// Cerrar popup
popupCerrar.onclick = () => popupOverlay.style.display = "none";
popupOverlay.onclick = e => {
  if (e.target === popupOverlay) popupOverlay.style.display = "none";
};
