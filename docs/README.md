# Workflow Definitions landing page

This directory contains a dependency-free, bilingual (Japanese / English), interactive landing page for the public [Workflow Definitions](https://github.com/ryo0221/open-workflow-definitions) repository.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8000 --directory docs
```

Open http://localhost:8000 in a browser. All animations and interactions work without npm, a build step, or backend services.

## Publish with GitHub Pages

In the repository settings, choose **Pages → Build and deployment → Deploy from a branch → main → /docs**. Merge this PR before enabling Pages. The site uses relative asset paths and works under the default `/open-workflow-definitions/` Pages project path.

Publishing is an explicit repository setting; this PR does not enable Pages, change repository visibility, or add Actions workflows. Add a custom domain separately if needed.

## Design and behavior

- Japanese is the default language. JP / EN switches all first-party page copy and interactive examples. The preference is kept locally if storage is available; `?lang=en` overrides it.
- The hero graph animates connections and cycles through concepts until a visitor clicks a node. It stops animating the selected node automatically once a visitor chooses.
- The workflow explorer includes a simplified view of the publicly released `software-product` definition, plus five selected phases from each of the now-public manga and visual identity definitions. All three are explicitly simplified tours, not full workflow implementations.
- The reference-tracing illustration is not an implementation of impact analysis, review, approvals, or project-level verification.
- Respects `prefers-reduced-motion`; keyboard-operable tabs, buttons, and skip link are included.
- No telemetry, third-party scripts, backend, or build-time dependencies.

## Content boundaries

The public repository provides declarations, JSON Schema and basic definition checks. **It does not execute the workflow or automatically validate a project's actual artifacts, approvals, or quality.** These capabilities belong to a consuming host such as PaoBub or another application.

To edit translations, update the `ja` and `en` dictionaries in `app.js` together. The visible static Japanese text in `index.html` is a no-JavaScript fallback. Keep the examples explicitly labeled as selected / shortened tours rather than full workflow implementations.

## Files

- `index.html`: semantic page structure, illustration markup, links and metadata.
- `styles.css`: responsive layouts, original visual language and reduced-motion support.
- `app.js`: translations, graph inspector, workflow explorer, and trace demonstration.

Licensed under the repository's MIT License.
