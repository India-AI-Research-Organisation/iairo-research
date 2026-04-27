# IAIRO Projects Site (Jekyll + GitHub Pages)

This repository contains a projects-focused research lab website template inspired by academic lab Jekyll themes (including the `rar-ensemble/lab_site` style), adapted for **IAIRO**.

## What this template includes

- Projects-only information architecture (no people/publications pages by default)
- Collection-based project entries in `_projects/`
- Project detail pages generated automatically
- Configurable site metadata and hero content in `_config.yml`
- GitHub Pages compatible dependencies

## Local development

1. Install Ruby and Bundler.
2. Install dependencies:

   ```bash
   bundle install
   ```

3. Run locally:

   ```bash
   bundle exec jekyll serve
   ```

4. Open `http://127.0.0.1:4000`.

## Customization

- Global content and branding: `_config.yml`
- Homepage layout and project grouping: `index.html`
- Styling: `assets/css/main.scss`
- Project entries: `_projects/*.md`

### Add a new project

Create a file in `_projects/` (for example, `_projects/2026-05-01-new-project.md`) with front matter similar to:

```yaml
---
title: New Project Name
summary: One-line overview shown on cards.
area: Robotics
status: active
featured: false
duration: 2026 - Present
order: 30
external_link: https://example.com
---

Detailed markdown description here.
```

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In repository settings, enable **Pages** for the default branch root.
3. If hosted under `username.github.io/repo-name`, set `baseurl: "/repo-name"` in `_config.yml`.
4. Commit and push changes.
