// script.js - Tương tác cho trang sản phẩm
// Mục tiêu:
//  - Tìm kiếm / lọc sản phẩm theo tên (không phân biệt hoa thường)
//  - Toggle (ẩn/hiện) form "Thêm sản phẩm" bằng JS
//  - Thêm sản phẩm mới vào DOM khi submit form
// Tất cả thao tác sử dụng DOM API (querySelector, addEventListener, classList,...)

// Dùng DOMContentLoaded để đảm bảo DOM đã sẵn sàng trước khi truy xuất phần tử
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- Lấy các phần tử cần thiết từ DOM ---
  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var productList = document.getElementById('productList');
  var addProductBtn = document.getElementById('addProductBtn');
  var addProductForm = document.getElementById('addProductForm');

  // Nếu không có productList thì dừng (bảo vệ khi chạy trang khác)
  if (!productList) return;

  // Load products từ localStorage hoặc từ DOM hiện có
  loadProducts();
  // Render products lên DOM
  renderProducts();

  // Helper: lấy mảng các phần tử sản phẩm
  function getProductItems() {
    return Array.prototype.slice.call(document.querySelectorAll('.product-item'));
  }

  // --- localStorage: lưu / tải products ---
  // products: mảng các object { id, name, desc, price, img }
  var products = [];

  function saveProducts() {
    try {
      localStorage.setItem('products', JSON.stringify(products));
    } catch (e) {
      // localStorage có thể bị đầy hoặc không được phép
      console.warn('Không lưu được products vào localStorage', e);
    }
  }

  // Tạo DOM element cho một product object
  function createProductArticle(prod) {
    var article = document.createElement('article');
    article.className = 'card product-item';

    var figure = document.createElement('figure');
    figure.className = 'product-figure';

    var image = document.createElement('img');
    image.src = prod.img || 'https://via.placeholder.com/400x240?text=No+Image';
    image.alt = prod.name || '';
    figure.appendChild(image);

    var caption = document.createElement('figcaption');
    caption.className = 'product-name';
    caption.textContent = prod.name || '';
    figure.appendChild(caption);

    article.appendChild(figure);

    var pDesc = document.createElement('p');
    pDesc.textContent = prod.desc || '';
    article.appendChild(pDesc);

    var pPrice = document.createElement('p');
    pPrice.className = 'price';
    pPrice.textContent = prod.price ? (prod.price) : '';
    article.appendChild(pPrice);

    // Accessibility id
    var id = prod.id || ('book-' + Date.now());
    caption.id = id;
    article.setAttribute('aria-labelledby', id);

    return article;
  }

  // Render toàn bộ products array vào DOM (xóa cũ và thêm mới)
  function renderProducts() {
    // Xóa phần tử hiện có
    productList.innerHTML = '';
    products.forEach(function (p) {
      var art = createProductArticle(p);
      productList.appendChild(art);
    });
  }

  // Load products từ localStorage nếu có, ngược lại khởi tạo từ DOM hiện tại
  function loadProducts() {
    var raw = null;
    try {
      raw = localStorage.getItem('products');
    } catch (e) {
      console.warn('Không thể đọc localStorage', e);
    }
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          products = parsed;
          return;
        }
      } catch (e) {
        console.warn('Dữ liệu products không hợp lệ', e);
      }
    }

    // Nếu không có products trong localStorage, lấy các sản phẩm mẫu hiện có trên trang
    var initial = getProductItems();
    products = initial.map(function (item) {
      var nameEl = item.querySelector('.product-name');
      var name = nameEl ? (nameEl.textContent || '').trim() : '';
      var imgEl = item.querySelector('img');
      var img = imgEl ? imgEl.src : '';
      // find description (first <p> that is not .price)
      var pEls = Array.prototype.slice.call(item.querySelectorAll('p'));
      var desc = '';
      var price = '';
      pEls.forEach(function (p) {
        if (p.classList && p.classList.contains('price')) {
          price = p.textContent || '';
        } else if (!desc) {
          desc = p.textContent || '';
        }
      });
      return {
        id: item.getAttribute('aria-labelledby') || ('book-' + Date.now()),
        name: name,
        desc: desc,
        price: price,
        img: img
      };
    });
    // Lưu initial vào localStorage để lần sau load nhanh
    saveProducts();
  }


  // Helper: kiểm tra 1 product element có chứa keyword trong .product-name hay không
  function productMatches(productEl, keyword) {
    var nameEl = productEl.querySelector('.product-name');
    if (!nameEl) return false;
    var text = (nameEl.textContent || nameEl.innerText || '').toLowerCase();
    return text.indexOf((keyword || '').toLowerCase()) !== -1;
  }

  // Hàm lọc sản phẩm theo keyword (nếu keyword rỗng thì show tất cả)
  function filterProducts(keyword) {
    var items = getProductItems();
    var k = (keyword || '').trim().toLowerCase();
    items.forEach(function (item) {
      if (!k || productMatches(item, k)) {
        // Hiện phần tử (restore display mặc định)
        item.style.display = '';
      } else {
        // Ẩn phần tử
        item.style.display = 'none';
      }
    });
  }

  // --- Bắt sự kiện cho tìm kiếm ---
  if (searchBtn && searchInput) {
    // Click vào nút Tìm sẽ gọi filter
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      filterProducts(searchInput.value);
    });
  }

  if (searchInput) {
    // Lắng nghe keyup để lọc realtime khi người dùng gõ
    searchInput.addEventListener('keyup', function () {
      filterProducts(searchInput.value);
    });
  }

  // --- Toggle form Thêm sản phẩm ---
  if (addProductBtn && addProductForm) {
    addProductBtn.addEventListener('click', function (e) {
      e.preventDefault();
      // Toggle class 'hidden' (CSS .hidden { display: none; })
      addProductForm.classList.toggle('hidden');
      // Nếu mới hiện form, focus vào input tên
      if (!addProductForm.classList.contains('hidden')) {
        var first = addProductForm.querySelector('input, textarea');
        if (first) first.focus();
      }
    });
  }

  // --- Xử lý submit form Thêm sản phẩm ---
  if (addProductForm) {
    addProductForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Lấy dữ liệu từ form bằng DOM API
      var name = (addProductForm.querySelector('#p-name') || {}).value || '';
      var desc = (addProductForm.querySelector('#p-desc') || {}).value || '';
      var price = (addProductForm.querySelector('#p-price') || {}).value || '';
      var img = (addProductForm.querySelector('#p-img') || {}).value || '';

      // Kiểm tra dữ liệu tối thiểu: tên là bắt buộc
      if (!name.trim()) {
        alert('Vui lòng nhập tên sản phẩm.');
        return;
      }

      // Tạo object sản phẩm và thêm vào products array
      var prod = {
        id: 'book-' + Date.now(),
        name: name,
        desc: desc,
        price: price,
        img: img
      };

      // Thêm vào đầu mảng để render mới nhất ở trên (optional)
      products.unshift(prod);

      // Lưu vào localStorage và render lại giao diện
      saveProducts();
      renderProducts();

      // Reset form và ẩn lại
      addProductForm.reset();
      addProductForm.classList.add('hidden');

      // Nếu đang có bộ lọc, chạy lại để trạng thái hiển thị đúng
      if (searchInput && searchInput.value.trim()) {
        filterProducts(searchInput.value);
      }
    });
  }

  // Khi load trang, đảm bảo hiển thị đầy đủ (clear filter)
  filterProducts('');
});
