async function removeBook(bookId) {
    fetch("/users/remove-book", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_id: bookId
      })
    })
    updateCartItems();
  }

  async function updateCartItems() {
    const cart = await fetchCartItems();

    if (!cart) return;

    const cartTable = document.getElementsByClassName("cart-table")[0];
    cartTable.innerHTML = "";

    const tableBody = document.createElement('tbody')
    cartTable.appendChild(tableBody);

    const headerRow = document.createElement('tr');
    tableBody.append(headerRow);

    const bookHeader = document.createElement('th');
    bookHeader.appendChild(document.createTextNode('Book'));
    headerRow.appendChild(bookHeader);

    const priceHeader = document.createElement('th');
    priceHeader.appendChild(document.createTextNode('Price'))
    headerRow.appendChild(priceHeader)

    const quantityHeader = document.createElement('th');
    quantityHeader.appendChild(document.createTextNode('Quantity'));
    headerRow.appendChild(quantityHeader);

    cart.cart.forEach(book => {
      const cartItemRow = document.createElement('tr');
      tableBody.append(cartItemRow);

      const bookTitle = document.createElement('td');
      const bookTitleLink = document.createElement('a');
      bookTitleLink.href = `/book/${book.book_id}`;
      bookTitleLink.appendChild(document.createTextNode(book.book_title));
      bookTitle.appendChild(bookTitleLink);
      cartItemRow.append(bookTitle);

      const bookPrice = document.createElement('td')
      bookPrice.appendChild(document.createTextNode("R" + book
        .book_price));
      cartItemRow.appendChild(bookPrice)

      const bookAmount = document.createElement('td')
      bookAmount.appendChild(document.createTextNode(+book.amount));
      cartItemRow.appendChild(bookAmount)

      const bookDelete = document.createElement('td')
      const bookDeleteButton = document.createElement('button')
      bookDeleteButton.onclick = () => removeBook(book.book_id)
      bookDeleteButton.appendChild(document.createTextNode("Remove"))
      bookDelete.appendChild(bookDeleteButton)
      cartItemRow.appendChild(bookDelete)
    });

    const cartTotalText = document.getElementsByClassName("cart-total")[0];
    const cartTotal = cart.cart.reduce((total, book) => total += parseFloat(
      book
      .book_price) * book.amount, 0);
    cartTotalText.innerHTML = "R" + cartTotal;
  }
