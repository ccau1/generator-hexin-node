const path = require('path');
const { AppStartConfig } = require('@httpeace_deploy/httpeace-node-core');
const expressHbs = require('express-handlebars');
const packageJson = require('../package.json');

module.exports = class ViewsConfig extends AppStartConfig {
  init(next) {
    const { app, title } = this.appConfig;

    //    set views settings
    const views = {
      dir: path.join(`${__dirname}/../views`),
      engine: 'hbs', // options: hbs, pug
      hbsConfig: {
        extname: 'hbs',
        defaultLayout: 'main.hbs',
        partialsDir: path.join(`${__dirname}/../views`),
        layoutsDir: `${__dirname}/../views/layouts`,
        // Specify helpers which are only registered on this instance.
        helpers: {
          title,
          pacakgeVersion: packageJson.version
        }
      }
    };

    app.set('views', views.dir); // TODO:: not working, still defaulting to /views

    switch (views.engine) {
      case 'hbs':
        app.engine('hbs', expressHbs.create(views.hbsConfig).engine);
        app.set('view engine', 'hbs');
        break;
      case 'pug':
        app.set('view engine', 'pug');
        break;
      default:
        break;
    }
    next();
  }
};
