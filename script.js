let currentLang = 'NP';

// 1. Live Real-time Clock
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById('real-time').innerText = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// 2. Dynamic Nepali Date
function setNepaliDate() {
  if (typeof bikramSambat !== 'undefined' || typeof NepaliFunctions !== 'undefined') {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const bsDate = NepaliFunctions.AD2BS({ year: year, month: month, day: day });
    document.getElementById('nepali-date').innerText = `${bsDate.year}-${bsDate.month}-${bsDate.day} वि.सं.`;
  } else {
    document.getElementById('nepali-date').innerText = "२०८२/११/०४"; // Fallback
  }
}
setNepaliDate();

// 3. Automatic Location & Weather API (GPS बेस्ड)
function getLiveLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Fetch Weather & City via Open-Meteo & Reverse Geocoding API
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(data => {
          document.getElementById('weather-temp').innerText = `${data.current_weather.temperature}°C`;
        })
        .catch(() => {
          document.getElementById('weather-temp').innerText = "--°C";
        });

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(res => res.json())
        .then(data => {
          const city = data.address.city || data.address.town || data.address.state || "Nepal";
          document.getElementById('user-location').innerText = city;
        })
        .catch(() => {
          document.getElementById('user-location').innerText = "Nepal";
        });
    }, () => {
      document.getElementById('user-location').innerText = "Location Off";
    });
  }
}
getLiveLocationAndWeather();

// 4. Dark / Light Mode Switch
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('theme-icon').className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  document.getElementById('theme-text').innerText = isLight ? 'Light' : 'Dark';
}

// 5. English / Nepali Language Toggle Engine
function toggleLanguage() {
  currentLang = currentLang === 'NP' ? 'EN' : 'NP';
  document.getElementById('lang-toggle').innerText = currentLang === 'NP' ? 'EN' : 'NP';

  // Translate all dynamic data attributes
  document.querySelectorAll('[data-np]').forEach(el => {
    el.innerText = currentLang === 'NP' ? el.getAttribute('data-np') : el.getAttribute('data-en');
  });
}
