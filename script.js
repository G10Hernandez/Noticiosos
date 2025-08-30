let cart = [];
let total = 0;

// Cargar negocios desde data.json
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    renderCategorias(data.categorias);
    renderNegocios(data.negocios);
  });

// Render categorías
function renderCategorias(categorias) {
  const cont = document.getElementById("categorias");
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.onclick = () => filterNegocios(cat);
    cont.appendChild(btn);
  });
}

// Render negocios
function renderNegocios(negocios) {
  const container = document.getElementById("negocios");
  container.innerHTML = "";
  negocios.forEach(n => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${n.imagen}" alt="${n.nombre}">
      <h3>${n.nombre}</h3>
      <p>${n.descripcion}</p>
      <p><strong>$${n.precio}</strong></p>
      <button onclick="addToCart('${n.nombre}', ${n.precio})">🛒 Comprar</button>
    `;
    container.appendChild(div);
  });
}

// Filtrar negocios
function filterNegocios(cat) {
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      const filtrados = data.negocios.filter(n => n.categoria === cat);
      renderNegocios(filtrados);
    });
}

// Carrito
function addToCart(nombre, precio) {
  cart.push({ nombre, precio });
  total += precio;
  openPopup();
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.nombre} - $${item.precio}`;
    list.appendChild(li);
  });
  document.getElementById("cart-total").innerText = total;
}

function openPopup() {
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Enviar pedido a WhatsApp
document.getElementById("send-whatsapp").addEventListener("click", () => {
  const mensaje = cart.map(i => `${i.nombre} - $${i.precio}`).join("\n");
  const url = `https://wa.me/521234567890?text=Pedido:%0A${mensaje}%0ATotal: $${total}`;
  window.open(url, "_blank");
});
