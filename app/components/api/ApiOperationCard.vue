<script setup lang="ts">
import type { ApiOperationState } from "~/composables/useApiOperation";

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    /** useApiOperation() 的 state */
    state: ApiOperationState<unknown>;
    /** 送出按鈕文字 */
    action: string;
    /** 破壞性操作（刪除）使用外框按鈕 */
    destructive?: boolean;
    resultLabel?: string;
  }>(),
  { description: "", destructive: false, resultLabel: "" },
);

defineEmits<{ (e: "submit"): void }>();

const hasResult = computed(() => {
  const { result } = props.state;
  return Array.isArray(result) ? result.length > 0 : result != null;
});
</script>

<template>
  <BaseCard class="space-y-6">
    <BaseSectionHeading
      :title="title"
      :description="description"
      :level="3"
    />
    <form class="space-y-4" @submit.prevent="$emit('submit')">
      <slot />
      <BaseButton
        type="submit"
        :loading="state.loading"
        :variant="destructive ? 'outline' : 'primary'"
        >{{ action }}</BaseButton
      >
    </form>
    <BaseAlert v-if="state.error" variant="error">{{ state.error }}</BaseAlert>
    <!-- 一直存在的狀態區域只替換文字，螢幕閱讀器才會穩定念出結果。 -->
    <div role="status">
      <BaseAlert v-if="state.success" variant="success" :live="false">{{
        state.success
      }}</BaseAlert>
    </div>
    <ApiResultViewer
      v-if="hasResult"
      :label="resultLabel || $t('api.results.response')"
      :value="state.result"
    />
  </BaseCard>
</template>
