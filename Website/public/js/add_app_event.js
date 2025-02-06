const firebaseDB = firebase.database();
const firebaseRootRef = firebaseDB.ref();
const firebaseAuth = firebase.auth();

let uName;

function switchNavBar(isLogined) {
  let eleLoginNavbar = document.getElementById("loginNavbar");
  let eleDisplayNameNavbar = document.getElementById("displayNameNavbar");
  let eleUNameDropdown = document.getElementById("uNameDropdown");

  if (isLogined) {
    eleLoginNavbar.classList.add("off");
    eleDisplayNameNavbar.classList.remove("off");
    eleUNameDropdown.innerHTML = uName;
  } else {
    eleLoginNavbar.classList.remove("off");
    eleDisplayNameNavbar.classList.add("off");
    eleUNameDropdown.innerHTML = null;
  }
}

function clearFormValue() {
  document.getElementById("appLink").value = "";
  document.getElementById("appVer").value = "";
}

function writeAppTable(link, version) {
  firebaseRootRef
    .child("app")
    .push({
      link: link,
      version: version,
    })
    .then((result) => {
      alert("Add app success.");
      clearFormValue();
    })
    .catch((error) => {
      console.log(error);
      alert("Add app unsuccess.");
    });
}

function isAdmin() {
  let user = firebase.auth().currentUser;
  console.log(user);

  let uid = user.uid;
  let email = user.email;
  let name = user.displayName;

  if (uid == "***REMOVED***" && email == "***REMOVED***" && name == "***REMOVED***") {
    switchNavBar(true);
  } else {
    document.location.href = "../index.html";
  }
}

function closeLoadingScene() {
  document.getElementById("loadingScene").classList.add("off");
  document.querySelectorAll("#loadingScene .lds-ellipsis div").forEach((div) => {
    div.classList.add("off");
  });
}

function checkUserIsLogined() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      let uid = user.uid;
      uName = user.displayName;
      let uEmail = user.email;

      if (uid == "***REMOVED***" && uEmail == "***REMOVED***" && uName == "***REMOVED***") {
        document.getElementById("uNameDropdownMenu").innerHTML +=
          `<a href="../add_app.html" class="dropdown-item">Add app</a>
                <a href="https://console.firebase.google.com/project/myincomeexpense/overview" class="dropdown-item" target="_blank">Console</a>`;
      }
      document.getElementById("uNameDropdownMenu").innerHTML +=
        `<a href="" class="dropdown-item" id="logoutButton">Logout</a>`;
      // do when logout button clicked
      document.getElementById("logoutButton").addEventListener("click", () => {
        logout();
      });

      switchNavBar(true);
      // readTodayUseMoney(uid);
      // readListsTable();
      // readRecordsTable(uid);
      // makeRealAddModal();
      closeLoadingScene();
      return true;
    } else {
      // User is signed out.
      document.location.href = "../index.html";
      return false;
    }
  });
}

function checkValid() {
  let link = document.getElementById("appLink");
  let ver = document.getElementById("appVer");

  if (link.value != "") {
    if (ver.value != "") {
      writeAppTable(link.value, ver.value);
    } else {
      ver.focus();
    }
  } else {
    link.focus();
  }
}

// Run this function when web page is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkUserIsLogined();
});

document.getElementById("addButton").addEventListener("click", () => {
  checkValid();
});

document.querySelectorAll("#add-app-form .form-group input").forEach((element) => {
  element.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      checkValid();
    }
  });
});
