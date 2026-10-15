/**
 * O Sobrado — Burger & Bar
 * JavaScript Vanilla Leve, Rápido e Focado em Mobile UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const currentTable = getActiveTable();

  // Inicializa o gerenciador de Wi-Fi (carrega localStorage e sincroniza com Supabase)
  WifiManager.init();

  // Identifica a página atual
  const isMenuPage = document.getElementById('menuAppContainer') !== null;
  const isHubPage = document.getElementById('hubAppContainer') !== null;

  if (isHubPage) {
    initHub(currentTable);
  }

  if (isMenuPage) {
    initMenu(currentTable);
  }

  initWifiModal();
}

/**
 * ---------------------------------------------------------------------
 * 1. GERENCIAMENTO DE MESA (URL & SESSION)
 * ---------------------------------------------------------------------
 */
function getActiveTable() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramTable = urlParams.get('mesa') || urlParams.get('table');

  if (paramTable) {
    const sanitizedTable = paramTable.trim();
    sessionStorage.setItem('sobrado_mesa', sanitizedTable);
    return sanitizedTable;
  }

  return sessionStorage.getItem('sobrado_mesa') || null;
}

/**
 * Formata número com 2 dígitos se for numérico puro (ex: 5 -> 05)
 */
function formatTableNumber(table) {
  if (!table) return '';
  if (/^\d+$/.test(table) && parseInt(table, 10) < 10) {
    return table.padStart(2, '0');
  }
  return table;
}

/**
 * ---------------------------------------------------------------------
 * 2. LÓGICA DO HUB DE ENTRADA (INDEX.HTML)
 * ---------------------------------------------------------------------
 */
function initHub(table) {
  const tableBadge = document.getElementById('hubTableBadge');
  const tableNumberSpan = document.getElementById('hubTableNumber');
  const menuLink = document.getElementById('hubMenuLink');

  if (table) {
    const formatted = formatTableNumber(table);
    if (tableBadge && tableNumberSpan) {
      tableNumberSpan.textContent = formatted;
      tableBadge.style.display = 'inline-flex';
    }
    // Garante que o link para o cardápio repasse a mesa ativa
    if (menuLink) {
      menuLink.href = `cardapio.html?mesa=${encodeURIComponent(table)}`;
    }
  } else {
    if (tableBadge) {
      tableBadge.style.display = 'none';
    }
  }
}

/**
 * ---------------------------------------------------------------------
 * 3. LÓGICA DO CARDÁPIO DIGITAL (CARDAPIO.HTML)
 * ---------------------------------------------------------------------
 */
function initMenu(table) {
  const tableBadge = document.getElementById('headerTableBadge');
  const tableText = document.getElementById('headerTableText');
  const backHubLink = document.getElementById('btnBackHub');

  if (table) {
    const formatted = formatTableNumber(table);
    if (tableBadge && tableText) {
      tableText.textContent = `Mesa ${formatted}`;
      tableBadge.style.display = 'flex';
    }
    if (backHubLink) {
      backHubLink.href = `index.html?mesa=${encodeURIComponent(table)}`;
    }
  } else {
    if (tableBadge) {
      tableBadge.style.display = 'none';
    }
  }

  // Inicializa o Gerenciador Administrativo antes de renderizar categorias e produtos
  if (typeof AdminManager !== 'undefined') {
    AdminManager.init();
  }

  renderCategories();
  renderProducts();
  setupSearchFilter();
  setupScrollSpy();
  setupProductDrawer();
  initCart();

  // Sincronização inicial com o Supabase (com fallback resiliente)
  loadProductsFromSupabase();
}

/**
 * Busca produtos do Supabase e substitui como fonte primária quando disponível
 */
async function loadProductsFromSupabase() {
  if (typeof SupabaseService === 'undefined') return;

  try {
    const supabaseProducts = await SupabaseService.fetchProducts();
    if (Array.isArray(supabaseProducts) && supabaseProducts.length > 0) {
      window.menuData.products = supabaseProducts;
      try {
        localStorage.setItem('sobrado_custom_products', JSON.stringify(supabaseProducts));
      } catch (e) {}
      renderProducts();
      console.log(`[Supabase] ${supabaseProducts.length} produtos carregados do banco.`);
    } else {
      console.log('[Supabase] Banco vazio ou sem itens. Mantendo cardápio local como fallback.');
    }
  } catch (err) {
    console.warn('[Supabase] Falha ao conectar ao banco. Mantendo dados locais como fallback:', err);
  }
}

/**
 * Formatação de preços em moeda brasileira Real (R$)
 */
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Fallback visual vetorial elegante com a paleta oficial do Sobrado
 */
function getCategoryFallbackSVG(categoryId, isLarge = false) {
  const size = isLarge ? 48 : 32;
  const strokeColor = "#C85A17";

  let iconSVG = '';

  switch (categoryId) {
    case 'hamburgueres':
    case 'mais-pedidos':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 11h16a1 1 0 0 0 1-1A6 6 0 0 0 3 10a1 1 0 0 0 1 1z"></path>
          <path d="M4 15h16"></path>
          <path d="M5 18h14a2 2 0 0 1 2 2H3a2 2 0 0 1 2-2z"></path>
        </svg>
      `;
      break;

    case 'porcoes-mais-pedidas':
    case 'porcoes':
    case 'porcoes-individuais':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
          <path d="M7 2v20"></path>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
        </svg>
      `;
      break;

    case 'batata-frita':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 11l2 10h10l2-10H5z"></path>
          <path d="M7 11V4"></path>
          <path d="M10 11V2"></path>
          <path d="M14 11V3"></path>
          <path d="M17 11V5"></path>
        </svg>
      `;
      break;

    case 'macarrao-na-chapa':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12h18"></path>
          <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8"></path>
          <path d="M6 8c2-2 4-2 6 0s4 2 6 0"></path>
        </svg>
      `;
      break;

    case 'molhos-extras':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 10h10v6a5 5 0 0 1-10 0v-6z"></path>
          <path d="M5 10h14"></path>
          <path d="M12 4v6"></path>
          <path d="M10 4h4"></path>
        </svg>
      `;
      break;

    case 'bebidas':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="2" x2="6" y2="4"></line>
          <line x1="10" y1="2" x2="10" y2="4"></line>
          <line x1="14" y1="2" x2="14" y2="4"></line>
        </svg>
      `;
      break;

    case 'cervejas':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 11h1a3 3 0 0 1 0 6h-1"></path>
          <path d="M5 8h12v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z"></path>
          <path d="M5 8a3 3 0 0 1 6-1 3 3 0 0 1 6 1"></path>
        </svg>
      `;
      break;

    case 'balas':
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M16 8l4-4v6l-4-2z"></path>
          <path d="M8 16l-4 4v-6l4 2z"></path>
        </svg>
      `;
      break;

    default:
      iconSVG = `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3 3"></path>
        </svg>
      `;
  }

  if (isLarge) {
    return `
      <div class="media-fallback-large">
        <div class="fallback-svg-wrap">
          ${iconSVG}
        </div>
        <span class="fallback-brand-tag">Sobrado • Burger & Bar</span>
      </div>
    `;
  }

  return `
    <div class="media-fallback" style="background: #FDF3EC; border: 1px solid #F6D2BD; border-radius: 12px; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
      ${iconSVG}
    </div>
  `;
}

/**
 * Renderiza as abas de categorias horizontais
 */
function renderCategories() {
  const categoriesContainer = document.getElementById('categoriesBar');
  if (!categoriesContainer || !window.menuData) return;

  const categories = [...window.menuData.categories].sort((a, b) => a.order - b.order);

  categoriesContainer.innerHTML = categories.map((cat, index) => `
    <button 
      type="button" 
      class="category-tab ${index === 0 ? 'active' : ''}" 
      data-category-id="${cat.id}"
      id="tab-${cat.id}"
      aria-label="Categoria ${cat.name}">
      <span class="tab-label">${cat.name}</span>
    </button>
  `).join('');

  // Event listener para clique nas abas
  categoriesContainer.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.category-tab');
    if (!tabBtn) return;

    const catId = tabBtn.dataset.categoryId;
    const targetSection = document.getElementById(`section-${catId}`);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
      setActiveCategoryTab(catId);
    }
  });
}

/**
 * Atualiza o estado visual da aba ativa
 */
function setActiveCategoryTab(categoryId) {
  const allTabs = document.querySelectorAll('.category-tab');
  allTabs.forEach(tab => {
    if (tab.dataset.categoryId === categoryId) {
      tab.classList.add('active');
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      tab.classList.remove('active');
    }
  });
}

/**
 * Renderiza a listagem de seções e produtos
 */
