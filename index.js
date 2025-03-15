import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import "dotenv/config";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import * as databaseHandler from "./databasehandler.js";
import { notifySubscribers } from "./mailer.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

const PORT = 6199;
const SALT_ROUNDS = 10;

//View Routes
// Home
app.get("/", async (req, res) => {
  var books = await databaseHandler.fetchAllBooks();

  if (books.length === 0) return res.send("Error Retrieving Books").status(500);
  return res.render("index.ejs", {
    user: req.user,
  });
});

app.get("/add_book", async (req, res) => {
  if (req.isAuthenticated() === false) return res.render("login.ejs");

  if (req.user.role != "admin") return res.redirect("/");

  return res.render("add_book.ejs");
});

app.post("/add_book", async (req, res) => {
  if (!req.body) return res.send("Server Error").status(500);

  const URL = "https://openlibrary.org/search.json";
  const PARAMS = new URLSearchParams({
    author: req.body.author,
    title: req.body.title,
    limit: 5,
    fields: "title,author_name,cover_i, publish_year",
  }).toString();
  const BOOK_DATA = await fetch(`${URL}?${PARAMS}`);
  const BOOKS = await BOOK_DATA.json();

  return res.render("add_book.ejs", {
    books: BOOKS,
    categories: await databaseHandler.fetchCategories(),
  });
});

app.post("/submit", async (req, res) => {
  if (!req.body) return res.send("Server Error").status(500);

  const BOOK = JSON.parse(req.body.book);
  const BOOK_INFO = await databaseHandler.addBook([
    BOOK.title,
    BOOK.author_name[0],
    req.body.category,
    BOOK.publish_year[0],
    req.body.abstract,
    BOOK.cover_i,
    req.body.quantity,
    req.body.price,
  ]);
  databaseHandler.addLog({
    event: "Add",
    object: "Books",
    description: `User: ${req.user.email} Added ${BOOK_INFO.title} to The Catalog.`,
    createdBy: req.user.email,
  });

  const SUBSCRIBERS = await databaseHandler.fetchSubscribers();

  notifySubscribers(
    SUBSCRIBERS,
    `${BOOK.title} just got added to the Catalog!`,
    `${BOOK.title} by ${BOOK.author_name}.
${req.body.abstract}

Visit your nearest Knowl & Tree Bookstore to Grab a Copy!`
  );

  return res.redirect("/");
});

app.get("/book/:book_id", async (req, res) => {
  if (!req.query) return res.send("Server Error").status(500);

  const BOOK_ID = req.params.book_id;
  console.log(BOOK_ID);
  var book = (await databaseHandler.fetchBooksBy("id", BOOK_ID))[0];

  if (!book) return res.send("Error Retrieving Book").status(500);

  var reviews = await databaseHandler.fetchBookReviews(book.id);

  return res.render("book.ejs", {
    book: book,
    user: req.user,
    reviews: reviews,
  });
});

app.post("/add_review", async (req, res) => {
  const USER_DATA = (
    await databaseHandler.fetchUsersBy("id", req.body.user_id)
  )[0];

  const REVIEW_INFO = await databaseHandler.addBookReview([
    req.body.review_title,
    USER_DATA.name,
    req.body.review_text,
    USER_DATA.id,
    req.body.rating,
    req.body.book_id,
  ]);
  console.log(REVIEW_INFO);
  databaseHandler.addLog({
    event: "Add",
    object: "Review",
    description: `User: ${req.user.email} Added "${
      REVIEW_INFO.review_title
    }" to ${
      (await databaseHandler.fetchBooksBy("id", REVIEW_INFO.book_id))[0].title
    }`,
    createdBy:USER_DATA.email,
  });

  res.json({OK: "Review Added Successfully"}).status(200);
});

app.get("/user_panel", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  if (req.user.role !== "admin") return res.redirect("/login");
  const SITE_USERS = await databaseHandler.fetchAllUsersRoles();
  return res.render("user_panel.ejs", { site_users: SITE_USERS });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);

    return res.redirect("/");
  });
});

