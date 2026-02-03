document.addEventListener("DOMContentLoaded", async () => {
  const CATEGORY_MAP = {
  men: ["hoodie", "tshirt", "polo", "pants", "shorts", "underwear"],
  women: ["hoodie", "tshirt", "dress", "pants", "skirt", "activewear"]
};

  /* ---------------- CATEGORY NAV ---------------- */
  const categoryMenu = document.getElementById("categoryMenu");
  if (categoryMenu) {
    categoryMenu.innerHTML = "";
    Object.entries(CATEGORY_MAP).forEach(([gender, categories]) => {
      const group = document.createElement("div");
      group.className = "dropdown-group";

      const title = document.createElement("a");
      title.className = "dropdown-title";
      title.href = `collection.html?gender=${gender}`;
      title.textContent = gender;
      group.appendChild(title);

      const links = document.createElement("div");
      links.className = "dropdown-links";
      categories.forEach(cat => {
        const link = document.createElement("a");
        link.href = `collection.html?gender=${gender}&category=${cat}`;
        link.textContent = cat.replace("-", " ");
        links.appendChild(link);
      });
      group.appendChild(links);

      categoryMenu.appendChild(group);
    });
  }


  /* ---------------- YEAR ---------------- */
  document.querySelectorAll("#year, #year2")
    .forEach(e => e.textContent = new Date().getFullYear());

  /* ---------------- TRENDING (HOME) ---------------- */
  if (document.getElementById("menTrending")) {
    const res = await fetch("products.json");
    const products = await res.json();

    const menGrid = document.getElementById("menTrending");
    const womenGrid = document.getElementById("womenTrending");

    products
      .filter(p => p.trending)
      .forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <a href="product.html?slug=${p.slug}">
            <img src="${p.image}" alt="${p.name}">
            <div class="card-body">
              <h4>${p.name}</h4>
              <div class="price">${p.price}</div>
            </div>
          </a>
        `;
        if (p.gender === "men") menGrid.appendChild(card);
        if (p.gender === "women") womenGrid.appendChild(card);
      });
  }

  /* ---------------- COLLECTION PAGE ---------------- */

  /* ---------------- COLLECTION PAGE ---------------- */

if (document.getElementById("collectionGrid")) {
  const params = new URLSearchParams(window.location.search);
  const gender = params.get("gender");
  const category = params.get("category");

  const res = await fetch("products.json");
  const products = await res.json();

  // Title
  document.getElementById("collectionTitle").textContent =
    gender ? `${gender.toUpperCase()} COLLECTION` : "COLLECTION";

  /* ---------- SUBCATEGORY BAR ---------- */
  const bar = document.getElementById("subcategoryBar");
  bar.innerHTML = "";

  if (gender && CATEGORY_MAP[gender]) {
    CATEGORY_MAP[gender].forEach(cat => {
      const link = document.createElement("a");
      link.href = `collection.html?gender=${gender}&category=${cat}`;
      link.textContent = cat.replace("-", " ");
      if (cat === category) link.classList.add("active");
      bar.appendChild(link);
    });
  }

  /* ---------- PRODUCT GRID ---------- */
  const grid = document.getElementById("collectionGrid");
  grid.innerHTML = "";

  products
    .filter(p =>
      (!gender || p.gender === gender) &&
      (!category || p.category === category)
    )
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <a href="product.html?slug=${p.slug}">
          <img src="${p.image}" alt="${p.name}">
          <div class="card-body">
            <h4>${p.name}</h4>
            <div class="price">${p.price}</div>
          </div>
        </a>
      `;
      grid.appendChild(card);
    });
}


  /* ---------------- SNOW (HOME ONLY) ---------------- */
  const canvas = document.getElementById("snowCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let flakes = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      d: Math.random() + 1
    }));

    setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      flakes.forEach(f => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        f.y += f.d;
        if (f.y > canvas.height) f.y = -10;
      });
      ctx.fill();
    }, 33);
  }
});
