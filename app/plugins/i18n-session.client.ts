const STORAGE_KEY = "fakestore-locale";

export default defineNuxtPlugin(async (nuxtApp) => {
  if (!process.client) return;

  const { $i18n } = nuxtApp;
  const locale = $i18n?.locale;
  const setLocale = $i18n?.setLocale;

  if (!locale || !setLocale) {
    return;
  }
  const readLocale = () => {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Session storage is unavailable", error);
      return null;
    }
  };

  const writeLocale = (value: string) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      console.warn("Session storage is unavailable", error);
    }
  };

  const storedLocale = readLocale();

  if (storedLocale && storedLocale !== locale.value) {
    await setLocale(storedLocale);
  }

  watch(
    locale,
    (next) => {
      writeLocale(next);
    },
    { immediate: true },
  );
});
