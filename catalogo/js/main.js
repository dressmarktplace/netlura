// Lista de categorias e filmes que serão exibidos no catálogo.
// Cada categoria tem um título e vários itens com imagem, vídeo e informações.
const categories = [
    {
        title: "Mais assistidos",
        items: [
            { img: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg", top10: true, badge: "Clássico", badgeColor: "red", progress: 0, youtube: "https://www.youtube.com/watch?v=bLvqoHBptjg" },
            { img: "https://aventurasnahistoria.com.br/wp-content/uploads/entretenimento/gladiador_2_VvnGVes.jpg", progress: 0, youtube: "https://www.youtube.com/watch?v=cXg62-t8BWs" },
            { img: "https://i.ytimg.com/vi/OQgySPQ5M3Y/maxresdefault.jpg", progress: 0, youtube: "https://www.youtube.com/watch?v=zckJCxYxn1g" },
            { img: "https://ingresso-a.akamaihd.net/img/cinema/cartaz/14413-destaque.jpg", progress: 0, youtube: "https://www.youtube.com/watch?v=a06zxOyQrAs" },
        ]
    },
    {
        title: "Séries",
        items: [
            { img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=600&auto=format&fit=crop", top10: true, badge: "Nova temporada", badgeColor: "red", youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
            { img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=600&auto=format&fit=crop", top10: true, youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
            { img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=600&auto=format&fit=crop", badge: "Novo episódio", badgeColor: "red", youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
            { img: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=600&auto=format&fit=crop", badge: "Novidade", badgeColor: "red", youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
        ]
    },
    {
        title: "Para maratonar",
        items: [
            { img: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop", top10: true, youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
            { img: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop", top10: true, badge: "Novidade", badgeColor: "red", youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
            { img: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop", top10: true, badge: "Novo episódio", badgeColor: "red", youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
            { img: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=600&auto=format&fit=crop", top10: true, badge: "Novo episódio", badgeColor: "red", youtube: "https://www.youtube.com/watch?v=wLo9bfgla4k" },
        ]
    }
];

function normalizeProfileImagePath(src) {
    if (!src) return src;
    const match = src.match(/(perfil-\d+\.png)$/i);
    if (match) {
        return `../assets/${match[1]}`;
    }
    if (src.startsWith('assets/')) {
        return `../${src}`;
    }
    return src;
}

// Pega o ID do vídeo do YouTube a partir do link completo.
// Este ID é usado no iframe para reproduzir o vídeo quando o mouse passa sobre o card.
function getYouTubeId(url) {
    if (!url) return "7RUA0IOfar8";
    if (url.includes('v=')) {
        return url.split('v=')[1].split('&')[0];
    }
    return url.split('/').pop();
}

// Gera um valor aleatório de 80 a 99 para exibir o score de relevância.
function getRandomMatchScore() {
    return Math.floor(Math.random() * 20 + 80);
}

// Mostra uma duração diferente dependendo se o item tem progresso ou não.
function getRandomDuration(hasProgress) {
    return hasProgress ? '10 temporadas' : '2h ' + Math.floor(Math.random() * 59) + 'm';
}

// Escolhe aleatoriamente um selo de idade para o card.
function getRandomAgeBadge() {
    return Math.random() > 0.5 ? { text: 'A16', class: 'red-accent' } : { text: '16', class: '' };
}

// Cria um card visual para cada item do catálogo.
// O card mostra imagem, botões, informações e vídeo em hover.
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    if (item.progress) card.classList.add('has-progress');

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.title ? item.title : 'Movie cover';

    const iframe = document.createElement('iframe');
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';

    const videoId = getYouTubeId(item.youtube);

    card.appendChild(iframe);
    card.appendChild(img);

    const ageBadge = getRandomAgeBadge();

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        ${item.title ? `<h3 class="movie-title">${item.title}</h3>` : ''}
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                ${item.progress ? '<button class="btn-icon"><i class="fas fa-check"></i></button>' : '<button class="btn-icon"><i class="fas fa-plus"></i></button>'}
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getRandomDuration(item.progress)}</span>
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            <span>Empolgante</span>
            <span>Animação</span>
            <span>Ficção</span>
        </div>
        ${item.youtube ? `<div class="video-link-row"><a class="video-link" href="${item.youtube}" target="_blank" rel="noopener noreferrer">Abrir trailer</a></div>` : ''}
    `;
    card.appendChild(details);

    const playButton = details.querySelector('.btn-play-icon');
    if (playButton && item.youtube) {
        playButton.addEventListener('click', event => {
            event.stopPropagation();
            window.open(item.youtube, '_blank');
        });
    }

    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`;
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    let playTimeout;
    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (rect.left < 100) card.classList.add('origin-left');
        else if (rect.right > windowWidth - 100) card.classList.add('origin-right');

        playTimeout = setTimeout(() => {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout);
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = '';
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    if (item.link) {
        const anchor = document.createElement('a');
        anchor.href = item.link;
        anchor.className = 'movie-link';
        anchor.appendChild(card);
        return anchor;
    }

    return card;
}

// Cria uma linha de filmes/séries para cada categoria.
// Ela recebe um título e monta vários cards dentro de uma fila.
function createCarousel(category) {
    const section = document.createElement('div');
    section.className = 'slider-section';

    const header = document.createElement('div');
    header.className = 'slider-header';

    const title = document.createElement('h2');
    title.className = 'slider-title';
    title.innerText = category.title;

    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';

    header.appendChild(title);
    header.appendChild(indicators);
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'movie-row';

    category.items.forEach(item => row.appendChild(createCard(item)));

    section.appendChild(row);
    return section;
}

// Quando a página terminar de carregar, exibimos o perfil ativo e o catálogo.
document.addEventListener('DOMContentLoaded', () => {
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');

    console.log('catalogo.js carregado, perfil ativo:', nomePerfil, imagemPerfil);

    const nameAnchor = document.getElementById('active-profile-name');
    const profileIcon = document.getElementById('profile-icon');

    if (nameAnchor) nameAnchor.textContent = nomePerfil || 'Seu nome';
    if (profileIcon) {
        const adjustedSrc = imagemPerfil ? normalizeProfileImagePath(imagemPerfil) : 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png';
        profileIcon.src = adjustedSrc;
        profileIcon.alt = nomePerfil || 'Perfil ativo';
    }

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        categories.forEach(category => mainContent.appendChild(createCarousel(category)));
    }
});