function renderProducts() {
  const menuContent = document.getElementById('menuContent');
  if (!menuContent || !window.menuData) return;

  const { categories, products } = window.menuData;
  const isAdm = typeof AdminManager !== 'undefined' && AdminManager.isAdmin();
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  let html = '';

  sortedCategories.forEach(category => {
    // No modo ADM exibe todos os itens (inclusive pausados) para permitir edição e reativação
    const categoryProducts = products.filter(p => p.categoryId === category.id && (isAdm || p.available !== false));

    if (categoryProducts.length === 0) return;

    html += `
      <section class="menu-section" id="section-${category.id}" data-category-id="${category.id}">
        <div class="section-header">
          <div class="section-title-wrap">
            <h2 class="section-title">${category.name}</h2>
            <span class="section-count">${categoryProducts.length} itens</span>
          </div>
          ${category.description ? `<p class="section-desc">${category.description}</p>` : ''}
        </div>

        <div class="products-grid">
          ${categoryProducts.map(product => createProductCardHTML(product, isAdm)).join('')}
        </div>
      </section>
    `;
  });

  menuContent.innerHTML = html;

  // Delegação de evento de clique para abrir detalhes (anexada uma única vez)
  if (!menuContent.dataset.listenerAttached) {
    menuContent.dataset.listenerAttached = 'true';
    menuContent.addEventListener('click', (e) => {
      // Se clicou em algum controle do modo ADM, não abre drawer do cliente
      if (e.target.closest('.product-card-admin-actions')) return;

      const card = e.target.closest('.product-card');
      if (!card) return;

      const productId = card.dataset.productId;
      openProductDetails(productId);
    });
  }
}

/**
 * Gera o HTML individual do card de produto
 */
function createProductCardHTML(product, isAdm = false) {
  const isPaused = product.available === false;

  let badgeHTML = '';
  if (isPaused) {
    badgeHTML = `<span class="product-badge badge-paused">Pausado</span>`;
  } else if (product.badge) {
    badgeHTML = `<span class="product-badge">${product.badge}</span>`;
  } else if (product.featured) {
    badgeHTML = `<span class="product-badge">Mais Pedido</span>`;
  }

  const fallbackHTML = getCategoryFallbackSVG(product.categoryId, false);

  const adminActionsHTML = isAdm ? `
    <div class="product-card-admin-actions" onclick="event.stopPropagation();">
      <button 
        type="button" 
        class="btn-card-adm btn-card-adm-edit" 
        onclick="event.stopPropagation(); window.AdminManager.openEditModal('${product.id}')" 
        title="Editar dados deste produto"
        aria-label="Editar ${product.name}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>Editar</span>
      </button>

      <button 
        type="button" 
        class="btn-card-adm btn-card-adm-pause ${isPaused ? 'is-paused' : ''}" 
        onclick="event.stopPropagation(); window.AdminManager.toggleAvailability('${product.id}')" 
        title="${isPaused ? 'Reativar item no cardápio' : 'Pausar venda deste produto'}"
        aria-label="${isPaused ? 'Reativar' : 'Pausar'} ${product.name}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${isPaused ? `
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          ` : `
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          `}
        </svg>
        <span>${isPaused ? 'Reativar' : 'Pausar'}</span>
      </button>

      <button 
        type="button" 
        class="btn-card-adm btn-card-adm-delete" 
        onclick="event.stopPropagation(); window.AdminManager.confirmDelete('${product.id}')" 
        title="Excluir este produto"
        aria-label="Excluir ${product.name}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Excluir</span>
      </button>
    </div>
  ` : '';

  return `
    <article 
      class="product-card ${isPaused ? 'product-card-paused' : ''}" 
      data-product-id="${product.id}"
      tabindex="0"
      role="button"
      aria-label="Ver detalhes de ${product.name}">
      
      <div class="product-card-media" id="media-${product.id}">
        ${product.imageUrl ? `
          <img 
            src="${product.imageUrl}" 
            alt="${product.name}" 
            class="product-card-img" 
            loading="lazy" 
            width="104" 
            height="104"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="display:none; width:100%; height:100%;">
            ${fallbackHTML}
          </div>
        ` : `
          ${fallbackHTML}
        `}
        ${badgeHTML}
      </div>

      <div class="product-card-info">
        <h3 class="product-card-name">${product.name}</h3>
        <p class="product-card-desc">${product.description || ''}</p>
        
        <div class="product-card-footer">
          <div class="product-price">
            <span class="product-price-currency">R$</span>${formatCurrency(product.price || 0)}
          </div>
          <span class="btn-open-detail" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        </div>

        ${adminActionsHTML}
      </div>
    </article>
  `;
}

/**
 * ---------------------------------------------------------------------
 * 4. BUSCA E FILTRAGEM EM TEMPO REAL
 * ---------------------------------------------------------------------
 */
function setupSearchFilter() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const emptyState = document.getElementById('emptySearchState');

  if (!searchInput) return;

  const performSearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    const sections = document.querySelectorAll('.menu-section');
    const cards = document.querySelectorAll('.product-card');
    let totalVisible = 0;

    if (query === '') {
      sections.forEach(s => s.style.display = '');
      cards.forEach(c => c.style.display = '');
      if (emptyState) emptyState.classList.remove('show');
      return;
    }

    cards.forEach(card => {
      const prodId = card.dataset.productId;
      const product = window.menuData?.products.find(p => p.id === prodId);

      if (!product) return;

      const nameMatch = product.name.toLowerCase().includes(query);
      const descMatch = product.description.toLowerCase().includes(query);
      const ingMatch = product.ingredients && product.ingredients.some(ing => ing.toLowerCase().includes(query));

      if (nameMatch || descMatch || ingMatch) {
        card.style.display = 'flex';
        totalVisible++;
      } else {
        card.style.display = 'none';
      }
    });

    // Oculta seções sem nenhum produto visível
    sections.forEach(sec => {
      const visibleInSec = sec.querySelectorAll('.product-card:not([style*="display: none"])');
      if (visibleInSec.length === 0) {
        sec.style.display = 'none';
      } else {
        sec.style.display = '';
      }
    });

    if (emptyState) {
      if (totalVisible === 0) {
        emptyState.classList.add('show');
      } else {
        emptyState.classList.remove('show');
      }
    }
  };

  searchInput.addEventListener('input', performSearch);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      performSearch();
      searchInput.focus();
    });
  }
}

/**
 * ---------------------------------------------------------------------
 * 5. SCROLLSPY AUTOMÁTICO PARA AS CATEGORIAS
 * ---------------------------------------------------------------------
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll('.menu-section');
  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const catId = entry.target.dataset.categoryId;
        setActiveCategoryTab(catId);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * ---------------------------------------------------------------------
 * 6. MODAL / BOTTOM SHEET DE DETALHES DO PRODUTO (FOTO / VÍDEO)
 * ---------------------------------------------------------------------
 */
let currentVideoElement = null;
let currentModalProductId = null;
let currentSelectedAddons = [];

function setupProductDrawer() {
  const modalOverlay = document.getElementById('productModal');
  const closeBtn = document.getElementById('btnCloseDrawer');
  const btnAddToCart = document.getElementById('btnAddToCart');
  const addonsSection = document.getElementById('drawerAddonsSection');

  if (!modalOverlay) return;

  const closeModal = () => {
    stopAndResetVideo();
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Listener delegado para alterações nos checkboxes de adicionais
  if (addonsSection) {
    addonsSection.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('addon-checkbox')) {
        onAddonCheckboxChange();
      }
    });
  }

  // Ação de adicionar produto à sacola
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      if (!currentModalProductId) return;
      const product = window.menuData?.products.find(p => p.id === currentModalProductId);
      if (!product || product.available === false) return;

      addToCart(product, currentSelectedAddons);

      // Feedback visual imediato no botão
      const btnText = document.getElementById('btnAddToCartText');
      if (btnText) btnText.textContent = '✓ Adicionado!';
      btnAddToCart.style.backgroundColor = '#237841';

      if (window.showToast) {
        window.showToast(`✓ ${product.name} adicionado à sacola!`);
      }

      // Fecha o modal suavemente após confirmação
      setTimeout(() => {
        closeModal();
        if (btnText) {
          updateModalButtonTotal(product);
        }
        btnAddToCart.style.backgroundColor = '';
      }, 420);
    });
  }

  // Fecha clicando fora da caixa do drawer
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Fecha com a tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

function stopAndResetVideo() {
  if (currentVideoElement) {
    try {
      currentVideoElement.pause();
      currentVideoElement.currentTime = 0;
      currentVideoElement.src = '';
      currentVideoElement.load();
    } catch (err) {
      console.warn('Erro ao resetar vídeo:', err);
    }
    currentVideoElement = null;
  }
}

