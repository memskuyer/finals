const config = require("../config/config.json");
const { Sequelize, QueryTypes, where } = require("sequelize");
const sequelize = new Sequelize(config.development);
const { myproject, User } = require("../models");

const renderHome = (req, res) => {
  const { user } = req.session;
  res.render("home", { user });
};

const renderBlog = async (req, res) => {
  const { user } = req.session;

  const query = `SELECT public."Blogs".*,
  "User".username, "User".email
  FROM public."Blogs"
  FULL OUTER JOIN public."Users" 
  AS "User" ON public."Blogs".user_id = "User".id WHERE title IS NOT NULL
  ORDER BY public."Blogs"."createdAt" ASC`;
  const blog = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  res.render("blogs", { data: blog, user });
};
const renderAddBlog = async (req, res) => {
  const { user } = req.session;
  res.render("add-blog", { user });
};
const renderEditBlog = async (req, res) => {
  const { user } = req.session;
  const { id } = req.params;

  const query = `SELECT * FROM public."Blogs" WHERE id = ${id}`;
  const sql = await sequelize.query(query, { type: QueryTypes.SELECT });
  if (!sql[0]) {
    req.flash("error", "Mau Ngedit Apa bang?");
    return res.redirect("/blog");
  }
  res.render("edit-blog", { data: sql[0], user });
};

const renderDetailBlog = async (req, res) => {
  const { user } = req.session;
  const { id } = req.params;

  const query = `SELECT public."Blogs".*,
  "User".username, "User".email
  FROM public."Blogs"
  FULL OUTER JOIN public."Users" 
  AS "User" ON public."Blogs".user_id = "User".id WHERE  public."Blogs".id = ${id}
  ORDER BY public."Blogs"."createdAt" ASC`;
  const sql = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!sql[0]) {
    req.flash("error", "Mau Nyari Apa bang?");
    return res.redirect("/blog");
  }

  console.log(sql);

  res.render("detail-blog", { data: sql[0], user });
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
  renderBlog,
  renderAddBlog,
  renderEditBlog,
  renderDetailBlog,
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
