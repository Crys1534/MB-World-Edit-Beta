// --- CONFIGURACIÓN DE PESTAÑAS E INVENTARIO ---

let activeInventoryTab = 'all';

// =================================================================
// ⬇️ LISTA COMPLETA DE BLOQUES CLASIFICADOS ⬇️
// =================================================================
const inventoryCategories = {
    // La pestaña "all" se llena automáticamente, no necesitas editar 'items' aquí.
    all: { icon: 'chest', items: [] }, 

    // 🧱 CONSTRUCCIÓN: Bloques sólidos, piedras, maderas, minerales
    building: { 
        icon: 'bricks', 
        items: [
            // Piedras y Tierras
            'r', 'cs', 'ms', 'moss', 'br', 'bdr', 'ss', 'sd', 'gdt', 'clb',
            // Maderas y Ladrillos
            'wp', 'bricks', 'sb', 'nb', 'bbb', 'lgr', 
            // Bloques de Minerales
            'ib', 'gb', 'db', 'lapb', 'clore', 'in', 'gd', 'dmore', 'egem',
            // Nether y End
            'n', 'es', 'boneb', 'magma', 'soul_sand', 'glow', 'portalstone',
            // Escaleras
            'staircs', 'stairr', 'stairwp', 'stairbrick', 'stairsb', 'stairn', 
            'stairib', 'stairgb', 'stairdb', 'stairob', 'stairbr', 'stairbbb',
            // Medios Bloques (Slabs)
            'halfcs', 'halfr', 'halfwp', 'halfbrick', 'halfsb', 'halfn',
            'halfib', 'halfgb', 'halfdb', 'halfob', 'halfbr', 'halfbbb',
            // Lanas (Colores)
            'cloth_white', 'cloth_red', 'cloth_blue', 'cloth_green', 'cloth_yellow', 
            'cloth_orange', 'cloth_purple', 'cloth_pink', 'cloth_cyan', 'cloth_gray', 
            'cloth_lightgray', 'cloth_black', 'cloth_brown', 'cloth_magenta', 'cloth_lightblue', 'cloth_lightgreen',
            // Cristales (Colores)
            'gs', 'gs_white', 'gs_red', 'gs_blue', 'gs_green', 'gs_yellow',
            'gs_orange', 'gs_purple', 'gs_pink', 'gs_cyan', 'gs_gray', 'gs_black'
        ]
    },

    // 🌿 NATURALEZA: Plantas, líquidos, cultivos, hielo
    nature: { 
        icon: 'gv', 
        items: [
            // Terreno
            'gv', 'br', 'sand', 'gr', 'myc', 'snow', 'snowblock', 'ice', 'fice',
            // Vegetación
            'lv', 'shrub', 'flower', 'rose', 'mush', 'mush_red', 'cactus', 'web', 'coral', 'lp',
            // Cultivos y Comida
            'wheat', 'carrot', 'potato', 'seed', 'mel', 'pk', 'hay_1', 'cake', 
            // Líquidos (Cubos)
            'wr', 'la', 'ad'
        ]
    },

    // 🧨 MECANISMOS: Redstone, TNT, Railes, Puertas
    redstone: { 
        icon: 'rsd', 
        items: [
            // Energía
            'rsd', 'rstorch', 'block_redstone', 
            // Actuadores
            'piston', 'spiston', 'TNT', 'dispense', 'dropper', 'note', 'lamp', 'light',
            // Entradas
            'lever', 'button', 'pp', 'tripwire', 
            // Railes
            'rail', 'raila', 'raild', 'railp',
            // Puertas y Trampillas
            'door', 'iron_door', 'trapdoor', 'fncg'
        ]
    },

    // 🛋️ DECORACIÓN: Muebles, utilidades, iluminación
    decor: { 
        icon: 'bed', 
        items: [
            // Utilidades
            'craft', 'oven', 'chest', 'echest', 'anvil', 'enchant', 'brew', 'cauldron', 'j',
            // Iluminación
            'torch', 'lant', 'glow', 'sea_lantern',
            // Mobiliario
            'bed', 'books', 'sign', 'ladder', 'fnc', 'nfnc', 'ibar', 'glass_pane', 
            // Alfombras
            'carpet_white', 'carpet_red', 'carpet_blue', 'carpet_green'
        ]
    }
};

// =================================================================

// --- GESTIÓN DE PESTAÑAS (RIBBON) ---
function openTab(tabName) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));

    const targetBtn = Array.from(buttons).find(b => b.textContent.toLowerCase().includes(tabName) || b.onclick.toString().includes(tabName));
    if (targetBtn) targetBtn.classList.add('active');

    const targetPane = document.getElementById('tab-' + tabName);
    if (targetPane) {
        targetPane.classList.add('active');
    }
}

// --- GESTIÓN DE MODALES ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// --- GESTIÓN DE LOGROS ---
const checkboxes = document.querySelectorAll('#achievements-list input[type="checkbox"]');
function toggleAchievements(checked) {
    checkboxes.forEach(cb => cb.checked = checked);
}

// --- GESTIÓN DE TEMAS ---
function setTheme(themeName) {
    const body = document.body;
    body.classList.remove('theme-white', 'theme-pastel', 'theme-darkblue');
    if (themeName !== 'dark') {
        body.classList.add('theme-' + themeName);
    }
    localStorage.setItem('mbw_theme', themeName);
    const select = document.getElementById('theme-select');
    if (select) select.value = themeName;
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('mbw_theme') || 'dark';
    setTheme(savedTheme);
    setTimeout(renderHotbarUI, 500);
});

