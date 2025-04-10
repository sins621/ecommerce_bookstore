document
  .getElementsByClassName("search-book-form")[0]
  .addEventListener("submit", async (event) => createBookForm(event));

async function createBookForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const author = formData.get("author");
  const title = formData.get("title");
  const response = await fetch(
    `/books/details?author=${author}&title=${title}`
  );
  const bookData = await response.json();

  const divForForm = document.getElementsByClassName("book-selector")[0];
  let form = divForForm.querySelector("form");

  if (!form) {
    form = document.createElement("form");
    divForForm.appendChild(form);
  } else {
    form.innerHTML = "";
  }

  const bookSelect = createBookSelect(bookData);
  form.appendChild(bookSelect);

  const abstractTextArea = createAbstractTextArea(bookData);
  form.appendChild(abstractTextArea);

  const generateAbstractButton = document.createElement("button");
  generateAbstractButton.type = "button";
  generateAbstractButton.appendChild(
    document.createTextNode("Generate Abstract")
  );
  form.appendChild(generateAbstractButton);

  generateAbstractButton.addEventListener("click", async () => {
    const selectedValue = bookSelect.value;
    const currentSelectedBookData = JSON.parse(selectedValue);
    const author = currentSelectedBookData.author_name[0];
    const title = currentSelectedBookData.title;
    abstractTextArea.textContent = await generateAbstract(author, title);
  });

  const quantityInput = document.createElement("input");
  quantityInput.name = "quantity";
  quantityInput.placeholder = "Quantity";
  quantityInput.type = "text";
  form.appendChild(quantityInput);

  const priceInput = document.createElement("input");
  priceInput.name = "price";
  priceInput.placeholder = "Price";
  priceInput.type = "text";
  form.appendChild(priceInput);

  const categories = await fetchCategories();
  const categorySelect = createCategorySelect(categories);
  form.appendChild(categorySelect);

  const submitBookButton = document.createElement("button");
  submitBookButton.type = "button";
  submitBookButton.appendChild(document.createTextNode("Submit"));
  form.appendChild(submitBookButton);

  submitBookButton.addEventListener("click", async () => {
    const selectedValue = bookSelect.value;
    const currentSelectedBookData = JSON.parse(selectedValue);
    await fetch("/books/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: currentSelectedBookData.title,
        author: currentSelectedBookData.author_name[0],
        category: categorySelect.value,
        publish_year: currentSelectedBookData.publish_year[0],
        abstract: abstractTextArea.value,
        cover_id: currentSelectedBookData.cover_i,
        quantity: quantityInput.value,
        price: priceInput.value,
        isbn: currentSelectedBookData.isbn,
      }),
    });
  });

  const bookImage = document.createElement("img");
  bookImage.height = 200;
  const selectedValue = bookSelect.value;
  const currentSelectedBookData = JSON.parse(selectedValue);
  bookImage.src = currentSelectedBookData.cover_i;
  bookSelect.addEventListener("change", () => {
    const selectedValue = bookSelect.value;
    const currentSelectedBookData = JSON.parse(selectedValue);
    bookImage.src = currentSelectedBookData.cover_i;
  });
  form.appendChild(bookImage);
}

function createBookSelect(bookData) {
  const bookSelect = document.createElement("select");
  bookSelect.name = "book";
  bookData.forEach((book) => {
    addBookOption(bookSelect, book);
  });
  return bookSelect;
}

function addBookOption(element, book) {
  const bookOption = document.createElement("option");
  bookOption.value = JSON.stringify(book);
  const bookText = document.createTextNode(
    `${book.title} ${
      book.publish_year &&
      Array.isArray(book.publish_year) &&
      book.publish_year.length > 0
        ? book.publish_year[0]
        : "N/A"
    }`
  );
  bookOption.appendChild(bookText);
  element.appendChild(bookOption);
}

function createAbstractTextArea(bookData) {
  const abstractTextArea = document.createElement("textarea");
  abstractTextArea.name = "abstract";
  abstractTextArea.placeholder =
    "Enter an Abstract for the Book or Generate with AI";
  abstractTextArea.className = "abstract-text-area";
  return abstractTextArea;
}

async function generateAbstract(author, title) {
  const response = await fetch(
    `/books/abstract?author=${author}&title=${title}`
  );
  return (await response.json()).abstract;
}

async function fetchCategories() {
  const response = await fetch("/books/categories");
  return await response.json();
}

function createCategorySelect(categories) {
  const categorySelect = document.createElement("select");
  categorySelect.name = "category";
  categories.forEach((category) => {
    addCategoryOption(categorySelect, category);
  });
  return categorySelect;
}

function addCategoryOption(element, category) {
  const categoryOption = document.createElement("option");
  categoryOption.value = category;
  categoryOption.appendChild(document.createTextNode(category));
  element.appendChild(categoryOption);
}
