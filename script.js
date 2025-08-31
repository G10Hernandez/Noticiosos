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
document.getElementById("addToCartFromPopup").onclick = function() {
  selectedItems.forEach(item => {
    const checkbox = document.querySelector(`#itemsContainer input[type="checkbox"][id]`);
    const checkboxes = document.querySelectorAll("#itemsContainer input[type='checkbox']");
    checkboxes.forEach((cb, idx) => {
      if(cb.checked) cart.push(selectedItems[idx]);
    });
  });
  updateCart();
  document.getElementById("itemsPopup").style.display = "none";
  document.getElementById("cartPopup").style.display = "flex";
}

// Carrito
function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.precio;
    const div = document.createElement("div");
    div.innerHTML = `${item.nombre} - $${item.precio} <button onclick="removeFromCart(${idx})">❌</button>`;
    cartItems.appendChild(div);
  });
  document.getElementById("cartTotal").textContent = total;
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCart();
}

// Cerrar carrito
document.getElementById("closeCartPopup").onclick = function() {
  document.getElementById("cartPopup").style.display = "none";
}

// WhatsApp
document.getElementById("sendWhatsapp").onclick = function() {
  if(cart.length===0){alert("Carrito vacío"); return;}
  let msg="🛍️ Pedido desde el Portal:\n";
  cart.forEach(i=>msg+=`- ${i.nombre}: $${i.precio}\n`);
  msg+=`\nTotal: $${document.getElementById("cartTotal").textContent}`;
  const phone="5211234567890";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank");
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
