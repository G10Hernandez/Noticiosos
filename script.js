// ======================
// Cargar Carrusel
// ======================
function cargarCarrusel() {
  fetch("data.json")
    .then(res => res.json())
    .then(banners => {
      const contenedor = document.getElementById("carrusel");
      if (!Array.isArray(banners)) return;
      contenedor.innerHTML = "";
      banners.forEach(b => {
        const img = document.createElement("img");
        img.src = b.imagen;
        img.alt = b.titulo || "Banner";
        contenedor.appendChild(img);
      });
    })
    .catch(err => console.error("⚠️ Error cargando data.json:", err));
}

// ======================
// Cargar Negocios
// ======================
function cargarNegocios() {
  fetch("negocios.json")
    .then(res => res.json())
    .then(data => {
      const negocios = Array.isArray(data) ? data : data.negocios;
      if (!Array.isArray(negocios)) return;

      const contenedor = document.getElementById("tarjetas-negocios");
      contenedor.innerHTML = "<h2>Negocios</h2>";

      negocios.forEach(n => {
        const card = document.createElement("div");
        card.classList.add("tarjeta-negocio");

        card.innerHTML = `
          <img src="${n.imagen || 'img/default.jpg'}" alt="${n.nombre}">
          <h3>${n.nombre}</h3>
          <p>${n.descripcion}</p>
        `;
        contenedor.appendChild(card);
      });
    })
    .catch(err => console.error("⚠️ Error cargando negocios.json:", err));
}

// ======================
// Cargar Noticias
// ======================
function cargarNoticias() {
  fetch("noticias.json")
    .then(res => res.json())
    .then(noticias => {
      if (!Array.isArray(noticias)) return;

      const contenedor = document.getElementById("noticias-burbujas");
      contenedor.innerHTML = "";

      noticias.forEach(n => {
        const burbuja = document.createElement("div");
        burbuja.classList.add("burbuja-noticia");

        burbuja.innerHTML = `
          <img src="${n.imagen || 'img/default.jpg'}" alt="noticia">
          <div>
            <h4>${n.titulo}</h4>
            <p>${n.descripcion}</p>
          </div>
        `;
        contenedor.appendChild(burbuja);
      });
    })
    .catch(err => console.error("⚠️ Error cargando noticias.json:", err));
}

// ======================
// Inicializar portal
// ======================
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrusel();
  cargarNegocios();
  cargarNoticias();
});
