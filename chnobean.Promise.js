// core implementation
(function (global, undefined) {
    "use strict";

    var chnobean = global.chnobean = global.chnobean || {};

    function Promise(resolver) {

        function onResolve(result) {
            // TODO: implement
        }

        function onReject(error) {
            // TODO: implement
        }

        try {
            resolver(onResolve, onReject);
        } catch (error) {
            onReject(error);
        }

    }

    Promise.prototype.then = function Promise_then(onResolve, onError) {
        return new Promise(function (resolve, reject) {
            // TODO: implement
        });
    };

    // exports
    chnobean.Promise = Promise;

})(this);

// syntactic sugar 
(function (global, undefined) {
    "use strict";

    var chnobean = global.chnobean = global.chnobean || {};

    // imports
    var Promise = chnobean.Promise;

    Promise.prototype.catch = function Promise_catch(func) {
        this.then(undefined, func);
    };

    Promise.resolve = function Promise_resolve(result) {
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    };

    Promise.reject = function Promise_reject(error) {
        return new Promise(function (resolve, reject) {
            reject(error);
        });
    };

})(this);