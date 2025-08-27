// Cargar datos
Promise.all([
  fetch("data.json").then(res => res.json()),
  fetch("noticias.json").then(res => res.json()),
  fetch("negocios.json").then(res => res.json())
]).then(([data, noticias, negocios]) => {
  
  // ================= CARRUSEL =================
  const carrusel = document.getElementById("carrusel");
  let i = 0;
  setInterval(() => {
    carrusel.innerHTML = `<img src="${data.banners[i].image}" alt="${data.banners[i].business}">`;
    i = (i + 1) % data.banners.length;
  }, 3000);

  // ================= NOTICIAS =================
  const listaNoticias = document.getElementById("lista-noticias");
  noticias.forEach(n => {
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <img src="${n.imagen}" alt="${n.titulo}">
      <h3>${n.titulo}</h3>
      <p>${n.descripcion}</p>
    `;
    listaNoticias.appendChild(div);
  });

  // ================= NEGOCIOS =================
  const listaNegocios = document.getElementById("lista-negocios");
  negocios.forEach(neg => {
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <img src="${neg.imagen}" alt="${neg.nombre}">
      <h3>${neg.nombre}</h3>
      <p>${neg.descripcion}</p>
      <button class="boton" data-nombre="${neg.nombre}">Ver más</button>
    `;
    listaNegocios.appendChild(div);
  });

  // ================= POPUP =================
  const popup = document.getElementById("popup");
  const cerrarPopup = document.getElementById("cerrar-popup");
  const popupNombre = document.getElementById("popup-nombre");
  const popupDescripcion = document.getElementById("popup-descripcion");
  const popupArticulos = document.getElementById("popup-articulos");
  const popupComprar = document.getElementById("popup-comprar");

  document.querySelectorAll("#lista-negocios .boton").forEach(btn => {
    btn.addEventListener("click", e => {
      const nombre = e.target.dataset.nombre;
      const negocioData = Object.values(data.negocios).find(n => n.nombre === nombre);

      if (negocioData) {
        popupNombre.textContent = negocioData.nombre;
        popupDescripcion.textContent = negocioData.descripcion;
        popupArticulos.innerHTML = "";
        negocioData.articulos.forEach(a => {
          const li = document.createElement("li");
          li.textContent = `${a.nombre} - $${a.precio}`;
          popupArticulos.appendChild(li);
        });
        popupComprar.href = `https://wa.me/${negocioData.telefono}?text=Hola, quiero más información de sus productos.`;
        popup.style.display = "flex";
      }
    });
  });

  cerrarPopup.addEventListener("click", () => {
    popup.style.display = "none";
  });
});
