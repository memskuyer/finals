require("dotenv").config();
const config = require("../../config/config");
// const { Octokit } = require("@octokit/rest");
const env = process.env.NODE_ENV || "production";
const { Sequelize, QueryTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { myproject } = require("../../models");
// const sequelize = new Sequelize(config.development);
// const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);

const addMyProject = async (req, res) => {
  const { user } = req.session;
  const { title, startDate, endDate, content, react, node, next, php } =
    req.body;
  const image = req.file ? req.file.path : null; // Cloudinary URL is in req.file.path

  if (!user) {
    req.flash("error", "Silahkan Login Terlebih Dahulu");
    // Remove the uploaded image if not logged in
    if (req.file) {
      // No need to manually unlink because Cloudinary URL is already stored in the database
    }
    return res.redirect("/login");
  }

  if (!title) {
    req.flash("error", "Title Tidak Boleh Kosong");
    if (req.file) {
      // Remove the uploaded image from Cloudinary if the title is empty
    }
    return res.redirect("/add-project");
  }

  if (!startDate) {
    req.flash("error", "Start Date Tidak Boleh Kosong");
    if (req.file) {
      // Remove the uploaded image from Cloudinary
    }
    return res.redirect("/add-project");
  }

  if (!endDate) {
    req.flash("error", "End Date Tidak Boleh Kosong");
    if (req.file) {
      // Remove the uploaded image from Cloudinary
    }
    return res.redirect("/add-project");
  }

  let dateStart = new Date(startDate.replaceAll("-", "/"));
  let dateEnd = new Date(endDate.replaceAll("-", "/"));
  let timeDifference = dateEnd.getDate() - dateStart.getDate();
  let duration =
    dateEnd.getMonth() -
    dateStart.getMonth() +
    12 * (dateEnd.getFullYear() - dateStart.getFullYear());
  let timeYears = parseInt(duration / 12);

  let made;
  if (duration < 0) {
    req.flash("error", "Start Date Tidak Boleh Lebih Dari End Date");
    return res.redirect("/add-project");
  } else if (duration === 0) {
    made = `${timeDifference} Days`;
  } else if (duration < 12) {
    made = `${duration} Month`;
  } else {
    made = `${timeYears} Year`;
  }

  if (!content) {
    req.flash("error", "Content Tidak Boleh Kosong");
    if (req.file) {
      // Remove the uploaded image from Cloudinary
    }
    return res.redirect("/add-project");
  }

  if (content.length < 200) {
    req.flash("error", "Content Minimal 200 karakter");
    if (req.file) {
      // Remove the uploaded image from Cloudinary
    }
    return res.redirect("/add-project");
  }

  if (!react && !node && !next && !php) {
    req.flash("error", "Minimal Pilih Salah Satu Technology");
    if (req.file) {
      // Remove the uploaded image from Cloudinary
    }
    return res.redirect("/add-project");
  }

  let checkBox = "";
  if (react) checkBox += ` ${react} `;
  if (node) checkBox += ` ${node} `;
  if (next) checkBox += ` ${next} `;
  if (php) checkBox += ` ${php} `;

  if (!req.file) {
    req.flash("error", "Image Tidak Boleh Kosong");
    return res.redirect("/add-project");
  }

  const idUser = user.id;

  // Save project with Cloudinary image URL
  await myproject.create({
    title,
    startDate,
    endDate,
    made,
    content,
    technology: checkBox,
    image: image, // Save the Cloudinary URL in the database
    user_id: idUser,
  });

  req.flash("success", "Berhasil Menambahkan Project Baru");
  res.redirect("/my-project");
};

const deleteMyProject = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  if (!user) {
    req.flash("error", "Silahkan Login Terlebih Dahulu");
    return res.redirect("/login");
  }

  const getImageById = await myproject.findOne({
    where: {
      id: id,
    },
  });

  if (user.id !== getImageById.user_id) {
    req.flash("error", "Tidak Bisa Menghapus Yang Bukan Hak Anda");
    return res.redirect("/my-project");
  }

  let getImage = getImageById.image;
  let imageReplace = getImage.replace(
    "https://b59-paste-prosmana.vercel.app/image/",
    ""
  );

  const deletes = await myproject.destroy({
    where: {
      id: id,
    },
  });

  if (deletes) {
    const fullPath = path.join(__dirname, "../uploads/", imageReplace);
    fs.unlink(fullPath, (err) => {});
  }

  req.flash("success", "Berhasil Menghapus Data Project");
  res.redirect("/my-project");
};

