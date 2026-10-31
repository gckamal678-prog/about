
(() => {
  "use strict";

  if (document.getElementById("kamal-common-nav")) return;

  const links = [
    { href: "index.html", icon: "⌂", ne: "Home", en: "Home" },
    { href: "emergency.html", icon: "🚨", ne: "आपतकालीन", en: "Emergency" },
    { href: "community.html", icon: "♡", ne: "Community", en: "Community" },
    { href: "messages.html", icon: "✉", ne: "सन्देश", en: "Messages" },
    { href: "notifications.html", icon: "♢", ne: "सूचना", en: "Alerts" },
    { href: "profile.html", icon: "◎", ne: "Profile", en: "Profile" },
    { href: "settings.html", icon: "⚙", ne: "सेटिङ", en: "Settings" }
  ];

  const currentPage = location.pathname.split("/").pop() || "index.html";

  const style = document.createElement("style");
  style.id = "kamal-common-nav-style";
  style.textContent = `
    body { padding-bottom: 88px !important; }

    #kamal-common-nav {
      position: fixed;
      z-index: 9990;
      left: 50%;
      bottom: max(12px, env(safe-area-inset-bottom));
      transform: translateX(-50%);
      width: min(900px, calc(100% - 24px));
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 5px;
      padding: 9px;
      overflow-x: auto;
      background: rgba(17, 28, 46, .96);
      color: #edf3fc;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 18px;
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      scrollbar-width: none;
    }

    #kamal-common-nav::-webkit-scrollbar { display: none; }

    #kamal-common-nav a {
      flex: 1 0 76px;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 7px 5px;
      border-radius: 12px;
      color: #aab8cc;
      text-decoration: none;
      font-family: inherit;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
      transition: .2s ease;
    }

    #kamal-common-nav a .nav-icon {
      font-size: 19px;
      line-height: 1.2;
    }

    #kamal-common-nav a:hover {
      background: rgba(255,255,255,.08);
      color: #fff;
    }

    #kamal-common-nav a.active {
      background: linear-gradient(120deg, #24486a, #3c3567);
      color: #fff;
    }

    #kamal-common-nav a:focus-visible {
      outline: 2px solid #69b7ff;
      outline-offset: 2px;
    }

    @media (min-width: 701px) {
      #kamal-common-nav {
        bottom: 18px;
        padding: 10px 13px;
      }

      #kamal-common-nav a {
        flex-basis: 100px;
        font-size: 11px;
      }

      #kamal-common-nav a .nav-icon {
        font-size: 20px;
      }
    }

    @media (max-width: 390px) {
      #kamal-common-nav {
        width: calc(100% - 14px);
        bottom: max(7px, env(safe-area-inset-bottom));
        padding: 6px 4px;
        gap: 2px;
      }

      #kamal-common-nav a {
        flex-basis: 68px;
        padding: 7px 3px;
        font-size: 9px;
      }

      #kamal-common-nav a .nav-icon {
        font-size: 17px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #kamal-common-nav a { transition: none; }
    }
  `;

  document.head.appendChild(style);

  const nav = document.createElement("nav");
  nav.id = "kamal-common-nav";
  nav.setAttribute("aria-label", "Main navigation");

  const englishMode = document.body.classList.contains("english-mode");

  links.forEach(item => {
    const link = document.createElement("a");
    link.href = item.href;

    const active = currentPage === item.href;
    if (active) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    const icon = document.createElement("span");
    icon.className = "nav-icon";
    icon.textContent = item.icon;

    const label = document.createElement("span");
    label.textContent = englishMode ? item.en : item.ne;

    link.append(icon, label);
    nav.appendChild(link);
  });

  document.body.appendChild(nav);
})();
