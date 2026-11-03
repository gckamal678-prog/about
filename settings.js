(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  const db = () => window.meroSathiSupabase;
  const user = () => window.meroSathiGetUser?.() || null;

  const message = text => {
    const host = $("#settingsMessage");
    if (host) host.textContent = String(text || "");
    window.showToast?.(text);
  };

  const STORAGE_KEY = "mero-sathi-settings";

  const defaults = {
    theme: "system",
    language: "ne",
    activeStatus: true,
    notifications: true
  };

  const translations = {
    ne: {
      settings: "सेटिङ",
      settingsSubtitle: "आफ्नो एप र खाता व्यवस्थापन गर्नुहोस्।",
      appearance: "देखावट",
      theme: "Theme",
      language: "भाषा",
      privacy: "गोपनीयता",
      activeStatus: "Active Status",
      notifications: "सूचनाहरू",
      blockedUsers: "Block गरिएका प्रयोगकर्ता",
      account: "खाता",
      displayName: "देखिने नाम",
      save: "Save",
      newPassword: "नयाँ Password",
      changePassword: "Password परिवर्तन",
      logout: "Logout",
      deleteAccount: "खाता मेटाउनुहोस्",
      helpAbout: "Help / About",
      helpText: "सहयोगका लागि आफ्नो समस्या स्पष्ट रूपमा लेख्नुहोस्।"
    },
    en: {
      settings: "Settings",
      settingsSubtitle: "Manage your app and account.",
      appearance: "Appearance",
      theme: "Theme",
      language: "Language",
      privacy: "Privacy",
      activeStatus: "Active Status",
      notifications: "Notifications",
      blockedUsers: "Blocked users",
      account: "Account",
      displayName: "Display name",
      save: "Save",
      newPassword: "New password",
      changePassword: "Change password",
      logout: "Log out",
      deleteAccount: "Delete account",
      helpAbout: "Help / About",
      helpText: "Describe your issue clearly when asking for help."
    }
  };

  function readSettings() {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
      return { ...defaults };
    }
  }

  let settings = readSettings();

  function saveLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  function applyTheme() {
    const selected = settings.theme;
    const effective = selected === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : selected;

    window.meroSathiSetTheme?.(effective);

    document.documentElement.dataset.themePreference = selected;
  }

  function applyLanguage() {
    const dict = translations[settings.language] || translations.ne;

    document.documentElement.lang = settings.language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (dict[key]) element.textContent = dict[key];
    });
  }

  function renderSettings() {
    $("#settingTheme").value = settings.theme;
    $("#settingLanguage").value = settings.language;
    $("#settingActiveStatus").checked = settings.activeStatus;
    $("#settingNotifications").checked = settings.notifications;

    applyTheme();
    applyLanguage();
  }

  async function loadProfile() {
    const current = user();
    const client = db();
    if (!current || !client) return;

    const { data, error } = await client
      .from("profiles")
      .select("display_name")
      .eq("id", current.id)
      .maybeSingle();

    if (error) {
      message(`Profile लोड भएन: ${error.message}`);
      return;
    }

    $("#settingDisplayName").value = data?.display_name || "";
  }

  async function saveProfile() {
    const current = user();
    const client = db();
    const displayName = $("#settingDisplayName").value.trim();

    if (!current || !client) return message("पहिले login गर्नुहोस्।");
    if (displayName.length < 2) return message("नाम कम्तीमा २ अक्षरको हुनुपर्छ।");

    const { error } = await client
      .from("profiles")
      .upsert({ id: current.id, display_name: displayName });

    if (error) return message(`Save भएन: ${error.message}`);
    message("Profile Save भयो।");
  }

  async function changePassword() {
    const current = user();
    const client = db();
    const password = $("#settingNewPassword").value;

    if (!current || !client) return message("पहिले login गर्नुहोस्।");
    if (password.length < 8) return message("Password कम्तीमा ८ अक्षरको हुनुपर्छ।");

    const { error } = await client.auth.updateUser({ password });
    if (error) return message(`Password परिवर्तन भएन: ${error.message}`);

    $("#settingNewPassword").value = "";
    message("Password परिवर्तन भयो।");
  }

  async function loadBlockedUsers() {
    const current = user();
    const client = db();
    const host = $("#settingsBlockedList");

    if (!host) return;
    host.replaceChildren();

    if (!current || !client) {
      host.textContent = "Blocked list हेर्न login गर्नुहोस्।";
      return;
    }

    const { data, error } = await client
      .from("user_blocks")
      .select("blocked_id,profiles:blocked_id(id,display_name,username)")
      .eq("blocker_id", current.id);

    if (error) {
      host.textContent = `Blocked list लोड भएन: ${error.message}`;
      return;
    }

    if (!data?.length) {
      host.textContent = "Block गरिएको प्रयोगकर्ता छैन।";
      return;
    }

    data.forEach(row => {
      const person = row.profiles || {};
      const item = document.createElement("div");
      item.className = "settings-blocked-user";

      const label = document.createElement("span");
      label.textContent = person.display_name || person.username || "प्रयोगकर्ता";

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Unblock";

      button.addEventListener("click", async () => {
        button.disabled = true;

        const { error: deleteError } = await client
          .from("user_blocks")
          .delete()
          .eq("blocker_id", current.id)
          .eq("blocked_id", row.blocked_id);

        if (deleteError) {
          button.disabled = false;
          message(`Unblock भएन: ${deleteError.message}`);
          return;
        }

        item.remove();
        if (!host.children.length) host.textContent = "Block गरिएको प्रयोगकर्ता छैन।";

        document.dispatchEvent(new CustomEvent("mero-sathi-block-list-changed"));
        message("Unblock गरियो।");
      });

      item.append(label, button);
      host.append(item);
    });
  }

  async function savePrivacySetting(column, value) {
    const current = user();
    const client = db();
    if (!current || !client) return message("पहिले login गर्नुहोस्।");

    const { error } = await client
      .from("profiles")
      .update({ [column]: value })
      .eq("id", current.id);

    if (error) {
      message(`सेटिङ Save भएन: ${error.message}`);
      return false;
    }
    return true;
  }

  function bindEvents() {
    $("#settingTheme")?.addEventListener("change", event => {
      settings.theme = event.target.value;
      saveLocal();
      applyTheme();
    });

    $("#settingLanguage")?.addEventListener("change", event => {
      settings.language = event.target.value;
      saveLocal();
      applyLanguage();
    });

    $("#settingActiveStatus")?.addEventListener("change", async event => {
      const value = event.target.checked;
      if (await savePrivacySetting("active_status", value)) {
        settings.activeStatus = value;
        saveLocal();
      } else {
        event.target.checked = !value;
      }
    });

    $("#settingNotifications")?.addEventListener("change", event => {
      settings.notifications = event.target.checked;
      saveLocal();
      message("Notification preference Save भयो।");
    });

    $("#settingSaveProfile")?.addEventListener("click", saveProfile);
    $("#settingChangePassword")?.addEventListener("click", changePassword);

    $("#settingLogout")?.addEventListener("click", async () => {
      if (!confirm("Logout गर्न चाहनुहुन्छ?")) return;
      const { error } = await db().auth.signOut();
      if (error) message(`Logout भएन: ${error.message}`);
      else location.reload();
    });

    $("#settingDeleteAccount")?.addEventListener("click", () => {
      message("खाता मेटाउन सुरक्षित server-side delete function आवश्यक छ। Supabase service-role key browser मा राखेर delete नगर्नुहोस्।");
    });

    document.addEventListener("mero-sathi-open-settings", () => {
      loadProfile();
      loadBlockedUsers();
    });

    window.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener?.("change", () => {
        if (settings.theme === "system") applyTheme();
      });
  }

  function init() {
    renderSettings();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
