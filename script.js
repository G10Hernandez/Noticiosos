let negocios = [];
let carrito = [];

// Cargar datos locales
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    if (data.categorias) mostrarCategorias(data.categorias);
    if (data.negocios) {
      negocios = data.negocios;
      mostrarNegocios(); // todos al inicio
    }
  });

// Noticias en vivo desde BBC Mundo
fetch("https://feeds.bbci.co.uk/mundo/rss.xml")
  .then(res => res.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const items = data.querySelectorAll("item");
    const container = document.getElementById("newsContainer");
    container.innerHTML = "";
    items.forEach((item, index) => {
      if (index < 5) {
        let div = document.createElement("div");
        div.innerHTML = `<a href="${item.querySelector("link").textContent}" target="_blank">${item.querySelector("title").textContent}</a>`;
        container.appendChild(div);
      }
    });
  });

// Mostrar categorías
function mostrarCategorias(categorias) {
  const container = document.getElementById("categoryButtons");
  container.innerHTML = "";
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.nombre;
    btn.addEventListener("click", () => mostrarNegocios(cat.id));
    container.appendChild(btn);
  });
}

// Mostrar negocios
function mostrarNegocios(categoriaId = null) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  let filtrados = categoriaId ? negocios.filter(n => n.categoriaId === categoriaId) : negocios;

  filtrados.forEach(neg => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${neg.imagen}" alt="${neg.nombre}">
      <h3>${neg.nombre}</h3>
      <p>${neg.descripcion}</p>
      <button onclick="abrirPopup(${neg.id})">Ver artículos</button>
    `;
    container.appendChild(card);
  });
}

// Popup de artículos
function abrirPopup(negocioId) {
  const negocio = negocios.find(n => n.id === negocioId);
  if (!negocio) return;
  document.getElementById("popupTitle").textContent = negocio.nombre;
  const itemsList = document.getElementById("popupItems");
  itemsList.innerHTML = "";

  negocio.articulos.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    li.addEventListener("click", () => {
      carrito.push(item);
      alert(`${item.nombre} agregado al carrito`);
    });
    itemsList.appendChild(li);
  });

  document.getElementById("popup").classList.remove("hidden");
}

// Cerrar popup
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("popup").classList.add("hidden");
});

// Enviar carrito a WhatsApp
document.getElementById("whatsappBtn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }
  let mensaje = "Pedido:\n";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} ($${item.precio})\n`;
  });
  // Número editable
  const url = `https://wa.me/52XXXXXXXXXX?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});
