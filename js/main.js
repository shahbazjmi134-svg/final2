import { initRouter, refresh } from './router.js'
import { bindAppEvents } from './pages.js'
import { onCartChange, cartTotals } from './cart.js'

const appEl = document.getElementById('app')
const cartBadge = document.getElementById('cart-badge')
document.getElementById('year').textContent = new Date().getFullYear()

function updateCartBadge() {
  const { count } = cartTotals()
  cartBadge.textContent = String(count)
  cartBadge.hidden = count === 0
}

function highlightActiveLink(path) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('nav-link--active', link.dataset.route === path)
  })
}

// Delegated listeners for add-to-cart / remove / qty / clear, defined once.
// After any cart mutation, re-render the current route (so e.g. the cart
// page reflects new totals) and refresh the badge.
bindAppEvents(appEl, {
  onCartUpdate: () => {
    updateCartBadge()
    refresh()
  },
})

onCartChange(updateCartBadge)

initRouter(appEl, { afterRender: highlightActiveLink })
