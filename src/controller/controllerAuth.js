const bcrypt = require("bcrypt");
const { User } = require("../../models");
const rollDice = 10;

const userRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    req.flash("error", "Username Tidak Boleh Kosong");
    return res.redirect("/register");
  }

  const isUsername = await User.findOne({ where: { username } });
  if (isUsername) {
    req.flash(
      "error",
      "Username Sudah Terdaftar Silahkan Masukkan Username yang lain"
    );
    return res.redirect("/register");
  }

  if (!email) {
    req.flash("error", "Email Tidak Boleh Kosong");
    return res.redirect("/register");
  }

  const isEmail = await User.findOne({ where: { email } });
  if (isEmail) {
    req.flash(
      "error",
      "Email Sudah Terdaftar Silahkan Masukkan Email Yang Lain"
    );
    return res.redirect("/register");
  }

  if (!password) {
    req.flash("error", "Password Tidak Boleh Kosong");
    return res.redirect("/register");
  }

  if (password.length < 6 || password.length > 12) {
    req.flash(
      "error",
      "Password Harus Memiliki minimal 6 character dan maksimal 12 character"
    );
    return res.redirect("/register");
  }

  let isUpperCase = false;
  let isNumber = false;
  let specialChar = "!@#$%^&*()_+~";
  let isSpecialChar = false;
  for (let i = 0; i < password.length; i++) {
    const pw = password[i];

    if (pw >= "A" && pw <= "Z") {
      isUpperCase = true;
    }

    if (pw >= "0" && pw <= "9") {
      isNumber = true;
    }

    if (specialChar.includes(pw)) {
      isSpecialChar = true;
    }
  }

  if (!isUpperCase) {
    req.flash("error", "Password Harus Memiliki Minimal 1 Huruf Besar");
    return res.redirect("/register");
  }

  if (!isNumber) {
    req.flash("error", "Password Harus Memiliki Minimal 1 Angka");
    return res.redirect("/register");
  }

  if (!isSpecialChar) {
    req.flash(
      "error",
      "Password Harus Memiliki Spesial Character Contoh !@#$%^&*()_+~"
    );
    return res.redirect("/register");
  }

  const passwordHash = await bcrypt.hash(password, rollDice);

  await User.create({
    username,
    email,
    password: passwordHash,
  });

  req.flash("success", "Selamat Anda Telah Berhasil Register");
  res.redirect("/login");
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    req.flash("error", "Email Tidak Boleh Kosong");
    return res.redirect("/login");
  }

  if (!password) {
    req.flash("error", "Password Tidak Boleh Kosong");
    return res.redirect("/login");
  }

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  console.log(user);

  if (!user) {
    req.flash("error", "Email Yang Anda Masukkan Tidak Terdaftar");
    return res.redirect("/login");
  }

  const isValidate = await bcrypt.compare(password, user.password);

  if (!isValidate) {
    req.flash("error", "Password Yang Anda Masukkan Salah");
    return res.redirect("/login");
  }

  let loginSession = user.toJSON();

  delete loginSession.password;

  req.session.user = loginSession;
  console.log(req.session.user);

  req.flash("success", `Selamat Datang ${loginSession.username}`);
  return res.redirect("/");
};

const processLogout = async (req, res) => {
  req.session.user = null;

  req.flash("success", `Yey Berhasil Logout`);
  res.redirect("/login");
};

module.exports = {
  userRegister,
  loginUser,
  processLogout,
};
