const STORAGE_KEY = 'catalogue.cart.v1'
const listeners = new Set()

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  listeners.forEach((fn) => fn(items))
}

let items = load()

export function onCartChange(fn) {
  listeners.add(fn)
  fn(items) // fire immediately with current state
  return () => listeners.delete(fn)
}

export function getCart() {
  return items
}

export function addToCart(product, qty = 1) {
  const existing = items.find((i) => i.id === product.id)
  if (existing) {
    items = items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
  } else {
    items = [...items, { ...product, qty }]
  }
  save(items)
}

export function removeFromCart(id) {
  items = items.filter((i) => i.id !== id)
  save(items)
}

export function updateQty(id, qty) {
  items = items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
  save(items)
}

export function clearCart() {
  items = []
  save(items)
}

export function cartTotals() {
  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const price = items.reduce((sum, i) => sum + i.qty * i.price, 0)
  return { count, price }
}
