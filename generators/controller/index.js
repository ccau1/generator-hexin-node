'use strict';
//Require dependencies
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: false });
  }
  initializing() {
    // checking current project state, getting configs, etc
  }

  prompting() {
    var done = this.async();
    var me = this;
    this.prompt(
      [
        {
          type    : 'input',
          name    : 'name',
          message : 'Comtroller name',
          when: () => {
            return !this.options.name;
          },
          default : this.appname // Default to current folder name
        },
        {
          type    : 'confirm',
          name    : 'withCrud',
          message : 'Include CRUD'
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
    // Where you write the generator specific files (routes, controllers, etc)
    this.fs.copyTpl(
      this.templatePath('server.js'),
      this.destinationPath('server.js'),
      this.props
    );
  }

  conflicts() {
    // Where conflicts are handled (used internally)
  }

  install() {
    // Where installations are run (npm, bower)
    this.installDependencies();
  }

  end() {
    // Called last, cleanup, say good bye, etc
  }
};
