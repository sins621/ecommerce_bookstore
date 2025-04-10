import databaseService from "../services/databaseService.js";
import bcrypt from "bcrypt";
import express from "express";

const SALT_ROUNDS = 10;

const viewController = {
  home: async (req, res, user) => {
    const books = await databaseService.fetchAllBooks();
    const categories = await databaseService.fetchCategories();

    if (books.length === 0)
      return res.send("Error Retrieving Books").status(500);

    if (!req.isAuthenticated())
      return res.render("routes/index.ejs", {
        books,
        categories,
        user: req.user,
      });

    const cart = await databaseService.fetchCartItems(user.id);

    return res.render("routes/index.ejs", {
      books,
      categories,
      user: req.user,
      cart,
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
