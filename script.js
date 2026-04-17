const owner = "BernardJoshua";
const repo = "Database-Agnostic-Text-to-SQL-Self-Service-Analytics-ChatBot";
const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`;

const el = (id) => document.getElementById(id);

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "Accept": "application/vnd.github+json" }
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }
  return response.json();
}

async function loadRepoData() {
  try {
    const [repoData, commits] = await Promise.all([fetchJson(repoUrl), fetchJson(commitsUrl)]);

    el("repo-branch").textContent = repoData.default_branch || "N/A";
    el("repo-pushed").textContent = repoData.pushed_at ? formatDate(repoData.pushed_at) : "N/A";
    el("repo-issues").textContent = String(repoData.open_issues_count ?? "0");
    el("repo-name").textContent = repoData.full_name || `${owner}/${repo}`;
    el("repo-description").textContent = repoData.description || "No description available";
    el("repo-stars").textContent = String(repoData.stargazers_count ?? 0);
    el("repo-forks").textContent = String(repoData.forks_count ?? 0);

    const latest = commits[0];
    if (latest) {
      el("latest-commit").classList.remove("loading");
      el("latest-commit").innerHTML = `
        <h4>${escapeHtml(latest.commit.message.split("\n")[0])}</h4>
        <p>Author: ${escapeHtml(latest.commit.author.name)}</p>
        <p>Date: ${formatDate(latest.commit.author.date)}</p>
        <p><a class="text-link" target="_blank" rel="noreferrer" href="${latest.html_url}">View commit</a></p>
      `;
    } else {
      el("latest-commit").textContent = "No commits found.";
    }

    const commitList = el("commit-list");
    commitList.classList.remove("loading");
    commitList.innerHTML = commits.map((commit) => `
      <article class="commit-item">
        <div>
          <h4>${escapeHtml(commit.commit.message.split("\n")[0])}</h4>
          <p>${escapeHtml(commit.commit.author.name)} · <a class="text-link" target="_blank" rel="noreferrer" href="${commit.html_url}">Open commit</a></p>
        </div>
        <time datetime="${commit.commit.author.date}">${formatDate(commit.commit.author.date)}</time>
      </article>
    `).join("");
  } catch (error) {
    console.error(error);
    const message = "Unable to load live GitHub data right now. This can happen because of API rate limits or network restrictions.";
    ["repo-branch", "repo-pushed", "repo-issues", "repo-name", "repo-description", "repo-stars", "repo-forks"].forEach((id) => {
      const node = el(id);
      if (node) node.textContent = "Unavailable";
    });
    if (el("latest-commit")) el("latest-commit").textContent = message;
    if (el("commit-list")) el("commit-list").textContent = message;
  }
}

loadRepoData();
