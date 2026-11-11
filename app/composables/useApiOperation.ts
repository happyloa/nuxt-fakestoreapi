export interface ApiOperationState<T> {
  loading: boolean;
  error: string;
  success: string;
  result: T;
}

interface RunOptions<T> {
  /** 成功訊息；省略時使用通用的「已取得回應」，讓螢幕閱讀器也能得知結果 */
  success?: (result: T) => string;
  /** 成功後的額外副作用，例如顯示 Toast 通知 */
  onSuccess?: (result: T) => void;
}

/**
 * API 操作台每張卡片的 loading / error / success / result 狀態與執行流程。
 * 搭配 ApiOperationCard 使用：<ApiOperationCard :state="op.state" @submit="..." />
 */
export function useApiOperation<T>(initialResult: T) {
  const { t } = useI18n();

  const state = reactive<ApiOperationState<T>>({
    loading: false,
    error: "",
    success: "",
    result: initialResult,
  }) as ApiOperationState<T>;

  // ofetch 的錯誤訊息是未在地化的英文（含方法與網址），改依狀態碼顯示語系文案。
  const describeError = (error: unknown) => {
    const status =
      error && typeof error === "object" && "statusCode" in error
        ? Number(error.statusCode) || undefined
        : undefined;
    const key =
      status === 400 || status === 413 || status === 415
        ? "invalidInput"
        : status === 404
          ? "notFound"
          : status && status >= 500
            ? "unavailable"
            : "generic";
    const message = t(`api.errors.${key}`);
    return status ? `${message} (HTTP ${status})` : message;
  };

  const run = async (task: () => Promise<T>, options: RunOptions<T> = {}) => {
    state.loading = true;
    state.error = "";
    state.success = "";
    // 清掉上一次的結果，避免錯誤訊息旁邊仍顯示舊的回應。
    state.result = initialResult;
    try {
      const result = await task();
      state.result = result;
      state.success = options.success?.(result) ?? t("api.results.received");
      options.onSuccess?.(result);
    } catch (error) {
      state.error = describeError(error);
    } finally {
      state.loading = false;
    }
  };

  /** 先解析 JSON 欄位再送出；格式錯誤時直接顯示錯誤，不發送請求 */
  const runWithJson = <P>(
    text: string,
    task: (payload: P) => Promise<T>,
    options?: RunOptions<T>,
  ) => {
    let payload: P;
    try {
      payload = JSON.parse(text);
    } catch {
      state.success = "";
      state.result = initialResult;
      state.error = t("api.errors.invalidJson");
      return;
    }
    return run(() => task(payload), options);
  };

  return { state, run, runWithJson };
}