function openProductDetails(productId) {
  const product = window.menuData?.products.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;
  currentSelectedAddons = [];

  // Reseta estado do botão de adicionar e exibe o total inicial com preço base
  const btnAddToCart = document.getElementById('btnAddToCart');
  const btnAddToCartText = document.getElementById('btnAddToCartText');
  if (btnAddToCart) {
    btnAddToCart.style.backgroundColor = '';
    if (product.available === false) {
      btnAddToCart.disabled = true;
      btnAddToCart.style.opacity = '0.55';
      btnAddToCart.style.cursor = 'not-allowed';
    } else {
      btnAddToCart.disabled = false;
      btnAddToCart.style.opacity = '';
      btnAddToCart.style.cursor = '';
    }
  }
  updateModalButtonTotal(product);

  const modalOverlay = document.getElementById('productModal');
  const mediaContainer = document.getElementById('drawerMediaContainer');
  const badgeEl = document.getElementById('drawerBadge');
  const titleEl = document.getElementById('drawerTitle');
  const priceEl = document.getElementById('drawerPrice');
  const descEl = document.getElementById('drawerDesc');
  const accompanimentBox = document.getElementById('drawerAccompanimentContainer');
  const ingredientsListEl = document.getElementById('drawerIngredientsList');
  const ingredientsBox = document.getElementById('drawerIngredientsBox');

  // Limpa mídia anterior
  stopAndResetVideo();
  mediaContainer.innerHTML = '';

  const fallbackDrawerHTML = getCategoryFallbackSVG(product.categoryId, true);

  // MÍDIA DO MODAL:
  if (product.videoUrl) {
    const video = document.createElement('video');
    video.src = product.videoUrl;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.className = 'drawer-media-video';
    mediaContainer.appendChild(video);
    currentVideoElement = video;
  } else if (product.imageUrl) {
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.name;
    img.className = 'drawer-media-img burger-focus';
    if (product.objectFit === 'contain') {
      img.classList.add('contain-fit');
      img.classList.remove('burger-focus');
    }
    if (product.objectPosition) {
      img.style.objectPosition = product.objectPosition;
    }
    img.onload = () => {
      // Se a imagem for vertical (mais alta que larga), acomoda o item por inteiro sem cortar
      if (img.naturalHeight > img.naturalWidth) {
        img.classList.add('is-vertical');
        img.classList.remove('burger-focus');
      }
    };
    img.onerror = () => {
      mediaContainer.innerHTML = fallbackDrawerHTML;
    };
    mediaContainer.appendChild(img);
  } else {
    mediaContainer.innerHTML = fallbackDrawerHTML;
  }

  // Preenche dados textuais
  if (badgeEl) {
    if (product.badge) {
      badgeEl.textContent = product.badge;
      badgeEl.style.display = 'inline-block';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.innerHTML = `<span class="product-price-currency">R$</span>${formatCurrency(product.price)}`;
  if (descEl) descEl.textContent = product.description;

  // DETECÇÃO E DESTAQUE DE MOLHOS E ACOMPANHAMENTOS INCLUSOS
  if (accompanimentBox) {
    const descLower = product.description.toLowerCase();
    let accompanimentText = null;

    if (descLower.includes('acompanha')) {
      const match = product.description.match(/(Acompanha[^.]+)/i);
      if (match) {
        accompanimentText = match[1].trim();
      }
    }

    if (accompanimentText) {
      accompanimentBox.innerHTML = `
        <div class="drawer-accompaniment-card">
          <span class="accompaniment-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C85A17" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <div class="accompaniment-text">
            <span class="accompaniment-title">Acompanhamento Incluso</span>
            <span class="accompaniment-desc">${accompanimentText}</span>
          </div>
        </div>
      `;
      accompanimentBox.style.display = 'block';
    } else {
      accompanimentBox.style.display = 'none';
      accompanimentBox.innerHTML = '';
    }
  }

  // Lista de ingredientes destacados
  if (ingredientsBox && ingredientsListEl) {
    if (product.ingredients && product.ingredients.length > 0) {
      ingredientsListEl.innerHTML = product.ingredients
        .map(ing => `<li class="ingredient-pill">${ing}</li>`)
        .join('');
      ingredientsBox.style.display = 'block';
    } else {
      ingredientsBox.style.display = 'none';
    }
  }

  // Renderiza seção de adicionais exclusiva do modal
  renderDrawerAddons(product);

  // Abre o drawer e trava o scroll do fundo
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Converte a lista de adicionais permitidos do produto (seja ID simples, JSON serializado ou objeto)
 * para uma lista padronizada [{ id, name, price }] considerando preços customizados
 */
function parseProductAddons(allowedAddons, product = null) {
  // 1. Prioriza addonsConfig vindo diretamente do Supabase / Admin
  if (product && Array.isArray(product.addonsConfig) && product.addonsConfig.length > 0) {
    const catalog = window.addonItems || window.menuData?.addonItems || {};
    return product.addonsConfig.map(item => {
      const base = catalog[item.id];
      const displayName = (base && (!item.name || item.name === item.id)) ? base.name : (item.name || (base ? base.name : item.id));
      const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
      const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
      return {
        id: String(item.id),
        name: displayName,
        price: finalPrice
      };
    });
  }

  // 2. Se allowedAddons já for um array de objetos estruturados [{ id, name, price }]
  if (Array.isArray(allowedAddons) && allowedAddons.length > 0 && typeof allowedAddons[0] === 'object' && allowedAddons[0] !== null && ('name' in allowedAddons[0] || 'price' in allowedAddons[0])) {
    const catalog = window.addonItems || window.menuData?.addonItems || {};
    return allowedAddons.map(item => {
      const base = catalog[item.id];
      const displayName = (base && (!item.name || item.name === item.id)) ? base.name : (item.name || (base ? base.name : item.id));
      const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
      const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
      return {
        id: String(item.id),
        name: displayName,
        price: finalPrice
      };
    });
  }

  if (!allowedAddons || !Array.isArray(allowedAddons) || allowedAddons.length === 0) {
    return [];
  }

  const catalog = window.addonItems || window.menuData?.addonItems || {};
  const customPrices = product?.customAddonPrices || {};

  return allowedAddons.map(item => {
    // 1. Já é objeto
    if (typeof item === 'object' && item !== null) {
      const price = customPrices[item.id] != null 
        ? Number(customPrices[item.id]) 
        : (typeof item.price === 'number' ? item.price : parseFloat(item.price || 0));
      return {
        id: item.id,
        name: item.name || catalog[item.id]?.name || item.id,
        price: price
      };
    }

    // 2. É string (JSON serializado ou ID simples)
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed && parsed.id) {
            const price = customPrices[parsed.id] != null 
              ? Number(customPrices[parsed.id]) 
              : (typeof parsed.price === 'number' ? parsed.price : parseFloat(parsed.price || 0));
            return {
              id: parsed.id,
              name: parsed.name || catalog[parsed.id]?.name || parsed.id,
              price: price
            };
          }
        } catch (e) {
          // segue fallback
        }
      }

      // ID simples
      const base = catalog[trimmed];
      const customPrice = customPrices[trimmed];
      if (base) {
        return {
          id: base.id,
          name: base.name,
          price: customPrice != null ? Number(customPrice) : base.price
        };
      }

      return {
        id: trimmed,
        name: trimmed,
        price: customPrice != null ? Number(customPrice) : 0
      };
    }

    return null;
  }).filter(Boolean);
}

/**
 * Atualiza o cálculo de adicionais selecionados e reflete no botão
 */
function onAddonCheckboxChange() {
  const product = window.menuData?.products.find(p => p.id === currentModalProductId);
  if (!product) return;

  const checkboxes = document.querySelectorAll('#drawerAddonsSection .addon-checkbox:checked');

  currentSelectedAddons = Array.from(checkboxes).map(cb => {
    return {
      id: cb.dataset.id || cb.value,
      name: cb.dataset.name || cb.value,
      price: parseFloat(cb.dataset.price) || 0
    };
  });

  // Atualiza destaque visual dos cards de adicionais
  document.querySelectorAll('#drawerAddonsSection .drawer-addon-item').forEach(label => {
    const cb = label.querySelector('.addon-checkbox');
    if (cb && cb.checked) {
      label.classList.add('selected');
    } else {
      label.classList.remove('selected');
    }
  });

  updateModalButtonTotal(product);
}

/**
 * Atualiza o texto do botão de ação com o valor total calculado
 */
function updateModalButtonTotal(product) {
  const btnAddToCartText = document.getElementById('btnAddToCartText');
  if (!btnAddToCartText || !product) return;

  if (product.available === false) {
    btnAddToCartText.textContent = 'Item Indisponível no Momento';
    return;
  }

  const addonsSum = currentSelectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
  const total = product.price + addonsSum;

  btnAddToCartText.textContent = `Adicionar à Sacola • R$ ${formatCurrency(total)}`;
}

/**
 * Renderiza dinamicamente os adicionais permitidos para o produto no modal
 */
function renderDrawerAddons(product) {
  const addonsSection = document.getElementById('drawerAddonsSection');
  if (!addonsSection) return;

  const catalog = window.addonItems || window.menuData?.addonItems || {};

  // Renderiza os adicionais e preços usando os dados de addonsConfig salvos no banco para aquele item
  const items = (Array.isArray(product.addonsConfig) && product.addonsConfig.length > 0)
    ? product.addonsConfig.map(addon => {
        const base = catalog[addon.id];
        const displayName = (base && (!addon.name || addon.name === addon.id)) ? base.name : (addon.name || (base ? base.name : addon.id));
        const rawPrice = typeof addon.price === 'number' ? addon.price : parseFloat(addon.price || 0);
        const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
        return {
          id: String(addon.id),
          name: displayName,
          price: finalPrice
        };
      })
    : parseProductAddons(product.allowedAddons, product);

  if (items.length === 0) {
    addonsSection.style.display = 'none';
    addonsSection.innerHTML = '';
    return;
  }

  addonsSection.style.display = 'flex';
  addonsSection.innerHTML = `
    <div class="drawer-addons-header">
      <h4 class="drawer-section-title">Adicionais</h4>
      <span class="drawer-addons-optional-badge">Opcional</span>
    </div>
    <div class="drawer-addons-list">
      ${items.map(addon => `
        <label class="drawer-addon-item" for="addon-${addon.id}">
          <div class="drawer-addon-item-left">
            <div class="addon-checkbox-wrap">
              <input 
                type="checkbox" 
                id="addon-${addon.id}" 
                class="addon-checkbox" 
                value="${addon.id}"
                data-id="${addon.id}"
                data-name="${addon.name}"
                data-price="${addon.price}"
              />
              <span class="addon-custom-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
            </div>
            <span class="addon-name">${addon.name}</span>
          </div>
          <span class="addon-price">+ R$ ${formatCurrency(addon.price)}</span>
        </label>
      `).join('')}
    </div>
  `;
}

