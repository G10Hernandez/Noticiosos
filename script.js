let data = {};

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    mostrarCategorias();
    mostrarNegocios(); // mostrar todos al inicio
    mostrarNoticias();
    iniciarCarrusel();
  });

// Mostrar categorías como botones
function mostrarCategorias() {
  const nav = document.getElementById("categorias");
  nav.innerHTML = "";

  data.categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;
    btn.onclick = () => mostrarNegocios(cat.nombre);
    nav.appendChild(btn);
  });

  // Botón "Todos"
  const btnTodos = document.createElement("button");
  btnTodos.textContent = "Todos";
  btnTodos.onclick = () => mostrarNegocios();
  nav.appendChild(btnTodos);
}

// Mostrar negocios filtrados
function mostrarNegocios(categoriaNombre) {
  const cont = document.getElementById("negocios");
  cont.innerHTML = "";

  data.negocios
    .filter(n => !categoriaNombre || n.categoria === categoriaNombre)
    .forEach(n => {
      const card = document.createElement("div");
      card.className = "tarjeta";
      card.innerHTML = `
        <img src="${n.imagen}" alt="${n.nombre}">
        <h3>${n.nombre}</h3>
        <p><b>Categoría:</b> ${n.categoria}</p>
        <button onclick='abrirPopup(${JSON.stringify(n).replace(/'/g,"&apos;")})'>
          Ver artículos
        </button>
      `;
      cont.appendChild(card);
    });
}

// Mostrar noticias (negocios de categoría "Servicios" o "Noticias")
function mostrarNoticias() {
  const cont = document.getElementById("noticias");
  cont.innerHTML = "";

  data.negocios
    .filter(n => n.categoria === "Servicios" || n.nombre.includes("Noticias"))
    .forEach(n => {
      const div = document.createElement("div");
      div.className = "noticia";
      div.innerHTML = `<h4>${n.nombre}</h4><p>Tel: ${n.telefono}</p>`;
      cont.appendChild(div);
    });
}

// Popup
function abrirPopup(negocio) {
  document.getElementById("popupTitulo").textContent = negocio.nombre;
  const lista = document.getElementById("popupArticulos");
  lista.innerHTML = "";
  negocio.articulos.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.nombre} - $${a.precio}`;
    lista.appendChild(li);
  });
  document.getElementById("popup").style.display = "block";
}
function cerrarPopup() {
  document.getElementById("popup").style.display = "none";
}

// Carrusel automático
function iniciarCarrusel() {
  const imgs = document.querySelectorAll(".carrusel-contenedor img");
  let i = 0;
  setInterval(() => {
    imgs[i].classList.remove("activo");
    i = (i + 1) % imgs.length;
    imgs[i].classList.add("activo");
  }, 3000);
}
