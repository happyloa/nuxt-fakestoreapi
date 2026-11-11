import { defineStore } from "pinia";
import { getUsers } from "~/services/fakestore/users";
import type { User } from "#shared/types/fakestore";

/**
 * 會員頁的使用者清單。API 操作台的使用者 CRUD 直接呼叫 services，不寫入這裡。
 * 載入失敗時錯誤會拋給呼叫端，由頁面的 useAsyncData 呈現。
 */
export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
  }),
  actions: {
    /** 已有資料時沿用 store 內容。 */
    async loadUsers() {
      if (this.users.length) return;
      this.users = await getUsers();
    },
  },
});
