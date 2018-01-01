'use strict';

const fs = require('fs');
const path = require('path');
const {ControllerBase} = require('@httpeace_deploy/httpeace-node-core');

module.exports = class HomeController extends ControllerBase {
  constructor(app) {
    super(app, '');
  }

  /**
  * @api {get}  / Get index page
  * @apiGroup home
  *
  * @apiSuccess {String} index Index page
  */
  renderRoutes(router) {
    router.get('/', async (req, res) => {
      res.render(
        'index',
        {});
    });

    /**
    * @api {get}  /health Check the health
    * @apiGroup home
    *
    * @apiSuccess {String} health Health status
    */
    router.get('/health', async (req, res) => {
      res.end('health check okay');
    });

    /**
    * @api {get}  /docs Get docs
    * @apiGroup home
    *
    * @apiSuccess {String} docs Docs
    */
    router.get('/docs', async (req, res) => {
      fs.readFile(path.dirname(__dirname) + '/../doc/index.html', 'utf8', function (err, text) {
        res.send(text);
      });
    });
  }
};
