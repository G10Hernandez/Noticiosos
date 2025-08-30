let dataJson;
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

// ================= Carrusel =================
function mostrarCarrusel(banners) {
  const carrusel = document.getElementById("carrusel");
  banners.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    if (i === 0) img.classList.add("active");
    carrusel.appendChild(img);
  });

  let idx = 0;
  setInterval(() => {
    const imgs = carrusel.querySelectorAll("img");
    imgs[idx].classList.remove("active");
    idx = (idx + 1) % imgs.length;
    imgs[idx].classList.add("active");
  }, 4000);
}

// ================= Noticias =================
function mostrarNoticias(noticias) {
  const cont = document.getElementById("lista-noticias");
  noticias.forEach(n => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${n.titulo}</strong>: ${n.contenido}`;
    cont.appendChild(div);
  });
}

// ================= Negocios =================
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

// ================= Popup =================
function abrirPopup(nombre) {
  const negocio = dataJson.negocios.find(n => n.nombre === nombre);
  if (!negocio) return;

  document.getElementById("popup-titulo").textContent = negocio.nombre;

  const contArticulos = document.getElementById("popup-articulos");
  contArticulos.innerHTML = "";
  let total = 0;

  negocio.articulos.forEach((a, i) => {
    const row = document.createElement("div");
    row.className = "popup-articulo";
    row.innerHTML = `
      <span>${a.nombre} - $${a.precio}</span>
      <input type="number" id="cantidad-${i}" value="0" min="0" style="width:50px">
    `;
    contArticulos.appendChild(row);
  });

  function actualizarTotal() {
    total = 0;
    negocio.articulos.forEach((a, i) => {
      const cant = parseInt(document.getElementById(`cantidad-${i}`).value) || 0;
      total += cant * a.precio;
    });
    document.getElementById("popup-total").textContent = total;
  }

  contArticulos.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", actualizarTotal);
  });

  document.getElementById("popup-enviar").onclick = () => {
    let mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A`;
    negocio.articulos.forEach((a, i) => {
      const cant = parseInt(document.getElementById(`cantidad-${i}`).value) || 0;
      if (cant > 0) {
        mensaje += `- ${a.nombre} x${cant} = $${a.precio * cant}%0A`;
      }
    });
    mensaje += `Total: $${total}`;
    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
  };

  document.getElementById("popup-total").textContent = total;
  popupOverlay.style.display = "flex";
}

// ================= Cerrar popup =================
popupCerrar.onclick = () => popupOverlay.style.display = "none";
popupOverlay.onclick = e => {
  if (e.target === popupOverlay) popupOverlay.style.display = "none";
};
