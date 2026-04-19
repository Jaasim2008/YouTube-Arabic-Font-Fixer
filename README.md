# YouTube Arabic Font Fixer

Firefox extension (Manifest V2) that makes Arabic text on YouTube easier to read by letting you set **font family**, **size**, **weight**, and **line height**. Settings apply across video pages, search, comments, channels, playlists, and captions where YouTube exposes those elements to page-level CSS.

## Problem

Arabic text on YouTube is often small and uses fonts that are hard to read. This add-on injects custom CSS on `youtube.com` so you can tune typography for Arabic (and mixed) text without changing global browser fonts.

## Installation

### Temporary (development)

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **This Firefox** → **Load Temporary Add-on…**.
3. Select the `manifest.json` file inside this folder (`youtube-arabic-font/manifest.json`).

Temporary add-ons are removed when Firefox closes unless you reload them.

### Permanent

- Install a signed `.xpi` from [addons.mozilla.org](https://addons.mozilla.org/) once the extension is published, or
- Use **Firefox Developer Edition** / **Nightly** with unsigned extensions if you sign your own build (advanced).

## Usage

1. Open any `https://www.youtube.com` page.
2. Click the toolbar icon to open the popup.
3. Toggle **Enable extension**, pick **Font family**, **Font size** (12–32px), **Font weight**, and **Line height**.
4. Changes save automatically and update open YouTube tabs. Use the **Preview** area to see sample Arabic text with your settings.
5. **Reset to defaults** restores built-in defaults (16px, Traditional Arabic stack, normal weight, line height 1.6, extension on).

## Features

- Enable/disable without uninstalling
- Twelve Arabic-capable font stacks (Traditional Arabic, Tahoma, Noto, Amiri, Cairo, Tajawal, etc.)
- Font size slider 12–32px (default 16px)
- Font weight: Normal, 500, 600, Bold
- Line height: 1.4, 1.6, 1.8, 2.0
- Bilingual popup (English / Arabic labels)
- Live preview string: `هذا مثال على النص العربي في يوتيوب`
- Persists with `browser.storage.local`
- Targets titles, descriptions, formatted strings, comments, channel names, common search/playlist renderers, and caption segments (`.ytp-caption-segment`)

## Troubleshooting

| Issue | What to try |
|--------|-------------|
| Nothing changes | Confirm the extension is enabled (checkbox) and you are on `youtube.com`. Reload the tab once. |
| Only some text changes | YouTube uses Shadow DOM in many places. Page-level CSS cannot reach every internal subtree; some UI may not be styleable from a content script. |
| Styles flash or disappear | YouTube’s SPA updates the DOM often; the extension reapplies styles on navigation and mutations. If a page glitches, refresh. |
| Open tab did not update | The tab may not have injected the content script yet (e.g. just opened). Reload the page or switch away and back. |
| Temporary add-on disappeared | Reload the extension from `about:debugging` after restarting Firefox. |

## Publishing on AMO (summary)

1. Create a [Firefox Add-ons](https://addons.mozilla.org/developers/) developer account.
2. Zip the extension directory (include `manifest.json`, `content.js`, `popup/`, `icons/`, and this `README` as needed).
3. Submit the source (and build instructions if you minify or bundle — this project is plain source).
4. Provide an accurate listing: permissions `storage` and `*://*.youtube.com/*` are required to save settings and style YouTube pages.
5. Respond to reviewer questions; after approval, distribute the signed XPI or list it publicly.

## License

You may use and modify this project for personal or open-source distribution in line with Mozilla’s add-on policies.
