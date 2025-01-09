let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartList = document.getElementById("cart-items");
const cartDelete = document.querySelector("#obrisi");
const posaljiMejl = document.querySelector("#posaljiMejl");
const popust = document.querySelector("#popust");
const popustTekst = document.querySelector(".popustTekst");
const close = document.querySelector(".close");
const modal = document.querySelector(".modal");
let popustMnozitelj = 1;

close.addEventListener("click", zatvori);
popust.addEventListener("click", dodajPopust);
posaljiMejl.addEventListener("click", finalizeOrder);
cartDelete.addEventListener("click", obrisi);

function obrisi() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Nema proizvoda u korpi</p>";
    document.getElementById("total-price").textContent = 0;
  } else {
    cart.forEach((product) => {
      cartList.innerHTML += `<div class="cart-item">
        <img src="${product.thumbnail}" alt="${product.title}" class="imgCart">
          <h3>${product.title}</h3>
          <p>Cena: ${product.price}</p>
          <div>
          <button class="minus" onclick="decreaseQuantity(${product.id})">-</button>
          ${product.quantity}
          <button class="plus" onclick="increaseQuantity(${product.id})">+</button>
          </div>
          <button class="deleteItem" onclick="removeFromCart(${product.id})">Ukloni</button>
        </div>`;
    });
    document.getElementById("total-price").textContent = calculateTotalPrice();
  }
}

function calculateTotalPrice() {
  let totalPrice = 0;
  cart.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });
  return (totalPrice * popustMnozitelj).toFixed(2);
}

function removeFromCart(id) {
  cart = cart.filter((product) => product.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function increaseQuantity(id) {
  cart.find((product) => product.id === id).quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decreaseQuantity(id) {
  const product = cart.find((product) => product.id === id);
  if (product.quantity > 1) {
    product.quantity--;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}

function dodajPopust() {
  const popustVrednost = document.querySelector("#popustUnos").value;
  if (popustVrednost == 1111) {
    modal.style.display = "block";
    popustTekst.textContent = "Dobili ste popust";
    popustMnozitelj = 0.9;
    renderCart();
  } else {
    modal.style.display = "block";
    popustTekst.textContent = "Nije dobro unesen kod";
    popustMnozitelj = 1;
    renderCart();
  }
}
function zatvori() {
  modal.style.display = "none";
}
function finalizeOrder() {
  if (confirm("Da li ste sigurni da zavrsavate kupovinu")) {
    sendMail();
  }
}

function sendMail() {
  const total = calculateTotalPrice();

  const template = {
    to_email: "dacko.m@gmail.com",
    message: "Uspesna kupovina u iznosu od " + total + " dinara",
  };

  emailjs.send("service_ml3qw7r", "template_sp9bt3w", template).then(
    (response) => {
      alert("Poslat je mejl");
      obrisi();
    },
    (error) => {
      console.log("FAILED...", error);
    }
  );
}

renderCart();
