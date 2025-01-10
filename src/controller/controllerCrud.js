require("dotenv").config();
const config = require("../../config/config");
const { Octokit } = require("@octokit/rest");
const env = process.env.NODE_ENV || "production";
const { Sequelize, QueryTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { myproject } = require("../../models");
// const sequelize = new Sequelize(config.development);
// const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const REPO_OWNER = "memskuyer";
const REPO_NAME = "finals";
const BRANCH = "master";

async function uploadFileToGitHub(localFilePath, remoteFilePath) {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const base64Content = Buffer.from(fileContent).toString("base64");

    const response = await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: remoteFilePath,
      message: "Add new image via Octokit",
      content: base64Content,
      branch: BRANCH,
    });

    console.log("File uploaded successfully!");
    console.log("File URL:", response.data.content.html_url);
  } catch (error) {
    console.error("Error uploading file:", error.message);
  }
}

const addMyProject = async (req, res) => {
  const { user } = req.session;
  const { title, startDate, endDate, content, react, node, next, php } =
    req.body;

  // if (!user) {
  //   req.flash("error", "Silahkan Login Terlebih Dahulu");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/login");
  // }

  // if (!title) {
  //   req.flash("error", "Title TIdak Boleh Kosong");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/add-project");
  // }

  // if (!startDate) {
  //   req.flash("error", "Start Date Tidak Boleh Kosong");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/add-project");
  // }
  // if (!endDate) {
  //   req.flash("error", "End Date Tidak Boleh Kosong");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/add-project");
  // }

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
    made = `${time_difference} Days`;
  } else if (duration < 12) {
    made = `${duration} Month`;
  } else if (duration >= 12) {
    made = `${timeYears} Year`;
  }

  // if (!content) {
  //   req.flash("error", "Content Tidak Boleh Kosong");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/add-project");
  // }

  // if (content.length < 200) {
  //   req.flash("error", "Content Minimal 200 karakter");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/add-project");
  // }

  // if (!react && !node && !next && !php) {
  //   req.flash("error", "Minimal Pilih Salah Satu Technology");
  //   if (req.file) {
  //     const fullPath = path.join(__dirname, "../uploads/", req.file.filename);
  //     fs.unlink(fullPath, (err) => {});
  //   }
  //   return res.redirect("/add-project");
  // }

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

  if (!req.file) {
    req.flash("error", "Image Tidak Boleh Kosong");
    return res.redirect("/add-project");
  }
  // const image =
  //   "https://b59-paste-prosmana.vercel.app/image/" + req.file.filename;

  const localImagePath = req.file.path;
  const ImageName = req.file.filename;
  const remoteImagePath = "uploads/" + ImageName;

  uploadFileToGitHub(localImagePath, remoteImagePath);

  const idUser = user.id;

  await myproject.create({
    title,
    startDate,
    endDate,
    made,
    content,
    technology: checkBox,
    image,
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
