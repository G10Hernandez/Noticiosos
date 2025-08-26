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
// Noticias (NewsAPI con fallback a noticias.json)
// ======================
async function cargarNoticias() {
  const API_KEY = "TU_API_KEY"; // pon tu API key aquí
  const urlNewsAPI = `https://newsapi.org/v2/top-headlines?country=mx&apiKey=${API_KEY}`;

  try {
    let noticias = [];

    // 1. Intentar cargar de NewsAPI
    const res = await fetch(urlNewsAPI);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.articles)) {
        noticias = data.articles.map(n => ({
          titulo: n.title,
          descripcion: n.description || "",
          imagen: n.urlToImage || "img/default.jpg"
        }));
      }
    } else {
      throw new Error("NewsAPI no respondió");
    }

    // Si NewsAPI no trajo nada, forzar fallback
    if (!noticias.length) throw new Error("NewsAPI vacío");

    mostrarNoticias(noticias);
  } catch (err) {
    console.warn("⚠️ No se pudo cargar NewsAPI, usando noticias.json:", err);

    try {
      // 2. Cargar de noticias.json como respaldo
      const resLocal = await fetch("noticias.json");
      if (!resLocal.ok) throw new Error("No se pudo cargar noticias.json");
      const noticiasLocal = await resLocal.json();

      if (Array.isArray(noticiasLocal)) {
        mostrarNoticias(noticiasLocal);
      }
    } catch (err2) {
      console.error("❌ Error cargando noticias.json:", err2);
    }
  }
}

// ======================
// Renderizar burbujas de noticias
// ======================
function mostrarNoticias(noticias) {
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
}

let catalogo = {};
let negocioActivo = null;

async function cargarCatalogo() {
  const response = await fetch("data.json");
  catalogo = await response.json();
}

function abrirVenta(idNegocio) {
  negocioActivo = catalogo[idNegocio];

  if (!negocioActivo) {
    alert("Catálogo no encontrado");
    return;
  }

  // Mostrar popup
  document.getElementById("popup").style.display = "block";
  document.getElementById("tituloNegocio").textContent = negocioActivo.nombre;

  // Llenar select con artículos
  let select = document.getElementById("articulo");
  select.innerHTML = "";
  negocioActivo.articulos.forEach((item, index) => {
    let option = document.createElement("option");
    option.value = index;
    option.textContent = item.nombre;
    select.appendChild(option);
  });

  // Set precio inicial
  actualizarPrecio();
}

function cerrarVenta() {
  document.getElementById("popup").style.display = "none";
}

function actualizarPrecio() {
  let index = document.getElementById("articulo").value;
  let costo = negocioActivo.articulos[index].precio;
  document.getElementById("costo").value = costo;
}

function enviarPedido() {
  let index = document.getElementById("articulo").value;
  let articulo = negocioActivo.articulos[index].nombre;
  let costo = negocioActivo.articulos[index].precio;
  let cantidad = document.getElementById("cantidad").value;
  let total = costo * cantidad;

  let mensaje = `Hola, quiero comprar en *${negocioActivo.nombre}*:\n- ${cantidad} x ${articulo}\n- Costo unitario: $${costo}\n- Total: $${total}`;

  let url = "https://wa.me/" + negocioActivo.telefono + "?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");
}

// Cargar catálogo al inicio
cargarCatalogo();
