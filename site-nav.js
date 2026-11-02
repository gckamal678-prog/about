(() => {
  "use strict";

  const LANGUAGE_KEY = "kamalgc_portal_language";
  const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const readLanguage = () => {
    try {
      return localStorage.getItem(LANGUAGE_KEY) === "EN" ? "EN" : "NP";
    } catch {
      return "NP";
    }
  };

  const labels = {
    NP: {
      home: "🏠 Home",
      messages: "💬 Messages",
      notifications: "🔔 Notifications",
      settings: "⚙️ Settings",
      login: "🔐 Login",
      profile: "👤 Profile"
    },
    EN: {
      home: "🏠 Home",
      messages: "💬 Messages",
      notifications: "🔔 Notifications",
      settings: "⚙️ Settings",
      login: "🔐 Login",
      profile: "👤 Profile"
    }
  };

  const navItems = [
    { key: "home", href: "index.html", pages: ["index.html", "community.html"] },
    { key: "messages", href: "messages.html", pages: ["messages.html"] },
    { key: "notifications", href: "notifications.html", pages: ["notifications.html"] },
    { key: "settings", href: "settings.html", pages: ["settings.html", "profile.html"] }
  ];

  const style = document.createElement("style");
  style.textContent = `
    .ms-site-nav {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      display: flex;
      justify-content: center;
      padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
      background: rgba(11,18,32,.96);
      border-top: 1px solid rgba(255,255,255,.12);
      backdrop-filter: blur(16px);
    }
    .ms-site-nav-inner {
      width: min(900px,100%);
      display: grid;
      grid-template-columns: repeat(4,minmax(0,1fr));
      gap: 6px;
    }
    .ms-site-nav a {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 7px 5px;
      border-radius: 11px;
      color: #b8c5d8;
      text-decoration: none;
      font: 700 12px/1.3 system-ui,sans-serif;
      text-align: center;
      overflow-wrap: anywhere;
    }
    .ms-site-nav a:hover,
    .ms-site-nav a:focus-visible {
      background: rgba(105,183,255,.14);
      color: #fff;
      outline: none;
    }
    .ms-site-nav a[aria-current="page"] {
      background: rgba(105,183,255,.2);
      color: #8ccaff;
    }
    body.light-mode .ms-site-nav,
    body.light-theme .ms-site-nav {
      background: rgba(255,255,255,.96);
      border-top-color: rgba(0,0,0,.12);
    }
    body.light-mode .ms-site-nav a,
    body.light-theme .ms-site-nav a {
      color: #475569;
    }
    body.light-mode .ms-site-nav a[aria-current="page"],
    body.light-theme .ms-site-nav a[aria-current="page"] {
      color: #1d4ed8;
      background: rgba(37,99,235,.12);
    }
    @media(min-width:700px) {
      .ms-site-nav {
        top: 0;
        bottom: auto;
        padding: 8px 14px;
        border-top: 0;
        border-bottom: 1px solid rgba(255,255,255,.12);
      }
      .ms-site-nav-inner {
        display: flex;
        justify-content: flex-end;
      }
      .ms-site-nav a {
        min-width: 105px;
        padding: 10px 12px;
      }
      body {
        padding-top: 58px;
      }
    }
  `;
  document.head.appendChild(style);

  function renderNav() {
    const oldNav = document.querySelector(".ms-site-nav");
    if (oldNav) oldNav.remove();

    const language = readLanguage();
    const text = labels[language];
    const nav = document.createElement("nav");
    nav.className = "ms-site-nav";
    nav.setAttribute("aria-label", "Main navigation");

    const inner = document.createElement("div");
    inner.className = "ms-site-nav-inner";

    navItems.forEach(item => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = text[item.key];

      if (item.pages.includes(currentPage)) {
        link.setAttribute("aria-current", "page");
      }

      inner.appendChild(link);
    });

    nav.appendChild(inner);
    document.body.appendChild(nav);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderNav, { once: true });
  } else {
    renderNav();
  }

  window.addEventListener("storage", event => {
    if (event.key === LANGUAGE_KEY) renderNav();
  });
})();
