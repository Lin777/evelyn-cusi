# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build

To regenerate `index.html` from templates and data:

```bash
python scripts/build.py
```

Requires the `.venv` virtual environment (already present). If needed:

```bash
.venv/Scripts/activate  # Windows
pip install jinja2
```

There are no tests, linters, or dev servers configured.

## Architecture

This is a **static personal portfolio site** for Evelyn Cusi López. The source of truth is the templates + JSON data; `index.html` is a build artifact — never edit it directly.

### Build pipeline

```
data/*.json  +  templates/index.html (+ partials)
        ↓
   scripts/build.py   (Python + Jinja2)
        ↓
   index.html   ← deployed as-is
```

`scripts/build.py` loads three JSON files, renders `templates/index.html`, and writes the final `index.html` to the repo root.

### Content data (`data/`)

All user-facing content lives here. Every text field that appears in both languages uses the shape `{ "es": "...", "en": "..." }`.

- `profile.json` — name, title, subtitle, location, contact links, CTA text
- `experience.json` — array of jobs with `id`, `company`, `role`, `period`, `location`, `description`, `highlights`
- `projects.json` — array of projects with `id`, `category`, `title`, `description`, `metric`

### Templates (`templates/`)

`templates/index.html` is the root template. It receives `profile`, `experiences`, and `projects` as Jinja2 variables and includes nine partials from `templates/partials/` (navbar, hero, experience, impact, skills, certifications, life, footer, modal).

The built `index.html` also injects all JSON data as JS globals for runtime use:

```js
window.__EXPERIENCE_DATA__
window.__PROJECTS_DATA__
window.__PROFILE_DATA__
window.__LANG__
```

### Frontend (`assets/`)

- `assets/js/app.js` — handles bilingual language switching, infinite carousel (impact section), and modal logic; reads from the `window.__*_DATA__` globals injected at build time
- `assets/css/styles.css` — custom styles; Tailwind CSS is loaded via CDN in the template

The only active files under `assets/` are `css/styles.css`, `js/app.js`, and the images referenced in the templates (`favicon.ico`, `evelyn_cusi.jpeg`, `hackathon.jpg`, `cerro.jpg`, `gato.jpg`).

### Bilingualism

Language is set at build time via the `lang` variable in `scripts/build.py` (currently `"en"`). Runtime language switching is handled entirely in `app.js` by toggling `currentLang` and re-rendering text from the injected JSON globals. To add or change translated strings, edit the relevant JSON file — never hardcode text in templates.
