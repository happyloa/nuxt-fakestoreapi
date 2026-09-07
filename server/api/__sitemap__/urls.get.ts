import { getCatalog } from "../../utils/fakestore";

export default defineSitemapEventHandler(async () => {
  const { products } = await getCatalog();
  return products.map((product) => ({ loc: `/product/${product.id}`, _i18nTransform: true }));
});
