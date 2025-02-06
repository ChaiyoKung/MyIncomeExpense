// Global variable
const firebaseDB = firebase.database();
const firebaseRootRef = firebaseDB.ref();
const firebaseAuth = firebase.auth();
const firebaseStorage = firebase.storage();
const firebaseStorageRootRef = firebaseStorage.ref();

// Vue data
let app = new Vue({
  el: "#app",
  data: {
    user: "123",
    images: [],
    status: {
      show: false,
      text: "",
      color: "bg-warning",
    },
  },
  methods: {
    toggleStatus: function () {
      this.status.show = !this.status.show;
      if (!this.status.show) {
        this.status.text = "";
        this.status.color = "bg-warning";
      }
    },
    changeStatus: function (text) {
      this.status.text = text;
    },
    changeStatusColor: function (status = "wait") {
      if (status == "success") this.status.color = "bg-success";
      else this.status.color = "bg-warning";
    },
    uploadImage: function (e) {
      // Get file from input
      let file = e.target.files[0];
      let dateNow = Date.now();
      let dot = file.name.split(".").pop();
      let fileNameInStorage = dateNow.toString() + "." + dot;

      // Upload file and metadata to the object 'images/mountains.jpg'
      let uploadTask = firebaseStorageRootRef.child(fileNameInStorage).put(file);

      this.toggleStatus();

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2);
          this.changeStatus("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              this.changeStatus("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              this.changeStatus("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          let errorCode = error.code;
          let errorMessage = error.message;
          alert(`Upload image error! Details: ${errorMessage}`);
          setTimeout(() => {
            this.toggleStatus();
          }, 2000);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log("File available at", downloadURL);
            firebaseRootRef
              .child("HANAMIZUKI")
              .child("images")
              .push(
                {
                  url: downloadURL,
                  name: fileNameInStorage,
                  timestamp: dateNow,
                  uploader: this.user.displayName,
                },
                (error) => {
                  if (error) {
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    alert(`Error! Can't write database.\nDetails: ${errorMessage}`);
                  } else {
                    this.changeStatus("Uploaded image success!");
                    this.changeStatusColor("success");
                  }
                  setTimeout(() => {
                    this.toggleStatus();
                  }, 2000);
                }
              );
          });
        }
      );
    },
    goToNew: function () {
      window.scrollTo(0, 0);
      // window.scrollTo(0, document.body.scrollHeight);
    },
  },
});

function addImageToImages(url, name, timestamp, uploader) {
  let timeFormatted = new Date(timestamp).toLocaleString();
  app.$data.images.unshift({
    url: url,
    name: name,
    timestamp: timeFormatted,
    uploader: uploader,
  });
}

function readImagesTable() {
  firebaseRootRef
    .child("HANAMIZUKI")
    .child("images")
    .orderByChild("timestamp")
    .on("child_added", function (data) {
      let val = data.val();
      let url = val.url;
      let name = val.name;
      let timestamp = val.timestamp;
      let uploader = val.uploader;

      addImageToImages(url, name, timestamp, uploader);
    });
}

function checkUserIsLogined() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      app.$data.user = user;
    }
  });
}

// Run this function when web page is loaded
document.addEventListener("DOMContentLoaded", () => {
  readImagesTable();
  checkUserIsLogined();
});
