const { AppStartConfig } = require('hexin-core');
const { Mailer } = require('hexin-core/helpers');
const IamService = require('../app/services/IamService');

module.exports = class MailerConfig extends AppStartConfig {
  init(next) {
    const UnitOfWork = require('../app/repos');
    const ModelContext = require('../app/models');

    const WTTunitOfWork = new UnitOfWork(new ModelContext());
    const iamService = new IamService({
      unitOfWork: WTTunitOfWork,
      locale: {}
    });

    iamService.getIam(this.appConfig.iams.aws.ses).then(mailerIam => {
      if (!mailerIam) {
        throw new Error('MailerConfig Iam not found');
      } else {
        Mailer.connect({
          host: mailerIam.params.host,
          port: mailerIam.params.port,
          auth: {
            user: mailerIam.credentials.accessKeyId,
            pass: mailerIam.credentials.secretAccessKey
          }
        });
      }
      next();
    });
  }
};
