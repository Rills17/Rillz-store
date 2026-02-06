let cart = JSON.parse(localStorage.getItem("cart")) || {};
let totalCount = 0;
let totalPrice = 0;

initCart();

function initCart(){
  totalCount = 0;
  totalPrice = 0;

  for(let id in cart){
    totalCount += cart[id].qty;
    totalPrice += cart[id].price * cart[id].qty;
  }

  updateCartUI();
}

function addCart(name, id, price, img){
  if(cart[id]){
    cart[id].qty++;
  }else{
    cart[id] = { name, price, qty: 1, img };
  }
  saveCart();
}

function increaseQty(id){
  cart[id].qty++;
  saveCart();
}

function decreaseQty(id){
  cart[id].qty--;
  if(cart[id].qty <= 0){
    delete cart[id];
  }
  saveCart();
}

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  initCart();
}

function updateCartUI(){
  const badge = document.getElementById("badge");
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  if(Object.keys(cart).length === 0){
    badge.style.display = "none";
    cartItems.innerHTML = "<p class='empty'>Keranjang masih kosong</p>";
    return;
  }

  badge.style.display = "inline-flex";
  badge.innerText = totalCount;

  for(let id in cart){
    let item = cart[id];
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-info">
          <strong>${item.name}</strong>
          <p>Rp ${item.price}</p>
          <div class="qty-control">
            <button onclick="decreaseQty('${id}')">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty('${id}')">+</button>
          </div>
        </div>
      </div>
    `;
  }

  cartItems.innerHTML += `
    <div class="cart-total">
      Total: <b>Rp ${totalPrice}</b>
    </div>
  `;
}

function toggleCart(){
  document.getElementById("cartPanel").classList.toggle("active");
}

function toggleTheme(){
  const current = document.body.dataset.theme;
  const next = current === "dark" ? "" : "dark";
  document.body.dataset.theme = next;
  localStorage.setItem("theme", next);
}

const savedTheme = localStorage.getItem("theme");
if(savedTheme){
  document.body.dataset.theme = savedTheme;
}

function scrollProduk(){
  document.getElementById("produk").scrollIntoView({ behavior: "smooth" });
}

function checkout(){
  window.open("https://forms.gle/WrTHErj4yqFcrLYu5","_blank");
}

/* SEARCH */
document.getElementById("searchInput").addEventListener("input", function(){
  let value = this.value.toLowerCase();
  document.querySelectorAll(".card").forEach(card=>{
    card.style.display = card.dataset.name.toLowerCase().includes(value)
      ? "block" : "none";
  });
});

/* SORT */
document.getElementById("sortPrice").addEventListener("change", function(){
  let list = document.getElementById("productList");
  let cards = Array.from(list.children);
  let dir = this.value;

  cards.sort((a,b)=>{
    let pa = +a.dataset.price;
    let pb = +b.dataset.price;
    return dir === "low" ? pa - pb : pb - pa;
  });

  cards.forEach(c => list.appendChild(c));
});