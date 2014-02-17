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
        var thisPromise = this,
            promise = new Promise();

        function whenDone() {
            var result,
                error;

            try {
                if (thisPromise._resolved) {
                    // resolved
                    result = thisPromise._result;
                    if (onResolve) {
                        result = onResolve(result);
                    }
                    promise._doResolve(result);
                } else {
                    // rejected
                    error = thisPromise._error;
                    if (onReject) {
                        result = onReject(error);
                        promise._doResolve(result);
                    } else {
                        promise._doReject(error);
                    }
                }
            } catch(e) {
                promise._doReject(e);
            }
        }

        if (this._resolved !== undefined) {
            // it is resolved
            whenDone();
        } else {
            thisPromise._deferred = thisPromise._deferred || [];
            thisPromise._deferred.push(whenDone);
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
            this._doDeferred();
        }
    };

    Promise.prototype._doReject = function Promise_doReject(error) {
        if (this._resolved === undefined) {
            this._resolved = false;
            this._error = error;
            this._doDeferred();
        }
    };

    Promise.prototype._doDeferred = function Promise_doDeferred() {
        if (this._resolved !== undefined) {
            var deferred = this._deferred;
            if (deferred) {
                this._deferred = undefined;
                for(var i = 0; i < deferred.length; i++) {
                    deferred[i]();
                }
            }
        }
    }

    // exports
    chnobean.Promise = Promise;

})(this);