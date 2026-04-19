(function () {
  "use strict";

  const STYLE_ID = "youtube-arabic-font-fixer-styles";
  const STORAGE_KEYS = ["enabled", "fontFamily", "fontSize", "fontWeight", "lineHeight"];

  const DEFAULTS = {
    enabled: true,
    fontFamily: "'Traditional Arabic', 'Arabic Typesetting', serif",
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: "1.6",
  };

  function mergeSettings(stored) {
    return {
      enabled: typeof stored.enabled === "boolean" ? stored.enabled : DEFAULTS.enabled,
      fontFamily: typeof stored.fontFamily === "string" && stored.fontFamily
        ? stored.fontFamily
        : DEFAULTS.fontFamily,
      fontSize: typeof stored.fontSize === "number" && !Number.isNaN(stored.fontSize)
        ? stored.fontSize
        : DEFAULTS.fontSize,
      fontWeight: typeof stored.fontWeight === "string" && stored.fontWeight
        ? stored.fontWeight
        : DEFAULTS.fontWeight,
      lineHeight: typeof stored.lineHeight === "string" && stored.lineHeight
        ? stored.lineHeight
        : DEFAULTS.lineHeight,
    };
  }

  function buildCss(settings) {
    if (!settings.enabled) {
      return "";
    }
    const ff = settings.fontFamily;
    const fs = settings.fontSize;
    const fw = settings.fontWeight;
    const lh = settings.lineHeight;

    const selectors = [
      "#video-title",
      "#video-title *",
      "h1.title",
      "h1.title *",
      "#description",
      "#description *",
      "yt-formatted-string",
      "yt-formatted-string *",
      "#content-text",
      "#content-text *",
      "#channel-name",
      "#channel-name *",
      "ytd-video-renderer #video-title",
      "ytd-video-renderer #video-title *",
      "ytd-playlist-video-renderer #video-title",
      "ytd-playlist-video-renderer #video-title *",
      "ytd-compact-video-renderer #video-title",
      "ytd-compact-video-renderer #video-title *",
      "ytd-playlist-panel-video-renderer #video-title",
      "ytd-playlist-panel-video-renderer #video-title *",
      ".ytp-caption-segment",
      ".ytp-caption-segment *",
    ].join(",\n");

    return (
      selectors +
      " {\n" +
      "  font-family: " +
      ff +
      " !important;\n" +
      "  font-size: " +
      fs +
      "px !important;\n" +
      "  font-weight: " +
      fw +
      " !important;\n" +
      "  line-height: " +
      lh +
      " !important;\n" +
      "}\n"
    );
  }

  let cachedSettings = null;

  function applyStyles(settings) {
    cachedSettings = settings;
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      existing.remove();
    }
    if (!settings || !settings.enabled) {
      return;
    }
    const css = buildCss(settings);
    if (!css) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  async function loadFromStorageAndApply() {
    const stored = await browser.storage.local.get(STORAGE_KEYS);
    applyStyles(mergeSettings(stored));
  }

  function applyFromMessage(settings) {
    if (settings) {
      applyStyles(mergeSettings(settings));
      return;
    }
    loadFromStorageAndApply();
  }

  loadFromStorageAndApply();

  browser.runtime.onMessage.addListener((message) => {
    try {
      if (message && message.type === "applySettings") {
        applyFromMessage(message.settings);
      }
    } catch (e) {
      /* ignore */
    }
  });

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }
    const hit = STORAGE_KEYS.some((k) => Object.prototype.hasOwnProperty.call(changes, k));
    if (hit) {
      loadFromStorageAndApply();
    }
  });

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => {
        loadFromStorageAndApply();
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });

  let debounceTimer = null;
  new MutationObserver(() => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      if (cachedSettings) {
        applyStyles(cachedSettings);
      } else {
        loadFromStorageAndApply();
      }
    }, 150);
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
})();
