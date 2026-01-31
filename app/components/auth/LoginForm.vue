<script setup lang="ts">
import { reactive } from "vue";

interface Props {
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: "",
});

const emit = defineEmits<{
  (e: "submit", credentials: { username: string; password: string }): void;
}>();

const form = reactive({
  username: "mor_2314",
  password: "83r5^_",
});

const submit = () => {
  emit("submit", { ...form });
};
</script>

<template>
  <BaseCard class="max-w-md space-y-6">
    <BaseSectionHeading
      :title="$t('auth.login.title')"
      :description="$t('auth.login.subtitle')"
      align="center" />
    <form class="space-y-4" @submit.prevent="submit">
      <BaseInput
        v-model="form.username"
        :label="$t('auth.login.username')"
        required />
      <BaseInput
        v-model="form.password"
        type="password"
        :label="$t('auth.login.password')"
        required />
      <BaseButton type="submit" :loading="loading" block>
        {{ $t("auth.login.submit") }}
      </BaseButton>
    </form>
    <BaseAlert v-if="error" variant="error">
      {{ error }}
    </BaseAlert>
  </BaseCard>
</template>
