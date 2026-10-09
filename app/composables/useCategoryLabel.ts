export function useCategoryLabel() {
  const { t } = useI18n();
  const keys: Record<string, string> = {
    "men's clothing": "men",
    "women's clothing": "women",
    jewelery: "jewelry",
    electronics: "electronics",
  };
  return (category: string) =>
    keys[category] ? t("products.categories." + keys[category]) : category;
}
