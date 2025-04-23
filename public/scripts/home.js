async function updateBookCollection(category) {
  const bookCollection = document.getElementsByClassName("book-collection")[0];
  bookCollection.className = "book-collection";

  let books = null;
  if (category) {
    books = await fetchBooksBy("category", category);
  } else {
    books = await fetchAllBooks();
  }

  const categories = await fetchBookCategories();

  bookCollection.innerHTML = "";

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

      const filteredBooks = books.filter((book) => {
        return book.category === category;
      });

      filteredBooks.forEach((book) => {
        createBookItem(bookCollectinGrid, book);
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
  bookImageLink.href = `/book/${book.id}`;
  const bookImage = document.createElement("img");
  bookImage.src = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
  bookImageLink.appendChild(bookImage);
  bookCollectionItem.appendChild(bookImageLink);

  const bookContent = document.createElement("div");
  bookContent.className = "book-content";
  bookCollectionItem.appendChild(bookContent);

  const bookTitleLink = document.createElement("a");
  bookTitleLink.href = `/book/${book.id}`;
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
  bookPrice.appendChild(document.createTextNode("R" + book.price));
  bookContent.appendChild(bookPrice);
}

let navOpen = false;

function toggleNav() {
  const side_nav = document.getElementById("side-nav");
  if (navOpen) {
    side_nav.style.width = "0";
    side_nav.classList.remove("side-nav--visible");
    navOpen = false;
  } else {
    side_nav.style.width = "250px";
    side_nav.classList.add("side-nav--visible");
    navOpen = true;
  }
}

let prevScrollpos = window.pageYOffset;

window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementsByClassName("header")[0].style.top = "0";
  } else {
    document.getElementsByClassName("header")[0].style.top = "-70px";
    if (navOpen) {
      toggleNav();
    }
  }
  prevScrollpos = currentScrollPos;
};

function toggleNested(id) {
  nested_elements = document.getElementById(id);
  if (nested_elements.classList.contains("side-nav-nested--visible")) {
    nested_elements.classList.remove("side-nav-nested--visible");
  } else {
    nested_elements.classList.add("side-nav-nested--visible");
  }
}
