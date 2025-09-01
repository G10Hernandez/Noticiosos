let businessesData = [];
let cart = [];
let selectedItems = [];

// Cargar negocios
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    businessesData = data.negocios;
    setupCategories();
    renderNegocios(businessesData);
  })
  .catch(err => console.error("Error cargando data.json:", err));

// Categorías
function setupCategories() {
  const categories = [...new Set(businessesData.map(b => b.categoria))];
  const buttonsContainer = document.getElementById("categoryButtons");

  const allBtn = document.createElement("button");
  allBtn.textContent = "Todos";
  allBtn.classList.add("active");
  allBtn.addEventListener("click", () => filterBusinesses("Todos", allBtn));
  buttonsContainer.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.addEventListener("click", () => filterBusinesses(cat, btn));
    buttonsContainer.appendChild(btn);
  });
}

function filterBusinesses(category, clickedBtn) {
  const buttons = document.querySelectorAll("#categoryButtons button");
  buttons.forEach(btn => btn.classList.remove("active"));
  clickedBtn.classList.add("active");

  if (category === "Todos") renderNegocios(businessesData);
  else {
    const filtered = businessesData.filter(b => b.categoria === category);
    renderNegocios(filtered);
  }
}

// Render tarjetas
function renderNegocios(negocios) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";
  negocios.forEach(n => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${n.imagen}" alt="${n.nombre}">
      <h3>${n.nombre}</h3>
      <p><strong>Categoría:</strong> ${n.categoria}</p>
      <p><strong>Tel:</strong> ${n.telefono}</p>
      <button onclick='openItemsPopup(${JSON.stringify(n.articulos)})'>Ver artículos</button>
    `;
    container.appendChild(div);
  });
}

// Abrir popup de artículos
function openItemsPopup(articulos) {
  selectedItems = articulos.map(a => ({...a, selected: false}));
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  selectedItems.forEach((item, idx) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <input type="checkbox" id="item${idx}" />
      <label for="item${idx}">${item.nombre} - $${item.precio}</label>
    `;
    container.appendChild(div);
  });

  document.getElementById("itemsPopup").style.display = "flex";
}

document.getElementById("closeItemsPopup").onclick = function() {
  document.getElementById("itemsPopup").style.display = "none";
}

// Añadir al carrito desde popup
document.addEventListener("DOMContentLoaded", function() {
  const addBtn = document.getElementById("addToCartFromPopup");
  const closeItemsBtn = document.getElementById("closeItemsPopup");
  const closeCartBtn = document.getElementById("closeCartPopup");

  // Botón "Añadir al Carrito" dentro del popup de artículos
  if (addBtn) {
    addBtn.onclick = function() {
      const checkboxes = document.querySelectorAll("#itemsContainer input[type='checkbox']");
      checkboxes.forEach((cb, idx) => {
        if (cb.checked) cart.push(selectedItems[idx]);
      });

      updateCart();
      document.getElementById("itemsPopup").style.display = "none";
      document.getElementById("cartPopup").style.display = "flex";
    };
  }

  // Cerrar popup de artículos
  if (closeItemsBtn) {
    closeItemsBtn.onclick = function() {
      document.getElementById("itemsPopup").style.display = "none";
    };
  }

  // Cerrar popup de carrito
  if (closeCartBtn) {
    closeCartBtn.onclick = function() {
      document.getElementById("cartPopup").style.display = "none";
    };
  }
});

// Cerrar carrito
document.getElementById("closeCartPopup").onclick = function() {
  document.getElementById("cartPopup").style.display = "none";
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");

  cartItemsContainer.innerHTML = ""; // limpiar antes de volver a pintar

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <span>${item.nombre} - $${item.precio.toFixed(2)}</span>
      <button class="removeItem" data-index="${index}">❌</button>
    `;

    cartItemsContainer.appendChild(div);

    total += item.precio;
  });

  cartTotalElement.textContent = total.toFixed(2);

  // Botones eliminar
  document.querySelectorAll(".removeItem").forEach(btn => {
    btn.onclick = function () {
      const idx = this.getAttribute("data-index");
      cart.splice(idx, 1); // quitar del carrito
      updateCart(); // refrescar carrito
    };
  });
}

 // Botón enviar a WhatsApp
const sendBtn = document.getElementById("sendWhatsapp");
if (sendBtn) {
  sendBtn.onclick = function () {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    let message = "🛍️ Pedido:\n";
    cart.forEach(item => {
      message += `- ${item.nombre}: $${item.precio.toFixed(2)}\n`;
    });
    message += `\n💰 Total: $${total.toFixed(2)}`;

    const phone = "521XXXXXXXXXX"; // 👉 tu número de WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // 🔹 Vaciar carrito después de enviar
    cart = [];
    updateCart();
  };
}


// Noticias BBC (RSS2JSON)
async function fetchNews() {
  const url="https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const container = document.getElementById("newsContainer");
    container.innerHTML="";
    data.items.slice(0,6).forEach(a=>{
      const div = document.createElement("div");
      div.className="news-item";
      div.innerHTML=`<a href="${a.link}" target="_blank" style="color:white;text-decoration:none;">${a.title}</a>`;
      container.appendChild(div);
    });
  } catch(e){ console.error("Error noticias:", e);}
}
fetchNews();

// Carrusel
let slideIndex=0;
function showSlides() {
  const slides=document.getElementsByClassName("carousel-slide");
  for(let i=0;i<slides.length;i++) slides[i].style.display="none";
  slideIndex++;
  if(slideIndex>slides.length) slideIndex=1;
  slides[slideIndex-1].style.display="block";
  setTimeout(showSlides,4000);
}
showSlides();
