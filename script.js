
"use strict";

// ==========================================
// 1. SERVICE WORKER REGISTRATION
// ==========================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => {
        console.log("Service Worker Registered Successfully!");
      })
      .catch(error => {
        console.warn("Service Worker Registration Failed:", error);
      });
  });
}


// ==========================================
// 2. LANGUAGE STATE
// ==========================================

let currentLang = "NP";


// ==========================================
// 3. LIVE REAL-TIME CLOCK
// ==========================================

function updateClock() {
  const clockEl = document.getElementById("real-time");

  if (!clockEl) return;

  clockEl.textContent = new Date().toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);


// ==========================================
// 4. LOCATION & WEATHER
// GPS चल्नेछ सम्बन्धित HTML Element भएमा मात्र
// ==========================================

function getLiveLocationAndWeather() {

  const tempEl = document.getElementById("weather-temp");
  const locEl = document.getElementById("user-location");

  // Weather र Location देखाउने ठाउँ नभए GPS नचलाउने
  if (!tempEl && !locEl) return;

  if (!navigator.geolocation) {
    if (locEl) locEl.textContent = "Location उपलब्ध छैन";
    if (tempEl) tempEl.textContent = "--°C";
    return;
  }

  navigator.geolocation.getCurrentPosition(

    async position => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // WEATHER
      if (tempEl) {
        try {

          const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
          );

          if (!weatherResponse.ok) {
            throw new Error("Weather API Error");
          }

          const weatherData = await weatherResponse.json();

          const temperature =
            weatherData.current_weather?.temperature;

          tempEl.textContent =
            temperature !== undefined
              ? `${temperature}°C`
              : "--°C";

        } catch (error) {

          console.warn("Weather Error:", error);
          tempEl.textContent = "--°C";

        }
      }


      // LOCATION NAME
      if (locEl) {
        try {

          const locationResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          if (!locationResponse.ok) {
            throw new Error("Location API Error");
          }

          const locationData = await locationResponse.json();

          const address = locationData.address || {};

          const city =
            address.city ||
            address.town ||
            address.village ||
            address.state ||
            "Unknown";

          locEl.textContent = city;

        } catch (error) {

          console.warn("Location Error:", error);
          locEl.textContent = "Location उपलब्ध छैन";

        }
      }

    },

    error => {

      console.warn("GPS Permission:", error.message);

      if (locEl) locEl.textContent = "Location Off";
      if (tempEl) tempEl.textContent = "--°C";

    },

    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }

  );
}

getLiveLocationAndWeather();


// ==========================================
// 5. DARK / LIGHT MODE SWITCH
// ==========================================

function toggleTheme() {

  document.body.classList.toggle("light-mode");

  const isLight =
    document.body.classList.contains("light-mode");

  const iconEl = document.getElementById("theme-icon");
  const textEl = document.getElementById("theme-text");

  if (iconEl) {
    iconEl.className = isLight
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";
  }

  if (textEl) {
    textEl.textContent = isLight ? "Light" : "Dark";
  }

}


// ==========================================
// 6. ENGLISH / NEPALI LANGUAGE TOGGLE
// ==========================================

function toggleLanguage() {

  currentLang = currentLang === "NP" ? "EN" : "NP";

  const langBtn = document.getElementById("lang-toggle");

  if (langBtn) {
    langBtn.textContent =
      currentLang === "NP" ? "EN" : "NP";
  }

  document.querySelectorAll("[data-np]").forEach(element => {

    const nepaliText = element.getAttribute("data-np");
    const englishText = element.getAttribute("data-en");

    const selectedText =
      currentLang === "NP" ? nepaliText : englishText;

    if (selectedText !== null) {
      element.textContent = selectedText;
    }

  });

}
