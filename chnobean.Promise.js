// core implementation
(function (global, undefined) {
    "use strict";

    // exports
    (global.chnobean = global.chnobean || {}).Promise = Promise;

    // new Promise(function(resolve, reject){ })
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
        var promise = new Promise();

        promise._onResolve = onResolve;
        promise._onReject = onReject; 

        if (this._resolved !== undefined) {
            this._doNext(promise);
        } else {
            this._deferred = this._deferred || [];
            this._deferred.push(promise);
        }

        return promise;
    };

    Promise.prototype.catch = function Promise_catch(onError) {
        return this.then(undefined, onError);
    };

    Promise.resolve = function Promise_resolve(result) {
        var promise = new Promise();
        promise._doResolve(result);
        return promise;
    };

    Promise.reject = function Promise_reject(error) {
        var promise = new Promise();
        promise._doReject(error);
        return promise;
    };

    Promise.prototype._doResolve = function Promise_doResolve(result) {
        if (this._resolved === undefined) {
            this._resolved = true;
            // TODO: handle result being a Promise (or thenable?)
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
        // assert(this._resolved !== undefined)
        var deferred = this._deferred;
        if (deferred) {
            this._deferred = undefined;
            for(var i = 0; i < deferred.length; i++) {
                this._doNext(deferred[i]);
            }
        }
    };

    Promise.prototype._doNext = function Promise_doNext(promise) {
        // assert(this._resolved !== undefined)
        if (this._resolved) {
            promise._tryResolve(this._result);
        } else {
            promise._tryReject(this._error);
        }
    };

    Promise.prototype._tryResolve = function Promise_tryResolve(result) {
        var onResolve = this._onResolve;
        this._onResolve = undefined;
        this._onReject = undefined;
        if (onResolve) {
            try {
                var newResult = onResolve.call(this, result);
                this._doResolve(newResult);
            } catch(e) {
                this._doReject(e);
            }
        } else {
            this._doResolve(result);
        }
    };

    Promise.prototype._tryReject = function Promise_tryReject(error) {
        var onReject = this._onReject;
        this._onResolve = undefined;
        this._onReject = undefined;
        if (onReject) {
            try {
                var newResult = onReject.call(this, error);
                this._doResolve(newResult);
            } catch(e) {
                this._doReject(e);
            }
        } else {
            this._doReject(error);
        }
    };

})(this);