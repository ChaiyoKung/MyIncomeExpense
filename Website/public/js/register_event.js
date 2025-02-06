const firebaseAuth = firebase.auth();
const firebaseDB = firebase.database();
const firebaseRootRef = firebaseDB.ref();

function openLoading() {
  document.getElementById("loadingScene").classList.remove("off");
}

function closeLoading() {
  document.getElementById("loadingScene").classList.add("off");
}

function backToHome() {
  document.location.href = "../index.html";
}

function writeUsersTable(uid, name, email) {
  firebaseRootRef.child("users").child(uid).set({
    name: name,
    email: email,
  });
}

function register(displayName, email, password) {
  openLoading();

  firebaseAuth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      let nowUser = firebase.auth().currentUser;
      console.log(nowUser);
      nowUser
        .updateProfile({
          displayName: displayName,
        })
        .then(() => {
          writeUsersTable(nowUser.uid, nowUser.displayName, nowUser.email);
          document.getElementById("loadingScene").innerHTML = `<h3 class="text-success">Register success.</h3>`;
          setTimeout(() => {
            backToHome();
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      alert("This Email already register in this website.\nDetails: " + errorMessage);
      closeLoading();
    });
}

function isValid() {
  let disName = document.getElementById("disName");
  let email = document.getElementById("regEmail");
  let pass = document.getElementById("regPassword");
  let confPass = document.getElementById("regConfirmPassword");

  if (disName.value != "") {
    if (email.value != "") {
      if (pass.value != "" && pass.value.length >= 6) {
        if (confPass.value != "") {
          if (pass.value == confPass.value) {
            register(disName.value, email.value, pass.value);
          } else {
            alert("Confirm password not equal password.");
          }
        } else {
          confPass.focus();
        }
      } else {
        pass.focus();
      }
    } else {
      email.focus();
    }
  } else {
    disName.focus();
  }
}

document.getElementById("regButton").addEventListener("click", () => {
  isValid();
});

document.querySelectorAll("#register-form .form-group input").forEach((element) => {
  element.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      isValid();
    }
  });
});
