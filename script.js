// ============================
// CARRUSEL
// ============================
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

// ============================
// TARJETAS DE NEGOCIOS
// ============================
async function cargarNegocios() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('No se pudo cargar data.json');
    const negocios = await res.json();
    const cont = document.getElementById('tarjetas-negocios');
    cont.innerHTML = '';
    negocios.forEach(n => {
      const div = document.createElement('div');
      div.className = 'tarjeta';
      div.dataset.categoria = n.categoria;
      div.innerHTML = `
        <img src="${n.imagen}" alt="${n.nombre}">
        <h3>${n.nombre}</h3>
        <p>${n.descripcion}</p>
        <button class="btn-whatsapp" onclick="window.open('https://wa.me/${n.whatsapp}','_blank')">Contactar por WhatsApp</button>
      `;
      cont.appendChild(div);
    });
    filtrarTarjetas();
  } catch (err) { console.error(err); }
}
cargarNegocios();

// ============================
// FILTRADO POR CATEGORÍA
// ============================
const botones = document.querySelectorAll('.btn-categoria');
function filtrarTarjetas() {
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.categoria;
      document.querySelectorAll('.tarjeta').forEach(t => {
        t.style.display = (cat === 'todos' || t.dataset.categoria === cat) ? 'block' : 'none';
      });
    });
  });
}

// ============================
// BUSCADOR
// ============================
document.getElementById('inputBusqueda').addEventListener('input', e => {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.tarjeta').forEach(t => {
    t.style.display = t.querySelector('h3').textContent.toLowerCase().includes(text) ? 'block' : 'none';
  });
});

// ============================
// NOTICIAS EN TIEMPO REAL + BURBUJAS DESDE MITAD/ABAJO
// ============================
const nube = document.getElementById('contenedor-noticias');
const API_KEY = "fbc9235a922348bd833eaf0e8f0aa106"; // reemplaza con tu Key
const URL_NEWS = `https://newsapi.org/v2/top-headlines?country=mx&category=general&apiKey=${API_KEY}`;

function mostrarNoticias(articulos) {
  if (!nube) return;
  nube.innerHTML = '';

  // Ordenar por fecha si existe (NewsAPI devuelve 'publishedAt')
  articulos.sort((a, b) => new Date(b.publishedAt || Date.now()) - new Date(a.publishedAt || Date.now()));

  articulos.slice(0, 8).forEach((item, idx) => {
    const burbuja = document.createElement('div');
    burbuja.className = 'burbuja';
	console.log("Artículo:", item);


   // Valores seguros para no tener undefined
	const title = item.titulo || "Sin título";
	const desc  = item.descripcion || "Sin descripción";
	const source = item.source?.name || "Fuente desconocida";
	const url = item.url || "#";

    burbuja.innerHTML = `<b>${title}</b><br>${desc}<br><i>${source}</i>`;
    if(url!=="#") burbuja.addEventListener('click', () => window.open(url,'_blank'));

    // Posición inicial: desde mitad hasta abajo
    const W = nube.clientWidth, H = nube.clientHeight;
    let posX = Math.random() * (W - 220);
    let posY = H * 0.5 + Math.random() * (H * 0.5); // mitad a parte inferior
    burbuja.style.left = posX + 'px';
    burbuja.style.top = posY + 'px';

    // Tamaño y opacidad según antigüedad
    const scale = 1 - idx * 0.1;
    const opacity = 0.9 - idx * 0.1;
    burbuja.style.transform = `scale(${scale})`;
    burbuja.style.opacity = opacity;

    nube.appendChild(burbuja);

    // Movimiento lento y oscilante
    const speed = 1 + Math.random() * 0.02; // más lento
    let t = 0;
    const anim = setInterval(() => {
      posY -= speed;
      posX += Math.sin(t) * 2;
      burbuja.style.top = posY + 'px';
      burbuja.style.left = posX + 'px';
      t += 0.05;
      if (posY + burbuja.offsetHeight < 0) {
        clearInterval(anim);
        burbuja.remove();
      }
    }, 40);
  });
}

async function cargarNoticias() {
  try {
    // Primero NewsAPI
    const resAPI = await fetch(URL_NEWS);
    if(!resAPI.ok) throw new Error("NewsAPI no respondió");
    const dataAPI = await resAPI.json();
    if(dataAPI.articles && dataAPI.articles.length > 0){
      mostrarNoticias(dataAPI.articles);
      return;
    }
    // Si NewsAPI está vacío, usar JSON local
    throw new Error("NewsAPI no devolvió artículos");
  } catch(err){
    console.warn("Usando noticias locales:", err);
    try {
      const resLocal = await fetch('noticias.json');
      if(!resLocal.ok) throw new Error("No se pudo cargar noticias.json");
      const dataLocal = await resLocal.json();
      mostrarNoticias(dataLocal);
    } catch(err2){
      console.error("Error cargando noticias locales:", err2);
    }
  }
}

// Cargar al iniciar y refrescar cada 30 segundos
cargarNoticias();
setInterval(cargarNoticias, 30000);

