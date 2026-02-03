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

  /* ---------------- HERO SLIDER ---------------- */
  const hero = document.querySelector(".hero");
  const heroSlides = document.querySelector(".hero-slides");
  const heroDots = document.querySelector(".hero-dots");
  if (hero && heroSlides) {
    const images = (hero.dataset.heroImages || "")
      .split(",")
      .map(src => src.trim())
      .filter(Boolean);

    if (images.length) {
      heroSlides.innerHTML = "";
      if (heroDots) heroDots.innerHTML = "";
      images.forEach((src, index) => {
        const slide = document.createElement("div");
        slide.className = "hero-slide" + (index === 0 ? " is-active" : "");
        slide.style.backgroundImage = `url('${src}')`;
        heroSlides.appendChild(slide);

        if (heroDots) {
          const dot = document.createElement("button");
          dot.className = "hero-dot" + (index === 0 ? " is-active" : "");
          dot.type = "button";
          dot.setAttribute("role", "tab");
          dot.setAttribute("aria-label", `Show slide ${index + 1}`);
          dot.addEventListener("click", () => {
            setActiveSlide(index);
            restartInterval();
          });
          heroDots.appendChild(dot);
        }
      });

      let activeIndex = 0;
      const setActiveSlide = (index) => {
        const slides = heroSlides.querySelectorAll(".hero-slide");
        const dots = heroDots ? heroDots.querySelectorAll(".hero-dot") : [];
        slides[activeIndex].classList.remove("is-active");
        if (dots[activeIndex]) dots[activeIndex].classList.remove("is-active");
        activeIndex = index;
        slides[activeIndex].classList.add("is-active");
        if (dots[activeIndex]) dots[activeIndex].classList.add("is-active");
      };

      let intervalId = null;
      const startInterval = () => {
        intervalId = setInterval(() => {
          const slides = heroSlides.querySelectorAll(".hero-slide");
          const nextIndex = (activeIndex + 1) % slides.length;
          setActiveSlide(nextIndex);
        }, 4500);
      };
      const restartInterval = () => {
        if (intervalId) clearInterval(intervalId);
        startInterval();
      };

      startInterval();
    }
  }

  /* ---------------- TRENDING (HOME) ---------------- */
  if (document.getElementById("trendingGrid")) {
    const res = await fetch("products.json");
    const products = await res.json();

    const trendingGrid = document.getElementById("trendingGrid");

    const menTrendingItems = products
      .filter(p => p.trending && p.gender === "men")
      .slice(0, 2);
    const womenTrendingItems = products
      .filter(p => p.trending && p.gender === "women")
      .slice(0, 2);

    const renderTrending = (items, grid) => {
      grid.innerHTML = "";
      items.forEach(p => {
        const rating = typeof p.rating === "number" ? p.rating : 4.7;
        const reviews = typeof p.reviews === "number" ? p.reviews : 32;
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        const starText = "★".repeat(fullStars) + (hasHalf ? "½" : "");

        const card = document.createElement("div");
        card.className = "card trending-card";
        card.innerHTML = `
          <a href="product.html?slug=${p.slug}">
            <img src="${p.image}" alt="${p.name}">
            <div class="card-body">
              <h4>${p.name}</h4>
              <div class="rating">
                <span class="stars">${starText}</span>
                <span class="reviews">${reviews} Reviews</span>
              </div>
              <div class="price">${p.price}</div>
            </div>
          </a>
        `;
        grid.appendChild(card);
      });
    };

    renderTrending([...menTrendingItems, ...womenTrendingItems], trendingGrid);
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
      card.className = "card collection-card";
      card.innerHTML = `
        <a class="collection-link" href="product.html?slug=${p.slug}">
          <div class="collection-media">
            <img src="${p.image}" alt="${p.name}">
            <div class="collection-badges">
              <span>${p.gender}</span>
              <span>${p.category}</span>
            </div>
          </div>
          <div class="collection-info">
            <h4>${p.name}</h4>
            <div class="price">${p.price}</div>
          </div>
        </a>
      `;
      grid.appendChild(card);
    });
}

  /* ---------------- PRODUCT PAGE ---------------- */
  const productPage = document.getElementById("productPage");
  if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("slug");

    const res = await fetch("products.json");
    const products = await res.json();

    const matchSlug = (value) =>
      value && value.toString().toLowerCase() === (slugParam || "").toLowerCase();

    const product =
      products.find(p => matchSlug(p.slug)) ||
      products.find(p => matchSlug(p.name));

    if (!product) {
      productPage.innerHTML = `<p>Product not found.</p>`;
    } else {
      const rating = typeof product.rating === "number" ? product.rating : 4.7;
      const reviews = typeof product.reviews === "number" ? product.reviews : 32;
      const fullStars = Math.floor(rating);
      const hasHalf = rating - fullStars >= 0.5;
      const starText = "★".repeat(fullStars) + (hasHalf ? "½" : "");
      const sizes = Array.isArray(product.sizes) && product.sizes.length
        ? product.sizes
        : ["S", "M", "L", "XL"];
      const colors = Array.isArray(product.colors) ? product.colors : [];
      const images = Array.isArray(product.images) && product.images.length
        ? product.images
        : [product.image];

      productPage.innerHTML = `
        <div class="product-layout">
          <div class="product-image">
            <img id="productMainImage" src="${images[0]}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h1>${product.name}</h1>
            <div class="product-rating">
              <span class="stars">${starText}</span>
              <span class="reviews">${reviews} Reviews</span>
            </div>
            <div class="product-price">${product.price}</div>
            <p class="product-description">
              Built for everyday cold-weather comfort, this piece blends a soft
              hand feel with a structured drape and easy layering profile. Clean
              lines, dependable warmth, and a refined finish make it a staple
              you can reach for all season.
            </p>

            <div class="product-section">
              <div class="label">Colors</div>
              <div class="color-list">
                ${colors.map(c => `<span class="color-chip">${c}</span>`).join("")}
              </div>
            </div>

            <div class="product-section">
              <div class="label">Sizes</div>
              <div class="size-list">
                ${sizes.map(s => `<span class="size-chip">${s}</span>`).join("")}
              </div>
            </div>

            <a class="buy-button" href="${product.amazonLink || "#"}" target="_blank" rel="noopener">
              Buy on Amazon
            </a>

            <div class="size-chart">
              <div class="label">Size Chart</div>
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest</th>
                    <th>Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>S</td><td>36–38 in</td><td>26–27 in</td></tr>
                  <tr><td>M</td><td>38–40 in</td><td>27–28 in</td></tr>
                  <tr><td>L</td><td>40–42 in</td><td>28–29 in</td></tr>
                  <tr><td>XL</td><td>42–44 in</td><td>29–30 in</td></tr>
                </tbody>
              </table>
            </div>

            <div class="top-review">
              <div class="label">Top Review</div>
              <p>
                “The fabric feels premium and the fit is clean without being
                boxy. Warm enough for chilly evenings, and the stitching is
                solid after multiple wears.”
              </p>
              <span>— Verified Buyer</span>
            </div>
          </div>
        </div>
      `;

      const mainImage = productPage.querySelector("#productMainImage");
      const thumbs = productPage.querySelectorAll(".product-thumbs .thumb");
      if (mainImage && thumbs.length) {
        thumbs.forEach(btn => {
          btn.addEventListener("click", () => {
            thumbs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            mainImage.src = btn.dataset.src;
          });
        });
      }
    }
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
