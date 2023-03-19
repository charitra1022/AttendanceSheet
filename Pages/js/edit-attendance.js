const getStudentCard = (params) => {
  /*
    params = {
      sno: integer denoting count of students
      student_regno: string denoting student registration number
      student_name: string denoting student name
      student_id: integer denoting student id
    }
  */

  let checked = "";   // to add checked option in the input field if present
  if (params.present === 1) checked = "checked";

  const html = `
  <tr class="">
    <td scope="row">${params.sno}</td>
    <td>${params.student_regno}</td>
    <td>${params.student_name}</td>
    <td>
      <input id="${params.student_regno}" data-student_id="${params.student_id}" type="checkbox" name=${params.student_regno} class="attendance-checkbox" disabled ${checked}>
    </td>
  </tr>
  `;

  return html;
};

// update page data after fetch
async function updatePageData(params) {
  // retrieve subject code and teacher id from URLParams
  const sub_code = params["subject_code"];
  const teacher_id = params["teacher_id"];
  const date = params["date"];

  // post request options for fetching date list for attendees
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject_code: sub_code,
      teacher_id: teacher_id,
      date: date,
    }),
  };

  // fetch data for attendees
  const url = `http://localhost:5000/attendance-record`;
  const data = await fetchData(url, options);
  const listAttendees = data["result"];

  let studentCards = ""; // contains all cards

  let counter = 0; // for s.no.

  // get input card for all attendees
  listAttendees.forEach((item) => {
    ++counter;
    const newData = { ...item, sno: counter };
    studentCards += getStudentCard(newData);
  });

  // inject the list of inputs in the DOM
  document.getElementById("attendance-list-container").innerHTML = studentCards;
}

// toggle edit mode in the DOM
// disables or enables the editable fields
function toggleUpdateMode() {
  const isChecked = document.getElementById("enable-update-btn").checked;
  const listParent = document.getElementById("attendance-list-container");
  let checkBoxes = listParent.getElementsByClassName("attendance-checkbox");

  // enable or disable input checkbox
  for (const checkBox of checkBoxes) {
    if (isChecked === true) checkBox.disabled = false;
    else checkBox.disabled = true;
  }

  // form buttons
  let cancelBtn = document.getElementsByClassName("update-cancel-btn")[0];
  let confirmBtn = document.getElementsByClassName("confirm-cancel-btn")[0];

  // enable or disable form buttons
  if (isChecked === true) {
    cancelBtn.classList.remove("disabled");
    confirmBtn.classList.remove("disabled");
  } else {
    cancelBtn.classList.add("disabled");
    confirmBtn.classList.add("disabled");
  }
}

window.onload = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  updatePageData(params);
};
