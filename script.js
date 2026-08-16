// ==========================================
// 0. Service Worker Registration (Offline Support)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered Successfully!'))
      .catch(err => console.log('Service Worker Registration Failed:', err));
  });
}

// ==========================================
// 1. Language State
// ==========================================
let currentLang = 'NP';

// ==========================================
// 2. Live Real-time Clock
// ==========================================
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const clockEl = document.getElementById('real-time');
  if (clockEl) {
    clockEl.innerText = timeString;
  }
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// 3. Dynamic Nepali Date
// ==========================================
function setNepaliDate() {
  const dateEl = document.getElementById('nepali-date');
  if (!dateEl) return;

  if (typeof bikramSambat !== 'undefined' || typeof NepaliFunctions !== 'undefined') {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const bsDate = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    dateEl.innerText = `${bsDate.year}-${bsDate.month}-${bsDate.day} वि.सं.`;
  } else {
    dateEl.innerText = "२०८२/११/०४"; // Fallback
  }
}
setNepaliDate();

// ==========================================
// 4. Automatic Location & Weather API (GPS बेस्ट)
// ==========================================
function getLiveLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Fetch Weather via Open-Meteo API
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          const tempEl = document.getElementById('weather-temp');
          if (tempEl) tempEl.innerText = `${data.current_weather.temperature}°C`;
        })
        .catch(() => {
          const tempEl = document.getElementById('weather-temp');
          if (tempEl) tempEl.innerText = "--°C";
        });

      // Fetch City Name via Reverse Geocoding API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          const city = data.address.city || data.address.town || data.address.state || "Nepal";
          const locEl = document.getElementById('user-location');
          if (locEl) locEl.innerText = city;
        })
        .catch(() => {
          const locEl = document.getElementById('user-location');
          if (locEl) locEl.innerText = "Nepal";
        });
    }, () => {
      const locEl = document.getElementById('user-location');
      if (locEl) locEl.innerText = "Location Off";
    });
  }
}
getLiveLocationAndWeather();

// ==========================================
// 5. Dark / Light Mode Switch
// ==========================================
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  
  const iconEl = document.getElementById('theme-icon');
  const textEl = document.getElementById('theme-text');

  if (iconEl) iconEl.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  if (textEl) textEl.innerText = isLight ? 'Light' : 'Dark';
}

// ==========================================
// 6. English / Nepali Language Toggle Engine
// ==========================================
function toggleLanguage() {
  currentLang = currentLang === 'NP' ? 'EN' : 'NP';
  
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.innerText = currentLang === 'NP' ? 'EN' : 'NP';

  // Translate all dynamic data attributes
  document.querySelectorAll('[data-np]').forEach(el => {
    el.innerText = currentLang === 'NP' ? el.getAttribute('data-np') : el.getAttribute('data-en');
  });
}
