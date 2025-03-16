let bookData = {
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

console.log("Test");

let form = document.createElement("form");
let divForForm = document.getElementById("test-div");
divForForm.appendChild(form);
createBookSelect(form, bookData);

function createBookSelect(element, bookData) {
  let bookSelect = document.createElement("select");
  bookSelect.name = "book";
  addBookOption(bookSelect, bookData)
  element.appendChild(bookSelect);
}

function addBookOption(element, bookData) {
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

