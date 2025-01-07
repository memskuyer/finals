const handleClick = () => {
  let changes = document.getElementById("bg-change");
  changes.classList.toggle("bg-cat3");
  changes.classList.toggle("bg-cat4");

  if (changes.classList.value == "bg-cat4") {
    document.getElementById("exampleInputPassword1").type = "text";
  } else {
    document.getElementById("exampleInputPassword1").type = "password";
  }
};
