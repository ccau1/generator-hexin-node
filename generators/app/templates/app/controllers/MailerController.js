'use strict';

const {ControllerBase} = require('hexin-core');

// Service
const Mailer = require('hexin-core/helpers/Mailer');

module.exports = class MailerController extends ControllerBase {
  constructor(app) {
    super(app, 'mailers');
  }

  /**
  * @api {post}  /mailers/send Send an email
  * @apiGroup mailers
  *
  * @apiParam {String} from From
  * @apiParam {String} to To
  * @apiParam {String} subject Subject
  * @apiParam {String} body Body
  * @apiParam {String} headers Headers
  *
  * @apiSuccess {Object} emailObj Send Email Details
  */
  renderRoutes(router) {
    router.post('/send', Mailer.sendRoute);
  }
};
