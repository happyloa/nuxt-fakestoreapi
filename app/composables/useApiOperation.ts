import { useI18n } from "vue-i18n";

export interface ApiOperationState<T> {
  loading: boolean;
  error: string;
  success: string;
  result: T;
}

interface RunOptions<T> {
  /** 回傳成功訊息字串，會寫入 state.success */
  success?: (result: T) => string;
  /** 成功後的額外副作用，例如顯示 Toast 通知 */
  onSuccess?: (result: T) => void;
}

/**
 * 封裝 API 操作的 loading / error / success / result 狀態與
 * try / catch / finally 樣板，供 API 操作台的各個 CRUD 卡片重用，
 * 消除三個 Section 元件中大量重複的非同步處理樣板。
 *
 * 用法：
 *   const query = useApiOperation<Cart[]>([]);
 *   const handle = () => query.run(() => store.fetchAll(), {
 *     success: (r) => t("...", { count: r.length }),
 *   });
 *   // template 透過 query.state.loading / .error / .success / .result 取用
 */
export function useApiOperation<T>(initialResult: T) {
  const { t } = useI18n();

  const state = reactive<ApiOperationState<T>>({
    loading: false,
    error: "",
    success: "",
    result: initialResult,
  }) as ApiOperationState<T>;

  const run = async (
    task: () => Promise<T>,
    options: RunOptions<T> = {},
  ): Promise<T | undefined> => {
    state.loading = true;
    state.error = "";
    state.success = "";
    try {
      const result = await task();
      state.result = result;
      if (options.success) state.success = options.success(result);
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : t("api.errors.generic");
      return undefined;
    } finally {
      state.loading = false;
    }
  };

  /** 設定驗證錯誤（不進入 loading 流程），例如必填欄位缺漏或 JSON 解析失敗 */
  const fail = (message: string) => {
    state.error = message;
  };

  return { state, run, fail };
}
