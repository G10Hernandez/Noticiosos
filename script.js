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

// Cargar negocios
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const negocios = data.negocios;
    const lista = document.getElementById("lista-negocios");
    const categoriasDiv = document.getElementById("categorias");

    // Categorías
    const categorias = [...new Set(Object.values(negocios).map(n => n.nombre))];
    categoriasDiv.innerHTML = `<button class='active' data-cat='Todos'>Todos</button>`;
    categorias.forEach(cat => {
      categoriasDiv.innerHTML += `<button data-cat='${cat}'>${cat}</button>`;
    });

    function mostrar(cat) {
      lista.innerHTML = "";
      Object.entries(negocios).forEach(([id, n]) => {
        if(cat === "Todos" || n.nombre === cat) {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img src='img/default.jpg' alt='${n.nombre}'>
            <h5>${n.nombre}</h5>
            <p>${n.descripcion || ""}</p>
            <a href='https://wa.me/${n.telefono}' target='_blank'>WhatsApp</a>
            ${n.articulos ? `<button onclick='abrirPopup(${id})'>Comprar</button>` : ""}
          `;
          lista.appendChild(card);
        }
      });
    }

    mostrar("Todos");

    // Filtrado
    document.querySelectorAll("#categorias button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#categorias button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mostrar(btn.dataset.cat);
      });
    });
  });

// Cargar noticias
fetch("noticias.json")
  .then(res => res.json())
  .then(noticias => {
    const contenedor = document.getElementById("lista-noticias");
    noticias.forEach(n => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `
        <img src='${n.imagen}' alt='${n.titulo}'>
        <h4>${n.titulo}</h4>
        <p>${n.descripcion}</p>
      `;
      contenedor.appendChild(div);
    });
  });

// Popup compras
function abrirPopup(id) {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const negocio = data.negocios[id];
      if(!negocio) return alert("Catálogo no disponible");

      let html = `<div><h3>${negocio.nombre}</h3>`;
      negocio.articulos.forEach(a => {
        html += `<label><input type='checkbox' data-nombre='${a.nombre}' data-precio='${a.precio}'> ${a.nombre} - $${a.precio}</label><br>`;
      });
      html += `<button id='btn-enviar-ws'>Enviar por WhatsApp</button></div>`;

      const modal = document.getElementById("popup");
      modal.innerHTML = html;
      modal.style.display = "flex";

      document.getElementById("btn-enviar-ws").onclick = () => {
        const seleccionados = [...modal.querySelectorAll("input:checked")];
        if(seleccionados.length===0) return alert("Selecciona al menos un artículo");

        let total = 0;
        let mensaje = `Hola, quiero comprar en *${negocio.nombre}*:%0A`;
        seleccionados.forEach(s => {
          mensaje += `- ${s.dataset.nombre}: $${s.dataset.precio}%0A`;
          total += parseFloat(s.dataset.precio);
        });
        mensaje += `Total: $${total}`;
        window.open(`https://wa.me/${negocio.telefono}?text=${mensaje}`, "_blank");
      };
    });
}
