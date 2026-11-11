<script setup lang="ts">
const usersStore = useUsersStore();
const search = ref("");
const { t } = useI18n();

definePageMeta({ middleware: "auth" });

const { pending, error } = await useAsyncData("users", async () => {
  await usersStore.loadUsers();
  return true;
});

/**
 * 提供使用者清單搜尋，展示 Fake Store API 的使用者資料能力。
 */
const filteredUsers = computed(() => {
  if (!search.value) {
    return usersStore.users;
  }
  const term = search.value.toLowerCase();
  return usersStore.users.filter((user) => {
    return (
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.name.firstname.toLowerCase().includes(term) ||
      user.name.lastname.toLowerCase().includes(term)
    );
  });
});

usePageSeo(() => ({
  title: t("seo.users.title"),
  description: t("seo.users.description"),
}));
</script>

<template>
  <div class="space-y-6">
    <UserList
      :users="filteredUsers"
      :loading="pending"
      :error="error ? t('errors.load') : ''"
      :search="search"
      @update:search="search = $event"
    />
  </div>
</template>