/**
 * ---------------------------------------------------------------------
 * 7. GERENCIADOR DE CONFIGURAÇÕES DE WI-FI
 * ---------------------------------------------------------------------
 */
const WifiManager = {
  LOCAL_STORAGE_KEY: 'sobrado_wifi_config',
  defaultConfig: {
    ssid: 'O Sobrado - Clientes',
    password: 'sobradoburger'
  },

  init() {
    // 1. Aplica dados locais imediatamente (sem flash de dados antigos)
    const current = this.getWifiConfig();
    this.applyToDOM(current);

    // 2. Tenta sincronizar com Supabase em segundo plano
    this.syncFromSupabase();

    // 3. Sincroniza em tempo real se alterado em outra aba
    window.addEventListener('storage', (e) => {
      if (e.key === this.LOCAL_STORAGE_KEY) {
        this.applyToDOM(this.getWifiConfig());
      }
    });
  },

  getWifiConfig() {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.ssid === 'string' && typeof parsed.password === 'string') {
          return {
            ssid: parsed.ssid.trim() || this.defaultConfig.ssid,
            password: parsed.password.trim() || this.defaultConfig.password
          };
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar wifi_config local:', e);
    }
    return {
      ssid: window.menuData?.restaurant?.wifi?.ssid || this.defaultConfig.ssid,
      password: window.menuData?.restaurant?.wifi?.password || this.defaultConfig.password
    };
  },

  applyToDOM(config) {
    if (!config) return;

    // Atualiza menuData em memória
    if (window.menuData?.restaurant?.wifi) {
      window.menuData.restaurant.wifi.ssid = config.ssid;
      window.menuData.restaurant.wifi.password = config.password;
    }

    // Atualiza os elementos de texto no modal
    const ssidEls = document.querySelectorAll('.wifi-ssid-value, #wifiModalSsidVal');
    const pwdEls = document.querySelectorAll('.wifi-password-value, #wifiModalPasswordVal');
    ssidEls.forEach(el => { el.textContent = config.ssid; });
    pwdEls.forEach(el => { el.textContent = config.password; });
  },

  async syncFromSupabase() {
    if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.fetchWifiConfig === 'function') {
      try {
        const remote = await SupabaseService.fetchWifiConfig();
        if (remote && remote.ssid && remote.password) {
          const current = this.getWifiConfig();
          if (remote.ssid !== current.ssid || remote.password !== current.password) {
            this.saveLocal(remote);
            this.applyToDOM(remote);
          }
        }
      } catch (e) {
        console.warn('Erro ao sincronizar wifi do Supabase:', e);
      }
    }
  },

  saveLocal(config) {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Erro ao salvar wifi_config localmente:', e);
    }
    this.applyToDOM(config);
  },

  async saveWifiConfig(config) {
    const cleanConfig = {
      ssid: config.ssid.trim() || this.defaultConfig.ssid,
      password: config.password.trim() || this.defaultConfig.password
    };

    // Salva local e reflete no DOM imediatamente
    this.saveLocal(cleanConfig);

    // Persiste no Supabase se disponível
    if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.saveWifiConfig === 'function') {
      try {
        await SupabaseService.saveWifiConfig(cleanConfig);
      } catch (e) {
        console.warn('Erro ao salvar wifi no Supabase:', e);
      }
    }

    return true;
  }
};

/**
 * ---------------------------------------------------------------------
 * 7.1 MODAL DE WI-FI & COPIAR SENHA (COM SUPORTE A EDIÇÃO ADM)
 * ---------------------------------------------------------------------
 */
function initWifiModal() {
  const wifiModal = document.getElementById('wifiModal');
  const btnOpenWifiList = document.querySelectorAll('.btn-trigger-wifi');
  const btnCloseWifi = document.getElementById('btnCloseWifi');
  const btnCopyWifi = document.getElementById('btnCopyWifiPassword');

  // Elementos do fluxo de edição ADM
  const displayView = document.getElementById('wifiDisplayView');
  const editForm = document.getElementById('wifiEditForm');
  const mainActions = document.getElementById('wifiMainActions');
  const btnOpenEdit = document.getElementById('btnOpenWifiEdit');
  const btnCancelEdit = document.getElementById('btnCancelWifiEdit');
  const btnSaveEdit = document.getElementById('btnSaveWifiEdit');
  const ssidInput = document.getElementById('wifiEditSsidInput');
  const passwordInput = document.getElementById('wifiEditPasswordInput');

  if (!wifiModal) return;

  const isUserAdmin = () => {
    return (typeof AdminManager !== 'undefined' && AdminManager.isAdmin && AdminManager.isAdmin()) ||
           sessionStorage.getItem('sobrado_admin_auth') === 'true';
  };

  const resetModalMode = () => {
    if (editForm) editForm.style.display = 'none';
    if (displayView) displayView.style.display = 'flex';
    if (mainActions) mainActions.style.display = 'block';

    const current = WifiManager.getWifiConfig();
    WifiManager.applyToDOM(current);

    if (btnOpenEdit) {
      btnOpenEdit.style.display = isUserAdmin() ? 'inline-flex' : 'none';
    }
  };

  const openWifi = () => {
    resetModalMode();
    wifiModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeWifi = () => {
    wifiModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(resetModalMode, 250);
  };

  btnOpenWifiList.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWifi();
    });
  });

  if (btnCloseWifi) {
    btnCloseWifi.addEventListener('click', closeWifi);
  }

  wifiModal.addEventListener('click', (e) => {
    if (e.target === wifiModal) {
      closeWifi();
    }
  });

  // Copiar senha
  if (btnCopyWifi) {
    btnCopyWifi.addEventListener('click', () => {
      const config = WifiManager.getWifiConfig();
      const password = config.password || 'sobradoburger';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password).then(() => {
          showToast('✓ Senha do Wi-Fi copiada com sucesso!');
        }).catch(() => {
          fallbackCopyText(password);
        });
      } else {
        fallbackCopyText(password);
      }
    });
  }

  // Abrir modo de edição ADM
  if (btnOpenEdit) {
    btnOpenEdit.addEventListener('click', () => {
      const current = WifiManager.getWifiConfig();
      if (ssidInput) ssidInput.value = current.ssid;
      if (passwordInput) passwordInput.value = current.password;

      if (displayView) displayView.style.display = 'none';
      if (mainActions) mainActions.style.display = 'none';
      if (editForm) editForm.style.display = 'flex';

      if (ssidInput) {
        ssidInput.style.borderColor = '';
        ssidInput.focus();
      }
      if (passwordInput) {
        passwordInput.style.borderColor = '';
      }
    });
  }

  // Cancelar edição ADM
  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => {
      if (editForm) editForm.style.display = 'none';
      if (displayView) displayView.style.display = 'flex';
      if (mainActions) mainActions.style.display = 'block';
    });
  }

  // Salvar credenciais de Wi-Fi ADM
  if (btnSaveEdit) {
    btnSaveEdit.addEventListener('click', async () => {
      const newSsid = ssidInput ? ssidInput.value.trim() : '';
      const newPassword = passwordInput ? passwordInput.value.trim() : '';

      if (!newSsid) {
        if (ssidInput) {
          ssidInput.focus();
          ssidInput.style.borderColor = '#DC2626';
        }
        showToast('Por favor, informe o Nome da Rede (SSID).');
        return;
      }

      if (!newPassword) {
        if (passwordInput) {
          passwordInput.focus();
          passwordInput.style.borderColor = '#DC2626';
        }
        showToast('Por favor, informe a Senha do Wi-Fi.');
        return;
      }

      btnSaveEdit.disabled = true;
      btnSaveEdit.textContent = 'Salvando...';

      await WifiManager.saveWifiConfig({
        ssid: newSsid,
        password: newPassword
      });

      btnSaveEdit.disabled = false;
      btnSaveEdit.textContent = 'Salvar Wi-Fi';

      // Volta para a visualização limpa com os novos valores
      if (editForm) editForm.style.display = 'none';
      if (displayView) displayView.style.display = 'flex';
      if (mainActions) mainActions.style.display = 'block';

      showToast('✓ Informações do Wi-Fi atualizadas com sucesso!');
    });
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('✓ Senha do Wi-Fi copiada com sucesso!');
  } catch (err) {
    showToast('Senha: ' + text);
  }
  document.body.removeChild(textArea);
}

/**
 * Toast flutuante de notificação
 */
