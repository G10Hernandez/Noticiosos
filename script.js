// Cargar banners
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const carouselInner = document.getElementById("carousel-inner");
    carouselInner.innerHTML = "";
    data.banners.forEach((banner, i) => {
      const div = document.createElement("div");
      div.className = "carousel-item";
      div.innerHTML = `<img src="${banner.image}" alt="${banner.business}">`;
      carouselInner.appendChild(div);
    });
  });

// Cargar negocios y artículos
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
        card.className = "card";

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

        const btn = document.createElement("button");
        btn.textContent = "Comprar";
        btn.addEventListener("click", () => abrirPopup(n.nombre)); // Aquí ya no usamos onclick en HTML

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

  // Popup para comprar
  function abrirPopup(nombreNegocio) {
    const negocioArticulos = Object.values(dataJson.negocios).find(n => n.nombre === nombreNegocio);
    if (!negocioArticulos) return alert("Catálogo no disponible");

    let html = `<div class='popup-content'><h3>${negocioArticulos.nombre}</h3>`;
    negocioArticulos.articulos.forEach(a => {
      html += `<label><input type='checkbox' data-nombre='${a.nombre}' data-precio='${a.precio}'> ${a.nombre} - $${a.precio}</label><br>`;
    });
    html += `<button id='btn-enviar-ws'>Enviar por WhatsApp</button></div>`;

    const modal = document.getElementById("popup");
    modal.innerHTML = html;
    modal.style.display = "flex";

    document.getElementById("btn-enviar-ws").onclick = () => {
      const seleccionados = [...modal.querySelectorAll("input:checked")];
      if (seleccionados.length === 0) return alert("Selecciona al menos un artículo");

      let total = 0;
      let mensaje = `Hola, quiero comprar en *${negocioArticulos.nombre}*:%0A`;
      seleccionados.forEach(s => {
        mensaje += `- ${s.dataset.nombre}: $${s.dataset.precio}%0A`;
        total += parseFloat(s.dataset.precio);
      });
      mensaje += `Total: $${total}`;
      window.open(`https://wa.me/${negocioArticulos.telefono}?text=${mensaje}`, "_blank");
    };
  }
});


// Noticias
fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const contenedor = document.getElementById("lista-noticias");
    noticias.forEach(n => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `
        <img src='${n.imagen}' alt='${n.nombre}'>
        <h4>${n.nombre}</h4>
        <p>${n.descripcion}</p>
      `;
      contenedor.appendChild(div);
    });
  });
