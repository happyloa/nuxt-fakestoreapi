<template>
  <div class="min-h-screen bg-stone-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
    <a class="skip-link" href="#main-content">
      {{ $t("common.skipToContent") }}
    </a>
    <ShellHeader />
    <main id="main-content" class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12" tabindex="-1">
      <slot />
    </main>
    <ShellFooter />
  </div>
</template>
