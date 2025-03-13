export default class MyInterface {
  constructor(views, databaseHandler, api, mailer) {
    this.views = views;
    this.databaseHandler = databaseHandler;
    this.api = api;
    this.mailer = mailer;
  }

  async home(CATEGORIES) {
    const BOOKS = await this.databaseHandler.fetchAllBooks();
    this.views.home(BOOKS, CATEGORIES);
  }

  async addBook() {
    this.api.addBookRoute(this.fetchBooks);
  }

  async fetchBooks(author, title) {
    const URL = "https://openlibrary.org/search.json";
    const PARAMS = new URLSearchParams({
      author: author,
      title: title,
      limit: 5,
      fields: "title,author_name,cover_i, publish_year",
    }).toString();
    const BOOK_DATA = await fetch(`${URL}?${PARAMS}`);
    return await BOOK_DATA.json();
  }
}
