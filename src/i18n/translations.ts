export type LangCode = "en" | "de";

export interface Translations {
  nav: {
    dashboard: string;
    customers: string;
    contacts: string;
    calendar: string;
    settings: string;
    appDrawer: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    back: string;
    search: string;
    signOut: string;
    online: string;
    loading: string;
    comingSoon: string;
    or: string;
  };
  login: {
    subtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    guestLogin: string;
    error: string;
    secureAccess: string;
  };
  dashboard: {
    title: string;
    overview: string;
    totalCustomers: string;
    openDeals: string;
    revenue: string;
    activeContacts: string;
    customerGrowth: string;
    distribution: string;
    recentActivity: string;
    event: string;
    type: string;
    status: string;
    time: string;
    justNow: string;
  };
  settings: {
    title: string;
    configuration: string;
    profile: string;
    displayName: string;
    appearance: string;
    theme: string;
    themeActive: string;
    language: string;
    selectLanguage: string;
    notifications: string;
    emailNotif: string;
    inAppAlerts: string;
    weeklyDigest: string;
    dangerZone: string;
    deleteAccount: string;
    deleteAccountDesc: string;
  };
}

const t: Record<LangCode, Translations> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      customers: "Customers",
      contacts: "Contacts",
      calendar: "Calendar",
      settings: "Settings",
      appDrawer: "Navigation",
    },
    common: {
      save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit",
      add: "Add", back: "Back", search: "Search", signOut: "Sign Out",
      online: "Online", loading: "Loading…", comingSoon: "Coming soon", or: "or",
    },
    login: {
      subtitle: "Sign in to your account to continue",
      email: "Email", password: "Password",
      signIn: "Sign In", signingIn: "Authenticating…",
      guestLogin: "Guest Login",
      error: "Invalid email or password.",
      secureAccess: "CRM Portal · Secure Access",
    },
    dashboard: {
      title: "Dashboard", overview: "Overview",
      totalCustomers: "Total Customers", openDeals: "Open Deals",
      revenue: "Revenue", activeContacts: "Active Contacts",
      customerGrowth: "Customer Growth", distribution: "Distribution",
      recentActivity: "Recent Activity", event: "Event", type: "Type",
      status: "Status", time: "Time", justNow: "Just now",
    },
    settings: {
      title: "Settings", configuration: "Configuration",
      profile: "Profile", displayName: "Display Name",
      appearance: "Appearance", theme: "Theme",
      themeActive: "Dark cyber theme active",
      language: "Language", selectLanguage: "Select Language",
      notifications: "Notifications", emailNotif: "Email notifications",
      inAppAlerts: "In-app alerts", weeklyDigest: "Weekly digest",
      dangerZone: "Danger Zone", deleteAccount: "Delete Account",
      deleteAccountDesc: "Permanently remove all data",
    },
  },
  de: {
    nav: {
      dashboard: "Dashboard",
      customers: "Kunden",
      contacts: "Kontakte",
      calendar: "Kalender",
      settings: "Einstellungen",
      appDrawer: "Navigation",
    },
    common: {
      save: "Speichern", cancel: "Abbrechen", delete: "Löschen", edit: "Bearbeiten",
      add: "Hinzufügen", back: "Zurück", search: "Suchen", signOut: "Abmelden",
      online: "Online", loading: "Laden…", comingSoon: "Demnächst", or: "oder",
    },
    login: {
      subtitle: "Melde dich an, um fortzufahren",
      email: "E-Mail", password: "Passwort",
      signIn: "Anmelden", signingIn: "Authentifizierung…",
      guestLogin: "Als Gast anmelden",
      error: "Ungültige E-Mail oder Passwort.",
      secureAccess: "CRM Portal · Sicherer Zugang",
    },
    dashboard: {
      title: "Dashboard", overview: "Übersicht",
      totalCustomers: "Kunden gesamt", openDeals: "Offene Deals",
      revenue: "Umsatz", activeContacts: "Aktive Kontakte",
      customerGrowth: "Kundenwachstum", distribution: "Verteilung",
      recentActivity: "Letzte Aktivitäten", event: "Ereignis", type: "Typ",
      status: "Status", time: "Zeit", justNow: "Gerade eben",
    },
    settings: {
      title: "Einstellungen", configuration: "Konfiguration",
      profile: "Profil", displayName: "Anzeigename",
      appearance: "Erscheinungsbild", theme: "Design",
      themeActive: "Dunkles Cyber-Design aktiv",
      language: "Sprache", selectLanguage: "Sprache wählen",
      notifications: "Benachrichtigungen", emailNotif: "E-Mail-Benachrichtigungen",
      inAppAlerts: "In-App-Hinweise", weeklyDigest: "Wöchentliche Zusammenfassung",
      dangerZone: "Gefahrenzone", deleteAccount: "Konto löschen",
      deleteAccountDesc: "Alle Daten dauerhaft entfernen",
    },
  },
};

export default t;

export const LANGUAGES: { code: LangCode; flag: string; native: string; english: string }[] = [
  { code: "en", flag: "🇬🇧", native: "English", english: "English" },
  { code: "de", flag: "🇩🇪", native: "Deutsch", english: "German" },
];
