// =============== CARGAR BANNERS =================
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const carouselInner = document.getElementById("carousel-inner");
    carouselInner.innerHTML = "";
    data.banners.forEach((banner, i) => {
      const div = document.createElement("div");
      div.className = "carousel-item" + (i === 0 ? " active" : "");
      div.innerHTML = `<img src="${banner.image}" class="d-block w-100" alt="${banner.business}">`;
      carouselInner.appendChild(div);
    });
  })
  .catch(err => console.error("Error cargando banners:", err));


// =============== CARGAR NEGOCIOS =================
fetch("negocios.json")
  .then(res => res.json())
  .then(negocios => {
    const lista = document.getElementById("lista-negocios");
    const categoriasDiv = document.getElementById("categorias");

    // Generar categorías únicas
    const categorias = [...new Set(negocios.map(n => n.categoria))];
    categoriasDiv.innerHTML = `<button class="btn-cat active" data-cat="Todos">Todos</button>`;
    categorias.forEach(cat => {
      categoriasDiv.innerHTML += `<button class="btn-cat" data-cat="${cat}">${cat}</button>`;
    });

    // Mostrar negocios
    function mostrar(cat) {
      lista.innerHTML = "";
      negocios
        .filter(n => cat === "Todos" || n.categoria === cat)
        .forEach(n => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img src="${n.imagen}" class="card-img-top" alt="${n.nombre}">
            <div class="card-body">
              <h5 class="card-title">${n.nombre}</h5>
              <p class="card-text">${n.descripcion}</p>
              <a href="https://wa.me/${n.telefono}" target="_blank" class="btn btn-success">WhatsApp</a>
              ${n.id ? `<button class="btn btn-primary btn-comprar" data-id="${n.id}">Comprar</button>` : ""}
            </div>
          `;
          lista.appendChild(card);
        });
    }

    mostrar("Todos");

    // Eventos de categoría
    document.querySelectorAll(".btn-cat").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".btn-cat").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mostrar(btn.dataset.cat);
      });
    });

    // Evento Comprar (delegado)
    document.addEventListener("click", e => {
      if (e.target.classList.contains("btn-comprar")) {
        const id = e.target.dataset.id;
        abrirPopup(id);
      }
    });
  })
  .catch(err => console.error("Error cargando negocios:", err));


// =============== CARGAR NOTICIAS =================
fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const contenedor = document.getElementById("lista-noticias");
    contenedor.innerHTML = "";
    noticias.forEach(n => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `
        <img src="${n.imagen}" alt="${n.titulo}">
        <div>
          <h4>${n.titulo}</h4>
          <p>${n.descripcion}</p>
        </div>
      `;
      contenedor.appendChild(div);
    });
  })
  .catch(err => console.error("Error cargando noticias:", err));


// =============== POPUP COMPRAS =================
function abrirPopup(id) {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const negocio = data.negocios[id];
      if (!negocio) return alert("Catálogo no disponible");

      let html = `<h3>${negocio.nombre}</h3>`;
      negocio.articulos.forEach((a, i) => {
        html += `
          <div>
            <label>
              <input type="checkbox" data-nombre="${a.nombre}" data-precio="${a.precio}">
              ${a.nombre} - $${a.precio}
            </label>
          </div>
        `;
      });
      html += `<button id="btn-enviar-ws">Enviar por WhatsApp</button>`;

      const modal = document.getElementById("popup");
      modal.innerHTML = html;
      modal.style.display = "block";

      document.getElementById("btn-enviar-ws").onclick = () => {
        const seleccionados = [...modal.querySelectorAll("input:checked")];
        if (seleccionados.length === 0) return alert("Selecciona al menos un artículo");

        let total = 0;
        let mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A`;
        seleccionados.forEach(s => {
          const nombre = s.dataset.nombre;
          const precio = parseFloat(s.dataset.precio);
          total += precio;
          mensaje += `- ${nombre}: $${precio}%0A`;
        });
        mensaje += `Total: $${total}`;
        window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
      };
    });
}
