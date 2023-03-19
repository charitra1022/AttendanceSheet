// returns fetched response from API
async function fetchData(url, options = {}) {
  let response = await fetch(url, options);
  return response.json();
}

const tableHead = `
<div class="container">
  <div class="row">
    <div class="col text-center"><strong>Date</strong></div>
    <div class="col text-center"><strong>Total</strong></div>
    <div class="col text-center"><strong>Present</strong></div>
  </div>
</div> 
`;

// creates a card for attendance date
const getAttendanceAdapter = (params) => {
  /*
    params = {
      date: string of date in format YYYY-MM-DD
      total: integer denoting total student count in a course semester,
      present: integer denoting total present students in a class
    }
  */

  let date = params.date;
  let totalStudents = params.total;
  let presentStudents = params.present;

  const html = `
  <div class="card py-3 my-3">
    <div class="container">
      <div class="row">
        <div class="col text-center">${date}</div>
        <div class="col text-center">${totalStudents}</div>
        <div class="col text-center">${presentStudents}</div>
      </div>
    </div>
  </div>
  `;
  return html;
};

// update the DOM with the fetched data of attendance
async function updatePageData(params) {
  // retrieve subject code and teacher id from URLParams
  const sub_code = params["subject_code"];
  const teacher_id = params["teacher_id"];

  document.getElementById("subject-code-heading").innerText = sub_code;

  // post request options for fetching date list for attendances
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject_code: sub_code,
      teacher_id: teacher_id,
    }),
  };

  // fetch attendance data for a teacher and a subject
  const url = `http://localhost:5000/attendence-date`;
  const data = await fetchData(url, options);
  const att_dates = data["dates"];

  // if no attendance exists, return
  if (att_dates.length === 0) return;

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
      },
      body: JSON.stringify({
        subject_code: sub_code,
        teacher_id: teacher_id,
        date: att_date,
      }),
    };
    // url to request attendance details
    const attDetailsUrl = `http://localhost:5000/attendence-details`;
    const data = await fetchData(attDetailsUrl, dateReqOpts);
    // add the attendance data to the list
    attData = { ...data["resp"], date: att_date };
    att_details.push(attData);
  }
  // add all date cards to a single string after data are fetched
  let att_cards = "";
  att_cards += tableHead; // add the heading for the table

  att_details.forEach(
    (att_detail) => (att_cards += getAttendanceAdapter(att_detail))
  );

  const attndnceContr = document.getElementById("attendance-list-container");
  attndnceContr.innerHTML = att_cards;
}

window.onload = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  updatePageData(params);
};
