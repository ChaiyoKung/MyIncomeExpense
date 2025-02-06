# My Income Expense - Website

## Configuration

Set up admin user in `public/js/download_event.js` file.

```js
function checkUserIsLogined() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      ...
      if (uid == "" && uEmail == "" && uName == "") {
```

Set up admin user in `public/js/view_records_event.js` file.

```js
function checkUserIsLogined() {
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      ...
      if (uid == "" && uEmail == "" && uName == "") {
```

Maby need to set up Facebook App ID and API version in `public/connectFB/connectfb.js` file.

```js
window.fbAsyncInit = function () {
  FB.init({
    appId: "{your-app-id}",
    cookie: true,
    xfbml: true,
    version: "{api-version}",
  });

  FB.AppEvents.logPageView();
};
```

## Getting Started

Install the Firebase CLI

> The Firebase CLI requires Node.js v18.0.0 or later.

```bash
npm install -g firebase-tools
```

Run in development mode

```bash
firebase serve
```

## Utilities commands

```bash
# Format code
npx prettier "public/**/*.{html,css,js}" --write
```

## Deploy to Firebase Hosting

Login to Firebase

```bash
firebase login
```

Deploy to Firebase Hosting

```bash
firebase deploy
```
