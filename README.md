# YouTube Arabic Font Fixer

Firefox extension (**Manifest V2**) that improves **Arabic readability on YouTube** by letting you control **font family**, **size** (12–32px), **weight**, and **line height**. Settings are stored locally and applied on `youtube.com` via a content script that injects CSS.

**Open source**: contributions, issues, and forks are welcome.

## Contents

- [Why this exists](#why-this-exists)
- [Features](#features)
- [Repository layout](#repository-layout)
- [Permissions and privacy](#permissions-and-privacy)
- [Install from source](#install-from-source)
- [Usage](#usage)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Publishing](#publishing)
- [Contributing](#contributing)
- [License](#license)

## Why this exists

Arabic text on YouTube is often **too small** or uses **fonts that are hard to read**. This add-on injects stylesheet rules on YouTube pages so you can tune typography **without changing global browser fonts**. It does not alter video playback or YouTube accounts.

## Features

- **On/off** without uninstalling
- **12 font stacks** (e.g. Traditional Arabic, Tahoma, Noto Naskh/Sans, Amiri, Cairo, Tajawal, …)
- **Font size** slider: 12–32px (default 16px)
- **Font weight**: Normal, 500, 600, Bold
- **Line height**: 1.4, 1.6, 1.8, 2.0
- **Bilingual popup** (English / Arabic labels) with **live preview** (`هذا مثال على النص العربي في يوتيوب`)
- **Persistent settings** via `browser.storage.local`
- **Instant updates** to open YouTube tabs when options change
- Handles **SPA navigation** and **dynamic content** (observers + re-injected styles)

Targets include titles, descriptions, `yt-formatted-string`, comments, channel names, common search/playlist renderers, and caption segments (`.ytp-caption-segment`) **where page-level CSS can reach**. YouTube’s Shadow DOM can limit what any extension can style; see [Troubleshooting](#troubleshooting).

## Repository layout

```text
youtube-arabic-font/
├── manifest.json          # MV2 manifest, gecko id + data_collection_permissions
├── content.js             # Injects CSS, observers, messaging
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── icons/
│   ├── icon-48.png
│   └── icon-96.png
└── README.md
```

There is **no build step**: plain HTML, CSS, and JavaScript.

## Permissions and privacy

| Permission | Purpose |
|------------|---------|
| `storage` | Save your font settings between sessions |
| `*://*.youtube.com/*` | Apply styles and message open YouTube tabs from the popup |

The manifest declares **`data_collection_permissions`: `none`** (no built-in data collection for transmission). This project does **not** ship analytics or remote servers; settings stay in **Firefox’s local storage** on your device.

## Install from source

### Temporary load (good for development)

1. Clone or download this repository.
2. Open Firefox → `about:debugging#/runtime/this-firefox`.
3. **This Firefox** → **Load Temporary Add-on…**
4. Select `youtube-arabic-font/manifest.json`.

Temporary add-ons are cleared when Firefox exits unless you load them again.

### From AMO (recommended for end users)

When published, install the signed add-on from [Firefox Add-ons](https://addons.mozilla.org/) (search for the listing name or use the link from the project maintainer).

## Usage

1. Open any `https://www.youtube.com` page.
2. Click the toolbar icon.
3. Adjust **Enable**, **Font family**, **Size**, **Weight**, and **Line height**.
4. Changes save automatically; open YouTube tabs update when possible.
5. **Reset** restores defaults (16px, Traditional Arabic stack, normal weight, line height 1.6, enabled).

## Development

- **Minimum**: Firefox with WebExtensions (same profile as for testing).
- **Linting**: Optional; no bundler required.
- After editing files, reload the add-on on `about:debugging` or use **Reload** on the temporary extension card.

To verify messaging: open two YouTube tabs, change settings, confirm both update (or refresh a tab if the content script was not yet injected).

## Contributing

- **Issues**: Bug reports and feature ideas are welcome (include Firefox version and steps to reproduce).
- **Pull requests**: Keep changes focused; match existing style; test on YouTube (video page, search, comments).
- **Translations**: The popup is English + Arabic; improvements to wording or RTL layout are appreciated.

Please follow [Mozilla’s add-on policies](https://extensionworkshop.com/documentation/publish/add-on-policies/) when contributing.

## License

This project is **open source**. Add a `LICENSE` file at the root of the repository with the license you chose (for example **MIT**), and keep it **aligned** with the license you select on GitHub and on [addons.mozilla.org](https://addons.mozilla.org/) if you publish there.

If you are not the sole author, ensure you have the right to license contributions under those terms.
