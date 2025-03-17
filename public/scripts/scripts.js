async function updateCartCounter() {
  const cartCounter = document.getElementById("cart-size");
  const cartItems = await fetchCartItems();
  cartCounter.innerHTML = cartItems.cart.length;
}

async function fetchCartItems() {
    response = await fetch("/users/cart");
    return await response.json();
  }
  