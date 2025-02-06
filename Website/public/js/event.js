// Global variable
const firebaseDB = firebase.database();
const firebaseRootRef = firebaseDB.ref();
const firebaseAuth = firebase.auth();
const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let today = getDateNow();
let lastBalance = 0;
let uName = "";
let nowLists = [];
let selectDate = document.getElementById("selectDate");

function getDateNow(DATE = new Date()) {
  // const DATE = new Date();
  let date = DATE.getDate() + "/" + (DATE.getMonth() + 1) + "/" + DATE.getFullYear();

  return date;
}

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

    closeLoadingScene();
  }
}

// change data-target of #addButton from #loginModal to #addModal
function makeRealAddModal() {
  document.getElementById("addButton").dataset.target = "#addModal";
}

function closeLoadingScene() {
  document.getElementById("loadingScene").classList.add("off");
  document.querySelectorAll("#loadingScene .lds-ellipsis div").forEach((div) => {
    div.classList.add("off");
  });
}

// Read database at table name is "records" where "date" equal to "today" and calculate sum of "expense"
function readTodayUseMoney(uid) {
  firebaseRootRef
    .child("records")
    .child(uid)
    .orderByChild("date")
    .equalTo(today)
    .on("value", (snapshot) => {
      let values = snapshot.val();
      let sumTodayExpense = 0;

      // Calculate sum of expense on today
      for (let key in values) {
        if (values.hasOwnProperty(key)) {
          let expense = values[key].expense;
          sumTodayExpense += expense;
        }
      }

      document.getElementById("sumTodayExpense").innerHTML = sumTodayExpense;

      closeLoadingScene();
    });
}

// Read database at table name is "lists"
function readListsTable() {
  firebaseRootRef.child("lists").on("value", (snapshot) => {
    let values = snapshot.val();

    // Generate radio button html for #addModalBody
    let html = ``;
    values.forEach((list) => {
      nowLists.push(list.name);

      let idx = values.indexOf(list);
      if (idx == 0) {
        html += `
                <div class="col">
                    <div class="custom-control custom-radio">
                        <input type="radio" name="lists" class="custom-control-input" id="list${idx}" value="${idx}">
                        <label class="custom-control-label" for="list${idx}">${list.name}</label>
                    </div>
                </div>
                <div class="col">`;
      } else {
        html += `
                <div class="custom-control custom-radio">
                    <input type="radio" name="lists" class="custom-control-input" id="list${idx}" value="${idx}">
                    <label class="custom-control-label" for="list${idx}">${list.name}</label>
                </div>`;
      }
    });
    html += `</div>`;

    document.getElementById("addModalBody").innerHTML = html;
  });
}

// Get list name from list ID
function getListName(listID) {
  if (nowLists.length != 0) {
    return nowLists[listID];
  }
}

// Read database at table name is "records"
function readRecordsTable(uid) {
  let html = ``;
  firebaseRootRef
    .child("records")
    .child(uid)
    .limitToLast(10)
    .on("child_added", (snapshot) => {
      let record = snapshot.val();

      let date = record.date;
      let listName = getListName(record.listID);
      let income = record.income;
      let expense = record.expense;
      let balance = record.balance;

      html = `
            <tr>
                <td>${date}</td>
                <td>${listName}</td>
                <td>${income}</td>
                <td>${expense}</td>
                <td>${balance}</td>
            </tr>`;
      document.getElementById("tbody").innerHTML += html;
    });
}

function clearValuesInAddModal() {
  document.getElementsByName("lists").forEach((element) => {
    if (element.checked) {
      element.checked = false;
    }
  });
  document.getElementById("moneyTextField").value = null;
}

// Close "addModal"
function closeAddModal() {
  $("#addModal").modal("toggle");
}

// Close #loginModal
function closeLoginModal() {
  $("#loginModal").modal("toggle");
}

// This function return "ListID" that choosed
function getListID() {
  let val;
  document.getElementsByName("lists").forEach((element) => {
    if (element.checked) {
      val = parseInt(element.value);
    }
  });

  return val;
}

// This funcion return number in #moneyTextField
function getMoneyTextFieldValue() {
  return parseFloat(document.getElementById("moneyTextField").value);
}

