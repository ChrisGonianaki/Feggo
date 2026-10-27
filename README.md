# FEGGO — Website

Bilingual (Greek / English) single-page website for FEGGO, custom lighting designed and made in Crete.

## Structure

```
index.html           Page content (Greek is the default text)
assets/css/style.css Brand styles (navy, cream, gold)
assets/js/main.js    EN translations, language switch, menu, scroll effects
assets/img/          Photography from the company presentation
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Language

- Greek by default; the EL / EN switch in the header remembers the choice.
- Link straight to English with `?lang=en`.
- To edit text: Greek lives in `index.html`, English in the `EN` object in `assets/js/main.js` (same `data-i18n` keys).

## Publishing

Static site with no build step, so it works on GitHub Pages (Settings → Pages → deploy from branch), Netlify, or any web host.
