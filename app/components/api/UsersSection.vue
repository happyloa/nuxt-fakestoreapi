<script setup lang="ts">
/**
 * 使用者管理區塊元件
 * 提供使用者的單一取得、建立、更新與刪除功能
 */

import { useI18n } from "vue-i18n";
import { useUsersStore } from "~/stores/users";
import { useNotificationsStore } from "~/stores/notifications";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from "~/types/fakestore";

const { t } = useI18n();
const usersStore = useUsersStore();
const notifications = useNotificationsStore();

// 查詢會員列表 (Query Users)
const userQueryForm = reactive({
  limit: 5,
  sort: "desc" as "asc" | "desc",
});
const userQuery = useApiOperation<User[]>([]);
const userQueryState = userQuery.state;
const handleUserQuery = () =>
  userQuery.run(
    () =>
      usersStore.queryUsers({
        limit: userQueryForm.limit || undefined,
        sort: userQueryForm.sort,
      }),
    {
      success: (users) => t("api.users.querySuccess", { count: users.length }),
    },
  );

// 取得單一使用者 (Get User By ID)
const userByIdForm = reactive({ id: "" as string | number });
const userById = useApiOperation<User | null>(null);
const userByIdState = userById.state;
const handleUserById = () => {
  if (!userByIdForm.id) return userById.fail(t("api.errors.idRequired"));
  return userById.run(() => usersStore.fetchUserById(Number(userByIdForm.id)));
};

// 建立使用者 (Create User)
const userCreateForm = ref(
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
    } as CreateUserPayload,
    null,
    2,
  ),
);
const userCreate = useApiOperation<User | null>(null);
const userCreateState = userCreate.state;
const handleUserCreate = () => {
  let payload: CreateUserPayload;
  try {
    payload = JSON.parse(userCreateForm.value);
  } catch {
    return userCreate.fail(t("api.errors.invalidJson"));
  }
  return userCreate.run(() => usersStore.createUser(payload), {
    success: (user) =>
      t("api.users.createSuccess", { username: user!.username }),
    onSuccess: (user) =>
      notifications.success(
        t("notifications.userCreated", { username: user!.username }),
      ),
  });
};

// 更新使用者 (Update User)
const userUpdateForm = reactive({
  id: "" as string | number,
  method: "PUT" as "PUT" | "PATCH",
  payload: '{\n  "phone": "02-8888888"\n}',
});
const userUpdate = useApiOperation<User | null>(null);
const userUpdateState = userUpdate.state;
const handleUserUpdate = () => {
  if (!userUpdateForm.id) return userUpdate.fail(t("api.errors.idRequired"));
  let payload: UpdateUserPayload;
  try {
    payload = JSON.parse(userUpdateForm.payload);
  } catch {
    return userUpdate.fail(t("api.errors.invalidJson"));
  }
  return userUpdate.run(
    () =>
      userUpdateForm.method === "PATCH"
        ? usersStore.patchUser(Number(userUpdateForm.id), payload)
        : usersStore.updateUser(Number(userUpdateForm.id), payload),
    {
      success: (user) => t("api.users.updateSuccess", { id: user!.id }),
      onSuccess: (user) =>
        notifications.info(
          t("notifications.userUpdated", { username: user!.username }),
        ),
    },
  );
};

