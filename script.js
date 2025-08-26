// ======================
filtrarPorCategoria(btn.dataset.categoria);
});
}


function cargarNegocios(negocios) {
const cont = document.getElementById('tarjetas-negocios');
cont.innerHTML = '';


negocios.forEach(n => {
const card = document.createElement('div');
card.className = 'tarjeta-negocio';
card.dataset.categoria = n.category;


// Detectar si este negocio tiene catálogo en data.json (usamos un id opcional)
const tieneId = Boolean(n.id);
const tieneCatalogo = tieneId && DATA?.negocios?.[n.id];


card.innerHTML = `
<img src="${(n.images && n.images[0]) || 'img/default.jpg'}" alt="${n.name}">
<h3>${n.name}</h3>
<p>${n.description || ''}</p>
<div>
<a class="btn-whatsapp" href="https://wa.me/${n.phone}" target="_blank" rel="noopener">WhatsApp</a>
${tieneCatalogo ? `<button class="btn-compra" data-id="${n.id}">Comprar</button>` : ''}
</div>
`;


cont.appendChild(card);
});


// Delegación de eventos para botones Comprar
cont.addEventListener('click', (e) => {
const btn = e.target.closest('.btn-compra');
if (!btn) return;
const id = btn.getAttribute('data-id');
abrirVenta(id);
});
}


function filtrarPorCategoria(cat) {
document.querySelectorAll('.tarjeta-negocio').forEach(card => {
const ok = (cat === 'todos') || (card.dataset.categoria === cat);
card.style.display = ok ? '' : 'none';
});
}


function filtrarPorTexto(texto) {
const t = (texto || '').toLowerCase();
document.querySelectorAll('.tarjeta-negocio').forEach(card => {
const nombre = card.querySelector('h3')?.textContent.toLowerCase() || '';
card.style.display = nombre.includes(t) ? '' : 'none';
});
}


// ======================
// Popup de compra (WhatsApp)
// ======================
function abrirVenta(idNegocio) {
const negocio = DATA?.negocios?.[idNegocio];
if (!negocio) {
alert('Catálogo no encontrado');
return;
}
negocioActivo = negocio;


const modal = document.getEleme
