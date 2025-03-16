console.log("Hello World");
const bookData = {
  numFound: 4,
  start: 0,
  numFoundExact: true,
  num_found: 4,
  documentation_url: "https://openlibrary.org/dev/docs/api/search",
  q: "",
  offset: null,
  docs: [
    {
      author_name: ["J. K. Rowling", "Jim Kay"],
      cover_i: 12059372,
      publish_year: [
        1993, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
        2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
        2023, 2024,
      ],
      title: "Harry Potter and the Goblet of Fire",
    },
    {
      author_name: ["SparkNotes Staff", "J. K. Rowling", "SparkNotes"],
      publish_year: [2014, 2007],
      title:
        "Harry Potter and the Goblet of Fire (SparkNotes Literature Guide)",
    },
    {
      author_name: ["J. K. Rowling"],
      publish_year: [2019],
      title: "Harry Potter and the Goblet of Fire (illustrated E",
    },
    {
      author_name: ["J. K. Rowling"],
      cover_i: 13290169,
      publish_year: [2021],
      title:
        "Harry Potter and the Half-Blood Prince / The Order Of The Pheonix / Chamber of Secrets / The Philosopher's Stone / The Goblet Of Fire /The Prisoner of Azkaban",
    },
  ],
};

document
  .getElementsByClassName("search-book-form")[0]
  .addEventListener("submit", async (event) => {
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
    generateAbstractButton.appendChild(document.createTextNode("Generate Abstract"));
    form.appendChild(generateAbstractButton);

    generateAbstractButton.addEventListener("click", async () => {
      const selectedBookData = JSON.parse(bookSelect.value)
      const author = selectedBookData.author_name[0];
      const title = selectedBookData.title;
      abstractTextArea.textContent = await generateAbstract(author, title);
    });
  });

function createBookSelect(bookData) {
  const bookSelect = document.createElement("select");
  bookSelect.name = "book";
  bookData.docs.forEach((book) => {
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
