let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const favoritesList = document.getElementById("favorites-list");

function renderFavorites() {
  favoritesList.innerHTML = "";
  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>Nema omiljenih proizvoda</p>";
  } else {
    favorites.forEach((product) => {
      favoritesList.innerHTML += `
        <div class="cart-item">
          <img src="${product.thumbnail}" alt="${product.title}" class="imgCart">
          <h3>${product.title}</h3>
          <p>Cena: ${product.price}</p>
          <div>
          <button class="deleteItem" onclick="removeFromFavorites(${product.id})">Ukloni</button>
        </div>`;
    });
  }
}

renderFavorites();

function removeFromFavorites(id) {
  favorites = favorites.filter((product) => product.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}
