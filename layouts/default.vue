<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="flex-1 bg-slate-50">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
