<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useFakeStoreApi } from "~/composables/useFakeStoreApi";
import type { ProductPayload } from "~/types/fakestore";

const props = defineProps<{
  categories: string[];
}>();

const emit = defineEmits<{
  (event: "created", productId: number): void;
}>();

const api = useFakeStoreApi();
const { t } = useI18n();

const form = reactive<ProductPayload>({
  title: "",
  price: 0,
  description: "",
  category: props.categories[0] ?? "electronics",
  image: "https://i.pravatar.cc/420",
});

watch(
  () => props.categories,
  (next) => {
    if (next.length && !next.includes(form.category)) {
      form.category = next[0];
    }
  },
  { immediate: true },
);

const submitting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const submit = async () => {
  submitting.value = true;
  error.value = null;
  successMessage.value = null;
  try {
    const created = await api.createProduct({ ...form });
    successMessage.value = t("products.form.success", { title: created.title });
    emit("created", created.id);
  } catch (err: any) {
    error.value = err?.message ?? t("products.form.error");
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <form class="card-surface space-y-6 p-8" @submit.prevent="submit">
    <div>
      <h1 class="text-3xl font-bold text-white">
        {{ $t("products.form.title") }}
      </h1>
      <p class="mt-2 text-sm text-slate-400">
        {{ $t("products.form.subtitle") }}
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <label class="flex flex-col gap-2 text-sm font-medium text-slate-200">
        {{ $t("products.form.fields.title") }}
        <input
          v-model="form.title"
          type="text"
          required
          class="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
        />
      </label>
      <label class="flex flex-col gap-2 text-sm font-medium text-slate-200">
        {{ $t("products.form.fields.price") }}
        <input
          v-model.number="form.price"
          type="number"
          min="0"
          step="0.01"
          required
          class="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
        />
      </label>
      <label class="flex flex-col gap-2 text-sm font-medium text-slate-200">
        {{ $t("products.form.fields.category") }}
        <select
          v-model="form.category"
          class="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
        >
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </label>
      <label class="flex flex-col gap-2 text-sm font-medium text-slate-200">
        {{ $t("products.form.fields.image") }}
        <input
          v-model="form.image"
          type="url"
          required
          class="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 focus:border-brand focus:outline-none"
        />
      </label>
      <label class="lg:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-200">
        {{ $t("products.form.fields.description") }}
        <textarea
          v-model="form.description"
          rows="4"
          required
          class="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 focus:border-brand focus:outline-none"
        ></textarea>
      </label>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        :disabled="submitting"
        class="inline-flex items-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span v-if="!submitting">{{ $t("products.form.submit") }}</span>
        <span v-else>{{ $t("products.form.submitting") }}</span>
      </button>
      <p v-if="successMessage" class="text-sm text-emerald-400">
        {{ successMessage }}
      </p>
      <p v-if="error" class="text-sm text-rose-400">
        {{ error }}
      </p>
    </div>
  </form>
</template>