app.get("/login", (_req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/register", (_req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  if (!req.body) return res.send("Server Error").status(500);

  const EMAIL = req.body.username;
  const PASSWORD = req.body.password;
  const NAME = req.body.name;
  var checkResult = await databaseHandler.database.query(
    `SELECT * FROM users
     WHERE email = $1`,
    [EMAIL]
  );

  if (checkResult.rows.length > 0) return req.redirect("/login");

  const HASH = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  const USER = await databaseHandler.addUser(EMAIL, HASH, NAME);
  databaseHandler.addLog({
    event: "Register",
    object: "Users",
    description: `User: ${USER.email} Registered an Account.`,
    createdBy: USER.email,
  });

  req.login(USER, (_err) => {
    console.log("success");

    return res.redirect("/");
  });
});

app.get("/cart", async (req, res) => {
  if (!req.user.isAuthenticated()) return res.redirect("/login");
  return res.render("cart.ejs");
});

// API Routes
app.get("/fetch_cart", async (req, res) => {
  const CART = await databaseHandler.fetchCartItems(req.query.user_id);
  console.log(CART);
  return res.json(CART);
});

app.post("/add_cart", async (req, res) => {
  const BOOK_INFO = await databaseHandler.addBookToCart(
    req.body.book_id,
    req.body.user_id
  );
  console.log(req.body.book_id, req.body.user_id);
  console.log(BOOK_INFO);
  // databaseHandler.addLog({
  //   event: "Add",
  //   object: "Cart",
  //   description: `User: ${req.user.email} Added ${BOOK_INFO.book_title} to Their Cart`,
  //   createdBy: req.user.email,
  // });
  return res.send("OK").status(200);
});

app.get("/fetch_cart_size", async (req, res) => {
  const USER_ID = req.query.user_id;
  const CART = await databaseHandler.fetchCartItems(USER_ID);
  return res.json({ cart_size: CART.length });
});

app.get("/fetch_books", async (req, res) => {
  const BOOKS = await databaseHandler.fetchAllBooks();
  const CATEGORIES = await databaseHandler.fetchCategories();
  return res.render("components/books_grid.ejs", {
    books: BOOKS,
    categories: CATEGORIES,
  });
});

app.get("/fetch_book_card", async (req, res) => {
  const BOOK_ID = req.query.book_id;
  const BOOK = await databaseHandler.fetchBooksBy("id", BOOK_ID);
  return res.render("components/book_card.ejs", {
    book: BOOK[0],
    user: req.user,
  });
});

app.post("/update_role", async (req, res) => {
  await databaseHandler.updateRole(req.body.role, req.body.email);
});

app.delete("/delete_user", async (req, res) => {
  await databaseHandler.deleteUser(req.body.email);
});

app.get("/api/ai_abstract", async (req, res) => {
  console.log(req.query);
  const AUTHOR = req.query.author;
  const TITLE = req.query.title;
  const GEN_AI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  const MODEL = GEN_AI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const PROMPT = `Provide a 20-30 word abstract for the Book ${TITLE} by ${AUTHOR}`;
  const RESULT = await MODEL.generateContent(PROMPT);
  const TEXT = RESULT.response.candidates[0].content.parts[0].text;

  return res.send(TEXT);
});

//Login Strategy
passport.use(
  "local",
  new Strategy(async function verify(username, password, callback) {
    // Form has to be called username even though it takes email (I think)
    const REGISTERED_USERS = await databaseHandler.fetchUsersBy(
      "email",
      username
    );

    if (REGISTERED_USERS.length === 0) return callback("User not found");

    const USER = REGISTERED_USERS[0];
    const STORED_HASHED_PASSWORD = USER.password;
    const VALID = await bcrypt.compare(password, STORED_HASHED_PASSWORD);

    if (!VALID) return callback(null, false);

    const USER_EMAIL_AND_ROLE = await databaseHandler.fetchUserByHighestRole(
      USER.id
    );
    databaseHandler.addLog({
      event: "Login",
      object: "Users",
      description: `User: ${USER_EMAIL_AND_ROLE.email} Logged In.`,
      createdBy: USER_EMAIL_AND_ROLE.email,
    });

    return callback(null, {
      id: USER.id,
      name: USER.name,
      email: USER_EMAIL_AND_ROLE.email,
      role: USER_EMAIL_AND_ROLE.role,
      cart: await databaseHandler.fetchCartItems(USER.id),
    });
  })
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});
passport.deserializeUser((user, callback) => {
  callback(null, user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.locals.url_for = function (route, params = {}) {
  const QUERY_STRING = new URLSearchParams(params).toString();

  return QUERY_STRING ? `${route}?${QUERY_STRING}` : route;
};