// 刪除使用者 (Delete User)
const userDeleteForm = reactive({ id: "" as string | number });
const userDelete = useApiOperation<null>(null);
const userDeleteState = userDelete.state;
const handleUserDelete = () => {
  if (!userDeleteForm.id) return userDelete.fail(t("api.errors.idRequired"));
  return userDelete.run(
    async () => {
      await usersStore.deleteUser(Number(userDeleteForm.id));
      return null;
    },
    {
      success: () => t("api.users.deleteSuccess", { id: userDeleteForm.id }),
      onSuccess: () =>
        notifications.info(
          t("notifications.userDeleted", { id: userDeleteForm.id }),
        ),
    },
  );
};
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
      {{ $t("api.users.title") }}
    </h2>
    <div class="grid gap-6 lg:grid-cols-2">
      <ApiOperationCard
        :title="$t('api.users.singleTitle')"
        :description="$t('api.users.singleDescription')"
        :loading="userByIdState.loading"
        :error="userByIdState.error">
        <form class="space-y-4" @submit.prevent="handleUserById">
          <BaseInput
            v-model="userByIdForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.userId')"
            required />
          <BaseButton type="submit" :loading="userByIdState.loading">
            {{ $t("api.actions.fetch") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="userByIdState.result"
            :label="$t('api.results.response')"
            :value="userByIdState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.createTitle')"
        :description="$t('api.users.createDescription')"
        :loading="userCreateState.loading"
        :error="userCreateState.error"
        :success-message="userCreateState.success">
        <form class="space-y-4" @submit.prevent="handleUserCreate">
          <BaseTextarea
            v-model="userCreateForm"
            :label="$t('api.fields.payload')"
            :rows="8" />
          <BaseButton type="submit" :loading="userCreateState.loading">
            {{ $t("api.actions.create") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="userCreateState.result"
            :label="$t('api.results.response')"
            :value="userCreateState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.queryTitle')"
        :description="$t('api.users.queryDescription')"
        :loading="userQueryState.loading"
        :error="userQueryState.error"
        :success-message="userQueryState.success">
        <form class="space-y-4" @submit.prevent="handleUserQuery">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model.number="userQueryForm.limit"
              type="number"
              min="1"
              :label="$t('api.users.fields.limit')"
              required />
            <BaseSelect
              v-model="userQueryForm.sort"
              :label="$t('api.users.fields.sort')"
              :options="[
                { label: 'ASC', value: 'asc' },
                { label: 'DESC', value: 'desc' },
              ]" />
          </div>
          <BaseButton type="submit" :loading="userQueryState.loading">
            {{ $t("api.actions.runQuery") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="userQueryState.result.length"
            :label="$t('api.results.preview')"
            :value="userQueryState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.updateTitle')"
        :description="$t('api.users.updateDescription')"
        :loading="userUpdateState.loading"
        :error="userUpdateState.error"
        :success-message="userUpdateState.success">
        <form class="space-y-4" @submit.prevent="handleUserUpdate">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseInput
              v-model="userUpdateForm.id"
              type="number"
              min="1"
              :label="$t('api.fields.userId')"
              required />
            <BaseSelect
              v-model="userUpdateForm.method"
              :label="$t('api.products.fields.method')"
              :options="[
                { label: 'PUT', value: 'PUT' },
                { label: 'PATCH', value: 'PATCH' },
              ]" />
          </div>
          <BaseTextarea
            v-model="userUpdateForm.payload"
            :label="$t('api.fields.payload')"
            :rows="6" />
          <BaseButton type="submit" :loading="userUpdateState.loading">
            {{ $t("api.actions.update") }}
          </BaseButton>
        </form>
        <template #footer>
          <ApiResultViewer
            v-if="userUpdateState.result"
            :label="$t('api.results.response')"
            :value="userUpdateState.result" />
        </template>
      </ApiOperationCard>

      <ApiOperationCard
        :title="$t('api.users.deleteTitle')"
        :description="$t('api.users.deleteDescription')"
        :loading="userDeleteState.loading"
        :error="userDeleteState.error"
        :success-message="userDeleteState.success">
        <form class="space-y-4" @submit.prevent="handleUserDelete">
          <BaseInput
            v-model="userDeleteForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.userId')"
            required />
          <BaseButton
            type="submit"
            :loading="userDeleteState.loading"
            variant="outline">
            {{ $t("api.actions.delete") }}
          </BaseButton>
        </form>
      </ApiOperationCard>
    </div>
  </section>
</template>
