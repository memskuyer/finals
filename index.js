require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 1706;
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const hbs = require("hbs");
const methodOverride = require("method-override");
const {
  formatDate,
  getRelativeTime,
  formatDuration,
  getUpdateTimes,
  formatText,
  formatTextT,
} = require("./src/javascript/timeFormat");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/pages"));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    name: "session-login",
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use("/image", express.static(path.join(__dirname, "./src/uploads")));
app.use("/js", express.static(path.join(__dirname, "./src/javascript")));
app.use("/uploads", express.static(path.join(__dirname, "./src/uploads")));

hbs.registerPartials(__dirname + "/src/partials", function (err) {});
hbs.registerHelper("formatDate", formatDate);
hbs.registerHelper("times", getRelativeTime);
hbs.registerHelper("updateTimes", getUpdateTimes);
hbs.registerHelper("duration", formatDuration);
hbs.registerHelper("textSlice", formatText);
hbs.registerHelper("textTitle", formatTextT);
hbs.registerHelper("equal", (a, b) => {
  return a === b;
});

const routerRender = require("./src/Router/routerRenderPages");
const routerAuth = require("./src/Router/routerAuth");
const routerCrud = require("./src/Router/routerCrud");
app.use("/", routerAuth);
app.use("/", routerCrud);
app.use("/", routerRender);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
