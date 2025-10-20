<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useCartStore } from "~/stores/cart";

useSeoMeta({
  title: "Login | Nuxt Fake Store",
  ogTitle: "Login | Nuxt Fake Store",
  description: "Sign in to connect your Fake Store API profile.",
  ogDescription: "Sign in to connect your Fake Store API profile.",
});

const auth = useAuthStore();
const cart = useCartStore();

const username = ref("");
const password = ref("");

const submit = async () => {
  await auth.login(username.value, password.value);
  if (auth.user) {
    await cart.fetchCart(auth.user.id);
  }
};
</script>

<template>
  <div class="mx-auto max-w-xl space-y-6">
    <h1 class="section-title text-center">
      {{ $t("auth.title") }}
    </h1>
    <p class="text-center text-sm text-slate-400">
      {{ $t("auth.subtitle") }}
    </p>

    <form class="card-surface space-y-5 p-8" @submit.prevent="submit">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-slate-200" for="username">
          {{ $t("auth.fields.username") }}
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          class="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 focus:border-brand focus:outline-none"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-slate-200" for="password">
          {{ $t("auth.fields.password") }}
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 focus:border-brand focus:outline-none"
        />
      </div>

      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span v-if="!auth.loading">{{ $t("auth.submit") }}</span>
        <span v-else>{{ $t("auth.loading") }}</span>
      </button>

      <p v-if="auth.error" class="text-sm text-rose-400">
        {{ auth.error }}
      </p>
      <p v-if="auth.profile" class="text-xs text-slate-400">
        {{ $t("auth.loggedInAs", { name: auth.profile.name.firstname }) }}
      </p>
    </form>
  </div>
</template>
