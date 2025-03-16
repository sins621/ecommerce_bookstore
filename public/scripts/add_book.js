console.log("script-working");

document
  .getElementsByClassName("search-book-form")[0]
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let author = formData.get("author");
    let title = formData.get("title");
    const response = await fetch(
      `/books/details?author=${author}&title=${title}`
    );
    let form = document.createElement("form");
    let divForForm = document.getElementsByClassName("book-selector")[0];
    divForForm.appendChild(form);
    addBookSelect(form, await response.json());
  });

function addBookSelect(element, bookData) {
  let bookSelect = document.createElement("select");
  bookSelect.name = "book";
  addBookOptions(bookSelect, bookData);
  element.appendChild(bookSelect);
}

function addBookOptions(element, bookData) {
  bookData.docs.forEach((book) => {
    let bookOption = document.createElement("option");
    bookOption.value = JSON.stringify(book);
    let bookText = document.createTextNode(
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
  });
}
