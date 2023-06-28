// remove the auth token and refresh page
function logout() {
  window.localStorage.clear();
  window.location.reload();
}

// returns subject card DOM element
const getSubjectCard = (params) => {
  /*
    params = {
        sub_no: integer representing subject count
        sub_name: string of subject name
        sub_code: string of subject code
    }
  */

  var sub_no = params.sub_no;
  var sub_name = params.sub_name;
  var sub_code = params.sub_code;

  const subjectCardElement = `
    <div>
      <a href="./attendance-list.html?subject_code=${sub_code}" target="_blank" class="subject-card card">
        <div>
          <div id="subject${sub_no}-name">${sub_name}</div>
          <div id="subject${sub_no}-code">${sub_code}</div>
        </div>
      </a>
    </div>
  <!-- subject ${sub_no} -->
`;
  return subjectCardElement;
};

// returns course card DOM element
const getCourseCard = (params) => {
  /*
    params = {
        subjects: string containing subject cards html
    }
  */

  const courseCardElement = `
  <div id="course" class="course-card container">
      <div class="course-heading row">
          <h1 id="course-name" class="course-name">${params.course_name}</h1>
      </div>

      <!- subject card flex container goes here -->
      <div id="course-subjects-container" class="flex-container">
        ${params.subjects}
      </div>
  </div>
  <!-- Course card  -->
  `;
  return courseCardElement;
};

async function updatePageData() {
  // get details from local storage
  const student_details = JSON.parse(
    window.localStorage.getItem("student_details")
  );

  // update personal data
  document.getElementById("student-name").innerText =
    student_details.student_name;
  document.getElementById("student-email").innerText = student_details.email_id;
  document.getElementById("student-regno").innerText =
    student_details.student_regno;
  document.getElementById("student-name").innerText =
    student_details.student_name;

  // fetch student data
  const url = `http://localhost:5000/student-subjects`;
  const data = await fetchData(url, {
    method: "POST",
    headers: {
      "auth-token": window.localStorage.getItem("authToken"),
    },
    body: JSON.stringify({
      student_id: student_details.student_id,
    }),
  });

  // get list of subjects
  const subjects = data["result"];
  let subjectCards = ""; // add all subject cards to a single string
  let counter = 1; // to increment semester count for unique DOM id

  console.log(subjects);

  // run loop for each subject and add the html card together
  for (const subject of subjects) {
    // data to send to the card function for displaying information
    const sub_params = {
      sub_no: counter,
      sub_name: subject.subject_name,
      sub_code: subject.subject_code,
    };
    counter++;
    // add the html card to the string
    subjectCards += getSubjectCard(sub_params);
  }

  // data to send to the card function for displaying information
  const course_params = {
    subjects: subjectCards,
    course_no: 1,
    course_name: "MCA",
  };
  // add course card to the DOM
  const coursesContainerEl = document.getElementById("courses-container");
  coursesContainerEl.innerHTML += getCourseCard(course_params);
  // coursesContainerEl.innerHTML = subjectCards;
}

// checks if user is logged in, otherwise redirects to login page
function checkAuth() {
  const authToken = window.localStorage.getItem("authToken");
  if (authToken == null) {
    window.location.replace("./studentLogin.html");
  }
}

window.onload = () => {
  // const urlSearchParams = new URLSearchParams(window.location.search);
  // const params = Object.fromEntries(urlSearchParams.entries());
  // updatePageData(params);

  checkAuth();
  updatePageData();
};
