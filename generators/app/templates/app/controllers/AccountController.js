'use strict';

const {ControllerBase} = require('hexin-core');
const AccountService = require('../services/AccountService');
const actions = require('../controllersActions/AccountActions');


module.exports = class AccountController extends ControllerBase {
  constructor(app) {
    super(app, 'account', AccountService);
  }

  renderRoutes(router) {
    const {authorize} = this;

    /**
    * @api {get} /account/user Get current User
    * @apiGroup account
    *
    * @apiSuccess {String} _id ID of the User.
    * @apiSuccess {String} firstName First name of the User.
    * @apiSuccess {String} lastName Last name of the User.
    * @apiSuccess {String} email Email of the User.
    * @apiSuccess {String} _id ID of the User.
    * @apiSuccess {Array} roles Roles of the User.
    *
    */
    router.get('/user', authorize(), actions.getUser);

    /**
    * @api {put} /account/user Update Current User
    * @apiName update user
    * @apiGroup account
    *
    * @apiParam {Object} userObj User object to update
    *
    * @apiSuccess {Object} userOjb Updated user object.
    *
    */
    router.put('/user', authorize(), actions.updateUser);

    /**
    * @api {get} /account/avatars?default Get all avatars
    * @apiName get avatars
    * @apiGroup account
    *
    * @apiParam {String} default is default avatar
    *
    * @apiSuccess {Object} avatars Avatars list
    */
    router.get('/avatars', authorize(), actions.getAvatarList);

    /**
    * @api {get} /account/avatars/:_id Get avatars by Id
    * @apiName get avatars
    * @apiGroup account
    *
    * @apiParam {String} default Is default avatar
    *
    * @apiSuccess {String} _id Avatar id
    * @apiSuccess {String} fileMetaId Uploaded avatar id from fileMeta
    * @apiSuccess {String} name Avatar name
    * @apiSuccess {String} uri Avatar uri
    * @apiSuccess {String} default Is default
    */
    router.get('/avatars/:_id', authorize(), actions.getUserAvatar);

    /**
    * @api {post} /account/avatars Insert an avatar to the user
    * @apiName create avatars
    * @apiGroup account
    *
    * @apiParam {String} fileMetaId Uploaded avatar id from fileMeta
    * @apiParam {String} name Avatar name
    * @apiParam {String} uri Avatar uri
    * @apiParam {String} default Is default
    *
    * @apiSuccess {String} _id Avatar id
    * @apiSuccess {String} fileMetaId Uploaded avatar id from fileMeta
    * @apiSuccess {String} name Avatar name
    * @apiSuccess {String} uri Avatar uri
    * @apiSuccess {String} default Is default
    */
    router.post('/avatars/', authorize(), actions.createAvatar);

    /**
    * @api {put} /account/avatars/:_id/setDefault Set the avatar as the default
    * @apiName Set avatar default
    * @apiGroup account
    *
    * @apiSuccess {Number} avatarCount Size of avatars.
    * @apiSuccess {Number} avatar Default avatar object.
    */

    router.put('/avatars/:_id/setDefault', authorize(), actions.updateAvatar);


    /**
    * @api {delete} /account/avatars Delete avatar
    * @apiName Delete avatar
    * @apiGroup account
    *
    * @apiSuccess {String} avatarObj Avatar object
    */
    router.delete('/avatars/:_id', authorize(), actions.deleteAvatar);
  }
};
