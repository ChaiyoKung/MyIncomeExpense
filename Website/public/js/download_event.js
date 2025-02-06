// Global variable
const firebaseDB = firebase.database();
const firebaseRootRef = firebaseDB.ref();
const firebaseAuth = firebase.auth();
const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let uName = "";

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

// Close #loginModal
function closeLoginModal() {
    $('#loginModal').modal('toggle');
}

function closeLoadingScene() {
    document.getElementById("loadingScene").classList.add("off");
    document.querySelectorAll("#loadingScene .lds-ellipsis div").forEach(div => {
        div.classList.add("off");
    });
}

function appendDownloadTbody(ver, link) {
    let tbody = document.getElementById("download-tbody");
    tbody.innerHTML += `<tr>
                            <td>${ver}</td>
                            <td><a href="${link}" target="_blank">${link}</a></td>
                        </tr>`;
}

function readAppTable() {
    firebaseRootRef.child("app").on("value", (snapshot) => {
        let values = snapshot.val();
        let reverseValues = [];
        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                let element = values[key];
                reverseValues.push(element);
            }
        }
        // orderdy desc
        reverseValues.reverse();
        reverseValues.forEach((list) => {
            let link = list.link;
            let version = list.version;
            appendDownloadTbody(version, link);
        });
        closeLoadingScene();
    })
}

function checkUserIsLogined() {
    firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in.
            let uid = user.uid;
            uName = user.displayName;
            let uEmail = user.email;

            if (uid == "" && uEmail == "" && uName == "") {
                document.getElementById("uNameDropdownMenu").innerHTML += `<a href="../add_app.html" class="dropdown-item">Add app</a>
                <a href="https://console.firebase.google.com/project/myincomeexpense/overview" class="dropdown-item" target="_blank">Console</a>`;
            }
            document.getElementById("uNameDropdownMenu").innerHTML += `<a href="" class="dropdown-item" id="logoutButton">Logout</a>`;
            // do when logout button clicked
            document.getElementById("logoutButton").addEventListener("click", () => {
                logout();
            });

            switchNavBar(true);
        } else {
            // User is signed out.
            switchNavBar(false);
        }
    });
}

function writeUsersTable(uid, name, email) {
    firebaseRootRef.child("users").child(uid).set({
        name: name,
        email: email
    })
}

function loginWithEmail() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (email.value != "") {
        if (password.value != "") {
            firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(() => {
                closeLoginModal();
            }).catch((error) => {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;

                alert("Error! Can't login with email.\nDetails: " + errorMessage);
            });
        } else {
            password.focus();
        }
    } else {
        email.focus()
    }
}

function loginWithFacebook() {
    firebaseAuth.signInWithPopup(fbProvider).then((result) => {
        // The signed-in user info.
        let user = result.user;
        // insert user data to database users table
        writeUsersTable(user.uid, user.displayName, user.email);
        closeLoginModal();
    }).catch((error) => {
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
    firebaseAuth.signInWithPopup(googleProvider).then((result) => {
        // The signed-in user info.
        let user = result.user;
        // insert user data to database users table
        writeUsersTable(user.uid, user.displayName, user.email);
        closeLoginModal();
    }).catch((error) => {
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
    firebaseAuth.signOut().then(() => {
        // Sign-out successful.
        console.log('Logout success.');
    }).catch((error) => {
        // An error happened.
        console.log("Error! Can't logout.\nDetails:", error);
    });
}









// Run this function when web page is loaded
document.addEventListener("DOMContentLoaded", () => {
    checkUserIsLogined();
    readAppTable();
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