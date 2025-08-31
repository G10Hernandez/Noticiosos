let businessesData = [];
let currentBusiness = null; // negocio seleccionado
let cart = [];

// === Cargar negocios desde data.json ===
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    businessesData = data.negocios;

    // Botones de categorías desde data.json
    const categories = data.categorias.map(c => c.nombre);
    const buttonsContainer = document.getElementById("categoryButtons");

    // Botón "Todos"
    const allBtn = document.createElement("button");
    allBtn.textContent = "Todos";
    allBtn.classList.add("active");
    allBtn.addEventListener("click", () => filterBusinesses("Todos", allBtn));
    buttonsContainer.appendChild(allBtn);

    // Botones de cada categoría
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.addEventListener("click", () => filterBusinesses(cat, btn));
      buttonsContainer.appendChild(btn);
    });

    // Mostrar todos al inicio
    renderNegocios(businessesData);
  });

// === Renderizar negocios ===
function renderNegocios(negocios) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  negocios.forEach(negocio => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${negocio.imagen}" alt="${negocio.nombre}">
      <h3>${negocio.nombre}</h3>
      <p><strong>Categoría:</strong> ${negocio.categoria}</p>
      <p><strong>Tel:</strong> ${negocio.telefono}</p>
      <button onclick="openItemsPopup('${negocio.nombre}')">Ver artículos</button>
    `;
    container.appendChild(div);
  });
}

// === Abrir popup de artículos ===
function openItemsPopup(nombreNegocio) {
  currentBusiness = businessesData.find(b => b.nombre === nombreNegocio);
  const itemsList = document.getElementById("itemsList");
  itemsList.innerHTML = "";

  currentBusiness.articulos.forEach((a, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      ${a.nombre} - $${a.precio}
      <button onclick="addToCart('${a.nombre}', ${a.precio})">🛒</button>
    `;
    itemsList.appendChild(div);
  });

  document.getElementById("itemsPopup").style.display = "block";
}

// === Cerrar popup de artículos ===
document.getElementById("closeItemsPopup").onclick = () => {
  document.getElementById("itemsPopup").style.display = "none";
};

// === Carrito ===
function addToCart(nombre, precio) {
  cart.push({ nombre, precio });
  updateCart();
  document.getElementById("cartPopup").style.display = "block"; // abre popup carrito
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.precio;
    const div = document.createElement("div");
    div.innerHTML = `${item.nombre} - $${item.precio} <button onclick="removeFromCart(${index})">❌</button>`;
    cartItems.appendChild(div);
  });
  document.getElementById("cartTotal").textContent = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

document.getElementById("closePopup").onclick = () => {
  document.getElementById("cartPopup").style.display = "none";
};

document.getElementById("sendWhatsapp").onclick = () => {
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  let message = "🛍️ Pedido desde el Portal:\n";
  cart.forEach(item => {
    message += `- ${item.nombre}: $${item.precio}\n`;
  });
  message += `\nTotal: $${document.getElementById("cartTotal").textContent}`;
  const phone = "5211234567890";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};
