/* main.js */
document.addEventListener("DOMContentLoaded", async () => {
  const yearEls = document.querySelectorAll("#year, #year2");
  yearEls.forEach(e => e.textContent = new Date().getFullYear());

  // Load product list on index.html
  if (document.getElementById("productGrid")) {
    const res = await fetch("products.json");
    const products = await res.json();
    const grid = document.getElementById("productGrid");
    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <a href="product.html?slug=${encodeURIComponent(p.slug)}" style="color:inherit;text-decoration:none">
          <img src="${p.image}" alt="${p.name}">
          <div class="card-body">
            <h4>${p.name}</h4>
            <div class="muted">${p.short}</div>
            <div class="price">${p.price}</div>
          </div>
        </a>`;
      grid.appendChild(card);
    });
  }

  // Product page: read slug from query string and show details
  if (document.getElementById("productName")) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    if (!slug) {
      document.getElementById("productName").textContent = "Product not found";
      return;
    }
    const res = await fetch("products.json");
    const products = await res.json();
    const product = products.find(p => p.slug === slug);
    if (!product) {
      document.getElementById("productName").textContent = "Product not found";
      return;
    }

    document.getElementById("productName").textContent = product.name;
    document.getElementById("productShort").textContent = product.short;
    document.getElementById("productPrice").textContent = product.price;
    document.getElementById("productImage").src = product.image;
    document.getElementById("productImage").alt = product.name;
    document.getElementById("metaTitle").textContent = `${product.name} — COLD DECEMBER`;
    document.getElementById("metaDesc").setAttribute("content", product.short);

    const cp = document.getElementById("colorPicker");
    product.colors.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.textContent = c;
      if (i === 0) btn.style.outline = "1px solid var(--accent)";
      btn.addEventListener("click", () => {
        // give simple selected style
        Array.from(cp.children).forEach(ch => ch.style.outline = "none");
        btn.style.outline = "1px solid var(--accent)";
      });
      cp.appendChild(btn);
    });

    const amazonBtn = document.getElementById("amazonBtn");
    amazonBtn.href = product.amazonLink || "#";
  }
});
