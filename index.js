let allProducts = [];
let page = 1;
let perPage = 12;
let filterCategories = [];
const pageInfo = document.getElementById("page-info");
const category = document.querySelector(".categories");
const prev = document.querySelector("#prev-page");
const next = document.querySelector("#next-page");
const search = document.querySelector("#search");

search.addEventListener("keyup", () => {
  renderProducts();
  page = 1;
});

const korpa = document.querySelector("#cart-link");
korpa.addEventListener("drop", function (event) {
  drop(event);
});

korpa.addEventListener("dragover", function (event) {
  allowDrop(event);
});

function fetchProducts() {
  fetch("https://dummyjson.com/products?limit=100")
    .then((response) => response.json())
    .then((data) => {
      allProducts = data.products;
      renderProducts();
    });
}

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  const filteredProducts = allProducts.filter(filterProducts);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  filteredProducts.slice(start, end).forEach((product) => {
    const isFavorite = favorites.find((elem) => elem.id === product.id);

    productList.innerHTML += `
        <div class="product" draggable="true" ondragstart="drag(event, ${
          product.id
        })">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.price}</p>
            <button class="btnDodaj" onclick="addToCart(${
              product.id
            })">Dodaj u korpu</button>
            <button class="btnFavorit" onclick="addToFavorites(${
              product.id
            })" style="color: ${isFavorite ? "red" : "white"};">❤</button>
        </div>
        `;
  });
  pageInfo.textContent = `Strana ${page} od ${Math.ceil(
    filteredProducts.length / perPage
  )}`;

  if (page === 1) {
    prev.disabled = true;
    prev.style.opacity = 0.5;
  } else {
    prev.disabled = false;
    prev.style.opacity = 1;
  }

  if (page === Math.ceil(filteredProducts.length / perPage)) {
    next.disabled = true;
    next.style.opacity = 0.5;
  } else {
    next.disabled = false;
    next.style.opacity = 1;
  }

  listCategories();
}

function listCategories() {
  const categories = allProducts.map((product) => product.category);
  const uniqueCategories = [...new Set(categories)];
  category.innerHTML = "";
  uniqueCategories.forEach((cat) => {
    const buttonClass = filterCategories.includes(cat) ? "active" : "";
    category.innerHTML += `<button class="${buttonClass}" onclick="filterByCategory('${cat}')">${cat}</button>`;
  });
}

function filterByCategory(cat) {
  if (filterCategories.includes(cat)) {
    filterCategories = filterCategories.filter((c) => c !== cat);
  } else {
    filterCategories.push(cat);
  }
  renderProducts();
}

function filterProducts(product) {
  let filterCategory = true;
  let filterTitle = true;
  if (filterCategories.length > 0) {
    filterCategory = filterCategories.includes(product.category);
  }
  if (search.value) {
    filterTitle = product.title
      .toLowerCase()
      .includes(search.value.toLowerCase());
  }
  return filterCategory && filterTitle;
}

function changePage(change) {
  page += change;
  renderProducts();
}

function addToCart(id) {
  const product = allProducts.find((product) => product.id === id);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.find((elem) => elem.id === id);

  if (exists) {
    exists.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();

  alert("Proizvod je dodat u korpu");
}

function addToFavorites(id) {
  const product = allProducts.find((product) => product.id === id);

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const exists = favorites.find((elem) => elem.id === id);

  if (exists) {
    favorites = favorites.filter((elem) => elem.id !== id);
  } else {
    favorites.push(product);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoritesCount();
}

function updateCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector("#cart-count").textContent = totalItems;
}

function updateFavoritesCount() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  document.querySelector("#favorites-count").textContent = favorites.length;
  renderProducts();
}

function drag(event, id) {
  event.dataTransfer.setData("product", id);
}
function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  let id = e.dataTransfer.getData("product");
  addToCart(Number(id));
}

fetchProducts();
updateCount();
updateFavoritesCount();
