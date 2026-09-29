import { categories, products, getProductById } from './data.js'
import { productGridHTML } from './components.js'
import { getCart, removeFromCart, updateQty, clearCart, cartTotals, addToCart } from './cart.js'

export function renderHome() {
  const featured = products.slice(0, 4)
  return `
    <section class="hero">
      <div class="container hero__inner">
        <h1>Everyday essentials, thoughtfully made.</h1>
        <p>A modular, fast, and fully responsive product catalog — built as a capstone project.</p>
        <a href="#/catalog" class="btn btn--lg">Browse the catalog</a>
      </div>
    </section>
    <section class="container section">
      <h2>Featured products</h2>
      ${productGridHTML(featured)}
    </section>
  `
}

// Catalog page keeps its own filter/search/sort state and re-renders
// just its grid — this is the "client-side interactivity" analog to
// the React ProductGrid component.
export function mountCatalog(root) {
  let category = 'All'
  let query = ''
  let sort = 'featured'

  root.innerHTML = `
    <div class="container section">
      <h1>Full Catalog</h1>
      <div class="toolbar">
        <input type="search" placeholder="Search products…" class="toolbar__search" aria-label="Search products" />
        <div class="toolbar__chips">
          ${categories
            .map(
              (c) =>
                `<button class="chip${c === category ? ' chip--active' : ''}" data-category="${c}">${c}</button>`,
            )
            .join('')}
        </div>
        <select class="toolbar__sort" aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <div id="catalog-grid"></div>
    </div>
  `

  const gridEl = root.querySelector('#catalog-grid')
  const searchEl = root.querySelector('.toolbar__search')
  const sortEl = root.querySelector('.toolbar__sort')
  const chipEls = [...root.querySelectorAll('.chip')]

  function renderGrid() {
    let list = products
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => p.title.toLowerCase().includes(q))
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    gridEl.innerHTML = productGridHTML(list)
  }

  searchEl.addEventListener('input', (e) => {
    query = e.target.value
    renderGrid()
  })
  sortEl.addEventListener('change', (e) => {
    sort = e.target.value
    renderGrid()
  })
  chipEls.forEach((chip) =>
    chip.addEventListener('click', () => {
      category = chip.dataset.category
      chipEls.forEach((c) => c.classList.toggle('chip--active', c === chip))
      renderGrid()
    }),
  )

  renderGrid()
}

export function renderProductDetail(params) {
  const product = getProductById(params.id)
  if (!product) {
    return `
      <div class="container section">
        <h1>Product not found</h1>
        <a href="#/catalog" class="btn">Back to catalog</a>
      </div>
    `
  }
  return `
    <div class="container section product-detail">
      <button class="link-back" data-back>← Back</button>
      <div class="product-detail__grid">
        <img
          src="${product.image}"
          alt="${product.title}"
          class="product-detail__image"
          loading="eager"
          decoding="async"
          width="600"
          height="600"
        />
        <div>
          <span class="card__category">${product.category}</span>
          <h1>${product.title}</h1>
          <p class="product-detail__price">$${product.price.toFixed(2)}</p>
          <p class="product-detail__desc">${product.description}</p>
          <div class="qty-row">
            <label for="qty">Qty</label>
            <input id="qty" type="number" min="1" value="1" />
          </div>
          <button class="btn btn--lg" data-add-to-cart="${product.id}" data-qty-input="qty">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  `
}

export function renderCart() {
  const items = getCart()
  const { price } = cartTotals()

  if (items.length === 0) {
    return `
      <div class="container section">
        <h1>Your cart is empty</h1>
        <a href="#/catalog" class="btn">Browse products</a>
      </div>
    `
  }

  return `
    <div class="container section">
      <h1>Your Cart</h1>
      <div class="cart-list">
        ${items
          .map(
            (item) => `
          <div class="cart-row">
            <img src="${item.image}" alt="${item.title}" loading="lazy" width="80" height="80" />
            <div class="cart-row__info">
              <a href="#/product/${item.id}">${item.title}</a>
              <span>$${item.price.toFixed(2)}</span>
            </div>
            <input type="number" min="1" value="${item.qty}" data-qty-for="${item.id}" />
            <button class="btn btn--sm btn--ghost" data-remove="${item.id}">Remove</button>
          </div>
        `,
          )
          .join('')}
      </div>
      <div class="cart-summary">
        <p>Total: <strong>$${price.toFixed(2)}</strong></p>
        <div class="cart-summary__actions">
          <button class="btn btn--ghost" data-clear-cart>Clear cart</button>
          <button class="btn btn--lg">Checkout</button>
        </div>
      </div>
    </div>
  `
}

export function renderAbout() {
  return `
    <div class="container section">
      <h1>About this project</h1>
      <p>
        This is a Web Development Capstone Project demonstrating a modular frontend
        architecture, client-side routing, and asset/performance optimization, built
        with vanilla HTML, CSS, and JavaScript, and deployed to Vercel.
      </p>
      <ul>
        <li>Modular JS files (data, cart, components, pages, router) for maintainability</li>
        <li>Client-side routing via the History API — no full page reloads</li>
        <li>Lazy-loaded images and a minified, cache-friendly static build</li>
        <li>Global cart state via a small pub/sub module backed by localStorage</li>
      </ul>
    </div>
  `
}

export function renderNotFound() {
  return `
    <div class="container section">
      <h1>404 — Page not found</h1>
      <a href="#/" class="btn">Go home</a>
    </div>
  `
}

// Attaches delegated listeners for actions rendered by the page functions
// above (add to cart, remove, qty change, clear cart, back button).
// Call once on #app after it's in the DOM.
export function bindAppEvents(root, { onCartUpdate } = {}) {
  root.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-to-cart]')
    if (addBtn) {
      const product = getProductById(addBtn.dataset.addToCart)
      const qtyInputId = addBtn.dataset.qtyInput
      const qty = qtyInputId ? Number(document.getElementById(qtyInputId).value) || 1 : 1
      addToCart(product, qty)
      onCartUpdate?.()
      return
    }
    const removeBtn = e.target.closest('[data-remove]')
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.remove)
      onCartUpdate?.()
      return
    }
    const clearBtn = e.target.closest('[data-clear-cart]')
    if (clearBtn) {
      clearCart()
      onCartUpdate?.()
      return
    }
    const backBtn = e.target.closest('[data-back]')
    if (backBtn) {
      history.back()
    }
  })

  root.addEventListener('change', (e) => {
    const qtyInput = e.target.closest('[data-qty-for]')
    if (qtyInput) {
      updateQty(qtyInput.dataset.qtyFor, Number(qtyInput.value))
      onCartUpdate?.()
    }
  })
}
