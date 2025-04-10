import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import openLibraryService from "../services/openLibraryService";

describe("fetchBookDetails", () => {
  global.fetch = vi.fn(); // Mock the global fetch function

  it("should successfully fetch book details and return an array of books", async () => {
    const mockResponseData = {
      docs: [
        {
          title: "The Hitchhiker's Guide to the Galaxy",
          author_name: ["Douglas Adams"],
          cover_i: 12345,
          publish_year: [1979],
          isbn: ["9780345391803"],
        },
        {
          title: "The Restaurant at the End of the Universe",
          author_name: ["Douglas Adams"],
          cover_i: 67890,
          publish_year: [1980],
          isbn: ["9780345391810"],
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const books = await openLibraryService.fetchBookDetails(
      "Douglas Adams",
      "Hitchhiker"
    );
    expect(books).toEqual(mockResponseData.docs);
    expect(fetch).toHaveBeenCalledWith(
      "https://openlibrary.org/search.json?author=Douglas+Adams&title=Hitchhiker&fields=title%2Cauthor_name%2Ccover_i%2C+publish_year%2C+isbn&limit=5"
    );
  });

  it("should return an empty array if the API returns no results", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [] }),
    });

    const books = await openLibraryService.fetchBookDetails(
      "NonExistentAuthor",
      "NonExistentTitle"
    );
    expect(books).toEqual([]);
    expect(console.error).toBeCalledWith(
      "No books were found for query author: NonExistentAuthor title: NonExistentTitle"
    );
  });

  it("should return an empty array if the API request fails", async () => {
    const mockError = new Error("Simulated network error");
    mockError.cause = { code: "EAI_AGAIN" };
    fetch.mockRejectedValueOnce(mockError);

    const books = await openLibraryService.fetchBookDetails(
      "Some Author",
      "Some Title"
    );
    expect(books).toEqual([]);
    expect(console.error).toBeCalledWith(
      "Failed to retrieve book data from https://openlibrary.org/search.json error: Simulated network error (Cause: EAI_AGAIN)"
    );
  });

  it("should handle non-2xx API responses and return an empty array", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not Found",
    });

    const books = await openLibraryService.fetchBookDetails(
      "Another Author",
      "Another Title"
    );
    expect(books).toEqual([]);
  });

  beforeEach(() => {
    vi.clearAllMocks(); // Reset the mock before each test
    vi.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error to avoid noise in test output
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore original mocks after each test
  });
});
