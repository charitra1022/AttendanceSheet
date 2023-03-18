const tableHead = `
<div class="container">
  <div class="row">
    <div class="col"><strong>Date</strong></div>
    <div class="col"><strong>Total Students</strong></div>
    <div class="col"><strong>Students Presence</strong></div>
  </div>
</div> 
`;

// creates a card for attendance date
const getAttendanceAdapter = (params) => {
  /*
    params = {
      date: string of date in format YYYY-MM-DD
      totalStudents: integer denoting total student count in a course semester,
      presentStudents: integer denoting total present students in a class
    }
  */

  let date = params.date;
  let totalStudents = params.totalStudents;
  let presentStudents = params.presentStudents;

  const html = `
  <div class="card py-3 my-3">
    <div class="container">
      <div class="row">
        <div class="col">${date}</div>
        <div class="col">${totalStudents}</div>
        <div class="col">${presentStudents}</div>
      </div>
    </div>
  </div>
  `;
  return html;
};

// update the DOM with the fetched data of attendance
function updatePageData(params) {
  const sub_code = params["subject_code"];
  const teacher_id = params["teacher_id"];

  document.getElementById("subject-code-heading").innerText = sub_code;

  // post request options
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

  let isEmpty = false;

  // fetch teacher data
  const url = `http://localhost:5000/attendence-date`;
  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      // get list of attendance dates
      const dates = data["dates"];
      console.log(dates);

      // add all date cards to a single string
      let attendanceCards = "";
      attendanceCards += tableHead;

      if(dates.length === 0) isEmpty = true;
      
      // run loop for each date and add the html card together
      dates.forEach((date) => {
        // data to send to the card function for displaying information
        const att_params = {
          date: date,
          totalStudents: 113,
          presentStudents: 10,
        };

        // add the html card to the string
        attendanceCards += getAttendanceAdapter(att_params);
      });

      // if there were some attendances, then only update the container in DOM
      if(!isEmpty){
        const attndnceContr = document.getElementById("attendance-list-container");
        attndnceContr.innerHTML = attendanceCards;
      }
    });
}

window.onload = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  updatePageData(params);
};
