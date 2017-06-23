'use strict';
//Require dependencies
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const generate = require('babel-generator').default;

var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: false });
  }
  initializing() {
    // checking current project state, getting configs, etc
  }

  _mailerPrompts() {
    const SERVICE = {
      GMAIL: 'gmail'
    };
    return [
      {
        type    : 'confirm',
        name    : 'mailer',
        message : 'Would you like to enable Mailer?'
      },
      {
        type    : 'list',
        name    : 'mailerService',
        message : 'Mailer:: service',
        choices : ['gmail'],
        when: function(props) {
          return props.mailer;
        }
      },
      {
        type    : 'input',
        name    : 'mailerAuthUser',
        message : 'Mailer:: email',
        when: function(props) {
          return props.mailer && props.mailerService === SERVICE.GMAIL;
        },
        validate: function(prop) {
          if (!prop) {
            return 'Email Required';
          } else {
            return true;
          }
        }
      },
      {
        type    : 'input',
        name    : 'mailerAuthPass',
        message : 'Mailer:: password',
        when: function(props) {
          return props.mailer && props.mailerService === SERVICE.GMAIL;
        },
        validate: function(prop) {
          if (!prop) {
            return 'Password Required';
          } else {
            return true;
          }
        }
      }
    ];
  }

  _redisPrompts() {
    return [
      {
        type    : 'confirm',
        name    : 'redis',
        message : 'Would you like to enable Redis?'
      },
      {
        type    : 'input',
        name    : 'redisHost',
        message : 'Redis:: host',
        default : 'localhost',
        when: function(props) {
          return props.redis;
        }
      },
      {
        type    : 'input',
        name    : 'redisPort',
        message : 'Redis:: port',
        default : 6379,
        when: function(props) {
          return props.redis;
        },
        validate: function(prop) {
          return isNaN(prop) ? 'Invalid Port Number' : true;
        }
      }
    ];
  }

  _fivebeansPrompts() {
    return [
      {
        type    : 'confirm',
        name    : 'fivebeans',
        message : 'Would you like to enable FiveBeans?'
      },
      {
        type    : 'input',
        name    : 'fivebeansHost',
        message : 'FiveBeans:: host',
        default : 'localhost',
        when: function(props) {
          return props.fivebeans;
        }
      },
      {
        type    : 'input',
        name    : 'fivebeansPort',
        message : 'FiveBeans:: port',
        default : 11300,
        when: function(props) {
          return props.fivebeans;
        },
        validate: function(prop) {
          return isNaN(prop) ? 'Invalid Port Number' : true;
        }
      }
    ];
  }

  prompting() {
    var done = this.async();
    var me = this;
    this.prompt(
      [
        {
          type    : 'input',
          name    : 'name',
          message : 'Your project name',
          when: () => {
            return !this.options.name;
          },
          default : this.appname // Default to current folder name
        }
      ].concat(
        this._mailerPrompts(),
        this._redisPrompts(),
        this._fivebeansPrompts()
      )
    ).then((answers) => {
      if (this.options.name) {
        answers.name = this.options.name;
      }
      // this.log(answers);
      this.props = answers;
      done();
    });
  }

  configuring() {
    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files)
  }

  writing() {
    this.props.mailerService = this.props.mailerService || '';
    this.props.mailerAuthUser = this.props.mailerAuthUser || '';
    this.props.mailerAuthPass = this.props.mailerAuthPass || '';
    this.props.redisHost = this.props.redisHost || '';
    this.props.redisPort = this.props.redisPort || '';
    this.props.fivebeansHost = this.props.fivebeansHost || '';
    this.props.fivebeansPort = this.props.fivebeansPort || '';
    // this.log('app name', this.props.name);
    // // Where you write the generator specific files (routes, controllers, etc)
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath('server.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('plopfile.js'),
      this.destinationPath('plopfile.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('package-lock.json'),
      this.destinationPath('package-lock.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.yo-rc.json'),
      this.destinationPath('.yo-rc.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('views/index.hbs'),
      this.destinationPath('views/index.hbs'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('views/layouts/main.hbs'),
      this.destinationPath('views/layouts/main.hbs'),
      this.props
    );
    mkdirp.sync(this.destinationPath('public/img'));
    this.fs.copyTpl(
      this.templatePath('pm2/pm2.development.json'),
      this.destinationPath('pm2/pm2.development.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('pm2/pm2.production.json'),
      this.destinationPath('pm2/pm2.production.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('locales/en.json'),
      this.destinationPath('locales/en.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('locales/zh_CN.json'),
      this.destinationPath('locales/zh_CN.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('locales/zh_HK.json'),
      this.destinationPath('locales/zh_HK.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('configs/index.js'),
      this.destinationPath('configs/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('configs/base/development.json'),
      this.destinationPath('configs/base/development.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('configs/base/production.json'),
      this.destinationPath('configs/base/production.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/index.js'),
      this.destinationPath('app_start/index.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/AuthConfig.js'),
      this.destinationPath('app_start/AuthConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/ControllersConfig.js'),
      this.destinationPath('app_start/ControllersConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/HttpHeadersConfig.js'),
      this.destinationPath('app_start/HttpHeadersConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/IndicativesConfig.js'),
      this.destinationPath('app_start/IndicativesConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/LocaleConfig.js'),
      this.destinationPath('app_start/LocaleConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/PublicPathConfig.js'),
      this.destinationPath('app_start/PublicPathConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/RouterConfig.js'),
      this.destinationPath('app_start/RouterConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app_start/ViewsConfig.js'),
      this.destinationPath('app_start/ViewsConfig.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app/controllers/AuthController.js'),
      this.destinationPath('app/controllers/AuthController.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app/controllers/HomeController.js'),
      this.destinationPath('app/controllers/HomeController.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app/helpers/indicatives.js'),
      this.destinationPath('app/helpers/indicatives.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app/models/LocalizedString.js'),
      this.destinationPath('app/models/LocalizedString.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app/models/User.js'),
      this.destinationPath('app/models/User.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('app/services/AuthService.js'),
      this.destinationPath('app/services/AuthService.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.vscode/launch.json'),
      this.destinationPath('.vscode/launch.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.vscode/settings.json'),
      this.destinationPath('.vscode/settings.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('.vscode/snippets/javascript.json'),
      this.destinationPath('.vscode/snippets/javascript.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('__test__/test_configs.js'),
      this.destinationPath('__test__/test_configs.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('__test__/services/auth.js'),
      this.destinationPath('__test__/services/auth.js'),
      this.props
    );
  }

  conflicts() {
    // Where conflicts are handled (used internally)
  }

  install() {
    // Where installations are run (npm, bower)
    this.installDependencies({
      bower: false
    });
  }

  end() {
    // Called last, cleanup, say good bye, etc
  }
};
