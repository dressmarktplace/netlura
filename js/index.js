// Profile selection functionality
function setActiveProfile(name, src) {
    localStorage.setItem('perfilAtivoNome', name);
    localStorage.setItem('perfilAtivoImagem', normalizeProfileSrc(src));
}

function normalizeProfileSrc(src) {
    if (!src) return src;
    const match = src.match(/(perfil-\d+\.png)$/i);
    if (match) {
        return `assets/${match[1]}`;
    }
    return src;
}

function getProfileData(li) {
    const img = li.querySelector('img');
    const name = li.querySelector('.profile-name').textContent;
    const src = img ? normalizeProfileSrc(img.src) : null;
    return { name, src };
}

function createProfileCard(name, src) {
    const normalizedSrc = normalizeProfileSrc(src);
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = './catalogo/catalogo.html';
    link.classList.add('perfil');

    const article = document.createElement('article');
    article.classList.add('profile');
    article.setAttribute('aria-label', `Perfil: ${name}`);

    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = normalizedSrc;
    image.alt = name;
    image.setAttribute('data-src', normalizedSrc);

    figure.appendChild(image);
    article.appendChild(figure);

    const p = document.createElement('p');
    p.classList.add('profile-name');
    p.textContent = name;

    link.appendChild(article);
    link.appendChild(p);
    li.appendChild(link);

    return li;
}

function saveProfiles(list) {
    localStorage.setItem('perfisCadastrados', JSON.stringify(list));
}

function loadProfiles() {
    const raw = localStorage.getItem('perfisCadastrados');
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return parsed.map(profile => ({
            ...profile,
            src: normalizeProfileSrc(profile.src)
        }));
    } catch (error) {
        console.warn('Erro ao ler perfis do localStorage', error);
        return [];
    }
}

function bindProfileActions(li, profileList, addProfileLi) {
    const profileBox = li.querySelector('.profile');
    const nameElement = li.querySelector('.profile-name');

    const run = () => {
        const { name, src } = getProfileData(li);
        if (name === 'Adicionar perfil') return;

        profileList.querySelectorAll('li .profile').forEach(p => p.classList.remove('selected'));
        profileBox.classList.add('selected');

        setActiveProfile(name, src);
        const destination = './catalogo/catalogo.html';
        console.log('clicou em perfil:', name, '->', destination);
        window.location.href = destination;
    };

    // Ações de clique em qualquer parte do item para garantir que não falha
    li.addEventListener('click', run);
};

function getAllProfiles() {
    const profileList = document.querySelector('.profile-list');
    return Array.from(profileList.querySelectorAll('li')).filter(li => !li.querySelector('.profile.add-profile'));
}

function renderManageProfiles() {
    const manageList = document.getElementById('manage-profile-list');
    if (!manageList) return;

    manageList.innerHTML = '';
    const savedProfiles = loadProfiles();

    getAllProfiles().forEach(li => {
        const { name, src } = getProfileData(li);
        const isRemovable = savedProfiles.some(profile => profile.name === name && profile.src === src);

        const item = document.createElement('li');
        item.className = 'manage-item';
        item.innerHTML = `
            <div class="manage-item-info">
                <img src="${src}" alt="${name}">
                <span>${name}</span>
            </div>
            <button type="button" class="delete-profile-btn" data-name="${name}" data-src="${src}" ${isRemovable ? '' : 'disabled'}>
                ${isRemovable ? 'Remover' : 'Padrão'}
            </button>
        `;

        manageList.appendChild(item);
    });
}

function deleteProfile(name, src) {
    const profiles = loadProfiles().filter(profile => profile.name !== name || profile.src !== src);
    saveProfiles(profiles);

    const profileList = document.querySelector('.profile-list');
    const itemToRemove = Array.from(profileList.children).find(li => {
        const data = getProfileData(li);
        return data.name === name && data.src === src;
    });

    if (itemToRemove) {
        profileList.removeChild(itemToRemove);
    }

    const currentActiveName = localStorage.getItem('perfilAtivoNome');
    const currentActiveImage = localStorage.getItem('perfilAtivoImagem');
    if (currentActiveName === name && currentActiveImage === src) {
        const firstProfile = getAllProfiles()[0];
        if (firstProfile) {
            const data = getProfileData(firstProfile);
            setActiveProfile(data.name, data.src);
        }
    }

    renderManageProfiles();
}

