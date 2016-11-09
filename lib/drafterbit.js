'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

var _moduleLoader = require('./nunjucks/module-loader');

var _moduleLoader2 = _interopRequireDefault(_moduleLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var drafterbit = _express2.default.application;

/**
 *  Get deskUrl appended by given path.
 *
 * @param strin path
 * @return string
 */
drafterbit.deskUrl = function (path) {
  return this._CONFIG.basePath + '/' + path.replace(/^\/|\/$/g, '');
};

/**
 * Get a module by name;
 *
 * @param strin name
 * @return object
 */
drafterbit.getModule = function (name) {

  if (!(name in this._modules)) {
    throw Error("Unregistered module: '" + name + "'");
  }

  return this._modules[name];
};

/**
 * Get modle by given name.
 *
 * @param strin name
 * @return object
 */
drafterbit.model = function (name) {

  if (typeof this._models[name] !== 'undefined') {
    return this._models[name];
  }

  if (name.indexOf('@') === 0) {
    var tmp = name.split('/');
    var module = tmp.shift().substr(1);

    // @todo move this to module manager
    if (!this._modules[module]) {
      throw Error("Unregistered module: '" + module + "'");
    }

    var basePath = this._modules[module].getModelPath();
    var fName = tmp.join('/');

    name = _path2.default.join(basePath, fName);
  }

  var ModelClass = require(name);
  var knex = this.get('db');
  this._models[name] = new ModelClass({ knex: knex });

  return this._models[name];
};

/**
 * This function can be overrided on app
 *
 * @return array
 */
drafterbit.registerModules = function () {
  return [];
};

/**
 * Load application from directory, this function must be called once
 * before run application to load routes, models, etc.
 *
 * @param string _ROOT
 */
drafterbit.load = function load(_ROOT) {

  this._ROOT = _ROOT;
  this._models = [];
  this._modules = [];
  this._modulePaths = this.registerModules();
  this._initConfig();
  this._initModules();
  this._boot();
};

/**
 * Boot the application.
 *
 * @return boolean
 */
drafterbit._boot = function () {
  this._initDB();
  this._initAppLogger();
  this._initViews();
  this._initBaseMiddlewares();
  this._initStaticMiddlewares();
  this._initSecurityMiddleware();

  // add req to nunjucks env as global
  // this must be defined after security
  var _this = this;
  this.use(function (req, res, next) {
    try {
      _this._nunjucksEnv.addGlobal('req', req);
      _this._nunjucksEnv.addGlobal('_jwtToken', req.session.JWToken);
    } catch (e) {
      console.log(e);
    }
    next();
  });

  this._initRoutes();

  // not found handle
  this.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  this._initErrorhandler();
  return true;
};

/**
 * Init error handler, this must be called in the end
 * @see drafterbit._boot
 *
 */
drafterbit._initErrorhandler = function () {
  if (this.get('env') === 'development') {
    this.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  this.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};

/**
 * Init security, for now, we simply use JWT auth.
 *
 * @return undefined
 */
drafterbit._initSecurityMiddleware = function () {
  // JWT simple auth setup, we redirect unauthorized to login page
  // @todo move secret to config

  // remove slash
  var basePath = this._CONFIG.basePath.replace(/^\/|\/$/g, '');

  this.use('(^\/' + basePath + ')', (0, _expressJwt2.default)({
    secret: this._CONFIG.secret,
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      } else if (req.session.JWToken) {
        return req.session.JWToken;
      }

      return null;
    }
  }).unless({ path: [this._CONFIG.basePath + '/login', this._CONFIG.basePath + '/signup'] }));

  var _this = this;
  this.use(function (err, req, res, next) {

    // @todo check if request is ajax and return json
    if (err.name === 'UnauthorizedError') {
      res.redirect(_this._CONFIG.basePath + '/login');
    } else {
      // @why this is not executed ??
      // console.log(req.user);
    }
  });
};

/**
 * We create path to each public path in module.
 *
 * @return undefined
 */
drafterbit._initStaticMiddlewares = function () {
  for (var name in this._modules) {
    if (name === this._CONFIG.mainModuleName) {
      continue;
    }

    this.use('/' + name, _express2.default.static(this._modules[name].getPublicPath()));
  }
};

/**
 * Setting mandatory middleware such as session, logger, etc.
 *
 * @return undefined
 */
