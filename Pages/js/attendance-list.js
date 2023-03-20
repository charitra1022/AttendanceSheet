// creates a card for attendance date
const getAttendanceAdapter = (params) => {
  /*
    params = {
      date: string of date in format YYYY-MM-DD
      total: integer denoting total student count in a course semester,
      present: integer denoting total present students in a class
      teacher_id: integer denoting teacher id
      subject_code: string denoting subject code
    }
  */

  let date = params.date;
  let totalStudents = params.total;
  let presentStudents = params.present;
  let teacher_id = params.teacher_id;
  let subject_code = params.subject_code;
  let sno = params.sno;

  const html = `
  <tr class="table-row" onclick="window.location.href='./updateAttendance.html?subject_code=${subject_code}&teacher_id=${teacher_id}&date=${date}'">
    <th scope="row">${sno}</th>
    <td>${date}</td>
    <td>${totalStudents}</td>
    <td>${presentStudents}</td>
  </tr>
  `;
  return html;
};

// update the DOM with the fetched data of attendance
async function updatePageData(params) {
  // retrieve subject code and teacher id from URLParams
  const sub_code = params["subject_code"];
  const teacher_id = params["teacher_id"];

  // add href to the new button
  document.getElementById(
    "add-attendance-btn"
  ).href = `./addAttendance.html?subject_code=${sub_code}&teacher_id=${teacher_id}`;

  document.getElementById("subject-code-heading").innerText = sub_code;

  // post request options for fetching date list for attendances
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": window.localStorage.getItem("authToken"),
    },
    body: JSON.stringify({
      subject_code: sub_code,
      teacher_id: teacher_id,
    }),
  };

  // fetch attendance data for a teacher and a subject
  const url = `http://localhost:5000/attendance-date`;
  const data = await fetchData(url, options);
  const att_dates = data["dates"];

  // if no attendance exists, return
  if (att_dates.length === 0) return;

  // remove empty placeholder
  document.getElementById("nolist").remove();

  // store list of objects of the attendance details
  let att_details = [];

  // run loop for each date and fetch data
  for (const att_date of att_dates) {
    let attData; // object to store date, total, present data
    // post request options for each date request
    const dateReqOpts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": window.localStorage.getItem("authToken"),
      },
      body: JSON.stringify({
        subject_code: sub_code,
        date: att_date,
      }),
    };
    // url to request attendance details
    const attDetailsUrl = `http://localhost:5000/attendance-details`;
    const data = await fetchData(attDetailsUrl, dateReqOpts);
    // add the attendance data to the list
    attData = {
      ...data["result"],
      date: att_date,
      teacher_id: teacher_id,
      subject_code: sub_code,
    };
    att_details.push(attData);
  }
  // add all date cards to a single string after data are fetched
  let att_cards = "";
  let counter = 1;
  att_details.forEach((att_detail) => {
    const data = {...att_detail, sno: counter}
    counter++;
    att_cards += getAttendanceAdapter(data);
  });

  const attndnceContr = document.getElementById("attendance-list-container");
  attndnceContr.innerHTML = att_cards;
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
