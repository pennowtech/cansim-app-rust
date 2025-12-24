# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

# Setup

```shell
# with npm
npm create tauri-app@latest tauri-app
cd tauri-app
npm install       
npm run tauri dev 

```


Let’s wire Tailwind in manually and move on to making the UI pretty.

---

## 1. Install Tailwind + friends

From your Tauri project root (where `package.json` is):

```bash
npm install -D tailwindcss autoprefixer
npm install -D @tailwindcss/postcss
```

## 2. Create `tailwind.config.cjs` manually

Create a file `tailwind.config.cjs` in the project root with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 3. Create `postcss.config.cjs`

Also in the project root:

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

Vite/Tauri will pick this up automatically.

---

## 4. Hook Tailwind into your CSS

Open your main CSS file (`src/App.css` or whatever your entry CSS is) and replace its contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional global styling */
html,
body,
#root {
  height: 100%;
}

body {
  @apply bg-slate-950 text-slate-800 antialiased;
  margin: 0;
}
```

Make sure your React entry imports this:

```ts
// src/main.tsx or src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // <- important

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```


LICENSE: GPL-3.0