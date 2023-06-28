// navigate to the dashboard after login
const dashboardURL = "./studentDashboard.html";

const dummyId = {
  email: "charitra.2022ca023@mnnit.ac.in",
  password: "12345",
};


function login() {
  // get credentials from the form
  const username = document.getElementById("student-login-email").value;
  const password = document.getElementById("student-login-password").value;

  // do http request
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:5000/login-student");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(
    JSON.stringify({
      email: username,
      password: password,
    })
  );

  // after the request is done
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      // get the response
      const objects = JSON.parse(this.responseText);

      console.log(objects); // for debugging

      // if the data of teacher is found
      if (objects["success"] === true) {
        window.localStorage.setItem("authToken", objects["authToken"]);

        // save student personal details to localStorage
        const student_details = objects["result"][0];
        window.localStorage.setItem(
          "student_details",
          JSON.stringify(student_details)
        );

        window.location.href = dashboardURL;
      }
      // if the data of teacher is not found
      else {
        alert(objects["error"]);
      }
    }
  };
  return false;
}

window.onload = () => {
  // check if the auth token is present or not
  if (window.localStorage.getItem("authToken") != null) 
    window.location.href = dashboardURL;
}
