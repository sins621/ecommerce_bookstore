const openLibraryService = {
  fetchBookDetails: async (author, title) => {
    const URL = "https://openlibrary.org/search.json";
    const PARAMS = new URLSearchParams({
      author: author,
      title: title,
      limit: 5,
      fields: "title,author_name,cover_i, publish_year",
    }).toString();
    const BOOK_DATA = await fetch(`${URL}?${PARAMS}`);
    return await BOOK_DATA.json();
  },
};

export default openLibraryService;
