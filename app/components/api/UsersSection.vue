<script setup lang="ts">
/** 會員端點：單筆、建立、查詢、更新與刪除。 */
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "~/services/fakestore/users";
import type { UpdateMethod } from "~/services/fakestore/client";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "#shared/types/fakestore";

const { t } = useI18n();
const notifications = useNotificationsStore();

const byIdForm = reactive({ id: "" });
const byId = useApiOperation<User | null>(null);
const runById = () => byId.run(() => getUserById(Number(byIdForm.id)));

const createPayload = ref(
  JSON.stringify(
    {
      email: "new.user@example.com",
      username: "new_user",
      password: "password123",
      name: { firstname: "New", lastname: "User" },
      address: {
        city: "Taipei",
        street: "Main Street",
        number: 1,
        zipcode: "100",
        geolocation: { lat: "0", long: "0" },
      },
      phone: "02-12345678",
    } satisfies CreateUserPayload,
    null,
    2,
  ),
);
const create = useApiOperation<User | null>(null);
const runCreate = () =>
  create.runWithJson<CreateUserPayload>(createPayload.value, createUser, {
    success: (user) => t("api.users.createSuccess", { username: user!.username }),
    onSuccess: (user) =>
      notifications.success(t("notifications.userCreated", { username: user!.username })),
  });

const queryForm = reactive({ limit: 5, sort: "desc" as "asc" | "desc" });
const query = useApiOperation<User[]>([]);
const runQuery = () =>
  query.run(() => getUsers({ limit: queryForm.limit || undefined, sort: queryForm.sort }), {
    success: (users) => t("api.users.querySuccess", { count: users.length }),
  });

const updateForm = reactive({
  id: "",
  method: "PUT" as UpdateMethod,
  payload: '{\n  "phone": "02-8888888"\n}',
});
const update = useApiOperation<User | null>(null);
const runUpdate = () =>
  update.runWithJson<UpdateUserPayload>(
    updateForm.payload,
    (payload) => updateUser(Number(updateForm.id), payload, updateForm.method),
    {
      success: (user) => t("api.users.updateSuccess", { id: user!.id }),
      onSuccess: (user) =>
        notifications.info(t("notifications.userUpdated", { username: user!.username })),
    },
  );

const deleteForm = reactive({ id: "" });
const remove = useApiOperation<User | null>(null);
const runDelete = () => {
  const id = deleteForm.id;
  return remove.run(() => deleteUser(Number(id)), {
    success: () => t("api.users.deleteSuccess", { id }),
    onSuccess: () => notifications.info(t("notifications.userDeleted", { id })),
  });
};
</script>

<template>
  <section class="space-y-6">
    <h2 class="meta text-slate-500 dark:text-slate-400">
      {{ $t("api.users.title") }}
    </h2>
    <div class="grid gap-6 lg:grid-cols-2">
      <ApiOperationCard
        :title="$t('api.users.singleTitle')"
        :description="$t('api.users.singleDescription')"
        :state="byId.state"
        :action="$t('api.actions.fetch')"
        @submit="runById">
        <BaseInput
          v-model="byIdForm.id"
          type="number"
          min="1"
          :label="$t('api.fields.userId')"
          required />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.createTitle')"
        :description="$t('api.users.createDescription')"
        :state="create.state"
        :action="$t('api.actions.create')"
        @submit="runCreate">
        <BaseTextarea
          v-model="createPayload"
          :label="$t('api.fields.payload')"
          :rows="8" />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.queryTitle')"
        :description="$t('api.users.queryDescription')"
        :state="query.state"
        :action="$t('api.actions.runQuery')"
        :result-label="$t('api.results.preview')"
        @submit="runQuery">
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput
            v-model.number="queryForm.limit"
            type="number"
            min="1"
            max="20"
            :label="$t('api.fields.limit')"
            required />
          <BaseSelect
            v-model="queryForm.sort"
            :label="$t('api.fields.sort')"
            :options="[
              { label: $t('api.fields.sortAsc'), value: 'asc' },
              { label: $t('api.fields.sortDesc'), value: 'desc' },
            ]" />
        </div>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.updateTitle')"
        :description="$t('api.users.updateDescription')"
        :state="update.state"
        :action="$t('api.actions.update')"
        @submit="runUpdate">
        <div class="grid gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="updateForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.userId')"
            required />
          <BaseSelect
            v-model="updateForm.method"
            :label="$t('api.fields.method')"
            :options="[
              { label: 'PUT', value: 'PUT' },
              { label: 'PATCH', value: 'PATCH' },
            ]" />
        </div>
        <BaseTextarea
          v-model="updateForm.payload"
          :label="$t('api.fields.payload')"
          :rows="6" />
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.deleteTitle')"
        :description="$t('api.users.deleteDescription')"
        :state="remove.state"
        :action="$t('api.actions.delete')"
        destructive
        @submit="runDelete">
        <BaseInput
          v-model="deleteForm.id"
          type="number"
          min="1"
          :label="$t('api.fields.userId')"
          required />
      </ApiOperationCard>
    </div>
  </section>
</template>
