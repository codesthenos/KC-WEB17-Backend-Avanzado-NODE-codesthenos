import path from 'node:path'
import { I18n } from 'i18n'

const i18n = new I18n({
  locales: ['en', 'es'],
  directory: path.join(import.meta.dirname, '..', 'i18n-locales'),
  defaultLocale: 'en',
  autoReload: true,
  syncFiles: true,
  cookie: 'nodepop-lang'
})

export const i18nMiddleware = i18n.init
