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

// 取得單一使用者 (Get User By ID)
const userByIdForm = reactive({ id: "" as string | number });
const userByIdState = reactive({
  loading: false,
  error: "",
  result: null as User | null,
});
const handleUserById = async () => {
  if (!userByIdForm.id) {
    userByIdState.error = t("api.errors.idRequired");
    return;
  }
  userByIdState.loading = true;
  userByIdState.error = "";
  userByIdState.result = null;
  try {
    const user = await usersStore.fetchUserById(Number(userByIdForm.id));
    userByIdState.result = user;
  } catch (error: any) {
    userByIdState.error = error?.message ?? t("api.errors.generic");
  } finally {
    userByIdState.loading = false;
  }
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
const userCreateState = reactive({
  loading: false,
  error: "",
  success: "",
  result: null as User | null,
});
const handleUserCreate = async () => {
  let payload: CreateUserPayload;
  try {
    payload = JSON.parse(userCreateForm.value);
  } catch (error: any) {
    userCreateState.error = t("api.errors.invalidJson");
    return;
  }
  userCreateState.loading = true;
  userCreateState.error = "";
  userCreateState.success = "";
  try {
    const created = await usersStore.createUser(payload);
    userCreateState.result = created;
    userCreateState.success = t("api.users.createSuccess", {
      username: created.username,
    });
    notifications.success(
      t("notifications.userCreated", { username: created.username }),
    );
  } catch (error: any) {
    userCreateState.error = error?.message ?? t("api.errors.generic");
  } finally {
    userCreateState.loading = false;
  }
};

// 更新使用者 (Update User)
const userUpdateForm = reactive({
  id: "" as string | number,
  payload: '{\n  "phone": "02-8888888"\n}',
});
const userUpdateState = reactive({
  loading: false,
  error: "",
  success: "",
  result: null as User | null,
});
const handleUserUpdate = async () => {
  if (!userUpdateForm.id) {
    userUpdateState.error = t("api.errors.idRequired");
    return;
  }
  let payload: UpdateUserPayload;
  try {
    payload = JSON.parse(userUpdateForm.payload);
  } catch (error: any) {
    userUpdateState.error = t("api.errors.invalidJson");
    return;
  }
  userUpdateState.loading = true;
  userUpdateState.error = "";
  userUpdateState.success = "";
  try {
    const updated = await usersStore.updateUser(
      Number(userUpdateForm.id),
      payload,
    );
    userUpdateState.result = updated;
    userUpdateState.success = t("api.users.updateSuccess", { id: updated.id });
    notifications.info(
      t("notifications.userUpdated", { username: updated.username }),
    );
  } catch (error: any) {
    userUpdateState.error = error?.message ?? t("api.errors.generic");
  } finally {
    userUpdateState.loading = false;
  }
};

// 刪除使用者 (Delete User)
const userDeleteForm = reactive({ id: "" as string | number });
const userDeleteState = reactive({
  loading: false,
  error: "",
  success: "",
});
const handleUserDelete = async () => {
  if (!userDeleteForm.id) {
    userDeleteState.error = t("api.errors.idRequired");
    return;
  }
  userDeleteState.loading = true;
  userDeleteState.error = "";
  userDeleteState.success = "";
  try {
    await usersStore.deleteUser(Number(userDeleteForm.id));
    userDeleteState.success = t("api.users.deleteSuccess", {
      id: userDeleteForm.id,
    });
    notifications.info(
      t("notifications.userDeleted", { id: userDeleteForm.id }),
    );
  } catch (error: any) {
    userDeleteState.error = error?.message ?? t("api.errors.generic");
  } finally {
    userDeleteState.loading = false;
  }
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
        :title="$t('api.users.updateTitle')"
        :description="$t('api.users.updateDescription')"
        :loading="userUpdateState.loading"
        :error="userUpdateState.error"
        :success-message="userUpdateState.success">
        <form class="space-y-4" @submit.prevent="handleUserUpdate">
          <BaseInput
            v-model="userUpdateForm.id"
            type="number"
            min="1"
            :label="$t('api.fields.userId')"
            required />
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
