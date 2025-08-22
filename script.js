// Carrusel
let indexSlide=0;
const slides=document.querySelectorAll('#carrusel .slide');
function mostrarSlide(i){
  slides.forEach((s,idx)=> s.style.opacity= idx===i?1:0);
}
mostrarSlide(indexSlide);
setInterval(()=>{
  indexSlide=(indexSlide+1)%slides.length;
  mostrarSlide(indexSlide);
},3000);

// Tarjetas negocios
async function cargarNegocios(){
  try {
    const res = await fetch('data.json');
    if(!res.ok) throw new Error('No se pudo cargar data.json');
    const negocios = await res.json();
    const cont = document.getElementById('tarjetas-negocios');
    cont.innerHTML='';
    negocios.forEach(n=>{
      const div=document.createElement('div');
      div.className='tarjeta';
      div.dataset.categoria=n.categoria;
      div.innerHTML=`
        <img src="${n.imagen}" alt="${n.nombre}">
        <h3>${n.nombre}</h3>
        <p>${n.descripcion}</p>
        <button class="btn-whatsapp" onclick="window.open('https://wa.me/${n.whatsapp}','_blank')">Contactar por WhatsApp</button>
      `;
      cont.appendChild(div);
    });
    filtrarTarjetas();
  } catch(err){ console.error(err);}
}
cargarNegocios();

// Filtrado por categoría
const botones=document.querySelectorAll('.btn-categoria');
function filtrarTarjetas(){
  botones.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const cat=btn.dataset.categoria;
      document.querySelectorAll('.tarjeta').forEach(t=>{
        t.style.display=(cat==='todos'|| t.dataset.categoria===cat)?'block':'none';
      });
    });
  });
}

// Buscador
document.getElementById('inputBusqueda').addEventListener('input', e=>{
  const text=e.target.value.toLowerCase();
  document.querySelectorAll('.tarjeta').forEach(t=>{
    t.style.display = t.querySelector('h3').textContent.toLowerCase().includes(text)?'block':'none';
  });
});

// Nube de noticias
// Detectar si estamos en GitHub Pages
const enGitHubPages = window.location.hostname.includes("github.io");

// Seleccionar origen de noticias
const URL_NEWS = enGitHubPages 
  ? "noticias.json" 
  : "proxy.php"; // XAMPP o servidor con PHP

// ======================
// Cargar Noticias
// ======================
function cargarNoticias() {
  const apiKey = "TU_API_KEY"; // <-- pon aquí tu API Key de NewsAPI
  const url = `https://newsapi.org/v2/top-headlines?country=mx&apiKey=${apiKey}`;

  // Intentar primero con NewsAPI
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("NewsAPI falló");
      return res.json();
    })
    .then(data => {
      if (data.articles && Array.isArray(data.articles)) {
        mostrarNoticias(data.articles);
      } else {
        throw new Error("Formato inesperado de NewsAPI");
      }
    })
    .catch(err => {
      console.warn("⚠️ No se pudo cargar NewsAPI, usando noticias.json:", err);

      // Fallback: usar noticias locales
      fetch("noticias.json")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            mostrarNoticias(data);
          } else {
            console.error("noticias.json no es un array válido");
            mostrarNoticias([]); // mostrar vacío
          }
        })
        .catch(err2 => {
          console.error("Error cargando noticias.json:", err2);
          mostrarNoticias([]); // mostrar vacío
        });
    });
}

// ======================
// Mostrar Noticias
// ======================
function mostrarNoticias(noticias) {
  const contenedor = document.getElementById("contenedor-noticias");
  if (!contenedor) {
    console.error("❌ No existe el contenedor-noticias en el HTML");
    return;
  }

  contenedor.innerHTML = ""; // limpiar

  noticias.forEach(noticia => {
    const card = document.createElement("div");
    card.classList.add("tarjeta-noticia");

    card.innerHTML = `
      <img src="${noticia.imagen || noticia.urlToImage || 'img/default.jpg'}" alt="noticia">
      <h3>${noticia.titulo || noticia.title || "Sin título"}</h3>
      <p>${noticia.descripcion || noticia.description || "Sin descripción"}</p>
    `;

    contenedor.appendChild(card);
  });
}
