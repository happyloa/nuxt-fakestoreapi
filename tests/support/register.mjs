// Let node:test import the app's TypeScript sources directly. Node strips the
// types; this hook adds the Nuxt aliases and the extensionless imports that
// Nuxt/Nitro resolve at build time.
import { registerHooks } from 'node:module';

const root = new URL('../../', import.meta.url);
const aliases = [['~/', 'app/'], ['#shared/', 'shared/']];

registerHooks({
  resolve(specifier, context, nextResolve) {
    for (const [alias, path] of aliases) {
      if (specifier.startsWith(alias)) {
        specifier = new URL(path + specifier.slice(alias.length), root).href;
        break;
      }
    }
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      const relative = specifier.startsWith('.') || specifier.startsWith('file:');
      if (error?.code === 'ERR_MODULE_NOT_FOUND' && relative && !/\.[cm]?[jt]s$/.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});
