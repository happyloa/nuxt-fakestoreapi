<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useUsersStore } from "~/stores/users";

const usersStore = useUsersStore();
const search = ref("");
const { t } = useI18n();

await usersStore.fetchUsers();

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
  <div class="space-y-6" data-aos="fade-up">
    <UserList
      :users="filteredUsers"
      :loading="usersStore.loading"
      :error="usersStore.error"
      :search="search"
      @update:search="search = $event" />
  </div>
</template>
