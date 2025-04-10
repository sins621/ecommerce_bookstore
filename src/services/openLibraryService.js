const openLibraryService = {
  fetchBookDetails: async (author, title) => {
    const url = "https://openlibrary.org/search.json";
    const params = new URLSearchParams({
      author: author,
      title: title,
      fields: "title,author_name,cover_i, publish_year, isbn",
      limit: 5,
    }).toString();
    const bookData = await fetch(`${url}?${params}`);
    return await bookData.json();
  },
};

export default openLibraryService;