function getLastBalance() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      let uid = user.uid;
      firebaseRootRef
        .child("records")
        .child(uid)
        .limitToLast(1)
        .on("child_added", (snapshot) => {
          lastBalance = snapshot.val().balance;
          document.getElementById("nowBalance").innerHTML = lastBalance;
        });
    }
  });
}

// Save function do when save button clicked or press "Enter" in money textfield
function save() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      let uid = user.uid;
      let pk = Date.now();
      // let nowDate = getDateNow();
      let nowDate = getDateNow(new Date(selectDate.value));
      let nowListID = getListID();
      let nowIncome = 0;
      let nowExpense = 0;
      if (nowListID == 0) {
        nowIncome = getMoneyTextFieldValue();
      } else {
        nowExpense = getMoneyTextFieldValue();
      }
      let nowBalance = lastBalance + nowIncome - nowExpense;

      // Write database at table name is "records"
      firebaseRootRef.child("records").child(uid).child(pk).set({
        date: nowDate,
        listID: nowListID,
        income: nowIncome,
        expense: nowExpense,
        balance: nowBalance,
      });

      clearValuesInAddModal();
      closeAddModal();
    }
  });
}

function writeUsersTable(uid, name, email) {
  firebaseRootRef.child("users").child(uid).set({
    name: name,
    email: email,
  });
}

function checkUserIsLogined() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      let uid = user.uid;
      uName = user.displayName;
      let uEmail = user.email;

      // document.getElementById("uNameDropdownMenu").innerHTML += `<a href="./profile.html" class="dropdown-item" id="logoutButton">Profile</a>`;

      if (uid === "***REMOVED***") {
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
      readTodayUseMoney(uid);
      readRecordsTable(uid);
      makeRealAddModal();
    } else {
      // User is signed out.
      switchNavBar(false);
    }
  });
}

function loginWithEmail() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");

  if (email.value != "") {
    if (password.value != "") {
      firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => {
          closeLoginModal();
        })
        .catch((error) => {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;

          alert("Error! Can't login with email.\nDetails: " + errorMessage);
        });
    } else {
      password.focus();
    }
  } else {
    email.focus();
  }
}

function loginWithFacebook() {
  firebaseAuth
    .signInWithPopup(fbProvider)
    .then((result) => {
      // The signed-in user info.
      let user = result.user;
      // insert user data to database users table
      writeUsersTable(user.uid, user.displayName, user.email);
      closeLoginModal();
    })
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;

      alert("Error! Can't login with facebook.\nDetails: " + errorMessage);
    });
}

function loginWithGoogle() {
  firebaseAuth
    .signInWithPopup(googleProvider)
    .then((result) => {
      // The signed-in user info.
      let user = result.user;
      // insert user data to database users table
      writeUsersTable(user.uid, user.displayName, user.email);
      closeLoginModal();
    })
    .catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;

      alert("Error! Can't login with google.\nDetails: " + errorMessage);
    });
}

function logout() {
  firebaseAuth
    .signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Logout success.");
    })
    .catch((error) => {
      // An error happened.
      console.log("Error! Can't logout.\nDetails:", error);
    });
}

// Run this function when web page is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkUserIsLogined();
  readListsTable();
  getLastBalance();
  selectDate.value = new Date().toISOString().split("T")[0];
});

document.getElementById("email").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    loginWithEmail();
  }
});

document.getElementById("password").addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    loginWithEmail();
  }
});

// do when login with facebook button clicked
document.getElementById("loginWithFacebookButton").addEventListener("click", () => {
  loginWithFacebook();
});

document.getElementById("loginWithGoogleButton").addEventListener("click", () => {
  loginWithGoogle();
});

// do when add button clicked
document.getElementById("addButton").addEventListener("click", () => {
  getLastBalance();
});

// Do when save button clicked
document.getElementById("saveButton").addEventListener("click", () => {
  save();
});

// Do when press any key in money textfield
document.getElementById("moneyTextField").addEventListener("keyup", (event) => {
  // Do when press "Enter"
  if (event.key == "Enter") {
    save();
  }
});