drafterbit._initBaseMiddlewares = function () {
  this.use((0, _morgan2.default)('dev'));
  this.use(_bodyParser2.default.urlencoded({ extended: true }));
  this.use(_bodyParser2.default.json());
  this.use((0, _expressValidator2.default)());
  this.use((0, _cookieParser2.default)());
  this.use(_express2.default.static(_path2.default.join(this._ROOT, 'public')));
  this.use('/bower_components', _express2.default.static(_path2.default.join(this._ROOT, 'bower_components')));

  this.use((0, _expressSession2.default)({ secret: this._CONFIG.secret })); // session secret
  this.use((0, _connectFlash2.default)()); // use connect-flash for flash messages stored in session
};

/**
 * We use nunjucks as default template engine.
 * Here we setup the environment and set express view engine to html.
 *
 * @return undefined
 */
drafterbit._initViews = function () {

  var viewPaths = [this._ROOT + '/views'];
  this._nunjucksEnv = new _nunjucks2.default.Environment(new _moduleLoader2.default(this._modules, { paths: viewPaths }), {
    autoescape: false,
    throwOnUndefined: true
  });
  this._nunjucksEnv.express(this);
  this._nunjucksEnv.addGlobal('__', function (s) {
    // @todo translation
    return s;
  });
  this._nunjucksEnv.addGlobal('isExists', function (el, arr) {
    return arr.indexOf(el) !== -1;
  });
  this._nunjucksEnv.addGlobal('gravatar', function (email) {
    var gravatar = require('gravatar');
    return gravatar.url(email, { s: 49 });
  });

  this._nunjucksEnv.addGlobal('system', {
    navigations: require('./navigations')
  });

  var _this = this;
  this._nunjucksEnv.addGlobal('deskUrl', function (path) {
    return _this.deskUrl(path);
  });

  this.set('view engine', 'html');
};

/**
 * We'll try to log user activity to database.
 *
 * @return undefined
 */
drafterbit._initAppLogger = function () {

  var winstonKnex = require('./winston/transports/knex');

  var appLogger = new _winston2.default.Logger({
    transports: [new _winston2.default.transports.Knex({ tableName: 'logs', knexInstance: this.get('knex') })]
  });

  this.set('appLogger', appLogger);
};

/**
 * Simply user knexjs as database access library.
 *
 * @return undefined
 */
drafterbit._initDB = function () {
  var knex = require('knex')(this._CONFIG.db);
  this.set('knex', knex);
  this.set('db', knex); // alias
};

/**
 * Init configuration, must be called first.
 *
 * @see drafterbit._boot
 * @todo distinguish per environment
 * @todo validate config file content
 */
drafterbit._initConfig = function () {
  var p = _path2.default.join(this._ROOT, 'config.js');
  if (_fs2.default.accessSync(p, _fs2.default.constants.F_OK)) {
    throw new Error("You must create config.js in your project root director");
  }

  this._CONFIG = require(p);
  this.set('_CONFIG', this._CONFIG);
  this.set('secret', this._CONFIG.secret);
  this.set('permissions', require('./permissions'));
};

/**
 * Init routing.
 * @todo add route priority options
 *
 */
drafterbit._initRoutes = function () {
  for (var name in this._modules) {

    var routes = this._modules[name].getRoutes();

    if (name === this._CONFIG.mainModuleName) {
      this.use('/', routes);
      continue;
    }

    if (routes) {
      this.use(this._CONFIG.basePath, routes);
    }
  }
};

/**
 * Init modules.
 */
drafterbit._initModules = function () {
  var _this = this;
  // create main/fallback module first

  var mainModule = function (_Module) {
    _inherits(mainModule, _Module);

    function mainModule() {
      _classCallCheck(this, mainModule);

      return _possibleConstructorReturn(this, (mainModule.__proto__ || Object.getPrototypeOf(mainModule)).apply(this, arguments));
    }

    _createClass(mainModule, [{
      key: 'getName',
      value: function getName() {
        return _this._CONFIG.mainModuleName;
      }
    }]);

    return mainModule;
  }(_module2.default);

  var mM = new mainModule(this);
  mM.dirname = this._ROOT;
  this._modules[mM.getName()] = mM;

  var ModulePathResolver = require('./module-path-resolver');
  this._modulePathResolver = new ModulePathResolver(this._ROOT);

  for (var i = 0; i < this._modulePaths.length; i++) {

    var rP = this._modulePathResolver.resolve(this._modulePaths[i]);
    var moduleF = require(rP);
    var m = new moduleF(this);
    m.resolvedPath = rP;

    if (_fs2.default.lstatSync(m.resolvedPath).isDirectory()) {
      m.dirname = m.resolvedPath;
    } else {
      m.dirname = _path2.default.dirname(m.resolvedPath);
    }

    // @todo validate name
    this._modules[m.getName()] = m;
  }
};

exports.default = drafterbit;
module.exports = exports['default'];