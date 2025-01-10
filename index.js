require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const hbs = require("hbs");
const { Pool } = require("pg"); // For PostgreSQL
const pgSession = require("connect-pg-simple")(session);

// Import your helper functions
const {
  formatDate,
  getRelativeTime,
  formatDuration,
  getUpdateTimes,
  formatText,
  formatTextT,
} = require("./src/javascript/timeFormat");

// Setup view engine and static files
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/pages"));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// PostgreSQL Pool connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Needed for Heroku/Vercel's SSL connection
});

// Configure session middleware to use PostgreSQL for session storage
app.use(
  session({
    store: new pgSession({
      pool: pool, // Pool of PostgreSQL connections
      tableName: "session", // Name of session table
    }),
    name: "session-login",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Secure cookies in production (for Vercel)
    //   sameSite: "strict", // CSRF protection
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // Session expiration (7 days)
    // },
  })
);

// Register Handlebars helpers
hbs.registerPartials(path.join(__dirname, "/src/partials"), function (err) {});
hbs.registerHelper("formatDate", formatDate);
hbs.registerHelper("times", getRelativeTime);
hbs.registerHelper("updateTimes", getUpdateTimes);
hbs.registerHelper("duration", formatDuration);
hbs.registerHelper("textSlice", formatText);
hbs.registerHelper("textTitle", formatTextT);
hbs.registerHelper("equal", (a, b) => {
  return a === b;
});

// Set up static file serving
app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use("/image", express.static(path.join(__dirname, "./src/uploads")));
app.use("/js", express.static(path.join(__dirname, "./src/javascript")));
app.use("/uploads", express.static(path.join(__dirname, "./src/uploads")));

// Routes
const routerRender = require("./src/Router/routerRenderPages");
const routerAuth = require("./src/Router/routerAuth");
const routerCrud = require("./src/Router/routerCrud");

app.use("/", routerAuth); // Authentication routes (login, register)
app.use("/", routerCrud); // CRUD routes for projects, etc.
app.use("/", routerRender); // Other rendering routes for pages

// Start the server
const port = process.env.PORT || 1706;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
