const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi'],
  },
  localePath:
    typeof window === 'undefined'
      ? path.resolve('./public/locales')
      : path.resolve('./public/locales')
}