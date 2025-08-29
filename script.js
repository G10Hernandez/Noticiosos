let dataJson;
const popupOverlay = document.getElementById("popup-overlay");
const popupCerrar = document.getElementById("popup-cerrar");

// Cargar data
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

// Abrir popup
function abrirPopup(nombre) {
  const negocio = dataJson.negocios.find(n => n.nombre === nombre);
  if (!negocio) return;

  document.getElementById("popup-titulo").textContent = negocio.nombre;
  const articulosDiv = document.getElementById("popup-articulos");
  articulosDiv.innerHTML = "";

  let total = 0;

  negocio.articulos.forEach(a => {
    const row = document.createElement("div");
    row.innerHTML = `
      <label>${a.nombre} - $${a.precio}</label>
      <input type="number" value="0" min="0" data-precio="${a.precio}">
    `;
    articulosDiv.appendChild(row);
  });

  // Recalcular total al cambiar cantidades
  articulosDiv.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      total = 0;
      articulosDiv.querySelectorAll("input").forEach(i => {
        total += i.value * i.dataset.precio;
      });
      document.getElementById("popup-total").textContent = total;
    });
  });

  // Enviar WhatsApp
  document.getElementById("popup-enviar").onclick = () => {
    let mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A`;
    total = 0;
    articulosDiv.querySelectorAll("input").forEach(i => {
      if (i.value > 0) {
        const precio = i.dataset.precio;
        const subtotal = i.value * precio;
        total += subtotal;
        mensaje += `- ${i.previousElementSibling.textContent} x${i.value} = $${subtotal}%0A`;
      }
    });
    mensaje += `Total: $${total}`;
    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
  };

  popupOverlay.style.display = "flex";
}

// Cerrar popup
popupCerrar.onclick = () => popupOverlay.style.display = "none";
popupOverlay.onclick = e => {
  if (e.target === popupOverlay) popupOverlay.style.display = "none";
};
