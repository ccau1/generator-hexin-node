'use strict';

const passport = require('passport');
const {ControllerBase} = require('hexin-core');
const actions = require('../controllersActions/AuthActions');

// Service
const AuthService = require('../services/AuthService');

module.exports = class AuthController extends ControllerBase {
  constructor(app) {
    super(app, 'auth', AuthService);
  }

  renderRoutes(router) {
    const {authorize} = this;
    /**
    * @api {post} /auth/register Register new user
    * @apiName Register
    * @apiGroup auth
    *
    * @apiParam {String} firstName First Name
    * @apiParam {String} lastName Last Name
    * @apiParam {String} email E-mail Address
    * @apiParam {String} password Password
    * @apiParam {String} confirmpassword Confirm Password
    *
    * @apiSuccess {String} firstName First Name
    * @apiSuccess {String} lastName Last Name
    * @apiSuccess {String} email E-mail Address
    * @apiSuccess {String} password Password
    * @apiSuccess {String} confirmpassword Confirm Password
    */
    router.post('/register', actions.registerUser);

    /**
    * @api {post} /auth/token Get user token with credentials
    * @apiName Login
    * @apiGroup auth
    *
    * @apiParam {String} username User's Username/Email
    * @apiParam {String} password User's Password
    *
    * @apiSuccess {String} id ID of the User.
    * @apiSuccess {String} name  Name of the User.
    * @apiSuccess {String} email  Email of the User.
    * @apiSuccess {String} status  Status of the User.
    * @apiSuccess {String} token  Token of the User.
    */
    router.post('/token', passport.authenticate('local'), actions.getUserToken);

    /**
    * @api {get} /auth/tokenFacebook Login and register using facebook
    * @apiName Login From Facebook
    * @apiGroup auth
    */
    router.get('/tokenFacebook', passport.authenticate('facebook', {scope: ['email', 'public_profile', 'user_friends']}));

    /**
    * @api {get} /auth/tokenFacebook/callback Get user token with credentials using facebook
    * @apiName Login From Facebook callback
    * @apiGroup auth
    * @apiSuccess {String} User id, name, email, status, token
    */
    router.get('/tokenFacebook/callback', passport.authenticate('facebook', {failureRedirect: '/api/auth/tokenFacebook/failed'}), actions.loginFacebook);

    /**
    * @api {get} /auth/tokenFacebook/failed return the failed message if facebook login or register failed
    * @apiName Login From Facebook fail
    * @apiGroup auth
    * @apiSuccess {String} message Fail message
    */
    router.get('/tokenFacebook/failed', actions.loginFacebookFail);

    /**
    * @api {get} /auth/tokenGoogle Login and register using google
    * @apiName Login From google
    * @apiGroup auth
    */
    router.get('/tokenGoogle', passport.authenticate('google', {scope: ['email', 'profile']}));

    /**
    * @api {get} /auth/tokenGoogle/callback Get user token with credentials using google
    * @apiName Login From Google callback
    * @apiGroup auth
    * @apiSuccess {String} User id, name, email, status, token
    */
    router.get('/tokenGoogle/callback', passport.authenticate('google', {failureRedirect: '/api/auth/tokenGoogle/failed'}), actions.loginGoogle);

    /**
    * @api {get} /auth/tokenGoogle/failed return the failed message if google login or register failed
    * @apiName Login From google fail
    * @apiGroup auth
    * @apiSuccess {String} message Fail message
    */
    router.get('/tokenGoogle/failed', actions.loginGoogleFail);

    /**
    * @api {post} /auth/reset-password Reset password
    * @apiName Reset Password
    * @apiGroup auth
    *
    * @apiParam {String} reset_token Reset token provided to user from email
    *
    */
    router.post('/reset-password', actions.resetPassword);

    /**
    * @api {post} /auth/reset-password-verify/:token Verify token
    * @apiName Reset-password-verify
    * @apiGroup auth
    *
    * @apiParam {String} token Access token
    *
    * @apiSuccess {Boolean} valid Token valid status
    */
    router.get('/reset-password-verify/:token', actions.resetPasswordVerify);

    /**
    * @api {post} /auth/reset-password/:token Validate token
    * @apiName Reset-password-verify-token
    * @apiGroup auth
    *
    * @apiParam {String} password Password
    * @apiParam {String} token Access token
    *
    * @apiSuccess {Boolean} updated Updated status
    */
    router.post('/reset-password/:token', actions.resetPasswordUpdate);

    /**
    * @api {post} /auth/logout Logout user
    * @apiName Logout
    * @apiGroup auth
    *
    */
    router.get('/logout', authorize(), actions.logoutUser);
  }
};
