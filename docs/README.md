# Workflow Definitions website

This directory contains the dependency-free Japanese / English landing page and the workflow library for [Workflow Definitions](https://github.com/ryo0221/open-workflow-definitions).

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000 --directory docs
```

Open http://localhost:8000. No package installation, build step, backend, telemetry or third-party scripts are required.

## GitHub Pages

After the website changes are merged, choose **Settings → Pages → Build and deployment → Deploy from a branch → main → /docs**, then save. The website uses relative asset paths and supports the `/open-workflow-definitions/` project path. `.nojekyll` keeps these assets as plain static files.

The website source and GitHub Pages enablement are separate operations. The source commit does not by itself enable Pages.

## Landing page

- Japanese is the default. JP / EN translates the landing page and its interactive examples. The preference is stored locally when available; `?lang=en` overrides it.
- The hero graph animates connections and cycles through concepts until a visitor chooses a node. Automatic changes do not announce through a live region.
- The interactive tour shows simplified excerpts from the software, manga and visual identity definitions.
- Keyboard navigation and reduced-motion preferences are supported.

## Workflow library

`workflows.html` introduces all six definitions at public commit `a6d827efeaeb9dc904d0350626f1450a9bc4b6ba`:

| Definition | Version | Phases | Deliverables |
| --- | --- | ---: | ---: |
| software-product | 1.7.0 | 13 | 18 |
| software-refactoring | 1.0.0 | 6 | 12 |
| fiction-novel | 1.2.0 | 12 | 21 |
| fiction-manga | 1.1.0 | 13 | 22 |
| visual-identity | 1.0.0 | 14 | 15 |
| japan-company-establishment | 1.0.0 | 16 | 19 |

All 74 phases are included, with source links, prerequisites, deliverables, expandable outlines and acceptance criteria. Category filters and shareable workflow/phase URLs support navigation.

Introductions, interface copy, phase names and section names are available in Japanese and English. Detailed purposes, deliverable names, outlines and criteria retain the original Japanese text; the English view explicitly identifies these as source excerpts. Keep both language dictionaries in sync when editing introductory copy.

The data in `catalog-data.js` is a bundled snapshot of those public definitions. Update its provenance commit and source links when refreshing the snapshot.

## Manga example

`assets/manga-workflow-digest.mp4` is a 44-second edit of the author-supplied `manga-workflow-demo-short.mp4`. It includes selected scenes of world/setting design, character artwork, storyboards, finishing and completed manga pages. The original recording is not included.

Source excerpts in seconds: 28–36, 68–73, 80–85, 110–118, 126–131, 147–153, 169–176. The clip uses H.264 High Level 4.1, yuv420p and fast-start metadata. It retains native controls and `playsinline`, without autoplay. The poster is taken from the edited clip.

## Content boundaries

These pages explain workflow definitions. Workflow execution, approval records, impact analysis and project artifact verification are responsibilities of the people and host tools using the definitions. The landing-page graphs are illustrative and do not perform those operations.

## Files

- `index.html`, `styles.css`, `app.js`: landing page and animated examples.
- `workflows.html`, `catalog.css`, `catalog.js`: workflow library and phase inspector.
- `catalog-data.js`: the six definition snapshots and introductory translations.
- `assets/`: edited manga sample and poster.

Code and definitions follow the repository's MIT License.
