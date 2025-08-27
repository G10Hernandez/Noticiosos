let carouselIndex = 0;

// ================== Cargar carrusel ==================
async function cargarCarousel() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    const cont = document.getElementById("carousel");
    cont.innerHTML = "";
    data.banners.forEach((b, i) => {
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
  } catch (e) { console.error(e); }
}
cargarCarousel();

// ================== Cargar negocios ==================
Promise.all([
  fetch("negocios.json").then(res => res.json()),
  fetch("data.json").then(res => res.json())
]).then(([negociosData, dataJson]) => {
  const lista = document.getElementById("lista-negocios");
  const categoriasDiv = document.getElementById("categorias");

  // Categorías únicas
  const categorias = [...new Set(negociosData.map(n => n.categoria))];
  categoriasDiv.innerHTML = `<button class='active' data-cat='Todos'>Todos</button>`;
  categorias.forEach(cat => {
    categoriasDiv.innerHTML += `<button data-cat='${cat}'>${cat}</button>`;
  });

  // Mostrar negocios
  function mostrar(cat, filtro = "") {
    lista.innerHTML = "";
    negociosData.forEach((n) => {
      if ((cat === "Todos" || n.categoria === cat) &&
          (n.nombre.toLowerCase().includes(filtro) || n.descripcion.toLowerCase().includes(filtro))) {

        const card = document.createElement("div");
        card.className = "tarjeta-negocio";

        const img = document.createElement("img");
        img.src = n.imagen;
        img.alt = n.nombre;

        const h5 = document.createElement("h5");
        h5.textContent = n.nombre;

        const p = document.createElement("p");
        p.textContent = n.descripcion;

        const link = document.createElement("a");
        link.href = `https://wa.me/${n.telefono}`;
        link.target = "_blank";
        link.textContent = "WhatsApp";
        link.className = "btn-whatsapp";

        const btn = document.createElement("button");
        btn.textContent = "Comprar";
        btn.className = "btn-compra";
        btn.addEventListener("click", () => abrirPopup(n.nombre, dataJson));

        card.appendChild(img);
        card.appendChild(h5);
        card.appendChild(p);
        card.appendChild(link);
        card.appendChild(btn);

        lista.appendChild(card);
      }
    });
  }

  mostrar("Todos");

  // Filtrar por categoría
  document.querySelectorAll("#categorias button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#categorias button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      mostrar(btn.dataset.cat, document.getElementById("busqueda").value.toLowerCase());
    });
  });

  // Filtro de búsqueda
  document.getElementById("busqueda").addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const activo = document.querySelector("#categorias button.active").dataset.cat;
    mostrar(activo, texto);
  });
});

// ================== POPUP ==================
const popupOverlay = document.getElementById("popup-overlay");
const cerrarPopup = document.getElementById("cerrar-popup");
const popupRegresar = document.getElementById("popup-regresar");

cerrarPopup.onclick = () => popupOverlay.style.display = "none";
popupRegresar.onclick = () => popupOverlay.style.display = "none";

function abrirPopup(nombreNegocio, dataJson) {
  const negocioArticulos = Object.values(dataJson.negocios).find(n => n.nombre === nombreNegocio);
  if (!negocioArticulos) return alert("Catálogo no disponible");

  popupOverlay.style.display = "block";
  document.getElementById("popup-titulo").textContent = negocioArticulos.nombre;

  const select = document.getElementById("popup-articulo");
  select.innerHTML = "";
  negocioArticulos.articulos.forEach((a) => {
    const option = document.createElement("option");
    option.value = a.precio;
    option.textContent = `${a.nombre} - $${a.precio}`;
    select.appendChild(option);
  });

  document.getElementById("popup-precio").value = negocioArticulos.articulos[0].precio;

  select.onchange = () => {
    document.getElementById("popup-precio").value = select.value;
  };

  document.getElementById("popup-enviar").onclick = () => {
    const articulo = select.options[select.selectedIndex].text;
    const cantidad = document.getElementById("popup-cantidad").value;
    const precio = document.getElementById("popup-precio").value;
    const total = precio * cantidad;

    const mensaje = `Hola, quiero comprar en *${negocioArticulos.nombre}*:%0A` +
                    `- ${articulo} x${cantidad} = $${total}%0A` +
                    `Total: $${total}`;

    window.open(`https://wa.me/${negocioArticulos.telefono}?text=${mensaje}`, "_blank");
  };
}
