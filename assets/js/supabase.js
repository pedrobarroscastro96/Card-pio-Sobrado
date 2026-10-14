/**
 * O Sobrado — Burger & Bar
 * Módulo de Integração Direta com Supabase (REST API leve via fetch)
 * Sem dependências ou CDNs pesadas para máxima performance mobile
 */

const SUPABASE_URL = 'https://cnauphubkxhizhfahdzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuYXVwaHVia3hoaXpoZmFoZHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MTEwNTYsImV4cCI6MjEwNzQ4NzA1Nn0.93KmOPdgDoCnDaEqbWMKR3-3nkUgILA7d8kHxx5xta0';

const SupabaseService = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,

  getHeaders(prefer) {
    const headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json'
    };
    if (prefer) {
      headers['Prefer'] = prefer;
    }
    return headers;
  },

  /**
   * Converte produto do modelo da aplicação para a tabela do Supabase (snake_case)
   */
  toSupabase(product, index = 0) {
    // 1. Processa addons_config (Supabase JSONB)
    const catalog = (typeof window !== 'undefined' && window.addonItems) 
      ? window.addonItems 
      : ((typeof window !== 'undefined' && window.menuData?.addonItems) ? window.menuData.addonItems : {});

    let addonsConfig = [];
    if (Array.isArray(product.addonsConfig)) {
      addonsConfig = product.addonsConfig.map(a => {
        const base = catalog[a.id];
        const formattedName = (base && (!a.name || a.name === a.id)) ? base.name : (a.name || (base ? base.name : a.id));
        const rawPrice = typeof a.price === 'number' ? a.price : parseFloat(a.price || 0);
        const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
        return {
          id: String(a.id),
          name: formattedName,
          price: finalPrice
        };
      });
    } else if (Array.isArray(product.addons_config)) {
      addonsConfig = product.addons_config.map(a => {
        const base = catalog[a.id];
        const formattedName = (base && (!a.name || a.name === a.id)) ? base.name : (a.name || (base ? base.name : a.id));
        const rawPrice = typeof a.price === 'number' ? a.price : parseFloat(a.price || 0);
        const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
        return {
          id: String(a.id),
          name: formattedName,
          price: finalPrice
        };
      });
    } else if (Array.isArray(product.allowedAddons) && product.allowedAddons.length > 0) {
      const customPrices = product.customAddonPrices || {};
      addonsConfig = product.allowedAddons.map(item => {
        if (typeof item === 'object' && item !== null) {
          const base = catalog[item.id];
          const formattedName = (base && (!item.name || item.name === item.id)) ? base.name : (item.name || (base ? base.name : item.id));
          const rawPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
          const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
          return {
            id: String(item.id),
            name: formattedName,
            price: finalPrice
          };
        }
        if (typeof item === 'string') {
          if (item.startsWith('{')) {
            try {
              const p = JSON.parse(item);
              const base = catalog[p.id];
              const formattedName = (base && (!p.name || p.name === p.id)) ? base.name : (p.name || (base ? base.name : p.id));
              const rawPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);
              const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
              return { id: String(p.id), name: formattedName, price: finalPrice };
            } catch (e) {}
          }
          const base = catalog[item];
          const price = (customPrices[item] != null && Number(customPrices[item]) > 0) ? Number(customPrices[item]) : (base ? base.price : 0);
          return {
            id: item,
            name: base ? base.name : item,
            price: price
          };
        }
        return null;
      }).filter(Boolean);
    }

    // 2. Processa allowed_addons legado (text[])
    const rawAddons = Array.isArray(product.allowedAddons) 
      ? product.allowedAddons 
      : (Array.isArray(product.allowed_addons) ? product.allowed_addons : []);

    const stringAddons = rawAddons.map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.stringify({
          id: item.id,
          name: item.name,
          price: Number(item.price || 0)
        });
      }
      return String(item);
    });

    return {
      id: String(product.id),
      category_id: product.categoryId || product.category_id,
      name: product.name,
      description: product.description || null,
      price: Number(product.price) || 0,
      image_url: product.imageUrl || product.image_url || null,
      video_url: product.videoUrl || product.video_url || null,
      badge: product.badge || null,
      ingredients: Array.isArray(product.ingredients) ? product.ingredients : (product.ingredients ? [product.ingredients] : []),
      allowed_addons: stringAddons,
      addons_config: addonsConfig,
      featured: !!product.featured,
      available: product.available !== false,
      display_order: typeof product.displayOrder === 'number' ? product.displayOrder : (typeof product.display_order === 'number' ? product.display_order : index)
    };
  },

  /**
   * Converte linha do Supabase (snake_case) para o modelo da aplicação (camelCase)
   */
  fromSupabase(row) {
    const rawAddons = Array.isArray(row.allowed_addons) ? row.allowed_addons : (Array.isArray(row.allowedAddons) ? row.allowedAddons : []);
    
    // Mapeia addons_config (Supabase) <-> addonsConfig (aplicação)
    let addonsConfig = [];
    let rawAddonsConfig = row.addons_config;
    if (typeof rawAddonsConfig === 'string') {
      try {
        rawAddonsConfig = JSON.parse(rawAddonsConfig);
      } catch (e) {
        rawAddonsConfig = [];
      }
    }

    const catalog = (typeof window !== 'undefined' && window.addonItems) 
      ? window.addonItems 
      : ((typeof window !== 'undefined' && window.menuData?.addonItems) ? window.menuData.addonItems : {});

    if (Array.isArray(rawAddonsConfig) && rawAddonsConfig.length > 0) {
      addonsConfig = rawAddonsConfig.map(a => {
        const base = catalog[a.id];
        const formattedName = (base && (!a.name || a.name === a.id)) ? base.name : (a.name || (base ? base.name : a.id));
        const rawPrice = typeof a.price === 'number' ? a.price : parseFloat(a.price || 0);
        const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
        return {
          id: String(a.id),
          name: formattedName,
          price: finalPrice
        };
      });
    } else if (rawAddons.length > 0) {
      addonsConfig = rawAddons.map(item => {
        if (typeof item === 'string' && item.startsWith('{')) {
          try {
            const p = JSON.parse(item);
            const base = catalog[p.id];
            const formattedName = (base && (!p.name || p.name === p.id)) ? base.name : (p.name || (base ? base.name : p.id));
            const rawPrice = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);
            const finalPrice = (rawPrice > 0 || !base) ? rawPrice : Number(base.price);
            return { id: String(p.id), name: formattedName, price: finalPrice };
          } catch (e) {}
        }
        const base = catalog[item];
        return {
          id: item,
          name: base ? base.name : item,
          price: base ? base.price : 0
        };
      }).filter(Boolean);
    }

    const customAddonPrices = {};
    addonsConfig.forEach(a => {
      customAddonPrices[a.id] = a.price;
    });

    return {
      id: row.id,
      categoryId: row.category_id || row.categoryId,
      name: row.name,
      description: row.description || '',
      price: typeof row.price === 'number' ? row.price : parseFloat(row.price || 0),
      imageUrl: row.image_url || row.imageUrl || null,
      videoUrl: row.video_url || row.videoUrl || null,
      badge: row.badge || null,
      ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
      allowedAddons: rawAddons,
      addonsConfig: addonsConfig,
      customAddonPrices: customAddonPrices,
      featured: !!row.featured,
      available: row.available !== false,
      displayOrder: row.display_order != null ? row.display_order : 0
    };
  },

  /**
   * Busca produtos ordenados por display_order
   * GET /rest/v1/products?select=*&order=display_order.asc
   */
  async fetchProducts() {
    try {
      const response = await fetch(`${this.url}/rest/v1/products?select=*&order=display_order.asc`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Falha na API Supabase: ${response.status} ${response.statusText}`);
      }

      const rows = await response.json();
      if (!Array.isArray(rows)) return [];
      return rows.map(r => this.fromSupabase(r));
    } catch (err) {
      console.warn('[SupabaseService] Erro ao buscar produtos:', err);
      throw err;
    }
  },

  /**
   * Cria novo produto
   * POST /rest/v1/products
   */
  async createProduct(productData) {
    const payload = this.toSupabase(productData);
    const response = await fetch(`${this.url}/rest/v1/products`, {
      method: 'POST',
      headers: this.getHeaders('return=representation'),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar produto no Supabase (${response.status}): ${errorText}`);
    }

    const rows = await response.json();
    return rows && rows[0] ? this.fromSupabase(rows[0]) : productData;
  },

  /**
   * Atualiza produto existente
   * PATCH /rest/v1/products?id=eq.${productId}
   */
  async updateProduct(productId, productData) {
    const payload = this.toSupabase(productData);
    delete payload.id; // Chave primária não deve ser alterada

    const response = await fetch(`${this.url}/rest/v1/products?id=eq.${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      headers: this.getHeaders('return=representation'),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar produto no Supabase (${response.status}): ${errorText}`);
    }

    const rows = await response.json();
    return rows && rows[0] ? this.fromSupabase(rows[0]) : productData;
  },

  /**
   * Alterna disponibilidade de um produto
   * PATCH /rest/v1/products?id=eq.${productId}
   */
  async toggleAvailability(productId, available) {
    const response = await fetch(`${this.url}/rest/v1/products?id=eq.${encodeURIComponent(productId)}`, {
      method: 'PATCH',
      headers: this.getHeaders('return=representation'),
      body: JSON.stringify({ available: !!available })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao alterar disponibilidade (${response.status}): ${errorText}`);
    }

    const rows = await response.json();
    return rows && rows[0] ? this.fromSupabase(rows[0]) : { id: productId, available };
  },

  /**
   * Remove produto
   * DELETE /rest/v1/products?id=eq.${productId}
   */
  async deleteProduct(productId) {
    const response = await fetch(`${this.url}/rest/v1/products?id=eq.${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao excluir produto no Supabase (${response.status}): ${errorText}`);
    }

    return true;
  },

  /**
   * Carga inicial (Seed) de múltiplos produtos em lote
   * POST /rest/v1/products com upsert
   */
  async seedProducts(productsList) {
    if (!Array.isArray(productsList) || productsList.length === 0) return [];

    const payloads = productsList.map((p, index) => this.toSupabase(p, index + 1));

    const response = await fetch(`${this.url}/rest/v1/products`, {
      method: 'POST',
      headers: this.getHeaders('resolution=merge-duplicates,return=representation'),
      body: JSON.stringify(payloads)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao sincronizar carga de produtos (${response.status}): ${errorText}`);
    }

    const rows = await response.json();
    return rows.map(r => this.fromSupabase(r));
  },

  /**
   * Validação de senha de administrador via RPC do Supabase
   * POST /rest/v1/rpc/verify_admin_password
   */
  async verifyAdminPassword(password) {
    const response = await fetch(`${this.url}/rest/v1/rpc/verify_admin_password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ input_password: password })
    });
    if (!response.ok) {
      throw new Error('Falha ao validar credenciais no servidor.');
    }
    return await response.json(); // Retorna true ou false
  },

  /**
   * Busca configurações de Wi-Fi no Supabase (app_settings)
   * GET /rest/v1/app_settings?key=eq.wifi_config
   */
  async fetchWifiConfig() {
    try {
      const response = await fetch(`${this.url}/rest/v1/app_settings?key=eq.wifi_config&select=key,value`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) return null;

      const rows = await response.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].value) {
        const val = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
        return val;
      }
    } catch (err) {
      console.warn('[SupabaseService] Erro ao buscar wifi_config:', err);
    }
    return null;
  },

  /**
   * Salva configurações de Wi-Fi no Supabase (app_settings)
   * POST /rest/v1/app_settings com merge-duplicates
   */
  async saveWifiConfig(config) {
    try {
      const payload = {
        key: 'wifi_config',
        value: config
      };

      const response = await fetch(`${this.url}/rest/v1/app_settings`, {
        method: 'POST',
        headers: this.getHeaders('resolution=merge-duplicates,return=representation'),
        body: JSON.stringify([payload])
      });

      if (response.ok) {
        const rows = await response.json();
        return rows && rows[0] ? rows[0].value : config;
      }
    } catch (err) {
      console.warn('[SupabaseService] Erro ao salvar wifi_config no Supabase:', err);
    }
    return false;
  }
};

// Exportação universal (Browser e Node)
if (typeof window !== 'undefined') {
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  window.SupabaseService = SupabaseService;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SupabaseService
  };
}