const editMyProject = async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const { title, startDate, endDate, content, react, node, next, php } =
    req.body;
  // console.log(react, node, next, php);

  if (!title) {
    req.flash("error", "Title TIdak Boleh Kosong");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect(`/edit-project/${id}`);
  }

  if (!startDate) {
    req.flash("error", "Start Date Tidak Boleh Kosong");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect(`/edit-project/${id}`);
  }
  if (!endDate) {
    req.flash("error", "End Date Tidak Boleh Kosong");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect(`/edit-project/${id}`);
  }

  let dateStart = new Date(startDate.replaceAll("-", "/"));
  let dateend = new Date(endDate.replaceAll("-", "/"));

  let time_difference = dateend.getDate() - dateStart.getDate();

  let duration =
    dateend.getMonth() -
    dateStart.getMonth() +
    12 * (dateend.getFullYear() - dateStart.getFullYear());

  let timeYears = parseInt(duration / 12);

  let made;
  if (duration < 0) {
    req.flash("error", "Start Date Tidak Boleh Lebih Dari End Date");
    return res.redirect("/add-project");
  } else if (duration == 0) {
    made = `${time_difference} Day`;
  } else if (duration < 12) {
    made = `${duration} Month`;
  } else if (duration >= 12) {
    made = `${timeYears} Year`;
  }

  if (!content) {
    req.flash("error", "Content Tidak Boleh Kosong");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect(`/edit-project/${id}`);
  }

  if (content.length < 200) {
    req.flash("error", "Content Minimal 200 karakter");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect(`/edit-project/${id}`);
  }

  if (!react && !node && !next && !php) {
    req.flash("error", "Minimal Pilih Salah Satu Technology");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect(`/edit-project/${id}`);
  }

  let checkBox = "";
  if (react) {
    checkBox += ` ${react} `;
  }
  if (node) {
    checkBox += ` ${node} `;
  }
  if (next) {
    checkBox += ` ${next} `;
  }
  if (php) {
    checkBox += ` ${php} `;
  }

  const getDataById = await myproject.findOne({ where: { id: id } });

  if (!user) {
    req.flash("error", "Silahkan Login Terlebih Dahulu");
    if (req.file) {
      const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
      fs.unlink(fullPath, (err) => {});
    }
    return res.redirect("/login");
  }

  if (user.id !== getDataById.user_id) {
    req.flash("error", "Tidak Bisa Mengedit Yang Bukan Hak Anda");
    return res.redirect("/my-project");
  }

  let getImage = getDataById.image;
  let imageReplace = getImage.replace(
    "https://b59-paste-prosmana.vercel.app/image/",
    ""
  );

  let fileImage;

  if (req.file) {
    fileImage =
      "https://b59-paste-prosmana.vercel.app/image/" + req.file.filename;
    const fullPath = path.join(__dirname, "../uploads/", imageReplace);
    fs.unlink(fullPath, (err) => {});
  } else {
    fileImage = getImage;
  }

  await myproject.update(
    {
      title: title,
      startDate,
      endDate,
      made,
      content: content,
      technology: checkBox,
      image: fileImage,
      updateAt: sequelize.fn("NOW"),
    },
    {
      where: {
        id: id,
      },
    }
  );

  req.flash("success", "Berhasil Mengubah Data Project");
  res.redirect(`/my-project`);
};

module.exports = {
  addMyProject,
  deleteMyProject,
  editMyProject,
};
