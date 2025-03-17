async function addBookToCart(bookId) {
  const response = await fetch("/users/cart/add-book", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_id: bookId,
    }),
  });
  if (response.ok) {
    updateCartCounter();
  }
}

async function updateCartCounter() {
  const cartCounter = document.getElementById("cart-size");
  const cartItems = await fetchCartItems();
  cartCounter.innerHTML = cartItems.cart.length;
}

async function fetchCartItems() {
    response = await fetch("/users/cart");
    return await response.json();
  }
  