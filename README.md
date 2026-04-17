# GitHub Pages Site for Text-to-SQL Self-Service Analytics Chatbot

This folder contains a GitHub Pages-ready static website for the repository:

- Product overview
- Problem statement
- Objectives
- Target users and pain points
- User stories
- Scope
- Model architecture
- System architecture
- Live repository updates from the GitHub API

## Files

- `index.html` – main page
- `styles.css` – styling
- `script.js` – fetches live repo data from the GitHub API

## Deploy on GitHub Pages

### Option 1: Root deployment
1. Copy these files into the root of your repository.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/(root)**.
5. Save.

### Option 2: docs folder deployment
1. Create a `docs/` folder in your repository.
2. Copy these files into `docs/`.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/docs**.
6. Save.

## Live updates note
The site fetches the latest repository metadata and commit history using the public GitHub REST API. For a public repository and light traffic, this is usually enough. For higher traffic, move this into a GitHub Actions workflow that writes a JSON file during builds.
