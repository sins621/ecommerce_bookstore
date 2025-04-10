const openLibraryService = {
  fetchBookDetails: async (author, title) => {
    const url = "https://openlibrary.org/search.json";
    const params = new URLSearchParams({
      author: author,
      title: title,
      fields: "title,author_name,cover_i, publish_year, isbn",
      limit: 5,
    }).toString();

    try {
      const bookQuery = await fetch(`${url}?${params}`);

      if (!bookQuery.ok) {
        console.error(`Open library returned status ${bookQuery.status}`);
        return [];
      }

      const bookData = await bookQuery.json();

      if (!("docs" in bookData))
        throw new Error("API call did not retrieve books.");

      bookData.docs = bookData.docs.filter((book) => {
        return "cover_i" in book;
      });

      bookData.docs = bookData.docs.map((book) => {
        book.cover_i = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        return book;
      })

      if (bookData.docs.length === 0) {
        console.error(
          `No books were found for query author: ${author} title: ${title}`
        );
        return [];
      }

      return await bookData.docs;
    } catch (err) {
      let errorMessage = `Failed to retrieve book data from ${url} error: ${err.message}`;
      if (err.cause && err.cause.code) {
        errorMessage += ` (Cause: ${err.cause.code})`;
      }
      console.error(errorMessage);
      return [];
    }
  },

};

export default openLibraryService;
