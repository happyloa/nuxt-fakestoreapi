<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale, setLocale, t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { itemCount } = useCart();
const { isSignedIn } = useSession();
const { theme, toggleTheme } = useTheme();

const isMobileMenuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);
const mobileDialog = ref<HTMLElement | null>(null);

const nextLocale = computed(() =>
  locale.value.startsWith("zh") ? "en" : "zh",
);

const languageLabel = computed(() =>
  nextLocale.value === "en" ? "EN" : "繁中",
);

const languageAriaLabel = computed(() =>
  nextLocale.value === "en" ? "Switch to English" : "切換為繁體中文",
);

const accountLink = computed(() => ({
  label: isSignedIn.value
    ? t("navigation.account")
    : t("navigation.login"),
  to: localePath(isSignedIn.value ? "/account" : "/login"),
}));

const navigation = computed(() => [
  { label: t("navigation.shop"), to: localePath("/") },
  { label: t("navigation.cart"), to: localePath("/cart") },
  accountLink.value,
]);

const isActive = (to: string) => route.path === to;

const closeMobileMenu = async () => {
  if (!isMobileMenuOpen.value) return;
  isMobileMenuOpen.value = false;
  await nextTick();
  menuButton.value?.focus();
};

const openMobileMenu = async () => {
  isMobileMenuOpen.value = true;
  await nextTick();
  mobileDialog.value?.focus();
};

const handleMenuButton = () => {
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
    return;
  }
  openMobileMenu();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
};

const toggleLocale = async () => {
  await setLocale(nextLocale.value);
};

watch(
  () => route.fullPath,
  () => {
    if (isMobileMenuOpen.value) {
      closeMobileMenu();
    }
  },
);

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() =>
  window.removeEventListener("keydown", handleKeydown),
);
</script>

<template>
  <header class="shell-header">
    <div class="shell-container shell-header__inner">
      <NuxtLink :to="localePath('/')" class="shell-brand">
        {{ t("site.name") }}
      </NuxtLink>

      <nav class="shell-nav" :aria-label="t('site.name')">
        <ul class="shell-nav__list">
          <li v-for="item in navigation" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="shell-nav__link"
              :aria-current="isActive(item.to) ? 'page' : undefined">
              <span>{{ item.label }}</span>
              <span
                v-if="item.to === localePath('/cart') && itemCount > 0"
                class="shell-cart-count"
                :aria-label="`${t('navigation.cart')} ${itemCount}`">
                {{ itemCount }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="shell-tools">
        <button
          type="button"
          class="shell-language-button"
          :aria-label="languageAriaLabel"
          @click="toggleLocale">
          {{ languageLabel }}
        </button>
        <button
          type="button"
          class="shell-icon-button"
          :aria-label="theme === 'dark' ? t('common.light') : t('common.dark')"
          :aria-pressed="theme === 'dark'"
          @click="toggleTheme">
          <span class="shell-icon-button__glyph" aria-hidden="true">
            {{ theme === "dark" ? "☀" : "◐" }}
          </span>
        </button>
        <button
          ref="menuButton"
          type="button"
          class="shell-menu-button"
          :aria-label="isMobileMenuOpen ? t('common.close') : t('common.openMenu')"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="site-mobile-menu"
          @click="handleMenuButton">
          <span class="shell-menu-button__glyph" aria-hidden="true">
            {{ isMobileMenuOpen ? "×" : "☰" }}
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <template v-if="isMobileMenuOpen">
        <div class="shell-mobile-backdrop" aria-hidden="true" @click="closeMobileMenu" />
        <aside
          id="site-mobile-menu"
          ref="mobileDialog"
          class="shell-mobile-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="t('common.openMenu')"
          tabindex="-1"
          @keydown.escape="closeMobileMenu">
          <div class="shell-mobile-dialog__header">
            <p class="shell-mobile-dialog__title">{{ t("site.name") }}</p>
            <button
              type="button"
              class="shell-icon-button"
              :aria-label="t('common.close')"
              @click="closeMobileMenu">
              <span class="shell-icon-button__glyph" aria-hidden="true">×</span>
            </button>
          </div>
          <nav class="shell-mobile-nav" :aria-label="t('site.name')">
            <ul class="shell-mobile-nav__list">
              <li v-for="item in navigation" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="shell-mobile-nav__link"
                  :aria-current="isActive(item.to) ? 'page' : undefined"
                  @click="closeMobileMenu">
                  <span>{{ item.label }}</span>
                  <span
                    v-if="item.to === localePath('/cart') && itemCount > 0"
                    class="shell-cart-count"
                    :aria-label="`${t('navigation.cart')} ${itemCount}`">
                    {{ itemCount }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </aside>
      </template>
    </Teleport>
  </header>
</template>
