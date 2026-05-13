# IAIRO Projects Wiki (Jekyll + GitHub Pages)

Research lab wiki for IAIRO. Tracks active and archived projects, publications, and media (demo videos, slides, image galleries).

## Local development

```bash
bundle install
bundle exec jekyll serve
# → http://127.0.0.1:4000
```

## Adding a project

Create a Markdown file in `_projects/`. The filename sets the URL slug (e.g. `_projects/2026-my-project.md` → `/projects/2026-my-project/`).

### Front matter reference

```yaml
---
title: Project Title          # required
summary: One-line description # required — shown on cards and used for SEO description
area: Embodied AI             # required — research area label
status: active                # required — "active" or "archived"
duration: 2026 – Present      # date range shown in the dossier
order: 10                     # integer; lower numbers appear first in the grid
featured: false               # set true on at most one active project to pin it above the grid
contact: name@iairo.ai        # project lead email (must contain "@" to render as a link)
external_link: https://...    # link to external resource or demo
paper_key: my-project         # key matching an entry in _data/papers.yml to link publications

# Media (all optional — remove unused lines)
youtube_id: dQw4w9WgXcQ       # YouTube video ID (part after ?v=)
slides_url: https://docs.google.com/presentation/d/ID/embed  # embeds slides inline
slides_link: https://docs.google.com/presentation/d/ID       # "open in new tab" link
gallery:
  - src: /assets/images/my-fig1.png
    alt: Architecture diagram
    caption: System overview (optional)
  - src: /assets/images/my-fig2.png
    alt: Results chart
---

Markdown body goes here. Supports headings, lists, code blocks, etc.
```

### Archiving a project

Change `status: active` to `status: archived`. The project moves to the Archived section automatically.

## Adding publications

Edit `_data/papers.yml`. The `paper_key` in a project file must match a top-level key here:

```yaml
papers:
  my-project:
    - year: 2025
      items:
        - title: "Paper Title"
          authors: "A. Author, B. Author"
          venue: "NeurIPS 2025"
          url: https://arxiv.org/abs/...
          abstract: "Optional abstract text."
```

## Customisation

| File | Purpose |
|---|---|
| `_config.yml` | Site title, org name, logo, mission, hero text |
| `assets/css/main.scss` | All styles (CSS custom properties at the top) |
| `_layouts/default.html` | Global HTML shell (head, topbar, sidebar, footer) |
| `_layouts/project.html` | Individual project page template |
| `_includes/project-card.html` | Card component used in the grid |
| `_includes/project-meta.html` | Dossier sidebar on project pages |

## Deploy to GitHub Pages

1. Push to GitHub.
2. Settings → Pages → Deploy from branch (`main`, root).
3. If hosted at `username.github.io/repo-name`, set `baseurl: "/repo-name"` in `_config.yml`.
