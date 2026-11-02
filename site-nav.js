(() => {
  "use strict";

  const LANGUAGE_KEY = "kamalgc_portal_language";
  const THEME_KEY = "kamalgc_portal_theme";

  const currentFile = (location.pathname.split("/").pop() || "index.html")
    .toLowerCase();

  const language = localStorage.getItem(LANGUAGE_KEY) || "NP";
  const isNepali = language === "NP";

  const items = [
    {
      href: "index.html",
      icon: "⌂",
      en: "Home",
      np: "गृहपृष्ठ",
      active: ["index.html", "", "community.html"]
    },
    {
      href: "settings.html",
      icon: "⚙",
      en: "Settings",
      np: "सेटिङ",
      active: ["settings.html", "profile.html"]
    },
    {
      href: "login.html",
      icon: "↪",
      en: "Login",
      np: "लगइन",
      active: ["login.html"]
    }
  ];

  const nav = document.createElement("nav");
  nav.id = "shared-site-nav";
  nav.setAttribute("aria-label", isNepali ? "मुख्य नेभिगेसन" : "Main navigation");

  nav.innerHTML = `
    <style>
      #shared-site-nav {
        position: fixed;
        z-index: 9999;
        left: 50%;
        bottom: max(8px, env(safe-area-inset-bottom));
        transform: translateX(-50%);
        width: min(560px, calc(100% - 16px));
        display: flex;
        justify-content: space-around;
        gap: 5px;
        padding: 7px;
        border: 1px solid var(--line, rgba(150,170,200,.2));
        border-radius: 17px;
        background: var(--nav-bg, rgba(17,28,46,.96));
        color: var(--nav-text, #eef4ff);
        box-shadow: 0 8px 30px rgba(0,0,0,.25);
        backdrop-filter: blur(16px);
        font-family: inherit;
      }
      #shared-site-nav a {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 7px 3px;
        border-radius: 11px;
        color: var(--nav-muted, #aab8cc);
        text-decoration: none;
        font-size: 11px;
        font-weight: 700;
      }
      #shared-site-nav a.active {
        color: var(--nav-active-text, #fff);
        background: var(--nav-active-bg, linear-gradient(120deg,#24486a,#3c3567));
      }
      #shared-site-nav .nav-icon { font-size: 18px; line-height: 1.2; }
      body { padding-bottom: 100px !important; }
      @media (min-width: 850px) {
        #shared-site-nav {
          top: 12px;
          bottom: auto;
          left: auto;
          right: 16px;
          transform: none;
          width: auto;
          border-radius: 14px;
        }
        #shared-site-nav a {
          flex-direction: row;
          gap: 7px;
          padding: 9px 14px;
        }
        body { padding-bottom: 24px !important; }
      }
    </style>
  `;

  items.forEach(item => {
    const link = document.createElement("a");
    link.href = item.href;

    if (item.active.includes(currentFile)) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    link.innerHTML = `
      <span class="nav-icon" aria-hidden="true">${item.icon}</span>
      <span>${isNepali ? item.np : item.en}</span>
    `;

    nav.appendChild(link);
  });

  // Add a language switch that updates the shared preference.
  const languageButton = document.createElement("button");
  languageButton.type = "button";
  languageButton.textContent = isNepali ? "EN" : "ने";
  languageButton.setAttribute(
    "aria-label",
    isNepali ? "Switch to English" : "नेपालीमा बदल्नुहोस्"
  );

  languageButton.style.cssText = `
    flex: 0 0 auto;
    border: 1px solid var(--line, rgba(150,170,200,.25));
    border-radius: 10px;
    padding: 7px 10px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  `;

  languageButton.addEventListener("click", () => {
    const nextLanguage = isNepali ? "EN" : "NP";
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    location.reload();
  });

  nav.appendChild(languageButton);

  // Apply the saved theme preference when available.
  const theme = localStorage.getItem(THEME_KEY);
  if (theme === "light") {
    nav.style.setProperty("--nav-bg", "rgba(255,255,255,.96)");
    nav.style.setProperty("--nav-text", "#172033");
    nav.style.setProperty("--nav-muted", "#536078");
    nav.style.setProperty("--nav-active-text", "#fff");
    nav.style.setProperty("--nav-active-bg", "linear-gradient(120deg,#3678b8,#7255b5)");
  }

  // Replace any older page-specific navigation to prevent duplicates.
  document.querySelectorAll("#main-nav, #site-nav").forEach(oldNav => {
    oldNav.remove();
  });

  document.body.appendChild(nav);
})();
