console.log("script-working");

document
  .getElementsByClassName("search-book-form")[0]
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(this);
    let author = formData.get("author");
    let title = formData.get("title");
    const response = fetch("/books/details");
    console.log(await response.json());
  });
