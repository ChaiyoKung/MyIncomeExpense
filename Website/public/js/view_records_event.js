// Global variable
const firebaseDB = firebase.database();
const firebaseRootRef = firebaseDB.ref();
const firebaseAuth = firebase.auth();

let uName = "";
let nowLists = [];

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

      if (uid == env.ADMIN_USER_ID && uEmail == env.ADMIN_EMAIL && uName == env.ADMIN_NAME) {
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
      readRecordsTable(uid);
    } else {
      // User is signed out.
      document.location.href = "../index.html";
      switchNavBar(false);
    }
  });
}

// Read database at table name is "lists"
function readListsTable() {
  firebaseRootRef.child("lists").on("value", (snapshot) => {
    let values = snapshot.val();
    values.forEach((list) => {
      nowLists.push(list.name);
    });
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
    .on("value", (snapshot) => {
      let records = snapshot.val();
      if (records != "") {
        for (const key in records) {
          if (records.hasOwnProperty(key)) {
            const record = records[key];

            let date = record.date;
            let listName = getListName(record.listID);
            let income = record.income;
            let expense = record.expense;
            let balance = record.balance;

            html += `
                    <tr>
                        <td>${date}</td>
                        <td>${listName}</td>
                        <td>${income}</td>
                        <td>${expense}</td>
                        <td>${balance}</td>
                    </tr>`;
          }
        }
        document.getElementById("tbody").innerHTML = html;
        closeLoadingScene();
      } else {
        closeLoadingScene();
      }
    });
}

function deleteRecords() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      if (confirm("Are you sure to delete your records?")) {
        if (confirm("Sure? It can't restore!")) {
          if (confirm("So, Click OK and your records was delete.")) {
            let uid = user.uid;
            firebaseRootRef.child("records").child(uid).remove();
            document.location.href = "../index.html";
          }
        }
      }
    } else {
      // User is signed out.
      document.location.href = "../index.html";
    }
  });
}

// Run this function when web page is loaded
document.addEventListener("DOMContentLoaded", () => {
  checkUserIsLogined();
  readListsTable();
});

document.getElementById("deleteRecordsButton").addEventListener("click", () => {
  deleteRecords();
});
