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
    let addBookSelectOptions = document.getElementsByClassName(
      "add-book-select-options"
    )[0];
    updateOptions(addBookSelectOptions, await response.json());
  });

function updateOptions(form, bookData) {
  form.innerHTML = `
  <select name="book">
    <option selected>Select the Correct Book</option>
    ${createSelectOptions(bookData)}
  </select>
  `;
}

function createSelectOptions(bookData) {
  let newHtml = ``;
  bookData.docs.forEach((book) => {
    let newOption = ``;
    newOption += `<option value="${JSON.stringify(book)}">\n`;
    newOption += `${book.title} ${
      book.publish_year &&
      Array.isArray(book.publish_year) &&
      book.publish_year.length > 0
        ? book.publish_year[0]
        : "N/A"
    }\n`;
    newOption += `</option>`;
    newHtml += newOption + `\n`;
  });
  return newHtml;
}
