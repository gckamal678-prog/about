"use strict";

// ==========================================
// KAMAL G.C. — COMMON SITE FEATURES
// ==========================================

// LIVE CLOCK
function updateClock() {
  const clockEl = document.getElementById("real-time");
  if (!clockEl) return;

  clockEl.textContent = new Date().toLocaleTimeString("ne-NP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}

updateClock();
setInterval(updateClock, 1000);


// LOCATION & WEATHER
async function getLiveLocationAndWeather() {
  const tempEl = document.getElementById("weather-temp");
  const locEl = document.getElementById("user-location");
  const conditionEl = document.getElementById("weather-condition");

  if (!tempEl && !locEl && !conditionEl) return;

  if (!navigator.geolocation) {
    if (tempEl) tempEl.textContent = "--°C";
    if (locEl) locEl.textContent = "स्थान उपलब्ध छैन";
    return;
  }

  if (locEl) locEl.textContent = "स्थान खोज्दै...";
  if (tempEl) tempEl.textContent = "लोड हुँदै...";

  navigator.geolocation.getCurrentPosition(
    async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // WEATHER
      try {
        const weatherURL =
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;

        const response = await fetch(weatherURL);

        if (!response.ok) throw new Error("Weather unavailable");

        const data = await response.json();
        const current = data.current;

        if (tempEl) {
          tempEl.textContent =
            current?.temperature_2m != null
              ? `${Math.round(current.temperature_2m)}°C`
              : "--°C";
        }

        if (conditionEl) {
          conditionEl.textContent =
            getWeatherDescription(current?.weather_code);
        }
      } catch (error) {
        console.warn("Weather error:", error);
        if (tempEl) tempEl.textContent = "--°C";
        if (conditionEl) conditionEl.textContent = "मौसम उपलब्ध छैन";
      }

      // LOCATION NAME
      if (locEl) {
        try {
          const locationURL =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

          const response = await fetch(locationURL);

          if (!response.ok) throw new Error("Location unavailable");

          const data = await response.json();
          const address = data.address || {};

          locEl.textContent =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state ||
            "स्थान भेटिएन";
        } catch (error) {
          console.warn("Location name error:", error);
          locEl.textContent = "स्थान उपलब्ध छैन";
        }
      }
    },

    error => {
      console.warn("Location permission:", error.message);

      if (locEl) locEl.textContent = "Location अनुमति आवश्यक";
      if (tempEl) tempEl.textContent = "--°C";
      if (conditionEl) conditionEl.textContent = "मौसम हेर्न Location खोल्नुहोस्";
    },

    {
      enableHighAccuracy: false,
      timeout: 12000,
      maximumAge: 300000
    }
  );
}


// WEATHER CODE DESCRIPTION
function getWeatherDescription(code) {
  if (code === 0) return "सफा आकाश";
  if ([1, 2].includes(code)) return "आंशिक बादल";
  if (code === 3) return "बादल लागेको";
  if ([45, 48].includes(code)) return "हुस्सु";
  if ([51, 53, 55, 56, 57].includes(code)) return "सिमसिम पानी";
  if ([61, 63, 65, 66, 67].includes(code)) return "वर्षा";
  if ([71, 73, 75, 77].includes(code)) return "हिमपात";
  if ([80, 81, 82].includes(code)) return "वर्षाको सम्भावना";
  if ([95, 96, 99].includes(code)) return "चट्याङसहित वर्षा";
  return "मौसम जानकारी";
}

getLiveLocationAndWeather();


// DARK / LIGHT THEME HELPER
function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");

  try {
    localStorage.setItem(
      "kamalgc_portal_theme",
      isLight ? "light" : "dark"
    );
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }

  const iconEl = document.getElementById("theme-icon");
  const textEl = document.getElementById("theme-text");

  if (iconEl) iconEl.textContent = isLight ? "☀" : "☾";
  if (textEl) textEl.textContent = isLight ? "Light" : "Dark";
}


// NEPALI / ENGLISH LANGUAGE HELPER
let currentLang = "NP";

function toggleLanguage() {
  currentLang = currentLang === "NP" ? "EN" : "NP";

  const langButton = document.getElementById("lang-toggle");

  if (langButton) {
    langButton.textContent = currentLang === "NP" ? "EN" : "NP";
  }

  document.querySelectorAll("[data-np]").forEach(element => {
    const selectedText =
      currentLang === "NP"
        ? element.getAttribute("data-np")
        : element.getAttribute("data-en");

    if (selectedText !== null) {
      element.textContent = selectedText;
    }
  });
}


// SERVICE WORKER — REGISTER ONLY ONCE
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Kamal G.C. site is ready."))
      .catch(error => console.warn("Service Worker error:", error));
  });
}
