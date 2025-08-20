/* Fondo de playa y colores claros */
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80') no-repeat center center fixed;
    background-size: cover;
    color: #333;
}

header {
    text-align: center;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.7);
}

h1, h2 {
    color: #004d40;
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
}

.card {
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 10px;
    padding: 1rem;
    width: 200px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    text-align: center;
}

.card h3 {
    margin-top: 0;
}

const config = {
    newsApiUrl: 'https://newsapi.org/v2/top-headlines',
    apiKey: 'fbc9235a922348bd833eaf0e8f0aa106', // ⚠️ Reemplaza esto por tu clave real de NewsAPI
    country: 'mx',
    category: 'general',
    language: 'es'
};


.news-container {
    position: relative;
    height: 400px;
    overflow: hidden;
    background-color: rgba(255,255,255,0.5);
    border-radius: 10px;
    margin: 1rem;
    padding: 1rem;
}

/* Noticias flotantes */
.news-item {
    position: absolute;
    left: 0;
    width: 100%;
    padding: 0.5rem;
    background-color: rgba(0,150,136,0.7);
    color: #fff;
    border-radius: 5px;
    text-align: center;
    cursor: default;
    user-select: none;
}