let toastTimeout = null;
function showToast(message, icon = '✓') {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Utilitários globais do sistema
 */
const Utils = {
  showToast(message) {
    showToast(message);
  }
};
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

/**
 * ---------------------------------------------------------------------
 * 8. SISTEMA DE SACOLA DE PEDIDOS & WHATSAPP
 * ---------------------------------------------------------------------
 */
let cart = [];

function initCart() {
  loadCart();
  setupCartDrawer();
}

function loadCart() {
  try {
    const saved = localStorage.getItem('sobrado_cart');
    if (saved) {
      cart = JSON.parse(saved);
      if (!Array.isArray(cart)) cart = [];
    }
  } catch (err) {
    cart = [];
  }
  updateCartBadge();
}

function saveCart() {
  try {
    localStorage.setItem('sobrado_cart', JSON.stringify(cart));
  } catch (err) {
    console.warn('Erro ao salvar sacola no localStorage:', err);
  }
  updateCartBadge();
}

function getCartTotalCount() {
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

function getCartTotalPrice() {
  return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadgeCount');
  if (!badge) return;
  const count = getCartTotalCount();
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function addToCart(product, addons = []) {
  // Identificador único contendo o produto e a combinação de adicionais selecionados
  const sortedAddons = [...addons].sort((a, b) => a.id.localeCompare(b.id));
  const addonsKey = sortedAddons.map(a => a.id).join('_');
  const cartItemId = addonsKey ? `${product.id}__${addonsKey}` : product.id;

  const addonsTotal = sortedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
  const unitPrice = product.price + addonsTotal;

  const existing = cart.find(item => item.id === cartItemId);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      price: unitPrice,
      addonsTotal: addonsTotal,
      imageUrl: product.imageUrl,
      quantity: 1,
      addons: sortedAddons
    });
  }
  saveCart();

  // Micro-animação no badge do carrinho
  const badge = document.getElementById('cartBadgeCount');
  if (badge) {
    badge.style.transform = 'scale(1.35)';
    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 180);
  }
}

function updateItemQuantity(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + delta;
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }
  saveCart();
  renderCartDrawer();
}

function removeItemFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCartDrawer();
}

function openCartDrawer() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  renderCartDrawer();
  cartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const cartModal = document.getElementById('cartModal');
  if (!cartModal) return;
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const footer = document.getElementById('cartDrawerFooter');
  const totalValue = document.getElementById('cartTotalValue');
  const cartTableBadge = document.getElementById('cartTableBadge');
  const cartTableText = document.getElementById('cartTableText');

  if (!body) return;

  // Atualiza identificação de mesa ativa
  const activeTable = getActiveTable();
  if (activeTable && cartTableBadge && cartTableText) {
    cartTableText.textContent = `Mesa ${formatTableNumber(activeTable)}`;
    cartTableBadge.style.display = 'inline-flex';
  } else if (cartTableBadge) {
    cartTableBadge.style.display = 'none';
  }

  if (cart.length === 0) {
    // Estado Vazio
    body.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <h3 class="cart-empty-title">Sua sacola está vazia</h3>
        <p class="cart-empty-desc">Adicione produtos deliciosos do cardápio para montar seu pedido.</p>
        <button type="button" class="btn-explore-menu" id="btnExploreMenu">Explorar Cardápio</button>
      </div>
    `;

    if (footer) footer.style.display = 'none';

    const btnExplore = document.getElementById('btnExploreMenu');
    if (btnExplore) {
      btnExplore.addEventListener('click', closeCartDrawer);
    }
  } else {
    // Lista de Itens Selecionados
    let itemsHTML = '<div class="cart-items-list">';
    cart.forEach(item => {
      const subtotal = item.price * (item.quantity || 1);

      let addonsHTML = '';
      if (item.addons && item.addons.length > 0) {
        const addonNames = item.addons.map(a => a.name).join(', ');
        const addonsTotal = item.addons.reduce((sum, a) => sum + (a.price || 0), 0);
        addonsHTML = `
          <div class="cart-item-addons">
            + ${addonNames} <span class="cart-item-addons-price">(+ R$ ${formatCurrency(addonsTotal)})</span>
          </div>
        `;
      }

      itemsHTML += `
        <div class="cart-item-card">
          <img 
            src="${item.imageUrl || 'assets/images/Logo_Sobrado.jpg'}" 
            alt="${item.name}" 
            class="cart-item-thumb" 
            onerror="this.src='assets/images/Logo_Sobrado.jpg'"
          />
          <div class="cart-item-details">
            <div class="cart-item-top">
              <h4 class="cart-item-name">${item.name}</h4>
              <button type="button" class="btn-cart-remove" onclick="window.removeItemFromCart('${item.id}')" aria-label="Remover item">✕</button>
            </div>
            ${addonsHTML}
            <span class="cart-item-unit">R$ ${formatCurrency(item.price)} un.</span>
            <div class="cart-item-bottom">
              <div class="cart-qty-control">
                <button type="button" class="btn-qty-action" onclick="window.updateItemQuantity('${item.id}', -1)" aria-label="Diminuir quantidade">−</button>
                <span class="cart-qty-display">${item.quantity}</span>
                <button type="button" class="btn-qty-action" onclick="window.updateItemQuantity('${item.id}', 1)" aria-label="Aumentar quantidade">+</button>
              </div>
              <div class="cart-item-subtotal">R$ ${formatCurrency(subtotal)}</div>
            </div>
          </div>
        </div>
      `;
    });
    itemsHTML += '</div>';

    body.innerHTML = itemsHTML;

    if (footer) footer.style.display = 'flex';
    if (totalValue) totalValue.textContent = `R$ ${formatCurrency(getCartTotalPrice())}`;
  }
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    if (window.showToast) window.showToast('Sua sacola está vazia.');
    return;
  }

  const restaurantPhone = window.menuData?.restaurant?.whatsapp || '553599170077';
  const table = getActiveTable();
  const notes = document.getElementById('cartNotesInput')?.value.trim();

  let message = 'Olá! Gostaria de fazer um pedido:\n\n';

  if (table) {
    message += `📍 Local: Mesa ${formatTableNumber(table)}\n\n`;
  }

  message += '🛒 ITENS:\n';
  cart.forEach(item => {
    const subtotal = item.price * (item.quantity || 1);
    message += `• ${item.quantity}x ${item.name} — R$ ${formatCurrency(subtotal)}\n`;
    if (item.addons && item.addons.length > 0) {
      const addonsFormatted = item.addons
        .map(a => `${a.name} (+ R$ ${formatCurrency(a.price)})`)
        .join(', ');
      message += `   └ Adicionais: ${addonsFormatted}\n`;
    }
  });

  if (notes) {
    message += `\n📝 Observações: ${notes}\n`;
  }

  message += `\n💰 Total: R$ ${formatCurrency(getCartTotalPrice())}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

function setupCartDrawer() {
  const btnOpenCart = document.getElementById('btnOpenCart');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartModal = document.getElementById('cartModal');
  const btnWhatsappOrder = document.getElementById('btnWhatsappOrder');

  if (btnOpenCart) {
    btnOpenCart.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (btnCloseCart) {
    btnCloseCart.addEventListener('click', closeCartDrawer);
  }

  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        closeCartDrawer();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) {
      closeCartDrawer();
    }
  });

  if (btnWhatsappOrder) {
    btnWhatsappOrder.addEventListener('click', sendOrderToWhatsApp);
  }
}

/**
 * =====================================================================
 * 9. MÓDULO ADMINISTRADOR (ADM) — FASE 1 (MOCK LOCAL & REATIVO)
 * =====================================================================
 */
