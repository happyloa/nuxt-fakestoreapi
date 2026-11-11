import { getCatalog } from "../utils/fakestore";

// The key ignores the query string so arbitrary ?params cannot create new
// cache entries or bypass the cache to reach the upstream API.
export default defineCachedEventHandler((event) => getCatalog(event), {
  name: "catalog",
  maxAge: 300,
  swr: true,
  getKey: () => "catalog",
});
