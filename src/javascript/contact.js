var handleClick = document.getElementById("handleForm");

handleClick.addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm(e);
});

const submitForm = (e) => {
  var form = e.target;
  var formData = new FormData(form);

  var data = Object.fromEntries(formData.entries());
  console.log(data);

  var link = document.createElement("a");
  link.href = `mailto:${data.email}?subject=${data.subject}&body=Selamat Siang.%0D%0ANama: ${data.name}. %0D%0ANo Hp: ${data.number}.%0D%0ASkill: ${data.skill}.%0D%0A%0D%0ABerikut pesan saya:%0D%0A${data.message}`;

  link.click();
};