const AdminManager = {
  SESSION_STORAGE_KEY: 'sobrado_admin_auth',
  LOCAL_STORAGE_PRODUCTS_KEY: 'sobrado_custom_products',
  productIdToDelete: null,

  init() {
    this.loadStoredProducts();
    this.checkSession();
    this.populateCategorySelect();
    this.setupListeners();
  },

  isAdmin() {
    return sessionStorage.getItem(this.SESSION_STORAGE_KEY) === 'true';
  },

  checkSession() {
    this.applyAdminUI(this.isAdmin());
  },

  applyAdminUI(isAuthed) {
    const topBar = document.getElementById('adminTopBar');
    const headerAdminBtn = document.getElementById('btnOpenAdminAuth');
    const btnOpenWifiEdit = document.getElementById('btnOpenWifiEdit');

    if (isAuthed) {
      document.body.classList.add('admin-mode-active');
      const container = document.getElementById('menuAppContainer');
      if (container) container.classList.add('admin-mode-active');
      if (topBar) topBar.style.display = 'block';
      if (headerAdminBtn) headerAdminBtn.classList.add('active');
      if (btnOpenWifiEdit) btnOpenWifiEdit.style.display = 'inline-flex';
    } else {
      document.body.classList.remove('admin-mode-active');
      const container = document.getElementById('menuAppContainer');
      if (container) container.classList.remove('admin-mode-active');
      if (topBar) topBar.style.display = 'none';
      if (headerAdminBtn) headerAdminBtn.classList.remove('active');
      if (btnOpenWifiEdit) btnOpenWifiEdit.style.display = 'none';
    }
  },

  loadStoredProducts() {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          window.menuData.products = parsed;
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar produtos salvos do localStorage:', err);
    }
  },

  persistProducts() {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(window.menuData.products));
    } catch (err) {
      console.error('Erro ao persistir produtos no localStorage:', err);
    }
  },

  async login(password) {
    const errorEl = document.getElementById('adminAuthError');
    const pwdInput = document.getElementById('adminAuthPassword');
    const submitBtn = document.getElementById('btnSubmitAdminAuth');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Entrar no Painel';

    const enteredPassword = password ? password.trim() : (pwdInput ? pwdInput.value.trim() : '');

    if (!enteredPassword) {
      if (errorEl) {
        errorEl.textContent = 'Por favor, digite a senha.';
        errorEl.style.display = 'block';
      }
      if (pwdInput) pwdInput.focus();
      return false;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verificando...';
    }

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    try {
      if (typeof SupabaseService === 'undefined' || typeof SupabaseService.verifyAdminPassword !== 'function') {
        throw new Error('Falha ao validar credenciais no servidor.');
      }

      const isValid = await SupabaseService.verifyAdminPassword(enteredPassword);

      if (isValid === true) {
        sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'true');
        this.applyAdminUI(true);
        renderProducts();
        this.closeAuthModal();

        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }

        if (pwdInput) pwdInput.value = '';

        if (window.showToast) {
          window.showToast('⚡ Bem-vindo ao Modo Administrador!');
        }
        return true;
      } else {
        if (errorEl) {
          errorEl.textContent = 'Senha incorreta.';
          errorEl.style.display = 'block';
        }
        if (pwdInput) {
          pwdInput.focus();
          pwdInput.style.borderColor = '#DC2626';
          setTimeout(() => {
            pwdInput.style.borderColor = '';
          }, 1500);
        }
        return false;
      }
    } catch (err) {
      console.error('[Admin] Erro ao validar credenciais:', err);
      if (errorEl) {
        errorEl.textContent = err.message || 'Falha ao validar credenciais no servidor.';
        errorEl.style.display = 'block';
      }
      return false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    this.applyAdminUI(false);
    renderProducts();
    if (window.showToast) {
      window.showToast('Sessão administrativa encerrada.');
    }
  },

  populateCategorySelect() {
    const select = document.getElementById('adminProdCategory');
    if (!select || !window.menuData || !window.menuData.categories) return;

    const categories = [...window.menuData.categories].sort((a, b) => a.order - b.order);
    select.innerHTML = categories.map(cat => `
      <option value="${cat.id}">${cat.name}</option>
    `).join('');
  },

  openAuthModal() {
    const modal = document.getElementById('adminAuthModal');
    if (!modal) return;

    if (this.isAdmin()) {
      if (window.showToast) {
        window.showToast('⚡ O Painel Administrativo já está ativo.');
      }
      return;
    }

    const pwdInput = document.getElementById('adminAuthPassword');
    const errorEl = document.getElementById('adminAuthError');
    if (pwdInput) pwdInput.value = '';
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (pwdInput) pwdInput.focus();
    }, 150);
  },

  closeAuthModal() {
    const modal = document.getElementById('adminAuthModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  currentEditingAddons: [],

  initAddonsConfig(productOrNull) {
    const catalog = window.addonItems || window.menuData?.addonItems || {};
    const baseCatalogList = Object.values(catalog);

    if (productOrNull) {
      // Carrega os adicionais e preços vindos de addonsConfig do Supabase (com fallback)
      let productAddons = [];
      if (Array.isArray(productOrNull.addonsConfig) && productOrNull.addonsConfig.length > 0) {
        productAddons = productOrNull.addonsConfig.map(a => {
          const base = catalog[a.id];
          const displayName = (base && (!a.name || a.name === a.id)) ? base.name : (a.name || (base ? base.name : a.id));
          const rawPrice = typeof a.price === 'number' ? a.price : parseFloat(a.price || 0);
          const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
          return {
            id: String(a.id),
            name: displayName,
            price: finalPrice
          };
        });
      } else {
        productAddons = parseProductAddons(productOrNull.allowedAddons, productOrNull);
      }

      const selectedMap = new Map();
      productAddons.forEach(a => selectedMap.set(a.id, a));

      // 1. Adicionais do catálogo base:
      // - Usa SEMPRE o nome formatado oficial (base.name), e nunca o id técnico cru
      // - Se o item não tiver preço customizado prévio (> 0), puxa o valor base de addonItems
      const list = baseCatalogList.map(base => {
        const sel = selectedMap.get(base.id);
        const selPrice = sel ? Number(sel.price) : 0;
        const finalPrice = (sel && selPrice > 0) ? selPrice : Number(base.price);

        return {
          id: base.id,
          name: base.name, // Nome sempre formatado (ex: "Hambúrguer 110g")
          price: finalPrice, // Preço customizado ou base de addonItems (nunca R$ 0,00)
          selected: !!sel,
          isCustom: false
        };
      });

      // 2. Adicionais customizados do produto (não presentes no catálogo base)
      productAddons.forEach(sel => {
        if (!catalog[sel.id]) {
          list.push({
            id: sel.id,
            name: sel.name || sel.id,
            price: Math.max(0, parseFloat(sel.price) || 0),
            selected: true,
            isCustom: true
          });
        }
      });

      this.currentEditingAddons = list;
    } else {
      // Novo produto: todos os adicionais base habilitados por padrão com nome e preço oficiais
      this.currentEditingAddons = baseCatalogList.map(base => ({
        id: base.id,
        name: base.name,
        price: Number(base.price),
        selected: true,
        isCustom: false
      }));
    }

    this.renderAddonsConfig();
  },

  renderAddonsConfig() {
    const listEl = document.getElementById('adminAddonsList');
    if (!listEl) return;

    if (!this.currentEditingAddons || this.currentEditingAddons.length === 0) {
      listEl.innerHTML = '<div style="padding: 10px; font-size: 0.78rem; color: var(--text-dim); text-align: center;">Nenhum adicional disponível.</div>';
      return;
    }

    const catalog = window.addonItems || window.menuData?.addonItems || {};

    listEl.innerHTML = this.currentEditingAddons.map(addon => {
      const base = catalog[addon.id];
      // Garante nome formatado oficial e preço base se zerado
      const displayName = (base && (!addon.name || addon.name === addon.id)) ? base.name : (addon.name || (base ? base.name : addon.id));
      const rawPrice = addon.price != null ? Number(addon.price) : 0;
      const displayPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);

      return `
      <div class="admin-addon-item-row ${addon.selected ? 'is-active' : 'is-inactive'}" data-id="${addon.id}">
        <label class="admin-addon-item-label" for="admin-addon-check-${addon.id}">
          <input 
            type="checkbox" 
            id="admin-addon-check-${addon.id}" 
            class="admin-addon-checkbox" 
            data-id="${addon.id}" 
            ${addon.selected ? 'checked' : ''}
          />
          <span class="admin-addon-custom-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span class="admin-addon-item-name" title="${displayName}">${displayName}</span>
        </label>
        <div class="admin-addon-item-price-wrap">
          <span class="admin-addon-price-prefix">R$</span>
          <input 
            type="number" 
            class="admin-addon-price-input" 
            data-id="${addon.id}" 
            value="${displayPrice.toFixed(2)}" 
            step="0.50" 
            min="0" 
          />
          ${addon.isCustom ? `
            <button type="button" class="btn-remove-custom-addon" data-id="${addon.id}" title="Remover adicional">✕</button>
          ` : ''}
        </div>
      </div>
    `;
    }).join('');
  },

  openNewModal() {
    const form = document.getElementById('adminProductForm');
    if (form) form.reset();

    const idInput = document.getElementById('adminProdId');
    if (idInput) idInput.value = '';

    const titleEl = document.getElementById('adminProductModalTitle');
    const subtitleEl = document.getElementById('adminProductModalSubtitle');
    if (titleEl) titleEl.textContent = 'Novo Produto';
    if (subtitleEl) subtitleEl.textContent = 'Preencha as informações do produto para o cardápio.';

    const categorySelect = document.getElementById('adminProdCategory');
    if (categorySelect && window.menuData?.categories?.length > 0) {
      categorySelect.value = window.menuData.categories[0].id;
    }

    const availableCheckbox = document.getElementById('adminProdAvailable');
    if (availableCheckbox) availableCheckbox.checked = true;

    const hasAddonsCheckbox = document.getElementById('adminProdHasAddons');
    if (hasAddonsCheckbox) hasAddonsCheckbox.checked = true;

    const addonsConfigSection = document.getElementById('adminAddonsConfigSection');
    if (addonsConfigSection) addonsConfigSection.style.display = 'flex';
    this.initAddonsConfig(null);

    const featuredCheckbox = document.getElementById('adminProdFeatured');
    if (featuredCheckbox) featuredCheckbox.checked = false;

    const modal = document.getElementById('adminProductFormModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const nameInput = document.getElementById('adminProdName');
      setTimeout(() => {
        if (nameInput) nameInput.focus();
      }, 150);
    }
  },

  openEditModal(productId) {
    const product = window.menuData?.products.find(p => p.id === productId);
    if (!product) return;

    const idInput = document.getElementById('adminProdId');
    const nameInput = document.getElementById('adminProdName');
    const catSelect = document.getElementById('adminProdCategory');
    const priceInput = document.getElementById('adminProdPrice');
    const descInput = document.getElementById('adminProdDesc');
    const ingInput = document.getElementById('adminProdIngredients');
    const imgInput = document.getElementById('adminProdImage');
    const hasAddonsCheckbox = document.getElementById('adminProdHasAddons');
    const featuredCheckbox = document.getElementById('adminProdFeatured');
    const availableCheckbox = document.getElementById('adminProdAvailable');

    if (idInput) idInput.value = product.id;
    if (nameInput) nameInput.value = product.name || '';
    if (catSelect) catSelect.value = product.categoryId || '';
    if (priceInput) priceInput.value = product.price != null ? Number(product.price).toFixed(2) : '';
    if (descInput) descInput.value = product.description || '';
    if (ingInput) {
      ingInput.value = Array.isArray(product.ingredients)
        ? product.ingredients.join(', ')
        : (product.ingredients || '');
    }
    if (imgInput) imgInput.value = product.imageUrl || '';

    const hasAddons = (Array.isArray(product.addonsConfig) && product.addonsConfig.length > 0)
      || (Array.isArray(product.allowedAddons) && product.allowedAddons.length > 0);
    if (hasAddonsCheckbox) {
      hasAddonsCheckbox.checked = hasAddons;
    }

    const addonsConfigSection = document.getElementById('adminAddonsConfigSection');
    if (addonsConfigSection) {
      addonsConfigSection.style.display = hasAddons ? 'flex' : 'none';
    }
    this.initAddonsConfig(hasAddons ? product : null);

    if (featuredCheckbox) featuredCheckbox.checked = !!product.featured;
    if (availableCheckbox) availableCheckbox.checked = product.available !== false;

    const titleEl = document.getElementById('adminProductModalTitle');
    const subtitleEl = document.getElementById('adminProductModalSubtitle');
    if (titleEl) titleEl.textContent = 'Editar Produto';
    if (subtitleEl) subtitleEl.textContent = `Editando dados de "${product.name}"`;

    const modal = document.getElementById('adminProductFormModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (nameInput) nameInput.focus();
      }, 150);
    }
  },

  closeProductFormModal() {
    const modal = document.getElementById('adminProductFormModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  async saveProductFromForm() {
    const idInput = document.getElementById('adminProdId');
    const nameInput = document.getElementById('adminProdName');
    const catSelect = document.getElementById('adminProdCategory');
    const priceInput = document.getElementById('adminProdPrice');
    const descInput = document.getElementById('adminProdDesc');
    const ingInput = document.getElementById('adminProdIngredients');
    const imgInput = document.getElementById('adminProdImage');
    const hasAddonsCheckbox = document.getElementById('adminProdHasAddons');
    const featuredCheckbox = document.getElementById('adminProdFeatured');
    const availableCheckbox = document.getElementById('adminProdAvailable');

    const name = nameInput?.value.trim();
    const categoryId = catSelect?.value;
    const priceRaw = priceInput?.value;
    const price = parseFloat(priceRaw);

    if (!name) {
      if (window.showToast) window.showToast('Por favor, informe o nome do produto.');
      nameInput?.focus();
      return;
    }

    if (!categoryId) {
      if (window.showToast) window.showToast('Selecione uma categoria.');
      catSelect?.focus();
      return;
    }

    if (isNaN(price) || price < 0) {
      if (window.showToast) window.showToast('Informe um preço válido.');
      priceInput?.focus();
      return;
    }

    const description = descInput?.value.trim() || '';
    const ingredientsRaw = ingInput?.value.trim() || '';
    const ingredients = ingredientsRaw
      ? ingredientsRaw.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const imageUrl = imgInput?.value.trim() || null;
    const featured = !!featuredCheckbox?.checked;
    const available = !!availableCheckbox?.checked;
    const hasAddons = !!hasAddonsCheckbox?.checked;

    const existingId = idInput?.value.trim();
    let addonsConfig = [];
    let allowedAddons = [];
    const customAddonPrices = {};

    if (hasAddons && Array.isArray(this.currentEditingAddons)) {
      // Sincroniza qualquer input de preço ainda em foco
      const priceInputs = document.querySelectorAll('#adminAddonsList .admin-addon-price-input');
      priceInputs.forEach(inp => {
        const id = inp.dataset.id;
        const item = this.currentEditingAddons.find(a => a.id === id);
        if (item) item.price = Math.max(0, parseFloat(inp.value) || 0);
      });

      // Colete a lista de adicionais selecionados com seus nomes e preços editados no formulário
      const selectedAddons = this.currentEditingAddons.filter(a => a.selected);
      const baseCatalog = window.addonItems || window.menuData?.addonItems || {};

      // 1. Array padronizado para a coluna addons_config da tabela products do Supabase
      addonsConfig = selectedAddons.map(a => {
        const base = baseCatalog[a.id];
        const formattedName = (base && (!a.name || a.name === a.id)) ? base.name : (a.name || (base ? base.name : a.id));
        const rawP = Number(a.price);
        const finalPrice = (rawP > 0 || !base) ? rawP : Number(base.price);
        return {
          id: String(a.id),
          name: formattedName,
          price: finalPrice
        };
      });

      // 2. Mapeamento legado para compatibilidade com allowed_addons
      allowedAddons = selectedAddons.map(a => {
        customAddonPrices[a.id] = Number(a.price);
        const base = baseCatalog[a.id];
        if (base && Number(base.price).toFixed(2) === Number(a.price).toFixed(2)) {
          return a.id;
        }
        return JSON.stringify({
          id: a.id,
          name: a.name,
          price: Number(a.price)
        });
      });
    }

    const productData = {
      id: existingId || null,
      name,
      categoryId,
      price,
      description,
      ingredients,
      imageUrl,
      videoUrl: null,
      featured,
      available,
      addonsConfig,
      addons_config: addonsConfig,
      allowedAddons,
      customAddonPrices
    };

    await this.saveProduct(productData);
  },

  async saveProduct(productData) {
    if (!productData || !productData.name || !productData.categoryId || productData.price == null) {
      return false;
    }

    const products = window.menuData.products;
    const isEditing = !!productData.id && products.some(p => p.id === productData.id);
    let finalProduct = { ...productData };

    if (!finalProduct.id) {
      finalProduct.id = `${productData.categoryId}-${Date.now().toString(36)}`;
    }

    // 1. Sincroniza com Supabase se disponível
    if (typeof SupabaseService !== 'undefined') {
      try {
        if (isEditing) {
          const updated = await SupabaseService.updateProduct(finalProduct.id, finalProduct);
          if (updated) finalProduct = { ...finalProduct, ...updated };
        } else {
          const created = await SupabaseService.createProduct(finalProduct);
          if (created) finalProduct = { ...finalProduct, ...created };
        }
      } catch (err) {
        console.error('[Supabase] Erro ao sincronizar produto no banco:', err);
        if (window.showToast) window.showToast('⚠️ Salvo localmente (offline do banco)');
      }
    }

    // 2. Atualiza estado local
    if (isEditing) {
      const index = products.findIndex(p => p.id === finalProduct.id);
      if (index !== -1) {
        products[index] = { ...products[index], ...finalProduct };
      } else {
        products.unshift(finalProduct);
      }
    } else {
      products.unshift(finalProduct);
    }

    this.persistProducts();
    renderProducts();
    this.closeProductFormModal();

    if (window.showToast) {
      window.showToast(isEditing ? '✓ Produto atualizado com sucesso!' : '✓ Novo produto cadastrado no cardápio!');
    }
    return true;
  },

  confirmDelete(productId) {
    const product = window.menuData?.products.find(p => p.id === productId);
    if (!product) return;

    this.productIdToDelete = productId;
    const modal = document.getElementById('adminConfirmModal');
    const descEl = document.getElementById('adminConfirmDesc');

    if (descEl) {
      descEl.textContent = `Tem certeza que deseja remover "${product.name}" do cardápio?`;
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeConfirmModal() {
    this.productIdToDelete = null;
    const modal = document.getElementById('adminConfirmModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  async deleteProduct(productId) {
    if (!productId) return;

    // 1. Sincroniza com Supabase se disponível
    if (typeof SupabaseService !== 'undefined') {
      try {
        await SupabaseService.deleteProduct(productId);
      } catch (err) {
        console.error('[Supabase] Erro ao excluir produto no banco:', err);
      }
    }

    // 2. Remove do estado local
    window.menuData.products = window.menuData.products.filter(p => p.id !== productId);
    this.persistProducts();
    renderProducts();
    this.closeConfirmModal();

    if (window.showToast) {
      window.showToast('✓ Produto excluído do cardápio.');
    }
  },

  async toggleAvailability(productId) {
    const product = window.menuData?.products.find(p => p.id === productId);
    if (!product) return;

    const newStatus = product.available === false ? true : false;

    // 1. Sincroniza com Supabase se disponível
    if (typeof SupabaseService !== 'undefined') {
      try {
        await SupabaseService.toggleAvailability(productId, newStatus);
      } catch (err) {
        console.error('[Supabase] Erro ao alternar disponibilidade no banco:', err);
      }
    }

    // 2. Atualiza estado local e re-renderiza
    product.available = newStatus;
    this.persistProducts();
    renderProducts();

    if (window.showToast) {
      window.showToast(
        product.available
          ? `✓ "${product.name}" agora está Disponível!`
          : `⏸ "${product.name}" foi Pausado (Esgotado).`
      );
    }
  },

  /**
   * Sincronização em massa do catálogo base para o Supabase
   * Executa diretamente sem pop-up de confirmação
   */
  async syncBaseToSupabase() {
    const btnAdminSync = document.getElementById('btnAdminSyncSupabase');
    if (!btnAdminSync || btnAdminSync.disabled) return;

    try {
      const originalText = btnAdminSync.innerHTML;
      btnAdminSync.disabled = true;
      btnAdminSync.textContent = 'Sincronizando...';

      if (window.SupabaseService) {
        await window.SupabaseService.seedProducts(window.menuData.products);
      }
      Utils.showToast('✓ Base sincronizada com sucesso!');
      btnAdminSync.innerHTML = originalText;
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao sincronizar.');
      btnAdminSync.innerHTML = originalText;
    } finally {
      btnAdminSync.disabled = false;
    }
  },

  setupListeners() {
    // Botão de acesso ao ADM no header
    const btnOpenAuth = document.getElementById('btnOpenAdminAuth');
    if (btnOpenAuth) {
      btnOpenAuth.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal();
      });
    }

    // Fechar modal de login
    const btnCloseAuth = document.getElementById('btnCloseAdminAuth');
    if (btnCloseAuth) {
      btnCloseAuth.addEventListener('click', () => this.closeAuthModal());
    }

    // Formulário de Login ADM
    const authForm = document.getElementById('adminAuthForm');
    if (authForm) {
      authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwdInput = document.getElementById('adminAuthPassword');
        await this.login(pwdInput ? pwdInput.value : '');
      });
    }

    // Alternar visibilidade da senha
    const btnTogglePwd = document.getElementById('btnToggleAuthPwd');
    if (btnTogglePwd) {
      btnTogglePwd.addEventListener('click', () => {
        const pwdInput = document.getElementById('adminAuthPassword');
        if (!pwdInput) return;
        const isPassword = pwdInput.type === 'password';
        pwdInput.type = isPassword ? 'text' : 'password';
        btnTogglePwd.style.color = isPassword ? 'var(--brand-terracotta)' : 'var(--text-dim)';
      });
    }

    // Botões da Barra Superior
    const btnAdminSync = document.getElementById('btnAdminSyncSupabase');
    if (btnAdminSync) {
      btnAdminSync.addEventListener('click', async () => {
        try {
          const originalText = btnAdminSync.innerHTML;
          btnAdminSync.disabled = true;
          btnAdminSync.textContent = 'Sincronizando...';

          if (window.SupabaseService) {
            await window.SupabaseService.seedProducts(window.menuData.products);
          }
          Utils.showToast('✓ Base sincronizada com sucesso!');
          btnAdminSync.innerHTML = originalText;
        } catch (err) {
          console.error(err);
          Utils.showToast('Erro ao sincronizar.');
          btnAdminSync.innerHTML = originalText;
        } finally {
          btnAdminSync.disabled = false;
        }
      });
    }

    const btnNewProduct = document.getElementById('btnAdminNewProduct');
    if (btnNewProduct) {
      btnNewProduct.addEventListener('click', () => this.openNewModal());
    }

    const btnLogout = document.getElementById('btnAdminLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => this.logout());
    }

    // Botões do Modal de Criação / Edição
    const btnCloseForm = document.getElementById('btnCloseProductForm');
    if (btnCloseForm) {
      btnCloseForm.addEventListener('click', () => this.closeProductFormModal());
    }

    const btnCancelProduct = document.getElementById('btnAdminCancelProduct');
    if (btnCancelProduct) {
      btnCancelProduct.addEventListener('click', () => this.closeProductFormModal());
    }

    // Alternar visibilidade e estado do switch de Adicionais
    const hasAddonsSwitch = document.getElementById('adminProdHasAddons');
    if (hasAddonsSwitch) {
      hasAddonsSwitch.addEventListener('change', (e) => {
        const configSection = document.getElementById('adminAddonsConfigSection');
        if (configSection) {
          if (e.target.checked) {
            configSection.style.display = 'flex';
            if (!this.currentEditingAddons || this.currentEditingAddons.length === 0) {
              this.initAddonsConfig(null);
            }
          } else {
            configSection.style.display = 'none';
          }
        }
      });
    }

    // Ações rápidas de Adicionais (Marcar Todos / Desmarcar Todos)
    // Ações rápidas de Adicionais (Marcar Todos / Desmarcar Todos)
    const btnSelectAll = document.getElementById('btnAdminAddonsSelectAll');
    if (btnSelectAll) {
      btnSelectAll.addEventListener('click', () => {
        if (Array.isArray(this.currentEditingAddons)) {
          this.currentEditingAddons.forEach(a => { a.selected = true; });
          const listEl = document.getElementById('adminAddonsList');
          if (listEl) {
            listEl.querySelectorAll('.admin-addon-checkbox').forEach(cb => {
              cb.checked = true;
              const row = cb.closest('.admin-addon-item-row');
              if (row) {
                row.classList.add('is-active', 'is-selected');
                row.classList.remove('is-inactive');
              }
            });
          }
        }
      });
    }

    const btnDeselectAll = document.getElementById('btnAdminAddonsDeselectAll');
    if (btnDeselectAll) {
      btnDeselectAll.addEventListener('click', () => {
        if (Array.isArray(this.currentEditingAddons)) {
          this.currentEditingAddons.forEach(a => { a.selected = false; });
          const listEl = document.getElementById('adminAddonsList');
          if (listEl) {
            listEl.querySelectorAll('.admin-addon-checkbox').forEach(cb => {
              cb.checked = false;
              const row = cb.closest('.admin-addon-item-row');
              if (row) {
                row.classList.remove('is-active', 'is-selected');
                row.classList.add('is-inactive');
              }
            });
          }
        }
      });
    }

    // Delegação de eventos da lista de adicionais: atualiza apenas estado e classe sem recriar o DOM
    const addonsListEl = document.getElementById('adminAddonsList');
    if (addonsListEl) {
      addonsListEl.addEventListener('change', (e) => {
        const cb = e.target.closest('.admin-addon-checkbox');
        if (cb) {
          const id = cb.dataset.id;
          const item = this.currentEditingAddons.find(a => a.id === id);
          if (item) {
            item.selected = cb.checked;
            const row = cb.closest('.admin-addon-item-row');
            if (row) {
              row.classList.toggle('is-selected', item.selected);
              row.classList.toggle('is-active', item.selected);
              row.classList.toggle('is-inactive', !item.selected);
            }
          }
        }
      });

      addonsListEl.addEventListener('input', (e) => {
        const inp = e.target.closest('.admin-addon-price-input');
        if (inp) {
          const id = inp.dataset.id;
          const item = this.currentEditingAddons.find(a => a.id === id);
          if (item) {
            item.price = Math.max(0, parseFloat(inp.value) || 0);
          }
        }
      });

      addonsListEl.addEventListener('click', (e) => {
        const btnRemove = e.target.closest('.btn-remove-custom-addon');
        if (btnRemove) {
          const id = btnRemove.dataset.id;
          this.currentEditingAddons = this.currentEditingAddons.filter(a => a.id !== id);
          this.renderAddonsConfig();
        }
      });
    }

    // Adicionar Novo Adicional Customizado
    const btnAddCustom = document.getElementById('btnAdminAddCustomAddon');
    if (btnAddCustom) {
      btnAddCustom.addEventListener('click', () => {
        const nameInput = document.getElementById('adminNewAddonName');
        const priceInput = document.getElementById('adminNewAddonPrice');
        if (!nameInput) return;

        const name = nameInput.value.trim();
        if (!name) {
          if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('Informe o nome do novo adicional.');
          } else if (window.showToast) {
            window.showToast('Informe o nome do novo adicional.');
          }
          nameInput.focus();
          return;
        }

        const price = Math.max(0, parseFloat(priceInput?.value) || 0);
        const slug = 'custom-' + name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '-' + Date.now().toString(36).slice(-3);

        if (!Array.isArray(this.currentEditingAddons)) {
          this.currentEditingAddons = [];
        }

        this.currentEditingAddons.push({
          id: slug,
          name: name,
          price: price,
          selected: true,
          isCustom: true
        });

        nameInput.value = '';
        if (priceInput) priceInput.value = '';

        this.renderAddonsConfig();

        if (typeof Utils !== 'undefined' && Utils.showToast) {
          Utils.showToast(`✓ Adicional "${name}" incluído!`);
        } else if (window.showToast) {
          window.showToast(`✓ Adicional "${name}" incluído!`);
        }
      });
    }

    const productForm = document.getElementById('adminProductForm');
    if (productForm) {
      productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProductFromForm();
      });
    }

    // Modal de Confirmação de Exclusão
    const btnCancelDelete = document.getElementById('btnAdminCancelDelete');
    if (btnCancelDelete) {
      btnCancelDelete.addEventListener('click', () => this.closeConfirmModal());
    }

    const btnConfirmDelete = document.getElementById('btnAdminConfirmDelete');
    if (btnConfirmDelete) {
      btnConfirmDelete.addEventListener('click', () => {
        if (this.productIdToDelete) {
          this.deleteProduct(this.productIdToDelete);
        }
      });
    }

    // Fechar ao clicar no overlay de cada modal de ADM
    const modals = [
      { id: 'adminAuthModal', close: () => this.closeAuthModal() },
      { id: 'adminProductFormModal', close: () => this.closeProductFormModal() },
      { id: 'adminConfirmModal', close: () => this.closeConfirmModal() }
    ];

    modals.forEach(({ id, close }) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', (e) => {
          if (e.target === el) close();
        });
      }
    });

    // Fechar com tecla ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const authModal = document.getElementById('adminAuthModal');
        const formModal = document.getElementById('adminProductFormModal');
        const confirmModal = document.getElementById('adminConfirmModal');

        if (confirmModal && confirmModal.classList.contains('active')) {
          this.closeConfirmModal();
        } else if (formModal && formModal.classList.contains('active')) {
          this.closeProductFormModal();
        } else if (authModal && authModal.classList.contains('active')) {
          this.closeAuthModal();
        }
      }
    });
  }
};

// Expõe funções necessárias globalmente
window.openProductDetails = openProductDetails;
window.showToast = showToast;
window.Utils = Utils;
window.updateItemQuantity = updateItemQuantity;
window.removeItemFromCart = removeItemFromCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.AdminManager = AdminManager;
window.WifiManager = WifiManager;
