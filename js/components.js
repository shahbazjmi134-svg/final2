export function starRatingHTML(value = 0) {
  const full = Math.round(value)
  let stars = ''
  for (let i = 0; i < 5; i++) {
    stars += `<span class="star${i < full ? ' star--filled' : ''}">★</span>`
  }
  return `<span class="stars" aria-label="Rated ${value} out of 5">${stars}<span class="stars__value">${value.toFixed(
    1,
  )}</span></span>`
}

export function productCardHTML(product) {
  return `
    <article class="card">
      <a href="#/product/${product.id}" class="card__image-link">
        <img
          src="${product.image}"
          alt="${product.title}"
          loading="lazy"
          decoding="async"
          width="600"
          height="600"
          class="card__image"
        />
      </a>
      <div class="card__body">
        <span class="card__category">${product.category}</span>
        <a href="#/product/${product.id}" class="card__title">${product.title}</a>
        ${starRatingHTML(product.rating)}
        <div class="card__footer">
          <span class="card__price">$${product.price.toFixed(2)}</span>
          <button class="btn btn--sm" data-add-to-cart="${product.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `
}

export function productGridHTML(list) {
  if (list.length === 0) {
    return `<p class="empty-state">No products match your search.</p>`
  }
  return `<div class="grid">${list.map(productCardHTML).join('')}</div>`
}
