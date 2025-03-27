const openLibraryService = {
  fetchBookDetails: async (author, title) => {
    const url = "https://openlibrary.org/search.json";
    const params = new URLSearchParams({
      author: author,
      title: title,
      limit: 5,
      fields: "title,author_name,cover_i, publish_year",
    }).toString();
    const bookData = await fetch(`${url}?${params}`);
    return await bookData.json();
  },
};

export default openLibraryService;
