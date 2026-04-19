(function () {
  "use strict";

  const STORAGE_KEYS = ["enabled", "fontFamily", "fontSize", "fontWeight", "lineHeight"];

  const DEFAULTS = {
    enabled: true,
    fontFamily: "'Traditional Arabic', 'Arabic Typesetting', serif",
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: "1.6",
  };

  const FONT_OPTIONS = [
    {
      labelEn: "Traditional Arabic",
      labelAr: "Traditional Arabic",
      value: "'Traditional Arabic', 'Arabic Typesetting', serif",
    },
    {
      labelEn: "Simplified Arabic",
      labelAr: "Simplified Arabic",
      value: "'Simplified Arabic', 'Arabic Typesetting', serif",
    },
    { labelEn: "Tahoma", labelAr: "Tahoma", value: "Tahoma, Arial, sans-serif" },
    { labelEn: "Arial", labelAr: "Arial", value: "Arial, Helvetica, sans-serif" },
    {
      labelEn: "Segoe UI",
      labelAr: "Segoe UI",
      value: "'Segoe UI', Tahoma, Arial, sans-serif",
    },
    {
      labelEn: "Droid Arabic Naskh",
      labelAr: "Droid Arabic Naskh",
      value: "'Droid Arabic Naskh', 'Noto Naskh Arabic', serif",
    },
    {
      labelEn: "Droid Arabic Kufi",
      labelAr: "Droid Arabic Kufi",
      value: "'Droid Arabic Kufi', 'Noto Kufi Arabic', sans-serif",
    },
    {
      labelEn: "Noto Naskh Arabic",
      labelAr: "Noto Naskh Arabic",
      value: "'Noto Naskh Arabic', 'Amiri', serif",
    },
    {
      labelEn: "Noto Sans Arabic",
      labelAr: "Noto Sans Arabic",
      value: "'Noto Sans Arabic', 'Segoe UI', sans-serif",
    },
    { labelEn: "Amiri", labelAr: "أميري", value: "'Amiri', 'Noto Naskh Arabic', serif" },
    { labelEn: "Cairo", labelAr: "القاهرة", value: "'Cairo', 'Noto Sans Arabic', sans-serif" },
    { labelEn: "Tajawal", labelAr: "تجوال", value: "'Tajawal', 'Noto Sans Arabic', sans-serif" },
  ];

  const WEIGHT_OPTIONS = [
    { labelEn: "Normal", labelAr: "عادي", value: "normal" },
    { labelEn: "Medium (500)", labelAr: "متوسط (500)", value: "500" },
    { labelEn: "Semi-Bold (600)", labelAr: "شبه عريض (600)", value: "600" },
    { labelEn: "Bold", labelAr: "عريض", value: "bold" },
  ];

  const LINE_HEIGHT_OPTIONS = [
    { labelEn: "1.4", labelAr: "1.4", value: "1.4" },
    { labelEn: "1.6 (default)", labelAr: "1.6 (افتراضي)", value: "1.6" },
    { labelEn: "1.8", labelAr: "1.8", value: "1.8" },
    { labelEn: "2.0", labelAr: "2.0", value: "2.0" },
  ];

  const el = {
    enabled: document.getElementById("enabled"),
    fontFamily: document.getElementById("fontFamily"),
    fontSize: document.getElementById("fontSize"),
    fontSizeValue: document.getElementById("fontSizeValue"),
    fontWeight: document.getElementById("fontWeight"),
    lineHeight: document.getElementById("lineHeight"),
    preview: document.getElementById("preview"),
    reset: document.getElementById("reset"),
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

  function fillSelect(select, options, getLabel) {
    select.innerHTML = "";
    options.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = getLabel(opt);
      select.appendChild(o);
    });
  }

  function getCurrentSettings() {
    return {
      enabled: el.enabled.checked,
      fontFamily: el.fontFamily.value,
      fontSize: Number(el.fontSize.value),
      fontWeight: el.fontWeight.value,
      lineHeight: el.lineHeight.value,
    };
  }

  function applyPreview(settings) {
    const p = el.preview;
    if (!settings.enabled) {
      p.style.opacity = "0.5";
      p.style.fontFamily = "";
      p.style.fontSize = "";
      p.style.fontWeight = "";
      p.style.lineHeight = "";
      return;
    }
    p.style.opacity = "1";
    p.style.fontFamily = settings.fontFamily;
    p.style.fontSize = settings.fontSize + "px";
    p.style.fontWeight = settings.fontWeight;
    p.style.lineHeight = settings.lineHeight;
  }

  function setUIFromSettings(settings) {
    el.enabled.checked = settings.enabled;
    el.fontFamily.value = settings.fontFamily;
    if (![...el.fontFamily.options].some((o) => o.value === settings.fontFamily)) {
      const o = document.createElement("option");
      o.value = settings.fontFamily;
      o.textContent = settings.fontFamily;
      el.fontFamily.appendChild(o);
      el.fontFamily.value = settings.fontFamily;
    }
    el.fontSize.value = String(settings.fontSize);
    el.fontSizeValue.textContent = settings.fontSize + "px";
    el.fontWeight.value = settings.fontWeight;
    el.lineHeight.value = settings.lineHeight;
    applyPreview(settings);
  }

  async function saveAndBroadcast(settings) {
    await browser.storage.local.set(settings);
    try {
      const tabs = await browser.tabs.query({ url: "*://*.youtube.com/*" });
      for (const tab of tabs) {
        try {
          await browser.tabs.sendMessage(tab.id, {
            type: "applySettings",
            settings: settings,
          });
        } catch (err) {
          /* tab may not have content script yet */
        }
      }
    } catch (err) {
      /* ignore */
    }
  }

  function wireControls() {
    const onChange = () => {
      const settings = getCurrentSettings();
      el.fontSizeValue.textContent = settings.fontSize + "px";
      applyPreview(settings);
      saveAndBroadcast(settings);
    };

    el.enabled.addEventListener("change", onChange);
    el.fontFamily.addEventListener("change", onChange);
    el.fontSize.addEventListener("input", onChange);
    el.fontSize.addEventListener("change", onChange);
    el.fontWeight.addEventListener("change", onChange);
    el.lineHeight.addEventListener("change", onChange);

    el.reset.addEventListener("click", async () => {
      setUIFromSettings(DEFAULTS);
      await saveAndBroadcast({ ...DEFAULTS });
    });
  }

  function init() {
    fillSelect(el.fontFamily, FONT_OPTIONS, (o) => o.labelEn + " — " + o.labelAr);
    fillSelect(el.fontWeight, WEIGHT_OPTIONS, (o) => o.labelEn + " — " + o.labelAr);
    fillSelect(el.lineHeight, LINE_HEIGHT_OPTIONS, (o) => o.labelEn + " — " + o.labelAr);

    wireControls();

    browser.storage.local.get(STORAGE_KEYS).then((stored) => {
      setUIFromSettings(mergeSettings(stored));
    });
  }

  init();
})();
