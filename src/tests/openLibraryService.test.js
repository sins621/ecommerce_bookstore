import { describe, it, expect, expectTypeOf } from "vitest";
import openLibraryService from "../services/openLibraryService";

describe("fetchBookDetails", async () => {
    it("Should fetch book data from Open Book API", async () => {
        const result = await openLibraryService.fetchBookDetails("JK Rowling", "Harry Potter");
    })
})