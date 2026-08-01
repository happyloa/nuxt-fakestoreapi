/**
 * 路由守衛 (auth)
 * 未登入（無 token）者導向登入頁，並以 redirect query 記住原本想去的頁面，
 * 登入成功後可導回。避免僅靠頁面內 v-if 隱藏 UI。
 */
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  if (auth.isAuthenticated) return;

  const localePath = useLocalePath();
  return navigateTo({
    path: localePath("/login"),
    query: { redirect: to.fullPath },
  });
});
