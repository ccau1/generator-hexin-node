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

    // this.argument('name', { type: String, required: false });
  }
  initializing() {
    // checking current project state, getting configs, etc
  }

  prompting() {
  }

  configuring() {
    // Saving configurations and configure the project
    // (creating .editorconfig files and other metadata files)
  }

  writing() {

    this._modifyAppStartIndex.apply(this, [this.props]);
  }

  _modifyAppStartIndex(props) {
    const source = this.fs.read(this.destinationPath('app_start/index.1.js'));
    // SourceType tells babylon to treat the source as a module and allow things like imports
    const ast = babylon.parse(source);
const me = this;
    // this.log('ast', props, ast, this.destinationPath('app_start/index.js'));
me.log('ast', ast.program.body);
me.log('ha', ast.program.body[0].declarations);

setTimeout(function () {
    traverse(ast, {
      enter(path) {
        if (path.node.type === 'Identifier' && path.node.name === 'require') {
          me.log('coming parent', path.parent.type);
          me.log('path', path.node.type, path.node.name);
        }
        // me.log('path parent', path.parent.type, path.parent.type.name);
      }
    });
}, 1000);
    // // Checks whether the node or it's parent is an ImportDeclaration or an ImportSpecifier
    // const isImportDeclaration = path => (
    //   t.isImportDeclaration(path.node) ||
    //   t.isImportSpecifier(path.node) ||
    //   t.isImportDeclaration(path.parent) ||
    //   t.isImportSpecifier(path.parent) ||
    //   t.isImportDefaultSpecifier(path.parent)
    // );

    // // Remember the last ImportDeclaration node
    // let lastImport = null;
    // let lastProperty = null;

    // // Create a new import declaration. You can also create a factory function for that.
    // const declaration = t.importDeclaration(
    //   [ t.importDefaultSpecifier(t.identifier(`${this.name}`)) ], // This is the imported name
    //   t.stringLiteral(`./reducers/${this.name}`) // This is the path to the source
    // );

    // // Traverse the tree
    // traverse(
    //   // Gets called when visiting *any* node
    //   enter(path) {
    //     // If we've visited imports and the current node is not an import we insert our declaration *after* the last import.
    //     if (lastImport && !isImportDeclaration(path)) {
    //       lastImport.insertAfter(declaration);
    //     }

    //     if (lastProperty && !t.isIdentifier(path.node)) {
    //       lastProperty.insertAfter(t.objectProperty(
    //         t.identifier('tasks'),
    //         t.identifier('tasksReducer')
    //       ));
    //     }
    //   },

    //   // Remember ImportDeclarations when visiting
    //   ImportDeclaration(path) {
    //     lastImport = path;
    //   },

    //   ObjectProperty(path) {
    //     lastProperty = path;
    //   }
    // );

    // // Generate actually source code from modified AST
    // const { code } = generate(ast, { /* Options */ }, source);

    // // Write source back to file
    // this.fs.write(this.destinationPath('src/reducers.js', code);
  }

  conflicts() {
    // Where conflicts are handled (used internally)
  }

  install() {
    // Where installations are run (npm, bower)
    // this.installDependencies();
  }

  end() {
    // Called last, cleanup, say good bye, etc
  }
};
