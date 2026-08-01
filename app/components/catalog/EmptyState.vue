<template>
  <!-- Filtered catalog empty state. -->
  <section class="empty-state" aria-live="polite">
    <div class="empty-state__icon" aria-hidden="true">⌕</div>
    <h3>{{ $t("catalog.noResultsTitle") }}</h3>
    <p>{{ $t("catalog.noResultsDescription") }}</p>
  </section>
</template>
