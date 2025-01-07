const alertError = (msg) => {
  Swal.fire({
    position: "center",
    icon: "error",
    title: `${msg}`,
    showConfirmButton: true,
  });
};

const alertSuccess = (msg) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: `${msg}`,
    showConfirmButton: true,
  });
};

const alertDelete = () => {
  event.preventDefault();
  const form = event.target.form;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      form.submit();
    }
  });
};
