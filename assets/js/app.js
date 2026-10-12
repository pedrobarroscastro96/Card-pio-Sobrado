/**
 * O Sobrado — Burger & Bar
 * JavaScript Vanilla Leve, Rápido e Focado em Mobile UX
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const currentTable = getActiveTable();

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

  renderCategories();
  renderProducts();
  setupSearchFilter();
  setupScrollSpy();
  setupProductDrawer();
  initCart();
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
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  let html = '';

  sortedCategories.forEach(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.id && p.available !== false);

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
          ${categoryProducts.map(product => createProductCardHTML(product)).join('')}
        </div>
      </section>
    `;
  });

  menuContent.innerHTML = html;

  // Delegação de evento de clique para abrir detalhes
  menuContent.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;

    const productId = card.dataset.productId;
    openProductDetails(productId);
  });
}

/**
 * Gera o HTML individual do card de produto
 */
function createProductCardHTML(product) {
  const badgeHTML = product.badge
    ? `<span class="product-badge">${product.badge}</span>`
    : '';

  const fallbackHTML = getCategoryFallbackSVG(product.categoryId, false);

  return `
    <article 
      class="product-card" 
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
        <p class="product-card-desc">${product.description}</p>
        
        <div class="product-card-footer">
          <div class="product-price">
            <span class="product-price-currency">R$</span>${formatCurrency(product.price)}
          </div>
          <span class="btn-open-detail" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
        </div>
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
      if (!product) return;

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
  if (btnAddToCart) btnAddToCart.style.backgroundColor = '';
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
 * Atualiza o cálculo de adicionais selecionados e reflete no botão
 */
function onAddonCheckboxChange() {
  const product = window.menuData?.products.find(p => p.id === currentModalProductId);
  if (!product) return;

  const catalog = window.addonItems || window.menuData?.addonItems || {};
  const checkboxes = document.querySelectorAll('#drawerAddonsSection .addon-checkbox:checked');

  currentSelectedAddons = Array.from(checkboxes).map(cb => {
    const addonId = cb.value;
    return catalog[addonId] || {
      id: addonId,
      name: cb.dataset.name,
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
  const allowed = product.allowedAddons;

  if (!allowed || !Array.isArray(allowed) || allowed.length === 0) {
    addonsSection.style.display = 'none';
    addonsSection.innerHTML = '';
    return;
  }

  const items = allowed.map(id => catalog[id]).filter(Boolean);

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
 * 7. MODAL DE WI-FI & COPIAR SENHA
 * ---------------------------------------------------------------------
 */
function initWifiModal() {
  const wifiModal = document.getElementById('wifiModal');
  const btnOpenWifiList = document.querySelectorAll('.btn-trigger-wifi');
  const btnCloseWifi = document.getElementById('btnCloseWifi');
  const btnCopyWifi = document.getElementById('btnCopyWifiPassword');

  if (!wifiModal) return;

  const openWifi = () => {
    wifiModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeWifi = () => {
    wifiModal.classList.remove('active');
    document.body.style.overflow = '';
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
      const password = window.menuData?.restaurant?.wifi?.password || 'sobradoburger';

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
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="toast-icon">✓</span> <span>${message}</span>`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
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

// Expõe funções necessárias
window.openProductDetails = openProductDetails;
window.showToast = showToast;
window.updateItemQuantity = updateItemQuantity;
window.removeItemFromCart = removeItemFromCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
