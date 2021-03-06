const path = require('path');
const { AppStartConfig } = require('hexin-core');
const { Locale } = require('hexin-core/helpers');
const PluginManager = require('../app/helpers/PluginManager');

module.exports = class LocaleConfig extends AppStartConfig {
  preInit(next, appConfig) {
    appConfig.localeSettings = {
      default: 'en',
      sources: [
        `${path.dirname(require.main.filename)}/locales`,
        PluginManager.manager().setLocales()
      ],
      accept: {
        zh_HK: ['zh_HK'],
        zh_CN: ['zh_CN'],
        en: [
          'en-us',
          'en-au',
          'en-bz',
          'en-zw',
          'en-gb',
          'en-tt',
          'en-za',
          'en-ph',
          'en-nz',
          'en-jm',
          'en-ie',
          'en-ca'
        ]
      }
    };
    next();
  }

  init(next) {
    const { router } = this.appConfig;
    router.use(this.middleware.bind(this));
    next();
  }

  middleware(req, res, next) {
    const { appConfig } = this;
    const locale = new Locale(appConfig.localeSettings);

    // example acceptLanguage: en;q=1,tc,sc;q=3 (q defaults to 1)
    const acceptLanguage = req.headers['accept-language'];
    if (acceptLanguage) {
      const languages = [];
      const acceptLanguages = acceptLanguage.split(',');
      acceptLanguages.forEach(acceptLng => {
        const parts = acceptLng.split(';');
        let qValue = 1;
        for (let p = 0; p < parts.length; p++) {
          const part = parts[p].split('=');
          if (part[0] === 'q' && !isNaN(part[1])) {
            qValue = Number(part[1]);
            break;
          }
        }
        languages.push({ code: parts[0], q: qValue });
      });
      if (languages.length) {
        languages.sort((a, b) => b.q - a.q);

        languages.find(
          lang =>
            locale.isValidLanguageCode(lang.code) &&
            locale.setCurrentLanguage(lang.code)
        );
      }
    }
    req.locale = locale;
    next();
  }
};
