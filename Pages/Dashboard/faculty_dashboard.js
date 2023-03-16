// function updatePageData(params) {
//   const teacher_id = parseInt(params['teacher_id']);
// }


function updatePageData() {
  const teacher_details = JSON.parse(window.localStorage.getItem("teacher_details"));

  document.getElementById("faculty-name").innerText = teacher_details.teacher_name;
  document.getElementById("faculty-email").innerText = teacher_details.email_id;
  document.getElementById("faculty-name").innerText = teacher_details.teacher_name;
}


window.onload = () => {
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const params = Object.fromEntries(urlSearchParams.entries());
  // updatePageData(params);

  updatePageData();
}
