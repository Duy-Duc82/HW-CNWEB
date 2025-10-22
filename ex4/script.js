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

  // Helper: lấy mảng các phần tử sản phẩm
  function getProductItems() {
    return Array.prototype.slice.call(document.querySelectorAll('.product-item'));
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

      // Tạo cấu trúc article.card tương tự HTML hiện có
      var article = document.createElement('article');
      article.className = 'card product-item';

      // Figure + image + figcaption (sử dụng cùng class để CSS áp dụng)
      var figure = document.createElement('figure');
      figure.className = 'product-figure';

      var image = document.createElement('img');
      image.src = img || 'https://via.placeholder.com/400x240?text=No+Image';
      image.alt = name;
      figure.appendChild(image);

      var caption = document.createElement('figcaption');
      caption.className = 'product-name';
      caption.textContent = name;
      figure.appendChild(caption);

      article.appendChild(figure);

      // Mô tả
      var pDesc = document.createElement('p');
      pDesc.textContent = desc;
      article.appendChild(pDesc);

      // Giá
      var pPrice = document.createElement('p');
      pPrice.className = 'price';
      pPrice.textContent = price ? price : '';
      article.appendChild(pPrice);

      // Thêm aria-labelledby cho accessibility (dùng id duy nhất)
      var id = 'book-' + Date.now();
      caption.id = id;
      article.setAttribute('aria-labelledby', id);

      // Append vào productList
      productList.appendChild(article);

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
