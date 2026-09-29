import {
  renderHome,
  mountCatalog,
  renderProductDetail,
  renderCart,
  renderAbout,
  renderNotFound,
} from './pages.js'

// Each route is either:
//  - { render: (params) => htmlString }   → router sets innerHTML
//  - { mount: (rootEl, params) => void }   → route manages its own DOM/listeners
const routes = [
  { pattern: '/', render: renderHome },
  { pattern: '/catalog', mount: mountCatalog },
  { pattern: '/product/:id', render: renderProductDetail },
  { pattern: '/cart', render: renderCart },
  { pattern: '/about', render: renderAbout },
]

function matchRoute(path) {
  for (const route of routes) {
    const paramNames = []
    const regexStr =
      '^' +
      route.pattern
        .split('/')
        .map((seg) => {
          if (seg.startsWith(':')) {
            paramNames.push(seg.slice(1))
            return '([^/]+)'
          }
          return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        })
        .join('/') +
      '$'
    const match = path.match(new RegExp(regexStr))
    if (match) {
      const params = {}
      paramNames.forEach((name, i) => (params[name] = match[i + 1]))
      return { route, params }
    }
  }
  return null
}

// Reads the app path out of the URL hash, e.g. "#/product/p3" -> "/product/p3".
// Hash-based routing means the real request the server sees is always just
// the site's own index.html — nothing after the "#" is ever sent to the
// server — so this works unchanged whether the site is hosted at a domain
// root (Vercel) or a subpath like https://user.github.io/repo/ (GitHub Pages).
function currentPath() {
  const hash = window.location.hash.slice(1) // drop leading '#'
  return hash.startsWith('/') ? hash : '/'
}

let appEl
let onNavigate // optional callback fired after every render (e.g. to update nav highlighting)

export function initRouter(rootEl, { afterRender } = {}) {
  appEl = rootEl
  onNavigate = afterRender

  window.addEventListener('hashchange', () => render(currentPath()))

  // No hash yet (first visit, or a link to the bare site root) -> default to home
  if (!window.location.hash) {
    window.history.replaceState({}, '', window.location.pathname + window.location.search + '#/')
  }

  render(currentPath())
}

// Re-renders the current route without changing the URL — used after a
// cart mutation so e.g. the cart page reflects new totals immediately.
export function refresh() {
  render(currentPath())
}

export function navigate(path) {
  window.location.hash = path
  // If the hash is unchanged (e.g. navigating to "/" while already there),
  // 'hashchange' won't fire, so render explicitly.
  if (currentPath() === path) render(path)
}

function render(path) {
  const matched = matchRoute(path)
  if (!matched) {
    appEl.innerHTML = renderNotFound()
  } else if (matched.route.mount) {
    matched.route.mount(appEl, matched.params)
  } else {
    appEl.innerHTML = matched.route.render(matched.params)
  }
  window.scrollTo(0, 0)
  onNavigate?.(path)
}
