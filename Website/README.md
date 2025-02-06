# My Income Expense - Website

## Configuration

Create a `env.js` file and set variables

```bash
cp public/js/env.example.js public/js/env.js
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
