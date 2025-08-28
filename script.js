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
const nube=document.getElementById('nube');
async function cargarNoticias(){
  try {
    const res = await fetch('noticias.json');
    if(!res.ok) throw new Error('No se pudo cargar noticias.json');
    const data = await res.json();
    data.forEach(item=>{
      const burbuja=document.createElement('div');
      burbuja.className='burbuja';
      burbuja.innerHTML=`<b>${item.titulo}</b><br>${item.descripcion}`;
      const W=nube.clientWidth,H=nube.clientHeight;
      let posX=Math.random()*(W-220), posY=H;
      const scale=0.7+Math.random()*0.6;
      const opacity=0.5+Math.random()*0.5;
      burbuja.style.transform=`scale(${scale})`;
      burbuja.style.opacity=opacity;
      burbuja.style.left=posX+'px';
      burbuja.style.top=posY+'px';
      burbuja.addEventListener('click',()=>window.open(item.link,'_blank'));
      nube.appendChild(burbuja);

      // Movimiento lento
      const speed = 0.02 + Math.random()*0.05;
      let t=0;
      const anim=setInterval(()=>{
        posY -= speed;
        posX += Math.sin(t)*5;
        burbuja.style.top = posY + 'px';
        burbuja.style.left = posX + 'px';
        t+=0.01;
        if(posY + burbuja.offsetHeight <0){
          clearInterval(anim);
          nube.removeChild(burbuja);
        }
      },40);
    });
  } catch(err){ console.error(err);}
}
cargarNoticias();
setInterval(cargarNoticias,30000);
