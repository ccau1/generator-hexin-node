"use strict";
//Require dependencies
var Generator = require("yeoman-generator");
var chalk = require("chalk");
var yosay = require("yosay");
var mkdirp = require("mkdirp");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const t = require("babel-types");
const generate = require("babel-generator").default;
const replace = require("replace-in-file");

var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("name", { type: String, required: false });
  }
  initializing() {
    // checking current project state, getting configs, etc
  }

  _dbPrompts() {
    const dbType = {
      MONGO: "mongo",
      MYSQL: "mysql"
    };
    return [
      {
        type: "list",
        name: "db",
        message: "Database",
        choices: [dbType.MONGO, dbType.MYSQL],
        default: dbType.MONGO,
        when: function(props) {
          return !props.express;
        }
      },
      {
        type: "input",
        name: "dbName",
        message: "Database:: name",
        validate: function(prop) {
          if (!prop) {
            return "Database Name Required";
          } else {
            return true;
          }
        }
      },
      {
        type: "input",
        name: "mainDbHost",
        message: "Database:: host",
        default: "localhost",
        when: function(props) {
          return !props.express;
        }
      },
      {
        type: "input",
        name: "mainDbPort",
        message: "Database:: port",
        default: 27017,
        when: function(props) {
          return !props.express;
        },
        validate: function(prop) {
          return isNaN(prop) ? "Invalid Port" : true;
        }
      }
    ];
  }

  _mailerPrompts() {
    const service = {
      GMAIL: "gmail"
    };
    return [
      {
        type: "confirm",
        name: "mailer",
        message: "Would you like to enable Mailer?",
        when: function(props) {
          return !props.express;
        }
      },
      {
        type: "list",
        name: "mailerService",
        message: "Mailer:: service",
        choices: [service.GMAIL],
        when: function(props) {
          return props.mailer;
        }
      },
      {
        type: "input",
        name: "mailerAuthUser",
        message: "Mailer:: email",
        when: function(props) {
          return props.mailer && props.mailerService === service.GMAIL;
        },
        validate: function(prop) {
          if (!prop) {
            return "Email Required";
          } else {
            return true;
          }
        }
      },
      {
        type: "input",
        name: "mailerAuthPass",
        message: "Mailer:: password",
        when: function(props) {
          return props.mailer && props.mailerService === service.GMAIL;
        },
        validate: function(prop) {
          if (!prop) {
            return "Password Required";
          } else {
            return true;
          }
        }
      }
    ];
  }

  _awsPrompts() {
    return [
      {
        type: "input",
        name: "awsS3User",
        message: "AWS s3 User",
        default: "s3-devcdn-wttwe-user",
        when: function(props) {
          return !props.express && props.mailer;
        },
        validate: function(prop) {
          if (!prop) {
            return "AWS S3 User Required";
          } else {
            return true;
          }
        }
      },
      {
        type: "input",
        name: "awsSesUser",
        message: "AWS Ses User",
        default: "ses-smtp-user.wtt-we",
        when: function(props) {
          return !props.express && props.mailer;
        },
        validate: function(prop) {
          if (!prop) {
            return "AWS Ses User Required";
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
        type: "confirm",
        name: "redis",
        message: "Would you like to enable Redis?",
        when: function(props) {
          return !props.express;
        }
      },
      {
        type: "input",
        name: "redisHost",
        message: "Redis:: host",
        default: "localhost",
        when: function(props) {
          return !props.express && props.redis;
        }
      },
      {
        type: "input",
        name: "redisPort",
        message: "Redis:: port",
        default: 6379,
        when: function(props) {
          return !props.express && props.redis;
        },
        validate: function(prop) {
          return isNaN(prop) ? "Invalid Port Number" : true;
        }
      }
    ];
  }

  _fivebeansPrompts() {
    return [
      {
        type: "confirm",
        name: "fivebeans",
        message: "Would you like to enable FiveBeans?",
        when: function(props) {
          return !props.express;
        }
      },
      {
        type: "input",
        name: "fivebeansHost",
        message: "FiveBeans:: host",
        default: "localhost",
        when: function(props) {
          return !props.express && props.fivebeans;
        }
      },
      {
        type: "input",
        name: "fivebeansPort",
        message: "FiveBeans:: port",
        default: 11300,
        when: function(props) {
          return !props.express && props.fivebeans;
        },
        validate: function(prop) {
          return isNaN(prop) ? "Invalid Port Number" : true;
        }
      }
    ];
  }

  _systemPrompts() {
    return [
      {
        type: "input",
        name: "port",
        message: "Port Number",
        default: 8280,
        when: function(props) {
          return true;
        },
        validate: function(prop) {
          return isNaN(prop) ? "Invalid Port Number" : true;
        }
      },
      {
        type: "input",
        name: "nodeVersion",
        message: "Node Version",
        default: "8.9.0",
        when: function(props) {
          return !props.express;
        },
        validate: function(prop) {
          if (!prop) {
            return "Node Version Required";
          } else {
            return true;
          }
        }
      }
    ];
  }

  _pluginPrompts() {
    return [
      {
        type: "confirm",
        name: "mediaPlugin",
        when: function(props) {
          return !props.express;
        },
        message: "Would you like to install Media Plugin?"
      },
      {
        type: "confirm",
        name: "postPlugin",
        when: function(props) {
          return !props.express;
        },
        message: "Would you like to install Post Plugin?"
      },
      {
        type: "confirm",
        name: "pagePlugin",
        when: function(props) {
          return !props.express;
        },
        message: "Would you like to install Page Plugin?"
      }
    ];
  }

  prompting() {
    var done = this.async();
    var me = this;
    this.prompt(
      [
        {
          type: "input",
          name: "name",
          message: "Your project name",
          when: () => {
            return !this.options.name;
          },
          default: this.appname // Default to current folder name
        },
        {
          type: "confirm",
          name: "express",
          message: "Express installation?"
        }
      ].concat(
        this._systemPrompts(),
        this._pluginPrompts(),
        this._dbPrompts(),
        this._mailerPrompts(),
        this._awsPrompts(),
        this._redisPrompts(),
        this._fivebeansPrompts()
      )
    ).then(answers => {
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
    if (this.props.express) {
      // if express installation, set default settings
      this.props = Object.assign({}, this.props, {
        // system
        nodeVersion: "8.9.0",
        // plugins
        mediaPlugin: false,
        postPlugin: false,
        pagePlugin: false,
        // fivebeans
        fivebeans: false,
        fivebeansHost: "localhost",
        fivebeansPort: 11300,
        // redis
        redis: false,
        redisHost: "localhost",
        redisPort: 6379,
        // aws
        awsS3User: "s3-devcdn-wttwe-user",
        awsSesUser: "ses-smtp-user.wtt-we",
        // mailer
        mailer: false,
        // db
        db: "mongo",
        mainDbHost: "localhost",
        mainDbPort: 27017
      });
    }

    this.props.mailerService = this.props.mailerService || "";
    this.props.mailerAuthUser = this.props.mailerAuthUser || "";
    this.props.mailerAuthPass = this.props.mailerAuthPass || "";
    this.props.redisHost = this.props.redisHost || "";
    this.props.redisPort = this.props.redisPort || "";
    this.props.fivebeansHost = this.props.fivebeansHost || "";
    this.props.fivebeansPort = this.props.fivebeansPort || "";
    // this.log('app name', this.props.name);
    // // Where you write the generator specific files (routes, controllers, etc)
    this.fs.copyTpl(
      this.templatePath("server.js"),
      this.destinationPath("server.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("seeder_" + this.props.db + ".js"),
      this.destinationPath("seeder.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("seederRemove.js"),
      this.destinationPath("seederRemove.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("plopfile.js"),
      this.destinationPath("plopfile.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".yo-rc.json"),
      this.destinationPath(".yo-rc.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".npmrcfile"),
      this.destinationPath(".npmrc"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".nvmrcfile"),
      this.destinationPath(".nvmrc"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".prettierrc"),
      this.destinationPath(".prettierrc"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".gitignorefile"),
      this.destinationPath(".gitignore"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".gitignorefile"),
      this.destinationPath(".gitignore"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".eslintrc"),
      this.destinationPath(".eslintrc"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".eslintignore"),
      this.destinationPath(".eslintignore"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".editorconfig"),
      this.destinationPath(".editorconfig"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("views/index.hbs"),
      this.destinationPath("views/index.hbs"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("views/layouts/main.hbs"),
      this.destinationPath("views/layouts/main.hbs"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("views/email/resetPassword.hbs"),
      this.destinationPath("views/email/resetPassword.hbs"),
      this.props
    );
    mkdirp.sync(this.destinationPath("public/img"));
    this.fs.copyTpl(
      this.templatePath("configs/pm2/pm2.development.json"),
      this.destinationPath("configs/pm2/pm2.development.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/pm2/pm2.production.json"),
      this.destinationPath("configs/pm2/pm2.production.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/pm2/pm2.staging.json"),
      this.destinationPath("configs/pm2/pm2.staging.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/pm2/pm2.testing.json"),
      this.destinationPath("configs/pm2/pm2.testing.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("locales/en.json"),
      this.destinationPath("locales/en.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("locales/zh_CN.json"),
      this.destinationPath("locales/zh_CN.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("locales/zh_HK.json"),
      this.destinationPath("locales/zh_HK.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/index.js"),
      this.destinationPath("configs/index.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/base/local.json"),
      this.destinationPath("configs/base/local.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/base/development.json"),
      this.destinationPath("configs/base/development.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/base/testing.json"),
      this.destinationPath("configs/base/testing.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/base/staging.json"),
      this.destinationPath("configs/base/staging.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/base/production.json"),
      this.destinationPath("configs/base/production.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/constants/props.json"),
      this.destinationPath("configs/constants/props.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("configs/constants/index.js"),
      this.destinationPath("configs/constants/index.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/accountDeleteAvatarByAvaraId.md"),
      this.destinationPath("documentation/accountDeleteAvatarByAvaraId.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/accountGetAvatarByAvaraId.md"),
      this.destinationPath("documentation/accountGetAvatarByAvaraId.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/accountGetAvatarsByUser.md"),
      this.destinationPath("documentation/accountGetAvatarsByUser.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/accountGetUserDetails.md"),
      this.destinationPath("documentation/accountGetUserDetails.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/accountUpdateUserDetails.md"),
      this.destinationPath("documentation/accountUpdateUserDetails.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/authLogin.md"),
      this.destinationPath("documentation/authLogin.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/authLogout.md"),
      this.destinationPath("documentation/authLogout.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/authRegister.md"),
      this.destinationPath("documentation/authRegister.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/authResetPassword.md"),
      this.destinationPath("documentation/authResetPassword.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/authResetPasswordUpdatePassword.md"),
      this.destinationPath("documentation/authResetPasswordUpdatePassword.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/authResetPasswordVerifyToken.md"),
      this.destinationPath("documentation/authResetPasswordVerifyToken.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/homeGetIndex.md"),
      this.destinationPath("documentation/homeGetIndex.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/homeHealthCheck.md"),
      this.destinationPath("documentation/homeHealthCheck.md"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("documentation/MailerSendEmail.md"),
      this.destinationPath("documentation/MailerSendEmail.md"),
      this.props
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/accountDeleteAvatarByAvatarId.png"
      ),
      this.destinationPath(
        "documentation/images/accountDeleteAvatarByAvatarId.png"
      )
    );
    this.fs.copy(
      this.templatePath("documentation/images/accountGetAvatarByAvatarId.png"),
      this.destinationPath(
        "documentation/images/accountGetAvatarByAvatarId.png"
      )
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/accountgetAvatarsByUserRequest.png"
      ),
      this.destinationPath(
        "documentation/images/accountgetAvatarsByUserRequest.png"
      )
    );
    this.fs.copy(
      this.templatePath("documentation/images/accountGetUser.png"),
      this.destinationPath("documentation/images/accountGetUser.png")
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/accountUpdateUserRequestBody.png"
      ),
      this.destinationPath(
        "documentation/images/accountUpdateUserRequestBody.png"
      )
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/accountUpdateUserRequestHeader.png"
      ),
      this.destinationPath(
        "documentation/images/accountUpdateUserRequestHeader.png"
      )
    );
    this.fs.copy(
      this.templatePath("documentation/images/accountUpdateUserResponse.png"),
      this.destinationPath("documentation/images/accountUpdateUserResponse.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/authLoginRequest.png"),
      this.destinationPath("documentation/images/authLoginRequest.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/authLoginResponse.png"),
      this.destinationPath("documentation/images/authLoginResponse.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/authRegisterRequest.png"),
      this.destinationPath("documentation/images/authRegisterRequest.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/authRegisterResponse.png"),
      this.destinationPath("documentation/images/authRegisterResponse.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/authResetPasswordRequest.png"),
      this.destinationPath("documentation/images/authResetPasswordRequest.png")
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/authResetPasswordRequestEmail.png"
      ),
      this.destinationPath(
        "documentation/images/authResetPasswordRequestEmail.png"
      )
    );
    this.fs.copy(
      this.templatePath("documentation/images/authResetPasswordResponse.png"),
      this.destinationPath("documentation/images/authResetPasswordResponse.png")
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/authResetPasswordVerifyTokenReponse.png"
      ),
      this.destinationPath(
        "documentation/images/authResetPasswordVerifyTokenReponse.png"
      )
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/authResetPasswordVerifyTokenRequest.png"
      ),
      this.destinationPath(
        "documentation/images/authResetPasswordVerifyTokenRequest.png"
      )
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/authUpdateNewResetPasswordRequest.png"
      ),
      this.destinationPath(
        "documentation/images/authUpdateNewResetPasswordRequest.png"
      )
    );
    this.fs.copy(
      this.templatePath(
        "documentation/images/authUpdateNewResetPasswordResponse.png"
      ),
      this.destinationPath(
        "documentation/images/authUpdateNewResetPasswordResponse.png"
      )
    );
    this.fs.copy(
      this.templatePath("documentation/images/homeHealth.png"),
      this.destinationPath("documentation/images/homeHealth.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/homeIndex.png"),
      this.destinationPath("documentation/images/homeIndex.png")
    );
    this.fs.copy(
      this.templatePath("documentation/images/mailerSendEmailRequest.png"),
      this.destinationPath("documentation/images/mailerSendEmailRequest.png")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/media/createMedia.md"),
      this.destinationPath("documentation/plugins/media/createMedia.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/media/deleteById.md"),
      this.destinationPath("documentation/plugins/media/deleteById.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/media/getAllMedia.md"),
      this.destinationPath("documentation/plugins/media/getAllMedia.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/media/getById.md"),
      this.destinationPath("documentation/plugins/media/getById.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/media/updateById.md"),
      this.destinationPath("documentation/plugins/media/updateById.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/page/createPage.md"),
      this.destinationPath("documentation/plugins/page/createPage.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/page/deleteById.md"),
      this.destinationPath("documentation/plugins/page/deleteById.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/page/getAllPages.md"),
      this.destinationPath("documentation/plugins/page/getAllPages.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/page/getPageByCode.md"),
      this.destinationPath("documentation/plugins/page/getPageByCode.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/page/updatePage.md"),
      this.destinationPath("documentation/plugins/page/updatePage.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/checkPermalinkAvailabe.md"),
      this.destinationPath(
        "documentation/plugins/post/checkPermalinkAvailabe.md"
      )
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/createPost.md"),
      this.destinationPath("documentation/plugins/post/createPost.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/deleteById.md"),
      this.destinationPath("documentation/plugins/post/deleteById.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/getAllPosts.md"),
      this.destinationPath("documentation/plugins/post/getAllPosts.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/getByPostType.md"),
      this.destinationPath("documentation/plugins/post/getByPostType.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/getPostById.md"),
      this.destinationPath("documentation/plugins/post/getPostById.md")
    );
    this.fs.copy(
      this.templatePath("documentation/plugins/post/updateById.md"),
      this.destinationPath("documentation/plugins/post/updateById.md")
    );
    this.fs.copyTpl(
      this.templatePath("app_start/index.js"),
      this.destinationPath("app_start/index.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/AuthConfig.js"),
      this.destinationPath("app_start/AuthConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/ControllersConfig.js"),
      this.destinationPath("app_start/ControllersConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/HttpHeadersConfig.js"),
      this.destinationPath("app_start/HttpHeadersConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/IndicativesConfig.js"),
      this.destinationPath("app_start/IndicativesConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/LocaleConfig.js"),
      this.destinationPath("app_start/LocaleConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/MailerConfig.js"),
      this.destinationPath("app_start/MailerConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/PluginInjectorConfig.js"),
      this.destinationPath("app_start/PluginInjectorConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/PublicPathConfig.js"),
      this.destinationPath("app_start/PublicPathConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/RouterConfig.js"),
      this.destinationPath("app_start/RouterConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/UnitOfWorkConfig.js"),
      this.destinationPath("app_start/UnitOfWorkConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/ViewsConfig.js"),
      this.destinationPath("app_start/ViewsConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app_start/SeedConfig.js"),
      this.destinationPath("app_start/SeedConfig.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/controllers/AccountController.js"),
      this.destinationPath("app/controllers/AccountController.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/controllers/AuthController.js"),
      this.destinationPath("app/controllers/AuthController.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/controllers/HomeController.js"),
      this.destinationPath("app/controllers/HomeController.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/controllers/MailerController.js"),
      this.destinationPath("app/controllers/MailerController.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/controllersActions/AccountActions.js"),
      this.destinationPath("app/controllersActions/AccountActions.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/controllersActions/AuthActions.js"),
      this.destinationPath("app/controllersActions/AuthActions.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/helpers/indicatives.js"),
      this.destinationPath("app/helpers/indicatives.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/helpers/PluginManager.js"),
      this.destinationPath("app/helpers/PluginManager.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/models/Iam_" + this.props.db + ".js"),
      this.destinationPath("app/models/Iam.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/models/index.js"),
      this.destinationPath("app/models/index.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/models/LocalizedString.js"),
      this.destinationPath("app/models/LocalizedString.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/models/User_" + this.props.db + ".js"),
      this.destinationPath("app/models/User.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/models/ModelContext_" + this.props.db + ".js"),
      this.destinationPath("app/models/ModelContext.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/repos/_unitOfWork.js"),
      this.destinationPath("app/repos/_unitOfWork.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/repos/IamRepo_" + this.props.db + ".js"),
      this.destinationPath("app/repos/IamRepo.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/repos/index.js"),
      this.destinationPath("app/repos/index.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/repos/UserRepo_" + this.props.db + ".js"),
      this.destinationPath("app/repos/UserRepo.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/seeds/iam.json"),
      this.destinationPath("app/seeds/iam.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/seeds/page.json"),
      this.destinationPath("app/seeds/page.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/seeds/user.json"),
      this.destinationPath("app/seeds/user.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/services/AccountService.js"),
      this.destinationPath("app/services/AccountService.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/services/AuthService.js"),
      this.destinationPath("app/services/AuthService.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/services/IamService_" + this.props.db + ".js"),
      this.destinationPath("app/services/IamService.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("app/services/MailerService.js"),
      this.destinationPath("app/services/MailerService.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".vscode/launch.json"),
      this.destinationPath(".vscode/launch.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".vscode/settings.json"),
      this.destinationPath(".vscode/settings.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".vscode/tasks.json"),
      this.destinationPath(".vscode/tasks.json"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath(".vscode/snippets/javascript.json"),
      this.destinationPath(".vscode/snippets/javascript.json"),
      this.props
    );
    mkdirp.sync(this.destinationPath("__test__/unit/repos"));
    this.fs.copyTpl(
      this.templatePath("__test__/unit/services/Account.test.js"),
      this.destinationPath("__test__/unit/services/Account.test.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/unit/services/Auth.test.js"),
      this.destinationPath("__test__/unit/services/Auth.test.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/unit/services/Mailer.test.js"),
      this.destinationPath("__test__/unit/services/Mailer.test.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/unit/services/Iam.test.js"),
      this.destinationPath("__test__/unit/services/Iam.test.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/unit/controllerActions/Auth.test.js"),
      this.destinationPath("__test__/unit/controllerActions/Auth.test.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/unit/controllerActions/Account.test.js"),
      this.destinationPath("__test__/unit/controllerActions/Account.test.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/bootstrap.js"),
      this.destinationPath("__test__/bootstrap.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/helper.js"),
      this.destinationPath("__test__/helper.js"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/mocha.opts"),
      this.destinationPath("__test__/mocha.opts"),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath("__test__/mongooseMock.js"),
      this.destinationPath("__test__/mongooseMock.js"),
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
    const pluginRequireArea = "// PLUGIN:INJECTOR";
    const pluginCreateArea = "this.pluginManager = PluginManager.manager();";
    const file = this.destinationPath("app_start/PluginInjectorConfig.js");

    const require = {
      media:
        pluginRequireArea +
        "\nconst media = require('hexin-core-plugins/hexin-plugin-media-node');",
      post:
        pluginRequireArea +
        "\nconst post = require('hexin-core-plugins/hexin-plugin-post-node');",
      page:
        pluginRequireArea +
        "\nconst page = require('hexin-core-plugins/hexin-plugin-page-node');"
    };

    const create = {
      media:
        pluginCreateArea +
        "\n    this.pluginManager.addPlugin(media, {iamService: IamService, iams: config.iams});",
      post: pluginCreateArea + "\n    this.pluginManager.addPlugin(post, {});",
      page: pluginCreateArea + "\n    this.pluginManager.addPlugin(page, {});"
    };

    let requireOptions = { files: file, from: pluginRequireArea, to: "" };
    let createOptions = { files: file, from: pluginCreateArea, to: "" };
    const plugins = {
      mediaPlugin: "media",
      postPlugin: "post",
      pagePlugin: "page"
    };

    for (var key in plugins) {
      if (this.props[key]) {
        requireOptions.to = require[plugins[key]];
        createOptions.to = create[plugins[key]];
        replace.sync(requireOptions);
        replace.sync(createOptions);
      }
    }
  }
};
