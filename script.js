let dataJson;
const popupOverlay = document.getElementById("popup-overlay");
const popupCerrar = document.getElementById("popup-cerrar");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataJson = data;
    mostrarNoticias(data.noticias);
    mostrarNegocios(data.negocios);
  });

// ================== Cargar Negocios ==================
async function cargarNegocios() {
  try {
    const resp = await fetch("negocios.json");
    const negocios = await resp.json();

    const contenedor = document.getElementById("negocios-container");
    contenedor.innerHTML = "";

    negocios.forEach(negocio => {
      const card = document.createElement("div");
      card.classList.add("card-negocio");

      card.innerHTML = `
        <img src="${negocio.imagen}" alt="${negocio.nombre}" class="card-img">
        <h3>${negocio.nombre}</h3>
        <p><strong>Categoría:</strong> ${negocio.categoria}</p>
        <p>${negocio.descripcion}</p>
        <button onclick="abrirPopup('${negocio.nombre}')">Ver artículos</button>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando negocios:", error);
  }
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
