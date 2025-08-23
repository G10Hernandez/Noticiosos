// ======================
// Carrusel (manual por ahora)
// ======================
let indexSlide = 0;
const slides = document.querySelectorAll('#carrusel .slide');
function mostrarSlide(i) {
  slides.forEach((s, idx) => s.style.opacity = idx === i ? 1 : 0);
}
mostrarSlide(indexSlide);
setInterval(() => {
  indexSlide = (indexSlide + 1) % slides.length;
  mostrarSlide(indexSlide);
}, 3000);

// ======================
// Cargar Negocios
// ======================
async function cargarNegocios() {
  try {
    const res = await fetch("negocios.json");
    if (!res.ok) throw new Error("No se pudo cargar negocios.json");
    const data = await res.json();

    // Validar estructura
    const negocios = data[0]?.businesses || [];
    if (!Array.isArray(negocios)) {
      console.error("❌ negocios.json no tiene un array válido en businesses");
      return;
    }

    const cont = document.getElementById("tarjetas-negocios");
    cont.innerHTML = "";

    negocios.forEach(n => {
      const card = document.createElement("div");
      card.className = "tarjeta-negocio";
      card.dataset.categoria = n.category;

      card.innerHTML = `
        <img src="${n.images?.[0] || 'img/default.jpg'}" alt="${n.name}">
        <h3>${n.name}</h3>
        <p>${n.description}</p>
        <button class="btn-whatsapp" onclick="window.open('https://wa.me/${n.phone}','_blank')">WhatsApp</button>
      `;
      cont.appendChild(card);
    });

    filtrarTarjetas();
  } catch (err) {
    console.error("⚠️ Error cargando negocios:", err);
  }
}

// ======================
// Filtrado por categoría
// ======================
const botones = document.querySelectorAll(".btn-categoria");
function filtrarTarjetas() {
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.categoria;
      document.querySelectorAll(".tarjeta-negocio").forEach(t => {
        t.style.display = (cat === "todos" || t.dataset.categoria === cat) ? "block" : "none";
      });
    });
  });
}

// ======================
// Buscador de negocios
// ======================
document.getElementById("inputBusqueda").addEventListener("input", e => {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll(".tarjeta-negocio").forEach(t => {
    t.style.display = t.querySelector("h3").textContent.toLowerCase().includes(text) ? "block" : "none";
  });
});

// ======================
// Noticias
// ======================
async function cargarNoticias() {
  try {
    const res = await fetch("noticias.json");
    if (!res.ok) throw new Error("No se pudo cargar noticias.json");
    const noticias = await res.json();

    if (!Array.isArray(noticias)) {
      console.error("❌ noticias.json no es un array válido");
      return;
    }

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

  } catch (err) {
    console.error("⚠️ Error cargando noticias:", err);
  }
}

// ======================
// Inicializar portal
// ======================
document.addEventListener("DOMContentLoaded", () => {
  cargarNegocios();
  cargarNoticias();
});
