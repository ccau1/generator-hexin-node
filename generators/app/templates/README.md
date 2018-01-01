# <%= name %>
# HEXIN Node Framework

This is a node framework that enforces scalability, seperation of concern, and obscuring redundent code while empowering developers with what they need to implement additional features without looking at bloated files. This framework was built with .NET's MVC ideology in mind, and takes ideas from their use of Service & Repository Pattern, Auto-Mapper, Inversion of Control, app_start config.

## Get Started
### Prerequisite
- You have to create the MySQL Database Manually before you start.

### install yarn
### https://yarnpkg.com/lang/en/docs/install/#linux-tab

### For Mac

    brew install yarn

### Install or Upgrade package

### Developers

    yarn run i

### Packages administrator

    yarn install

### YARN Scripts
|`yarn run <script>`|Description|
|-------------------|-----------|
|`apidoc`           |Build apidoc page to public/docs/|
|`build`            |Builds the application|
|`i`                |Install modules but freeze the package-lock file
|`seed`             |Create a mongo database and insert seed data
|`seed:remove`      |Remove seed data
|`start`            |Serves your app at `localhost:8280` (port by default)|
|`test`             |Test the application using mocha|

Table of contents
=================
  * [Prerequisite](#prerequisite)
  * [Get Started](#get-started)
    * [Setup](#setup)
    * [Run](#run)
    * [NPM Scripts](#npm-scripts)
  * [Folder Structure](#folder-structure)
  * [App](#app)
    * [Controllers](#controllers)
    * [Helpers](#helpers)
    * [Models](#models)
    * [Services](#services)
  * [App_Start](#app_start)
  * [File Scaffolding](#file-scaffolding)
    * [Install](#install)
    * [Usage](#usage)
    * [Plop Scripts](#plop-scripts)
  * [Useful Requires and Helpers](#useful-requires-and-helpers)
  * [API End Points](#api_en_points)
    * [Auth](#auth)
    * [Account](#account)
    * [Home](#home)
    * [Mailer](#mailer)
  * [Plugins](#plugins)
  * [Todos](#todos)

## Folder Structure
```
├── __test__                    Mocha & chai tests
|   └── controllers
|   └── helpers
|   └── models
|   └── services
├── .vscode                     Settings & snippets for this project (for VS Code)
├── app                         Main container for the application
|   └── controllers             Handles routes
|   └── helpers                 Reusable helper methods
|   └── models                  Mongoose models
|   └── repos                   Data access layers (coming soon)
|       └── unitOfWork.js       Contains all repos
|   └── seeds                   Contains seed data and seed models
|   └── services                Business logic (fascades between controller and models)
├── app_start                   Holds application startup code
|   └── index.js                Handles ordering & calling of the application startup code
├── configs                     Holds all configs
├── documentation               Hold the documentaion
├── locales                     Locale definitions
├── public                      folders and files that'll be available in http://{url}/
├── views                       Holds views using handlebars
    └── layouts                 View's layouts
```
## App
The app folder is where developers will spent majority of their time in.

### The Flow
All requests made to the server will flow through the system into the following five layers and in this specific order:
`Controllers <-> Services <-> (UnitOfWork <-> Repos) <-> Models`
> It is very important to remember that a layer can never skip over another layer and directly communicate with another layer. All communication must be to their adjacent  layers.

The purpose of this flow is to maintain the Separation-of-Concern between each of them. Each layer has its own duty and will only handle their own tasks. A very good example for this would be if you decide to change the database to another type, you just have to swap the models and update the code for the repo (adaptor for data accessing). For this change, all code updates are contained and you do not have to scour the whole project for all endpoints.

### Controllers
> Controller is responsible for authorization, DTO mapping, calling service methods, and returning of result/errors

The controller will have two base class to extend from; the ControllerBase and ControllerCrudBase. The ControllerBase holds the essential methods and variables needed. ControllerCrudBase is an extension of ControllerBase and holds all basic CRUD calls for the given Service provided in the constructor. Every controller must extend either ControllerBase or ControllerCrudBase.

#### Constructor
`constructor(app: Object)` - controller is instantiated with an app argument

`super(app: Object[, controllerName: string[, service: Object]])` - ControllerBase super

`super(app: Object[, controllerName: string[, service: Object[, middlewares]]])` - ControllerCrudBase super

#### Extendable class
`ControllerBase` - documentation in https://github.com/ccau1/hexin-core#controllerbase

`ControllerCrudBase` - documentation in https://github.com/ccau1/hexin-core#controllercrudbase

ControllerCrudBase automatically initalizes the following routes:
- **[GET]** `api/{route}/` - Get All
- **[GET]** `api/{route}/:_id` - Get by _id
- **[POST]** `api/{route}/` - Create
- **[PUT]** `api/{route}/:_id` - Update by _id
- **[DELETE]** `api/{route}/:_id` - Delete by _id


#### Helper methods
`authenticate` - a middleware that verifies whether user is logged in or not
```javascript
router.post('/', this.authenticate, (req, res, next) {
```
`authorize(...roles: Array<string>)` - a middleware that can be used as authenticate or can be called as function with permitted roles
```javascript
router.post('/', this.authorize, (req, res, next) {
router.post('/', this.authorize(), (req, res, next) { // (same as above)
router.post('/', this.authorize('user', 'admin'), (req, res, next) {
```
`renderRoutes(router: Object): void` - this is the method where you declare all the routes for this controller. You must override this method in each controller

`this.isVerb(verb: string, inVerbList: Array<string>|string): boolean` - Function that returns true if first arg is in second argument. Useful for checking if req.method is equal to one of the verbs listed
```javascript
this.isVerb(req.method, 'PUT|POST|DELETE')
this.isVerb(req.method, ['PUT', 'POST', 'DELETE'])
```
#### Example
```javascript
'use strict';

const {ControllerCrudBase} = require('hexin-core');

// Service
const AuthService = new require('../services/AuthService');

module.exports = class AuthController extends ControllerCrudBase {
    constructor(app) {
        const baseMiddlewares = [
            (req, res, next) => {
                // if method is create, update, or delete, ensure user is authenticated first
                if (this.isVerb(req.method, 'PUT|POST|DELETE')) {
                    this.authenticate(req, res, next);
                } else {
                    next();
                }
            }
        ];
        super(app, 'auth', AuthService, baseMiddlewares);
    }

    renderRoutes(router) {
        const {authorize} = this;

        // Routes definition set here

        // [POST] Register
        router.post('/register', async (req, res, next) => {
        const {m} = req;
        const result = await m.createUser(req.body);

        res.send(result);
        });
    }
}
```

### Helpers
Helpers are small reusable functions that'll be applicable in multiple endpoints and could even possibly be transferable to other projects
### Models
A model defines a database collection/table structure and its constraints/rules. By default, the model uses mongoose to manage this definition and data-modification methods.
### Services
> Service is responsible for the system's business logic

The service will have two base class to extend from; the ServiceBase and ServiceCrudBase (corresponds to controller's two base classes). The ServiceBase holds the essential methods and variables needed. The ServiceCrudBase is an extension of the ServiceBase class and holds all basic CRUD calls for the given Model provided in the constructor. Every service must extend either ServiceBase or ServiceCrudBase. It is highly recommended that you use the library HandleError to handle any errors

#### Constructor
`constructor(context: Object)` - services will be instantiated with a context argument (represents router's request object)

`super(context: Object, model: Object)`

#### Extendable Class
`ServiceBase` - documentation in https://github.com/ccau1/hexin-core#servicebase

`ServiceCrudBase` - documentation in https://github.com/ccau1/hexin-core#servicecrudbase

ServiceCrudBase automatically provides the following methods:

- `getAll(): Array<Object>` - Get All
- `getById(_id: number): Object` - Get by _id
- `create(obj: Object): Object` - Create
- `update(_id: number, obj: Object): Object` - Update by _id
- `delete(_id: number): Object` - Delete by _id

#### Context Variables (this)
`t(localeKey: string, args: Array<string>): string` - translates localeKey into text defined in current locale

`lang` - current locale

`context` - context passed from parent

`_model` - the model passed from constructor

#### Helper Methods
`validate(obj: Object): boolean` - validates model object and returns true if success or throws error if fails. Used before passing it to the database

`sanitize` - modify object to become database ready. Used before passing it to the database

`mapper` - a DTO mapper to handle from database to client

`mapperReverse` - a DTO mapper to handle from client to database


#### Example
```javascript
'use strict';

const {ServiceCrudBase} = require('hexin-core');
const indicative = require('indicative');

const {HandleError} = require('hexin-core/helpers');

// Models
const Todo = new require('../models/Todo');

module.exports = class TodoService extends ServiceCrudBase {
    constructor(context_) {
        super(context_, Todo);
    }

    /*
        ServiceCrudBase already included the following:
            getAll(),
            getById(_id),
            create(obj),
            update(_id, obj),
            delete(_id)
    */

    * setIsComplete(_id, isComplete) {
        const {t} = this;
        let todo = yield _model.update({'_id': _id}, {$set: {isComplete}});
        if (!todo) {
            throw new HandleError({_error: [t('err_reset_token_expired')]}, 422);
        }
        return todo;
    }
}
```

### Repos
(coming soon)


## App_Start
The app_start folder contains all the configuration files needed to get the app started. Each of the config files will have three lifecycle methods available for it: `preInit()`, `init()`, `postInit()`
```javascript
'use strict';

const {AppStartConfig} = require('hexin-core');

module.exports = class ControllersConfig extends AppStartConfig {
    preInit(appConfig: Object) { }
    init(appConfig: Object) { }
    postInit(appConfig: Object) { }
```


## File Scaffolding
We use plop to generate scaffolds to maintain consistancy in code and folder structure, as well as speeding up development time
### Install
```
$ npm install -g plop
```
### Usage
View File Scaffolding List
```
$ plop
```
Trigger specific command
```
$ plop {scriptName}
```

### Plop Scripts
|`npm run g:<script>`    |Description|
|-------------------|-----------|
|`model`            |Generate Model|
|`service`            |Generate Service|
|`controller`             |Generate Controller|
|`msc`           |Generate Model, Service & Controller|
|`app_start`        |Generate app_start/{name}Config.js|


## Useful Requires and Helpers
`const configs = require('../../configs').base;` - Project configs

`const {HandleError} = require('hexin-core/helpers');` - Error handling


# API End Points

### Auth
- [login](documentation/authLogin.md)
- [register](documentation/authRegister.md)
- [reset password](documentation/authResetPassword.md)
- [reset password verify toekn](documentation/authResetPasswordVerifyToken.md)
- [reset password update new password](documentation/authResetPasswordUpdatePassword.md)
- [logout](documentation/authLogout.md)

### Account
- [get user details](documentation/accountGetUserDetails.md)
- [update user details](documentation/accountUpdateUserDetails.md)
- [get avatars by user](documentation/accountGetAvatarsByUser.md)
- [get avatar by avatar id](documentation/accountGetAvatarByAvaraId.md)
- [delete avatar by avatar id](documentation/accountDeleteAvatarByAvaraId.md)

### Home
- [get index page](documentation/homeGetIndex.md)
- [check health](documentation/homeHealthCheck.md)

### Mailer
- [send email](documentation/MailerSendEmail.md)


# Plugin End points

- ## Media plugin
    - [create media](documentation/plugins/media/createMedia.md)
    - [get all media](documentation/plugins/media/getAllMedia.md)
    - [get by id](documentation/plugins/media/getById.md)
    - [update by id](documentation/plugins/media/updateById.md)
    - [delete by id](documentation/plugins/media/deleteById.md)

- ## Posts plugin
    - [create post](documentation/plugins/post/createPost.md)
    - [get all posts](documentation/plugins/post/getAllPosts.md)
    - [get by id](documentation/plugins/post/getPostById.md)
    - [get by type](documentation/plugins/post/getByPostType.md)
    - [check permalink available](documentation/plugins/post/checkPermalinkAvailabe.md)
    - [update by id](documentation/plugins/post/updateById.md)
    - [delete by id](documentation/plugins/post/deleteById.md)

- ## Page plugin
    - [create page](documentation/plugins/page/createPage.md)
    - [get all pages](documentation/plugins/page/getAllPages.md)
    - [get page by code](documentation/plugins/page/getPageByCode.md)
    - [update page](documentation/plugins/page/updatePage.md)
    - [delete by id](documentation/plugins/page/deleteById.md)


(More Documentation Coming Soon)

## Todos
- [ ] Move /views to /app/views
- [x] Use plop for generating files
- [x] Enhance User functionalities (reset/change password, upload avatar)
- [x] Add Unit of Work and Repository Layer
- [x] Use yeoman to generate this framework
