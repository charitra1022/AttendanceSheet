// returns js object that is needed to send to the api to add attendance
function getAttnDataForApi() {
  // get all input checkbox elements
  let checkBoxes = document.getElementsByClassName("attendance-checkbox");

  // store list of student reg and present status
  let attn_details = [];

  // get detail from all checkboxes
  for (const checkBox of checkBoxes) {
    const detail = {
      student_id: parseInt(checkBox.getAttribute("data-student_id")),
      present: checkBox.checked ? 1 : 0,
    };
    // add to list
    attn_details.push(detail);
  }

  // get required data from the hidden fields
  let sub_code = document.getElementById("hidden-subject_code").value;
  let teacher_id = document.getElementById("hidden-teacher_id").value;

  // construct data to send to the API except date
  return {
    subject_code: sub_code,
    teacher_id: parseInt(teacher_id),
    students: attn_details,
  };
}

// updates the date field to current date
function updateCurrentDate() {
  const dateInput = document.getElementById("attendance-date");

  const dateObj = new Date();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const dateStr = dateObj.getFullYear() + "-" + month + "-" + dateObj.getDate();
  dateInput.value = dateStr;
}

// validates the date on form submission
function validateDateElement() {
  // get value from the date field
  const dateInput = document.getElementById("attendance-date");
  const dateVal = dateInput.value;

  // if the field is empty, get the current date
  if (dateVal === "") {
    const dateObj = new Date();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const dateStr =
      dateObj.getFullYear() + "-" + month + "-" + dateObj.getDate();

    return dateStr;
  }
  return dateVal;
}

async function addButtonClicked() {
  const dateStr = validateDateElement();
  const dataForApi = { ...getAttnDataForApi(), date: dateStr };

  const confirmation = confirm(
    "This action is irreversible!\nDo you want to add new Attendance sheet?\n"
  );

  if (confirmation === false) return;

  const url = `http://localhost:5000/add-attendence`;
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "auth-token": window.localStorage.getItem("authToken"),
    },
    body: JSON.stringify(dataForApi),
  };

  // add request
  const res = await fetchData(url, options);
  alert(res["msg"]);

  // navigate to update page after adding data
  const newUrl = `./updateAttendance.html?subject_code=${dataForApi.subject_code}&teacher_id=${dataForApi.teacher_id}&date=${dataForApi.date}`;
  window.location.replace(newUrl);
}

const getStudentCard = (params) => {
  /*
    params = {
      sno: integer denoting count of students
      student_regno: string denoting student registration number
      student_name: string denoting student name
      student_id: integer denoting student id
    }
  */

  const html = `

  <tr class="table-row">
    <th scope="row">${params.sno}</th>
    <td>${params.student_regno}</td>
    <td>${params.student_name}</td>
    <td>
      <input id="${params.student_regno}" data-student_id="${params.student_id}" type="checkbox" name=${params.student_regno} class="attendance-checkbox">
    </td>
  </tr>
  `;

  return html;
};

// update page data after fetch
async function updatePageData(params) {
  // retrieve required details from URLParams
  const sub_code = params["subject_code"];
  const teacher_id = params["teacher_id"];

  // update the current date in the date field
  updateCurrentDate();

  // other required details
  const course = "MCA";
  const semester = sub_code[3];

  // fetch data for student list
  const url = "http://localhost:5000/students";
  // post request options for fetching date list for attendances
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": window.localStorage.getItem("authToken"),
    },
    body: JSON.stringify({
      course: "MCA",
      semester: "2",
      mode: "min",
    }),
  };
  const data = await fetchData(url, options);
  const studentList = data["result"];
  console.log(studentList);

  let studentCards = ""; // contains all cards

  let counter = 0; // for s.no.

  // get input card for all attendees
  studentList.forEach((item) => {
    ++counter;
    const newData = { ...item, sno: counter };
    studentCards += getStudentCard(newData);
  });

  // add hidden input fields for data to be passed to API later
  const hiddenFields = `
  <input id="hidden-subject_code" type="text" name="subject_code" value=${sub_code} hidden>
  <input id="hidden-teacher_id" type="number" name="teacher_id" value=${teacher_id} hidden>
  `;

  studentCards += hiddenFields;

  // inject the list of inputs in the DOM
  document.getElementById("attendance-list-container").innerHTML = studentCards;
}

// checks if user is logged in, otherwise redirects to login page
function checkAuth() {
  const authToken = window.localStorage.getItem("authToken");
  if (authToken == null) {
    window.location.replace("./facultyLogin.html");
  }
}

window.onload = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  checkAuth();
  updatePageData(params);
};
