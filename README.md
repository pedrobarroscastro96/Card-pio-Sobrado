# O Sobrado — Cardápio Digital & Hub NFC 🍔🍺

Projeto frontend de alta performance, mobile-first e com identidade visual gastronômica para a hamburgueria artesanal **O Sobrado** (@osobradoo).

Desenvolvido para ser acessado instantaneamente via placas **NFC e QR Code** nas mesas do salão, sem dependência de frameworks pesados, rotas de API ou banco de dados.

---

## 🚀 Destaques da Experiência

1. **Hub NFC de Mesa (`index.html`)**:
   - Identificação automática da mesa via parâmetro de URL (ex: `?mesa=05`).
   - Selo visual de mesa conectada com status ativo pulsante.
   - **Ação Principal**: Acesso direto ao Cardápio Digital com preservação da mesa.
   - **Instagram Oficial**: Link direto para [@osobradoo](https://www.instagram.com/osobradoo).
   - **Wi-Fi da Casa**: Modal interativo com nome da rede e botão de 1-toque "Copiar Senha" com toast de confirmação.

2. **Cardápio Digital Gastronômico (`cardapio.html`)**:
   - **Header Compacto Sticky**: Identidade do Sobrado, selo da mesa ativa e atalho para o Wi-Fi.
   - **Navegação por Categorias Horizontal**: Barra fixa com rolagem suave e *ScrollSpy* automático que destaca a categoria em foco.
   - **Busca em Tempo Real**: Filtro instantâneo por nome do burger, porção, bebida ou ingrediente específico.
   - **Bottom Drawer / Modal de Detalhes**:
     - Suporte nativo a **Vídeo curto** (`<video autoplay muted loop playsinline>`) ou **Foto em alta resolução** no topo.
     - Gestão inteligente de ciclo de vida: pausa e descarrega o vídeo ao fechar o modal para economizar bateria e memória do cliente.
     - Tags elegantes de ingredientes artesanais.
     - Fallbacks limpos caso a imagem não exista.

3. **Performance & Design System**:
   - 100% HTML5 semântico, CSS3 moderno e Vanilla JavaScript.
   - Paleta gastronômica sofisticada: tons de carvão escuro, madeira aconchegante, toques de âmbar/brasa e dourado suave.
   - Alvos de toque com no mínimo 44x44px (*touch-friendly*).
   - Imagens otimizadas com dimensões explícitas e `loading="lazy"` para evitar Cumulative Layout Shift (CLS).
   - Meta tags Open Graph completas para pré-visualização no WhatsApp.

---

## 📁 Estrutura do Projeto

```text
Cardapio-Sobrado/
│
├── index.html                    # Hub NFC de entrada (Linktree da mesa)
├── cardapio.html                 # Cardápio digital interativo
├── README.md                     # Documentação de uso e manutenção
│
└── assets/
    ├── css/
    │   └── styles.css            # Design System, variáveis de tema e componentes
    ├── js/
    │   ├── products.js           # Base de dados desacoplada do cardápio
    │   └── app.js                # Lógica de URL params, busca, modais e scrollspy
    ├── images/
    │   ├── logo.jpg              # Emblema oficial O Sobrado Burger & Beer
    │   ├── sobrado-facade.jpg    # Foto da fachada acolhedora para o Hub
    │   └── products/             # Imagens em alta resolução dos itens
    │       ├── burger-sobrado.jpg
    │       ├── smash-duplo.jpg
    │       ├── batatas-rusticas.jpg
    │       ├── croquete-costela.jpg
    │       ├── chopp-artesanal.jpg
    │       └── brownie-artesanal.jpg
    └── videos/
        └── products/             # Pasta reservada para vídeos curtos dos produtos (.mp4 / .webm)
```

---

## ⚙️ Como Testar Localmente

Por ser uma aplicação 100% estática, você pode:

1. **Abrir diretamente**: Basta dar um duplo clique em `index.html` ou `cardapio.html` no seu navegador.
2. **Servidor Local (Recomendado para simular celular)**:
   ```bash
   python -m http.server 8000
   ```
   Em seguida, acesse no navegador:
   - Hub com mesa: `http://localhost:8000/index.html?mesa=05`
   - Cardápio direto: `http://localhost:8000/cardapio.html?mesa=05`

---

## 📝 Como Adicionar ou Modificar Produtos

Todos os itens do cardápio estão centralizados no arquivo `assets/js/products.js`. Para adicionar um novo produto ou alterar um preço, basta editar o objeto `menuData`:

```javascript
{
  id: "burger-novo",
  categoryId: "hamburgueres", // 'hamburgueres', 'porcoes', 'bebidas' ou 'sobremesas'
  name: "Nome do Burger Artesanal",
  badge: "Novidade", // Opcional (ou null)
  description: "Descrição detalhada dos ingredientes artesanais.",
  ingredients: ["Pão brioche", "Blend 180g", "Queijo derretido"],
  price: 39.90,
  imageUrl: "assets/images/products/novo-burger.jpg",
  videoUrl: "assets/videos/products/novo-burger.mp4", // Opcional (se null, usa a imagem)
  featured: true,
  available: true
}
```
