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

// Cargar noticias
async function cargarNoticias() {
  try {
    const response = await fetch(URL_NEWS);
    if (!response.ok) throw new Error("Error al cargar noticias");

    const data = await response.json();
    mostrarNoticias(data.articles || data); // NewsAPI usa "articles", JSON local es array
  } catch (error) {
    console.error("Error cargando noticias:", error);
  }
}

// Mostrar noticias en burbujas
function mostrarNoticias(noticias) {
  const contenedor = document.querySelector(".nube");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  noticias.forEach((noticia) => {
    const burbuja = document.createElement("div");
    burbuja.className = "burbuja";

    const titulo = noticia.title || noticia.titulo || "Sin título";
    const descripcion = noticia.description || noticia.descripcion || "Sin descripción";
    const fuente = noticia.source?.name || "Fuente desconocida";

    burbuja.innerHTML = `
      <strong>${titulo}</strong><br>
      <small>${descripcion}</small><br>
      <em>${fuente}</em>
    `;

    // Posición inicial (parte baja o media del contenedor)
    burbuja.style.left = `${Math.random() * 80}%`;
    burbuja.style.top = `${50 + Math.random() * 40}%`; // entre 50% y 90% de altura

    contenedor.appendChild(burbuja);
  });
}

// Ejecutar
cargarNoticias();
