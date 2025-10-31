Here’s a **ready-to-copy-paste version** of the `README.md` file (no formatting breaks):

---

```markdown
# 🌐 Grotech Website

A React-based web application deployed automatically via **GitHub Actions** to **GitHub Pages**.

---

## 🚀 Deployment Overview

This project uses **GitHub Actions** to automatically build and deploy the app to the `gh-pages` branch whenever changes are pushed to the `main` branch.

The workflow file is located at:
```

.github/workflows/deploy.yml

````

---

## 🛠️ Setup Instructions

Follow these steps if you’ve just cloned or forked the repository.

### 1. Clone the repository
```bash
git clone git@github.com:<your-username>/grotech-website.git
cd grotech-website
````

### 2. Install dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run build
```

### 4. Run locally (optional)

```bash
npm start
```

---

## ⚙️ GitHub Pages Configuration

### 1. Update `package.json`

Make sure your `package.json` contains the correct `homepage` field:

```json
"homepage": "https://<your-username>.github.io/grotech-website"
```

> ⚠️ Replace `<your-username>` with your actual GitHub username.

---

### 2. Configure GitHub Secrets

You’ll need a **GitHub Personal Access Token** with permission to push to the repository.

1. Go to your GitHub repository → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name it: `GITHUB_TOKEN` or `ACTIONS_DEPLOY_KEY`
4. Paste your token

GitHub provides a built-in `${{ secrets.GITHUB_TOKEN }}` automatically, but you can add a custom one if needed for forks or special cases.

---

## ⚡ Workflow Explained

The deploy workflow (`deploy.yml`) automates these steps:

1. **Trigger**: Runs when you push to `main`
2. **Install**: Installs dependencies using `npm ci`
3. **Build**: Builds the app using `npm run build`
4. **Deploy**: Publishes the contents of the `build/` folder to the `gh-pages` branch

### Example Workflow

```yaml
name: Deploy React App to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build the project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## 🌍 Accessing Your Deployed App

Once the workflow finishes successfully:

* Go to your repo → **Settings → Pages**
* Ensure **Branch** is set to `gh-pages` → `/ (root)`
* Your app will be available at:

  ```
  https://<your-username>.github.io/grotech-website/
  ```

---

## 🧹 Common Issues

### ❌ `npm ci` fails with lock file error

Run the following locally, then commit the new lock file:

```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix lockfile mismatch"
```

### ❌ 404 after deployment

* Ensure the `homepage` field in `package.json` is correct.
* Verify that the `gh-pages` branch exists.
* In **Settings → Pages**, select `gh-pages` as the source branch.

### ❌ Workflow fails with permission error

Make sure your workflow has:

```yaml
permissions:
  contents: write
```

---

## 🧠 Notes

* For a forked repo, you may need to manually enable GitHub Actions.
* The first deployment might take a few minutes while the `gh-pages` branch is created.
* Each new push to `main` automatically rebuilds and redeploys the app.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).