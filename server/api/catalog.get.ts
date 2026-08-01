import { defineEventHandler } from "h3";
import { getCatalog } from "../utils/fakestore";

export default defineEventHandler(async () => getCatalog());
