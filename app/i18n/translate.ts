import { TxKeyPath } from './i18n';
import i18n from 'i18n-js';

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: TxKeyPath, options?: i18n.TranslateOptions) {
  return key ? i18n.t(key, options) : null;
}
