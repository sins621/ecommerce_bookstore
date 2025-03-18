async function updateBookCollection(category) {
  const bookCollection = document.getElementsByClassName("book-collection")[0];
  bookCollection.className = "book-collection";
  bookCollection.innerHTML = "";

  let books = null;
  if (category) {
    books = await fetchBooksBy("category", category);
  } else {
    books = await fetchAllBooks();
  }

  const categories = await fetchBookCategories();

  categories.forEach((category) => {
    if (books.some((book) => book.category === category)) {
      const bookCollectionCategory = document.createElement("h2");
      bookCollectionCategory.className = "book-collection-category";    
      bookCollection.appendChild(bookCollectionCategory);

      const bookCollectionCategoryLink = document.createElement("a");
      bookCollectionCategory.appendChild(
        bookCollectionCategoryLink.appendChild(
          document.createTextNode(category)
        )
      );

      const bookCollectinGrid = document.createElement("div");
      bookCollectinGrid.className = "book-collection-grid";
      bookCollection.appendChild(bookCollectinGrid);

      books.forEach((book) => {
        if (book.category === category) {
          createBookItem(bookCollectinGrid, book);
        }
      });
    }
  });
}

async function fetchBooksBy(filter, value) {
  const response = await fetch(
    `/books/filter/?filter=${filter}&value=${value}`
  );
  return await response.json();
}

async function fetchAllBooks() {
  const response = await fetch(/books/);
  return await response.json();
}

async function fetchBookCategories() {
  const response = await fetch(`/books/categories`);
  return await response.json();
}

function createBookItem(element, book) {
  const bookCollectionItem = document.createElement("div");
  bookCollectionItem.className = "book-collection-item";
  element.appendChild(bookCollectionItem);

  const bookImageLink = document.createElement("a");
  const bookImage = document.createElement("img");
  bookImage.src = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
  bookImageLink.appendChild(bookImage);
  bookCollectionItem.appendChild(bookImageLink);

  const bookContent = document.createElement("div");
  bookContent.className = "book-content";
  bookCollectionItem.appendChild(bookContent);

  const bookTitleLink = document.createElement("a");
  const bookTitle = document.createElement("h3");
  bookTitle.appendChild(document.createTextNode(book.title));
  bookTitleLink.appendChild(bookTitle);
  bookContent.appendChild(bookTitleLink);

  const bookAuthorAndYear = document.createElement("h4");
  bookAuthorAndYear.appendChild(
    document.createTextNode(`${book.author} ${book.publish_year}`)
  );
  bookContent.appendChild(bookAuthorAndYear);

  const bookPrice = document.createElement("p");
  bookPrice.appendChild(document.createTextNode(book.price));
  bookContent.appendChild(bookPrice);
}
