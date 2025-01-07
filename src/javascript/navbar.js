let btnId = document.getElementById("nav-btn");
let listMenuId = document.getElementById("menu-list");

btnId.addEventListener("click", () => {
  listMenuId.classList.toggle("nav-show");
  listMenuId.classList.toggle("menuHide");
});
