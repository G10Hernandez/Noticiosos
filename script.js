let carouselIndex = 0;

// ================== Cargar datos ==================
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    cargarCarousel(data.banners);
    cargarNegocios(data.negocios);
    cargarNoticias(data.noticias);
  })
  .catch(err => console.error("Error cargando datos:", err));

// ================== Carrusel ==================
function cargarCarousel(banners) {
  const cont = document.getElementById("carousel");
  cont.innerHTML = "";
  banners.forEach((b, i) => {
    const img = document.createElement("img");
    img.src = b.image;
    img.alt = b.business;
    img.style.opacity = i === 0 ? "1" : "0";
    cont.appendChild(img);
  });
  setInterval(() => {
    const imgs = cont.querySelectorAll("img");
    imgs.forEach((img, i) => img.style.opacity = i === carouselIndex ? "1" : "0");
    carouselIndex = (carouselIndex + 1) % imgs.length;
  }, 3000);
}

// ================== Negocios ==================
function cargarNegocios(negocios) {
  const lista = document.getElementById("lista-negocios");
  const categoriasDiv = document.getElementById("categorias");

  // Crear categorías
  const categorias = [...new Set(Object.values(negocios).map(n => n.categoria))];
  categoriasDiv.innerHTML = `<button class="active" data-cat="Todos">Todos</button>`;
  categorias.forEach(cat => {
    categoriasDiv.innerHTML += `<button data-cat="${cat}">${cat}</button>`;
  });

  function mostrar(cat, filtro="") {
    lista.innerHTML = "";
    Object.values(negocios).forEach(n => {
      if ((cat === "Todos" || n.categoria === cat) &&
          (n.nombre.toLowerCase().includes(filtro) || n.descripcion.toLowerCase().includes(filtro))) {

        const card = document.createElement("div");
        card.className = "tarjeta-negocio";

        card.innerHTML = `
          <img src="${n.imagen}" alt="${n.nombre}">
          <h5>${n.nombre}</h5>
          <p>${n.descripcion}</p>
          <a href="https://wa.me/${n.telefono}" target="_blank" class="btn-whatsapp">WhatsApp</a>
          <button class="btn-compra">Comprar</button>
        `;

        card.querySelector(".btn-compra").addEventListener("click", () => abrirPopup(n));
        lista.appendChild(card);
      }
    });
  }

  mostrar("Todos");

  // Filtro por categoría
  document.querySelectorAll("#categorias button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#categorias button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mostrar(btn.dataset.cat, document.getElementById("busqueda").value.toLowerCase());
    });
  });

  // Búsqueda
  document.getElementById("busqueda").addEventListener("input", e => {
    const texto = e.target.value.toLowerCase();
    const activo = document.querySelector("#categorias button.active").dataset.cat;
    mostrar(activo, texto);
  });
}

// ================== Noticias ==================
function cargarNoticias(noticias) {
  const lista = document.getElementById("lista-noticias");
  lista.innerHTML = "";
  noticias.forEach(n => {
    const div = document.createElement("div");
    div.className = "noticia";
    div.innerHTML = `
      <img src="${n.imagen}" alt="${n.titulo}">
      <h4>${n.titulo}</h4>
      <p>${n.descripcion}</p>
    `;
    lista.appendChild(div);
  });
}

// ================== Popup ==================
const popupOverlay = document.getElementById("popup-overlay");
const cerrarPopup = document.getElementById("cerrar-popup");
const popupRegresar = document.getElementById("popup-regresar");

cerrarPopup.onclick = () => popupOverlay.style.display = "none";
popupRegresar.onclick = () => popupOverlay.style.display = "none";

function abrirPopup(negocio) {
  popupOverlay.style.display = "block";
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
}
