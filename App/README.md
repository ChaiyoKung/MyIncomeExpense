# My Income Expense - App

## Configuration

Set up your Firebase configuration in `global.js` file.

```js
let firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
```

Set up your Facebook App ID in `screens/LoginScreen.js` file.

```js
async loginWithFacebook() {
  const firebase = global.firebase;
  let appID = "";
```

Set up your Google Client ID in `screens/LoginScreen.js` file.

```js
async loginWithGoogle() {
  const firebase = global.firebase;
  const config = {
    iosClientId: "",
    androidClientId: "",
    iosStandaloneAppClientId: "",
    androidStandaloneAppClientId: "",
    scopes: ["profile", "email"],
  };
```