// --- SISTEMA DE INVENTARIO ---
function toggleInventory() {
    const modal = document.getElementById('inventory-modal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        
        const searchInput = document.getElementById('inventory-search');
        if(searchInput) {
            searchInput.value = ''; 
            searchInput.focus();
        }

        renderInventoryTabs(); 
        populateInventory();   
    }
}

function renderInventoryTabs() {
    const container = document.getElementById('inventory-tabs-sidebar');
    if (!container) return;
    container.innerHTML = '';

    Object.keys(inventoryCategories).forEach(key => {
        const tabConfig = inventoryCategories[key];
        
        const tabBtn = document.createElement('div');
        tabBtn.className = `inv-tab-btn ${activeInventoryTab === key ? 'active' : ''}`;
        tabBtn.onclick = () => {
            activeInventoryTab = key;
            populateInventory();
            renderInventoryTabs(); 
        };

        const cvs = document.createElement('canvas');
        cvs.width = 24;
        cvs.height = 24;
        const ctx = cvs.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const tempState = { type: tabConfig.icon };
        let renderObj = null;
        if (typeof getBlockObject === 'function') {
            renderObj = getBlockObject(tempState);
        } else if (window.blockData && window.blockData[tabConfig.icon]) {
             const renderer = window.blockData[tabConfig.icon];
             renderObj = renderer(tempState);
        } else {
            renderObj = { x: 0, y: 0 }; 
        }

        if (renderObj && images.blocks.complete) {
             ctx.drawImage(images.blocks, renderObj.x, renderObj.y, 16, 16, 0, 0, 24, 24);
        }

        tabBtn.appendChild(cvs);
        container.appendChild(tabBtn);
    });
}

function populateInventory() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    
    if (typeof images === 'undefined' || !images.blocks || !images.blocks.complete) {
        setTimeout(populateInventory, 500);
        return;
    }

    const allBlocks = (typeof window.blockData !== 'undefined') ? Object.keys(window.blockData) : [];
    let blocksToShow = [];

    if (activeInventoryTab === 'all') {
        blocksToShow = allBlocks;
    } else {
        const categoryItems = inventoryCategories[activeInventoryTab].items;
        // Solo mostramos bloques que realmente existen en el sistema (window.blockData)
        // Esto evita bloques vacíos/negros si me equivoqué en algún nombre de la lista de arriba
        blocksToShow = categoryItems.filter(item => allBlocks.includes(item));
    }

    blocksToShow.forEach(blockType => {
        const item = document.createElement('div');
        item.className = 'inv-item';
        item.title = blockType; 
        item.onclick = () => selectBlockFromInventory(blockType);
        
        const cvs = document.createElement('canvas');
        cvs.width = 32;
        cvs.height = 32;
        const ctx = cvs.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        const tempState = { type: blockType }; 
        let renderObj = null;
        if (typeof getBlockObject === 'function') {
            renderObj = getBlockObject(tempState);
        } else if (window.blockData[blockType]) {
             const renderer = window.blockData[blockType];
             renderObj = renderer(tempState);
        }

        if (renderObj && images.blocks.complete) {
             ctx.drawImage(images.blocks, renderObj.x, renderObj.y, 16, 16, 0, 0, 32, 32);
        }
        
        item.appendChild(cvs);
        grid.appendChild(item);
    });

    const searchInput = document.getElementById('inventory-search');
    if (searchInput && searchInput.value) {
        filterInventory(searchInput.value);
    }
}

function filterInventory(query) {
    const items = document.querySelectorAll('.inv-item');
    query = query.toLowerCase();
    items.forEach(item => {
        const name = item.title.toLowerCase();
        if (name.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function selectBlockFromInventory(blockType) {
    if (typeof hotbar !== 'undefined') {
        hotbar.slots[slotIndex] = { type: blockType };
        renderHotbarUI();
    }
    closeModal('inventory-modal');
}

function renderHotbarUI() {
    const container = document.getElementById('hotbar-container');
    if (!container) return;
    
    container.innerHTML = '';
    if (typeof hotbar === 'undefined') return;

    hotbar.slots.forEach((slot, index) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `hotbar-slot ${index === slotIndex ? 'active' : ''}`;
        slotDiv.onclick = () => {
            slotIndex = index;
            updateHotbarSelection();
        };
        
        const cvs = document.createElement('canvas');
        cvs.width = 24;
        cvs.height = 24;
        const ctx = cvs.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        let renderObj = null;
        if (typeof getBlockObject === 'function') {
             renderObj = getBlockObject(slot);
        }
        
        if (renderObj && images && images.blocks && images.blocks.complete) {
            ctx.drawImage(images.blocks, renderObj.x, renderObj.y, 16, 16, 0, 0, 24, 24);
        }
        
        slotDiv.appendChild(cvs);
        container.appendChild(slotDiv);
    });
}

function updateHotbarSelection() {
    const slots = document.querySelectorAll('.hotbar-slot');
    slots.forEach((s, i) => {
        if (i === slotIndex) s.classList.add('active');
        else s.classList.remove('active');
    });
}
