<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { user, refresh, signOut } = useSession()
const { lastOrder } = useCart()

definePageMeta({ middleware: "auth" })

if (!user.value) await refresh()

const fullName = computed(() => {
  if (!user.value) return ""
  return `${user.value.name.firstName} ${user.value.name.lastName}`
})

const initials = computed(() =>
  fullName.value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase(),
)

const signOutAndLeave = async () => {
  await signOut()
  await navigateTo(localePath("/"))
}

useSeoMeta({
  title: () => t("account.title"),
  description: () => t("account.description"),
})
</script>

<template>
  <div v-if="user" class="space-y-8">
    <header class="flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 dark:border-slate-800 sm:flex-row sm:items-end">
      <div>
        <p class="eyebrow">{{ $t("account.eyebrow") }}</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {{ $t("account.title") }}
        </h1>
        <p class="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          {{ $t("account.description") }}
        </p>
      </div>
      <button class="btn-secondary" type="button" @click="signOutAndLeave">
        {{ $t("account.logout") }}
      </button>
    </header>

    <section class="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
      <article class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div class="flex items-center gap-4">
          <div class="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {{ initials }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-slate-950 dark:text-white">{{ fullName }}</h2>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ $t("account.signedInAs", { username: user.username }) }}
            </p>
          </div>
        </div>

        <h3 class="mt-9 text-sm font-semibold text-slate-950 dark:text-white">
          {{ $t("account.profile") }}
        </h3>
        <dl class="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <div class="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt class="text-slate-500 dark:text-slate-400">{{ $t("account.email") }}</dt>
            <dd class="min-w-0 break-words text-slate-950 dark:text-white">{{ user.email }}</dd>
          </div>
          <div class="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt class="text-slate-500 dark:text-slate-400">{{ $t("account.phone") }}</dt>
            <dd class="text-slate-950 dark:text-white">{{ user.phone }}</dd>
          </div>
          <div class="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt class="text-slate-500 dark:text-slate-400">{{ $t("account.address") }}</dt>
            <dd class="text-slate-950 dark:text-white">
              {{ user.address.street }} {{ user.address.number }}, {{ user.address.city }} {{ user.address.zipcode }}
            </dd>
          </div>
        </dl>
      </article>

      <aside class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <p class="eyebrow">{{ $t("account.orderHistory") }}</p>
        <template v-if="lastOrder">
          <h2 class="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
            {{ lastOrder.id }}
          </h2>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {{ new Date(lastOrder.createdAt).toLocaleDateString() }} · {{ $t("cart.items", { count: lastOrder.itemCount }) }}
          </p>
          <p class="mt-6 text-2xl font-semibold text-slate-950 dark:text-white">
            {{ $n(lastOrder.total, "currency") }}
          </p>
        </template>
        <template v-else>
          <h2 class="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
            {{ $t("account.noOrders") }}
          </h2>
          <NuxtLink class="btn-primary mt-6" :to="localePath('/')">
            {{ $t("home.browse") }}
          </NuxtLink>
        </template>
      </aside>
    </section>
  </div>
</template>
