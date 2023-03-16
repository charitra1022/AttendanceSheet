// function updatePageData(params) {
//   const teacher_id = parseInt(params['teacher_id']);
// }

// just a small dummy function until logout is implemented in backend
function back() {
  window.history.back();
}

// returns subject card DOM element
const getSubjectCard = (params) => {
  /*
    params = {
        semester_no: integer representing semester
        sub_no: integer representing subject count
        sub_name: string of subject name
        sub_code: string of subject code
        course_no: integer representing course count
    }
  */

  var semester_no = params.semester_no;
  var sub_no = params.sub_no;
  var sub_name = params.sub_name;
  var sub_code = params.sub_code;
  var course_no = params.course_no;

  const subjectCardElement = `
        <a href="./attendance-list.html" target="_blank" class="subject-card card col">
          <div>
            <div><strong id="course${course_no}-semester">Semester ${semester_no}</strong></div>
            <div id="subject${course_no}${sub_no}-name">${sub_name}</div>
            <div id="subject${course_no}${sub_no}-code">${sub_code}</div>
          </div>
        </a>
        <!-- subject ${sub_no} -->
`;
  return subjectCardElement;
};

// returns course card DOM element
const getCourseCard = (params) => {
  /*
    params = {
        subjects: string containing subject cards html
        course_no: integer representing course count
        course_name: string of course name
    }
  */

  var course_no = params.course_no;
  var course_name = params.course_name;

  const courseCardElement = `
      <div id="course${course_no}" class="course-card container">
        <h2 id="course${course_no}-name" class="course-name row">${course_name}</h2>
        <div id="course${course_no}-subjects-container" class="row">
          <!- subject card elements goes here ->
          ${params.subjects}
        </div>
      </div>
      <!-- Course card ${course_no} -->
  `;
  return courseCardElement;
};

function updatePageData() {
  const teacher_details = JSON.parse(
    window.localStorage.getItem("teacher_details")
  );

  // update personal data
  document.getElementById("faculty-name").innerText =
    teacher_details.teacher_name;
  document.getElementById("faculty-email").innerText = teacher_details.email_id;
  document.getElementById("faculty-name").innerText =
    teacher_details.teacher_name;

  // fetch teacher data
  const url = `http://localhost:5000/teacher?teacher_id=${teacher_details.teacher_id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // get list of subjects
      const subjects = data["result"];

      let subjectCards = ""; // add all subject cards to a single string
      let counter = 1; // to increment semester count for unique DOM id

      // run loop for each subject and add the html card together
      subjects.forEach((subject) => {
        // data to send to the card function for displaying information
        const sub_params = {
          semester_no: subject.semester,
          sub_no: counter,
          sub_name: subject.subject_name,
          sub_code: subject.subject_code,
          course_no: 1,
        };
        counter++;

        // add the html card to the string
        subjectCards += getSubjectCard(sub_params);
      });

      // data to send to the card function for displaying information
      const course_params = {
        subjects: subjectCards,
        course_no: 1,
        course_name: "MCA",
      };
      // add course card to the DOM
      const coursesContainerEl = document.getElementById("courses-container");
      coursesContainerEl.innerHTML += getCourseCard(course_params);
    });
}

window.onload = () => {
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const params = Object.fromEntries(urlSearchParams.entries());
  // updatePageData(params);

  updatePageData();
};
