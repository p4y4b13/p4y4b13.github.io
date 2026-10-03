# P4Y4B13 · Research notes

A minimal GitHub Pages blog for articles, audit writeups, and hack analyses. The homepage is a simple chronological article list grouped by year. Includes Markdown posts, RSS, a sitemap, dark mode, responsive layouts, and an on-site audit portfolio with all competitive and private engagements.

## Preview locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:4173. The preview builds on startup; restart it after source changes.

## Publish to GitHub Pages

1. Create a GitHub repository. Use `p4y4b13.github.io` for the root GitHub Pages address, or another name for a project site.
2. Push these files to its `main` branch.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Run the **Deploy Fieldnotes to GitHub Pages** workflow (or push a commit). The workflow builds and validates the site, then deploys it.

The workflow derives the origin and base path from GitHub Pages, so both root and project repositories work. No GitHub repository or domain is changed by this local project. Your existing p4y4b13.com site remains linked from the portfolio. To move this site to a custom domain later, configure it in GitHub Pages and update the domain's DNS deliberately.

## Publish from the GitHub website

Once deployed, open `content/posts/` in your GitHub repository, choose **Add file → Create new file**, and name it `YYYY-MM-DD-your-title.md`. Paste the Markdown example below, write your post, and commit to `main`. GitHub Actions rebuilds the blog automatically. You do not need to edit HTML or run a local server to publish.

## Publish a new post

Copy a file from `content/templates/` into `content/posts/`, with a unique filename such as `2026-10-03-my-research.md`. Frontmatter is JSON between two `---` lines (not YAML):

```markdown
---
{"title":"Your title","description":"A short summary.","date":"2026-10-03","category":"Articles","tags":["Solidity"],"draft":false}
---
## Introduction

Write in Markdown, with links, lists, tables and fenced code blocks.
```

- Categories: `Articles`, `Reports`, or `Hacks`.
- `draft: true` excludes a post from pages, the archive, feed and sitemap. Templates are never published.
- Posts appear automatically under their publication year, newest first.
- Put images or public PDFs in `assets/`; link from posts with `../../assets/filename.pdf`.
- Keep filenames stable after publication: they define post URLs.
- Push to `main` to publish. Future-dated posts are not automatically scheduled; use draft mode until ready.

Only trusted author-controlled Markdown should be added: embedded HTML is supported. This is a static site, with no login or browser-based publishing dashboard.

## Personalize

- `site.config.json`: identity, social links, local-build URL and base path.
- `assets/style.css`: palette, typography, layout and responsive styles.
- `scripts/build.mjs`: blog index and article layouts.
- `content/posts/`: public writing and drafts.
- `content/portfolio.md`: audit tables imported from your public `p4y4b13/Audits` README; edit this file to update the portfolio.

For a manual project-site build, run `BASE_PATH=/repository-name npm run build`. Run checks with the same `BASE_PATH` value. `SITE_URL` is the origin only, such as `https://p4y4b13.github.io`, without the repository path.

## Content provenance

The welcome post is starter copy for you to edit or remove. The three earlier audit summaries are now unpublished drafts, preserved in `content/posts/`; they do not appear in the index, RSS feed, or sitemap. Templates also remain unpublished. The Portfolio navigation opens `/portfolio/`, with all 28 audit engagements from https://github.com/p4y4b13/Audits.

Fonts are loaded from Google Fonts, with local serif, sans-serif and monospace fallbacks. No analytics or tracking scripts are included. Theme preference is stored locally when browser storage is available.

## Verify

```sh
npm run build
npm run check
```

The check verifies generated-page metadata and local links/assets. Deployment uploads only `dist/`.
