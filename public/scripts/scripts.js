async function updateCartCounter() {
  const cartCounter = document.getElementById("cart-size");
  const cartItems = await fetchCartItems();
  cartCounter.innerHTML = cartItems.cart.length;
}

async function fetchCartItems() {
  response = await fetch("/users/cart");
  return await response.json();
}

document
  .getElementsByClassName("newsletter-subscription-form")[0]
  .addEventListener("submit", async (event) => subscribe(event));

async function subscribe(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get("email");
}

async function addSubscriber(email) {
  await fetch("");
}
