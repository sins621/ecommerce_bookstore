import databaseService from "../services/databaseService.js";
import bcrypt from "bcrypt";
import express from "express";
import amazonService from "../services/amazonService.js";
import "dotenv/config";

const SALT_ROUNDS = 10;

const viewController = {
  home: async (req, res, user) => {
    const books = (
      await databaseService.query(
        `
        SELECT books.book_id, books.title, books.author, books.price, books.cover_hex, categories.name
          FROM books_categories
        LEFT OUTER JOIN books
          ON books_categories.book_id = books.book_id
        LEFT OUTER JOIN categories
          ON books_categories.category_id = categories.category_id
        `
      )
    ).rows;
    for (let i = 0; i < books.length; i++) {
      books[i].cover_link =
        "https://d29yposcq41qf1.cloudfront.net/" + books[i].cover_hex;
    }
    const categories = (
      await databaseService.query(
        `
        SELECT categories.name, categories_images.image_hex 
        FROM categories
        INNER JOIN categories_images 
        ON categories.category_id = categories_images.category_id
        `
      )
    ).rows;
    for (let i = 0; i < categories.length; i++) {
      categories[i].image_link =
        "https://d29yposcq41qf1.cloudfront.net/" + categories[i].image_hex;
    }
    const adverts = (
      await databaseService.query(
        `
        SELECT * FROM public.adverts
        ORDER BY advert_id ASC 
        `
      )
    ).rows;
    for (let i = 0; i < adverts.length; i++) {
      adverts[i].image_link = "https://d29yposcq41qf1.cloudfront.net/" + adverts[i].image_hex
    }
    return res.render("routes/index.ejs", {
      books,
      categories,
      adverts,
    });
  },

  book: async (req, res) => {
    const bookId = Number(req.params.id);
    const books = await databaseService.fetchBooksBy("id", bookId);
    const reviews = await databaseService.fetchBookReviews(bookId);

    if (books.length === 0)
      return res.send("Error Retrieving Book").status(500);
    const book = books[0];

    if (!req.isAuthenticated())
      return res.render("routes/book_solo.ejs", {
        book,
        reviews,
      });

    const cart = await databaseService.fetchCartItems(req.user.id);

    return res.render("routes/book_solo.ejs", {
      book,
      reviews,
      user: req.user,
      cart,
    });
  },

  cart: async (req, res, user) => {
    const cart = await databaseService.fetchCartItems(user.id);
    return res.render("routes/cart.ejs", {
      cart,
      user: user.id,
    });
  },

  addBook: (req, res) => {
    // if (!req.isAuthenticated() || req.user.role != "admin") return res.redirect("/login");
    return res.render("routes/add_book.ejs");
  },

  admin: async (req, res) => {
    const users = await databaseService.fetchAllUsersRoles();
    const roles = await databaseService.fetchAllRoles();
    const orders = await databaseService.fetchAllOrdersItems();
    const sales = await databaseService.fetchAllSalesItems();

    return res.render("routes/admin", {
      users,
      roles,
      orders,
      sales,
    });
  },

  loginForm: (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return res.render("routes/login.ejs");
  },

  registerForm: (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return res.render("routes/register.ejs");
  },

  register: async (req, res) => {
    if (!req.body) return res.send("Server Error").status(500);
    const email = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    var checkResult = await databaseService.fetchUsersBy("email", email);
    if (checkResult.length > 0) return res.redirect("/login");

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await databaseService.addUser(email, hash, name);
    databaseService.addLog({
      event: "Register",
      object: "Users",
      description: `User: ${user.email} Registered an Account.`,
      createdBy: user.email,
    });

    req.login(user, (_err) => {
      console.log("success");

      return res.redirect("/");
    });
  },

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);

      return res.redirect("/");
    });
  },

  test: (req, res) => {
    res.render("routes/test.ejs");
  },
};

export default viewController;
