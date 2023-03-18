// navigate to the dashboard after login
// const dashboardURL = `./Dashboard/facultyDashboard.html?teacher_id={teacher_id}`;
const dashboardURL = "./Dashboard/facultyDashboard.html";

const dummyId = {
  email: "mmgore@mnnit.ac.in",
  password: "12345"
}



/*
 * Request reference: https://javascript.plainenglish.io/lets-build-a-website-login-page-with-html-css-javascript-and-an-external-api-a083942f797d
 */

// var jwt = localStorage.getItem("jwt");
// if (jwt != null) {
//   window.location.href = dashboardURL;
// }


function login() {
  // get credentials from the form
  const username = document.getElementById("faculty-login-email").value;
  const password = document.getElementById("faculty-login-password").value;

  // do http request
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://localhost:5000/login-teacher");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    email: username,
    password: password,
  }));
  
  // after the request is done
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      // get the response
      const objects = JSON.parse(this.responseText);

      console.log(objects);   // for debugging

      // if the data of teacher is found
      if (objects['success'] === true) {
        // localStorage.setItem("jwt", objects['accessToken']);
        
        // save teacher personal details to localStorage
        const teacher_details = objects['result'][0]
        window.localStorage.setItem("teacher_details", JSON.stringify(teacher_details));

        // window.location.href = dashboardURL.replace("{teacher_id}", 4);
        window.location.href = dashboardURL;

        // Swal.fire({
        //   text: objects['message'],
        //   icon: 'success',
        //   confirmButtonText: 'OK'
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     window.location.href = dashboardURL;
        //   }
        // });
      } 
      // if the data of teacher is not found
      else {
        alert(objects['msg']);

        // Swal.fire({
        //   text: objects['message'],
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // });
      }
    }
  };
  return false;
}