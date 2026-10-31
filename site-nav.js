
(() => {
  "use strict";

  const SUPABASE_URL = "https://zbyntmyybhdcwmttkuys.supabase.co";
  const SUPABASE_KEY = "sb_publishable_N8U3og_Ntm-ImrtM8c1NGA_-Rqb3dSy";

  if (window.__kamalNavStarted) return;
  window.__kamalNavStarted = true;

  const $ = id => document.getElementById(id);

  const publicLinks = [
    { href: "index.html", icon: "⌂", ne: "Home", en: "Home" },
    { href: "emergency.html", icon: "🚨", ne: "आपतकालीन", en: "Emergency" },
    { href: "community.html", icon: "♡", ne: "Community", en: "Community" }
  ];

  const privateLinks = [
    { href: "profile.html", icon: "◎", ne: "Profile", en: "Profile" },
    { href: "messages.html", icon: "✉", ne: "सन्देश", en: "Messages" },
    { href: "notifications.html", icon: "♢", ne: "सूचना", en: "Alerts" },
    { href: "settings.html", icon: "⚙", ne: "सेटिङ", en: "Settings" }
  ];

  const currentPage = location.pathname.split("/").pop() || "index.html";

  function isEnglish() {
    try {
      return localStorage.getItem("kamalgc_portal_language") === "EN";
    } catch {
      return document.body.classList.contains("english-mode");
    }
  }

  function loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
      if (window.supabase?.createClient) {
        resolve();
        return;
      }

      const existing = document.querySelector(
        'script[data-kamal-supabase="true"]'
      );

      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.dataset.kamalSupabase = "true";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Supabase library load failed"));
      document.head.appendChild(script);
    });
  }

  const style = document.createElement("style");
  style.id = "kamal-common-nav-style";
  style.textContent = `
    body { padding-bottom: 90px !important; }

    #kamal-common-nav {
      position: fixed;
      z-index: 9990;
      left: 50%;
      bottom: max(12px, env(safe-area-inset-bottom));
      transform: translateX(-50%);
      width: min(960px, calc(100% - 20px));
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 4px;
      padding: 8px;
      overflow-x: auto;
      background: rgba(17, 28, 46, .97);
      color: #edf3fc;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 18px;
      box-shadow: 0 12px 40px rgba(0,0,0,.35);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      scrollbar-width: none;
    }

    #kamal-common-nav::-webkit-scrollbar { display: none; }

    #kamal-common-nav a,
    #kamal-common-nav button {
      flex: 1 0 70px;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 7px 4px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: #aab8cc;
      text-decoration: none;
      font-family: inherit;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: .2s ease;
    }

    #kamal-common-nav .nav-icon {
      font-size: 19px;
      line-height: 1.2;
    }

    #kamal-common-nav a:hover,
    #kamal-common-nav button:hover {
      background: rgba(255,255,255,.08);
      color: #fff;
    }

    #kamal-common-nav a.active {
      background: linear-gradient(120deg, #24486a, #3c3567);
      color: #fff;
    }

    #kamal-common-nav .nav-logout {
      color: #ff9aaa;
    }

    #kamal-common-nav .nav-logout:disabled {
      opacity: .55;
      cursor: wait;
    }

    #kamal-common-nav a:focus-visible,
    #kamal-common-nav button:focus-visible {
      outline: 2px solid #69b7ff;
      outline-offset: 2px;
    }

    @media (min-width: 701px) {
      #kamal-common-nav {
        bottom: 18px;
        padding: 10px 13px;
      }
      #kamal-common-nav a,
      #kamal-common-nav button {
        flex-basis: 95px;
        font-size: 11px;
      }
      #kamal-common-nav .nav-icon { font-size: 20px; }
    }

    @media (max-width: 390px) {
      #kamal-common-nav {
        width: calc(100% - 12px);
        bottom: max(7px, env(safe-area-inset-bottom));
        padding: 6px 3px;
        gap: 1px;
      }
      #kamal-common-nav a,
      #kamal-common-nav button {
        flex-basis: 62px;
        padding: 7px 2px;
        font-size: 9px;
      }
      #kamal-common-nav .nav-icon { font-size: 17px; }
    }

    @media (prefers-reduced-motion: reduce) {
      #kamal-common-nav a,
      #kamal-common-nav button { transition: none; }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement("nav");
  nav.id = "kamal-common-nav";
  nav.setAttribute("aria-label", "Main navigation");
  document.body.appendChild(nav);

  let supabaseClient = null;
  let authSubscription = null;

  function addLink(item, english) {
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

    link.append(icon, label);
    nav.appendChild(link);
  }

  function addLogoutButton(english) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nav-logout";

    const icon = document.createElement("span");
    icon.className = "nav-icon";
    icon.textContent = "↪";

    const label = document.createElement("span");
    label.textContent = english ? "Logout" : "Logout";

    button.append(icon, label);

    button.addEventListener("click", async () => {
      if (!supabaseClient) return;

      const confirmText = english
        ? "Are you sure you want to logout?"
        : "के तपाईं Logout गर्न चाहनुहुन्छ?";

      if (!window.confirm(confirmText)) return;

      button.disabled = true;
      label.textContent = english ? "Logging out..." : "Logout हुँदैछ...";

      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;

        location.replace("community.html");
      } catch (error) {
        console.error("Logout error:", error);
        alert(
          english
            ? "Logout failed. Please try again."
            : "Logout हुन सकेन। फेरि प्रयास गर्नुहोस्।"
        );
        button.disabled = false;
        label.textContent = "Logout";
      }
    });

    nav.appendChild(button);
  }

  function renderNavigation(isLoggedIn) {
    const english = isEnglish();
    nav.replaceChildren();

    publicLinks.forEach(item => addLink(item, english));

    if (isLoggedIn) {
      privateLinks.forEach(item => addLink(item, english));
      addLogoutButton(english);
    }
  }

  async function startNavigation() {
    try {
      await loadSupabaseLibrary();

      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

      const { data, error } = await supabaseClient.auth.getSession();
      if (error) throw error;

      renderNavigation(!!data.session?.user);

      const { data: listener } = supabaseClient.auth.onAuthStateChange(
        (_event, session) => {
          renderNavigation(!!session?.user);
        }
      );

      authSubscription = listener.subscription;

    } catch (error) {
      console.error("Navigation authentication error:", error);
      renderNavigation(false);
    }
  }

  startNavigation();

  // भाषा परिवर्तन भएपछि Navigation का शब्द पनि परिवर्तन गर्ने
  window.addEventListener("storage", event => {
    if (event.key === "kamalgc_portal_language") {
      const loggedIn = !!supabaseClient;
      if (loggedIn) {
        supabaseClient.auth.getSession().then(({ data }) => {
          renderNavigation(!!data.session?.user);
        });
      } else {
        renderNavigation(false);
      }
    }
  });
})();
