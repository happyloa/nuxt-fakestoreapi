<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUsersStore } from '~/stores/users'

const usersStore = useUsersStore()
const search = ref('')

await usersStore.fetchUsers()

const filteredUsers = computed(() => {
  if (!search.value) {
    return usersStore.users
  }
  const term = search.value.toLowerCase()
  return usersStore.users.filter((user) => {
    return (
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.name.firstname.toLowerCase().includes(term) ||
      user.name.lastname.toLowerCase().includes(term)
    )
  })
})

useSeoMeta({
  title: 'Users | Fake Store Dashboard',
  description: 'Explore Fake Store API users with contact and address details.',
  ogTitle: 'Users | Fake Store Dashboard',
  ogDescription: 'Explore Fake Store API users with contact and address details.',
})
</script>

<template>
  <div class="space-y-6">
    <UserList
      :users="filteredUsers"
      :loading="usersStore.loading"
      :error="usersStore.error"
      :search="search"
      @update:search="search = $event"
    />
  </div>
</template>
