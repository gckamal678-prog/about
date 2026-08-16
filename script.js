// १. Real-time Clock
function updateClock() {
  const now = new Date();
  document.getElementById('live-time').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// २. Nepali BS Date Calculation
function updateBSDate() {
  const now = new Date();
  // वि.सं. २०८३ को लागि सामान्य रूपान्तरण
  const bsYear = 2083;
  const months = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
  document.getElementById('bs-date').innerText = `वि.सं. ${bsYear} ${months[now.getMonth()]} ${now.getDate()}`;
}
updateBSDate();

// ३. Weather API (काठमाडौँको तापक्रम)
async function fetchWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=27.7172&longitude=85.3240&current_weather=true');
    const data = await res.json();
    document.getElementById('live-temp').innerText = `${Math.round(data.current_weather.temperature)}°C`;
  } catch (e) {
    document.getElementById('live-temp').innerText = '२५°C';
  }
}
fetchWeather();

// ४. Dark/Light Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('light-mode');
}
