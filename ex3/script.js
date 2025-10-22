// script.js - add simple interactivity: search filter, toggle add-product form, and add new products

// Helpers to query elements
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = $("#searchInput");
  const searchBtn = $("#searchBtn");
  const addProductBtn = $("#addProductBtn");
  const addProductForm = $("#addProductForm");
  const productList = $("#productList");

  // Search/filter function
  function filterProducts() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const items = $$(".product-item");
    if (!q) {
      items.forEach((i) => (i.style.display = ""));
      return;
    }
    items.forEach((item) => {
      const nameEl = item.querySelector(".product-name");
      const name = nameEl ? nameEl.textContent.toLowerCase() : "";
      if (name.indexOf(q) !== -1) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Bind events for search: keyup and click
  if (searchInput) {
    searchInput.addEventListener("keyup", () => filterProducts());
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      filterProducts();
    });
  }

  // Toggle add-product form
  if (addProductBtn && addProductForm) {
    addProductBtn.addEventListener("click", () => {
      addProductForm.classList.toggle("hidden");
      // focus first input when shown
      if (!addProductForm.classList.contains("hidden")) {
        const first = addProductForm.querySelector("input, textarea");
        if (first) first.focus();
      }
    });
  }

  // Handle add product form submission
  if (addProductForm) {
    addProductForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById("p-name").value || "").trim();
      const desc = (document.getElementById("p-desc").value || "").trim();
      const price = (document.getElementById("p-price").value || "").trim();
      const img =
        (document.getElementById("p-img").value || "").trim() ||
        "https://via.placeholder.com/400x240?text=No+Image";

      if (!name || !desc || !price) {
        alert("Vui lòng điền tên, mô tả và giá.");
        return;
      }

      // Create article element
      const art = document.createElement("article");
      art.className = "card product-item";

      const imgEl = document.createElement("img");
      imgEl.src = img;
      imgEl.alt = name;

      const h3 = document.createElement("h3");
      h3.className = "product-name";
      h3.textContent = name;

      const pDesc = document.createElement("p");
      pDesc.textContent = desc;

      const pPrice = document.createElement("p");
      pPrice.className = "price";
      pPrice.textContent = price;

      art.appendChild(imgEl);
      art.appendChild(h3);
      art.appendChild(pDesc);
      art.appendChild(pPrice);

      productList.appendChild(art);

      // Clear form and hide
      addProductForm.reset();
      addProductForm.classList.add("hidden");

      // If a search is active, re-run filter so new item may be hidden/shown correctly
      filterProducts();
    });
  }
});
