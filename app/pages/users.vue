<script setup lang="ts">
const localePath = useLocalePath()
await navigateTo(localePath("/account"), { redirectCode: 301 })
</script>

<template><span /></template>
