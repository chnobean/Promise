// core implementation
(function (global, undefined) {
    "use strict";

    var chnobean = global.chnobean = global.chnobean || {};

    function Promise(resolver) {
        if (resolver) {
            try {
                resolver(this._doResolve.bind(this), this._doReject.bind(this));
            } catch(e) {
                this._doReject(e);
            }
        }
    }

    Promise.prototype.then = function Promise_then(onResolve, onReject) {
        var promise,
            result,
            error;

        if (this._resolved !== undefined) {

            // it is resolved
            try {
                if (this._resolved) {
                    // resolved
                    result = this._result;
                    if (onResolve) {
                        result = onResolve(result);
                    }
                    promise = Promise.resolve(result);
                } else {
                    // rejected
                    error = this._error;
                    if (onReject) {
                        result = onReject(error);
                        promise = Promise.resolve(result);
                    } else {
                        promise = Promise.reject(error);
                    }
                }
            } catch(e) {
                promise = Promise.reject(e);
            }

        } else {

            // not resolved, deffer 
            promise = new Promise();

            // TODO: deferred

        }

        return promise;
    };

    Promise.prototype.catch = function Promise_catch(onError) {
        return this.then(undefined, onError);
    };

    Promise.resolve = function Promise_resolve(result) {
        var promise = new Promise();
        promise._resolved = true;
        promise._result = result;
        return promise;
    };

    Promise.reject = function Promise_reject(error) {
        var promise = new Promise();
        promise._resolved = false;
        promise._error = error;
        return promise;
    };

    Promise.prototype._doResolve = function Promise_doResolve(result) {
        if (this._resolved === undefined) {
            this._resolved = true;
            this._result = result;

            // TODO: deferred
        }
    };

    Promise.prototype._doReject = function Promise_doReject(error) {
        if (this._resolved === undefined) {
            this._resolved = false;
            this._error = error;

            // TODO: deferred
        }
    };

    // exports
    chnobean.Promise = Promise;

})(this);