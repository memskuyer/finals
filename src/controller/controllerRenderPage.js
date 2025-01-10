require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const config = require("../../config/config");
const { myproject, User } = require("../../models");
// const sequelize = new Sequelize(config.development);
const env = process.env.NODE_ENV || "production";
const sequelize = new Sequelize(config[env]);

const renderHome = (req, res) => {
  const { user } = req.session;
  console.log(user);

  res.render("home", { user });
};

const renderMyProject = async (req, res) => {
  const { user } = req.session;

  const data = await myproject.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    order: [["createdAt", "DESC"]],
  });

  res.render("my-project", { data, user });
};

const renderAddProject = async (req, res) => {
  const { user } = req.session;
  res.render("add-myproject", { user });
};

const renderEditProject = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  const data = await myproject.findOne({
    where: {
      id: id,
    },
  });

  if (!data) {
    req.flash("error", "Mau Ngedit Apa bang?");
    return res.redirect("/my-project");
  }
  const react = data.technology.includes("ReactJs"); //true
  const node = data.technology.includes("NodeJs"); //true
  const next = data.technology.includes("NextJs"); //true
  const php = data.technology.includes("PHP"); //false

  res.render("edit-myproject", { data, user, react, node, next, php });
};

const renderDetailProject = async (req, res) => {
  const { user } = req.session;
  const { id } = req.params;
  const data = await myproject.findAll({
    include: {
      model: User,
      as: "user",
      attributes: { exclude: ["password"] },
    },
    where: {
      id: id,
    },
  });

  if (!data[0]) {
    req.flash("error", "Mau Liat Apa bang?");
    return res.redirect("/my-project");
  }

  const react = data[0].technology.includes("ReactJs");
  const node = data[0].technology.includes("NodeJs");
  const next = data[0].technology.includes("NextJs");
  const php = data[0].technology.includes("PHP");

  res.render("detail-myproject", {
    data: data[0],
    user,
    react,
    node,
    next,
    php,
  });
};

const renderTestimonials = async (req, res) => {
  const { user } = req.session;

  res.render("testimonials", { user });
};

const renderContact = async (req, res) => {
  const { user } = req.session;

  res.render("contact", { user });
};

const renderNotFound = (req, res) => {
  res.render("NotFund");
};

const renderLogin = (req, res) => {
  const { user } = req.session;
  if (user) {
    req.flash("error", "Maaf Tidak Bisa Ke Page Login Karena Anda Sudah Login");
    return res.redirect("/");
  }
  res.render("login");
};

const renderRegister = (req, res) => {
  const { user } = req.session;
  if (user) {
    req.flash("error", "Tidak Bisa Register karena Anda Sudah Login");
    return res.redirect("/");
  }
  res.render("register");
};

module.exports = {
  renderHome,
  renderMyProject,
  renderAddProject,
  renderEditProject,
  renderDetailProject,
  renderTestimonials,
  renderContact,
  renderLogin,
  renderRegister,
  renderNotFound,
};
