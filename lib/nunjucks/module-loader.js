'use strict';

var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');
var lib = require('nunjucks/src/lib');

// Node <0.7.1 compatibility
var existsSync = fs.existsSync || path.existsSync;

var ModuleLoader = nunjucks.FileSystemLoader.extend({
    async: false,

    init: function init(modules, opts) {

        this.modules = modules;
        var opts = opts || {};
        var searchPaths = opts.paths || false;

        this.parent(searchPaths, opts);
    },

    getSource: function getSource(name) {

        if (name.indexOf('@') === 0) {
            var tmp = name.split('/');
            var _module = tmp.shift().substr(1);

            // @todo move this to module manager
            if (!this.modules[_module]) {
                throw Error("Unregistered module: '" + _module + "'");
            }

            var basePath = this.modules[_module].getViewPath();
            var fName = tmp.join('/');

            var tempName = path.join(basePath, fName);
            if (!existsSync(tempName)) {
                return null;
            }

            this.searchPaths.unshift(basePath);
            name = fName;
        }

        return this.parent(name);
    }

});

module.exports = ModuleLoader;