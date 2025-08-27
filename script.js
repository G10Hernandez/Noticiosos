let dataJson;
const popupOverlay = document.getElementById("popup-overlay");
const popupCerrar = document.getElementById("popup-cerrar");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataJson = data;
    mostrarNoticias(data.noticias);
    mostrarNegocios(data.negocios);
  })
  .catch(err => console.error("Error cargando data.json:", err));

// Noticias
function mostrarNoticias(noticias) {
  const cont = document.getElementById("lista-noticias");
  cont.innerHTML = ""; // limpiar
  noticias.forEach(n => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${n.titulo}</strong>: ${n.contenido}`;
    cont.appendChild(div);
  });
}

// Negocios
function mostrarNegocios(negocios) {
  const cont = document.getElementById("lista-negocios");
  cont.innerHTML = ""; // limpiar
  negocios.forEach(n => {
    const card = document.createElement("div");
    card.className = "negocio-card";

    const img = document.createElement("img");
    img.src = n.imagen;
    img.alt = n.nombre;

    const h3 = document.createElement("h3");
    h3.textContent = n.nombre;

    const btn = document.createElement("button");
    btn.textContent = "Comprar";
    btn.onclick = () => abrirPopup(n.nombre);

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(btn);

    cont.appendChild(card);
  });
}

// Abrir popup
function abrirPopup(nombre) {
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

  document.getElementById("popup-enviar").onclick = () => {
    const articulo = select.options[select.selectedIndex].text;
    const cantidad = document.getElementById("popup-cantidad").value;
    const precio = document.getElementById("popup-precio").value;
    const total = precio * cantidad;

    const mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A` +
                    `- ${articulo} x${cantidad} = $${total}%0A` +
                    `Total: $${total}`;

    window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
  };

  popupOverlay.style.display = "flex";
}

// Cerrar popup
popupCerrar.onclick = () => popupOverlay.style.display = "none";
popupOverlay.onclick = e => {
  if (e.target === popupOverlay) popupOverlay.style.display = "none";
};
