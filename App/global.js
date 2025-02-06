import * as firebase from "firebase";

let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

if (firebase.apps.length == 0) firebase.initializeApp(firebaseConfig);

const color = {
  primary: "#0081ff",
  info: "#02a2b8",
  success: "#1ca345",
  warning: "#ffc001",
  danger: "#df3e44",
  dark: "#353a40",
  darker: "#211a22",
  darkest: "#110c12",
  secondary: "#6b757e",
  light: "#f9fafc",
  white: "#ffffff",
};

export default {
  color: color,
  firebase: firebase,
};
