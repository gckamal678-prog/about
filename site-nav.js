
(() => {
  "use strict";

  // एउटै navigation दोहोरिन नदिन
  if (window.__meroSathiNavStarted) return;
  window.__meroSathiNavStarted = true;

  const currentPage =
    location.pathname.split("/").pop() || "index.html";

  // तलको Navigation मा यी चारवटा मात्र
  const navItems = [
    {
      href: "index.html",
      icon: "⌂",
      ne: "Home",
      en: "Home"
    },
    {
      href: "messages.html",
      icon: "✉",
      ne: "सन्देश",
      en: "Message"
    },
    {
      href: "notifications.html",
      icon: "♢",
      ne: "सूचना",
      en: "Notifications"
    },
    {
      href: "settings.html",
      icon: "⚙",
      ne: "सेटिङ",
      en: "Setting"
    }
  ];

  // Navigation को CSS
  const style = document.createElement("style");

  style.textContent = `
    body {
      padding-bottom: 104px !important;
    }

    #mero-sathi-nav {
      position: fixed;
      z-index: 9990;
      left: 50%;
      bottom: max(10px, env(safe-area-inset-bottom));
      transform: translateX(-50%);
      width: min(720px, calc(100% - 18px));
      display: flex;
      justify-content: space-around;
      gap: 4px;
      padding: 8px;
      background: rgba(17, 28, 46, .97);
      color: #edf3fc;
      border: 1px solid rgba(255, 255, 255, .14);
      border-radius: 18px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, .35);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    #mero-sathi-nav a {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 7px 3px;
      border-radius: 12px;
      color: #aab8cc;
      text-decoration: none;
      font-family: inherit;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.3;
      white-space: nowrap;
    }

    #mero-sathi-nav .nav-icon {
      font-size: 20px;
      line-height: 1.2;
    }

    #mero-sathi-nav a.active {
      background: linear-gradient(
        120deg,
        #24486a,
        #3c3567
      );
      color: #fff;
    }

    #mero-sathi-nav a:focus-visible {
      outline: 2px solid #69b7ff;
      outline-offset: 2px;
    }

    @media (min-width: 700px) {
      #mero-sathi-nav {
        bottom: 16px;
        padding: 10px 14px;
      }

      #mero-sathi-nav a {
        font-size: 11px;
      }
    }
  `;

  document.head.appendChild(style);

  // Navigation बनाउने
  const nav = document.createElement("nav");

  nav.id = "mero-sathi-nav";
  nav.setAttribute("aria-label", "Main navigation");

  let english = false;

  try {
    english =
      localStorage.getItem("kamalgc_portal_language") === "EN";
  } catch (error) {}

  navItems.forEach(item => {
    const link = document.createElement("a");

    link.href = item.href;

    if (currentPage === item.href) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    const icon = document.createElement("span");
    icon.className = "nav-icon";
    icon.textContent = item.icon;

    const label = document.createElement("span");
    label.textContent = english ? item.en : item.ne;

    link.appendChild(icon);
    link.appendChild(label);

    nav.appendChild(link);
  });

  document.body.appendChild(nav);

})();