function initialize() {
    const profileList = document.querySelector('.profile-list');
    const addProfileLi = Array.from(profileList.children).find(li => li.querySelector('.profile.add-profile'));

    // Carrega perfis extras do localStorage
    const savedListFromStorage = loadProfiles();
    if (savedListFromStorage.length > 0) {
        savedListFromStorage.forEach(profile => {
            const card = createProfileCard(profile.name, profile.src);
            profileList.insertBefore(card, addProfileLi);
        });
    }

    console.log('index.js carregado, perfis encontrados:', profileList.querySelectorAll('li').length);
    const profileItems = profileList.querySelectorAll('li');

    // Preset do perfil ativo
    let savedName = localStorage.getItem('perfilAtivoNome');
    let savedImage = localStorage.getItem('perfilAtivoImagem');

    if (!savedName || !savedImage) {
        const firstLi = profileItems[0];
        const data = getProfileData(firstLi);
        savedName = data.name;
        savedImage = data.src;
        setActiveProfile(savedName, savedImage);
    }

    profileItems.forEach(li => {
        const data = getProfileData(li);
        const profileBox = li.querySelector('.profile');

        if (data.name === savedName) {
            profileBox.classList.add('selected');
        } else {
            profileBox.classList.remove('selected');
        }

        if (!li.querySelector('.profile.add-profile')) {
            bindProfileActions(li, profileList, addProfileLi);
        }
    });

    // Modal para adicionar novo perfil
    const formOverlay = document.getElementById('profile-form-overlay');
    const closeFormBtn = document.getElementById('close-profile-form');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const nameInput = document.getElementById('new-profile-name');
    const avatarButtons = document.querySelectorAll('.avatar-option');
    let selectedAvatar = 'assets/perfil-1.png';

    avatarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            avatarButtons.forEach(item => item.classList.remove('selected'));
            btn.classList.add('selected');
            selectedAvatar = btn.getAttribute('data-src');
        });
    });

    if (addProfileLi) {
        const addButton = addProfileLi.querySelector('.profile');
        addButton.addEventListener('click', () => {
            formOverlay.classList.add('active');
            nameInput.value = '';
            nameInput.focus();
        });
    }

    const manageProfilesBtn = document.getElementById('manage-profiles-btn');
    const manageOverlay = document.getElementById('manage-profiles-overlay');
    const closeManageBtn = document.getElementById('close-manage-profiles');
    const doneManagingBtn = document.getElementById('done-managing');
    const manageList = document.getElementById('manage-profile-list');

    manageProfilesBtn.addEventListener('click', () => {
        renderManageProfiles();
        manageOverlay.classList.add('active');
    });

    closeManageBtn.addEventListener('click', () => {
        manageOverlay.classList.remove('active');
    });

    doneManagingBtn.addEventListener('click', () => {
        manageOverlay.classList.remove('active');
    });

    manageList.addEventListener('click', event => {
        if (!event.target.classList.contains('delete-profile-btn')) return;
        const name = event.target.dataset.name;
        const src = event.target.dataset.src;
        if (!name || !src) return;
        deleteProfile(name, src);
    });

    closeFormBtn.addEventListener('click', () => {
        formOverlay.classList.remove('active');
    });

    saveProfileBtn.addEventListener('click', () => {
        const rawName = nameInput.value.trim();
        if (!rawName) {
            alert('Digite um nome válido.');
            nameInput.focus();
            return;
        }

        const newProfile = { name: rawName, src: selectedAvatar };
        const previousProfiles = loadProfiles();
        const updatedProfiles = [...previousProfiles, newProfile];
        saveProfiles(updatedProfiles);

        const newCard = createProfileCard(rawName, newProfile.src);
        profileList.insertBefore(newCard, addProfileLi);
        bindProfileActions(newCard, profileList, addProfileLi);

        profileList.querySelectorAll('li .profile').forEach(p => p.classList.remove('selected'));
        newCard.querySelector('.profile').classList.add('selected');

        setActiveProfile(rawName, selectedAvatar);
        formOverlay.classList.remove('active');
        const destination = './catalogo/catalogo.html';
        console.log('novo perfil criado:', rawName, '->', destination);
        window.location.href = destination;
    });
}

document.addEventListener('DOMContentLoaded', initialize);