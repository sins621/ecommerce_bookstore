import express from "express";
import path from "node:path";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import morgan from "morgan";
import databaseService from "./services/databaseService.js";
import userRoutes from "./routes/userRouter.js";
import bookRoutes from "./routes/bookRouter.js";
import viewRoutes from "./routes/viewRouter.js";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 6199;

app.use(express.static("src/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("tiny"));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "local",
  new Strategy(async function verify(username, password, callback) {
    // Form has to be called username even though it takes email (I think)
    const REGISTERED_USERS = await databaseService.fetchUsersBy(
      "email",
      username
    );

    if (REGISTERED_USERS.length === 0) return callback("User not found");

    const USER = REGISTERED_USERS[0];
    const STORED_HASHED_PASSWORD = USER.password;
    const VALID = await bcrypt.compare(password, STORED_HASHED_PASSWORD);

    if (!VALID) return callback(null, false);

    const USER_EMAIL_AND_ROLE = await databaseService.fetchUserByHighestRole(
      USER.id
    );
    databaseService.addLog({
      event: "Login",
      object: "Users",
      description: `User: ${USER_EMAIL_AND_ROLE.email} Logged In.`,
      createdBy: USER_EMAIL_AND_ROLE.email,
    });

    return callback(null, {
      id: USER.id,
      email: USER_EMAIL_AND_ROLE.email,
      role: USER_EMAIL_AND_ROLE.role,
    });
  })
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user as Express.User);
});

app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/", viewRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
