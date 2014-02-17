/*
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Mick Hakobyan
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

// core implementation
(function (global, undefined) {
    "use strict";

    // export
    if (global.module) {
        // Node.js
        global.module.exports = Promise;
    } else {
        // <script />
        (global.chnobean = global.chnobean || {}).Promise = Promise;
    }

    /**
    * @constructor
    * @param {function(function, function)} resolver
    */
    function Promise(resolver) {
        if (resolver) {
            try {
                resolver(this._doResolve.bind(this), this._doReject.bind(this));
            } catch(e) {
                this._doReject(e);
            }
        }
    }

    /**
    * @param {function=} onResolve is executed when this promise is fulfilled
    * @param {function=} onReject is executed when this promise is rejected
    */
    Promise.prototype.then = function Promise_then(onResolve, onReject) {
        var promise = new Promise();
        promise._onResolve = onResolve;
        promise._onReject = onReject; 
        this._when(promise);
        return promise;
    };

    /**
    * @param {function} onReject
    *
    * Sugar for promise.then(undefined, onReject)
    */
    Promise.prototype.catch = function Promise_catch(onReject) {
        return this.then(undefined, onReject);
    };

    /**
    * @param {*=} result
    *
    * Creates a promise resolved for result.
    */
    Promise.resolve = function Promise_resolve(result) {
        var promise = new Promise();
        promise._resolved = true;
        promise._result = result;
        return promise;
    };

    /**
    * @param {*=} error
    *
    * Creates a promise rejected with error.
    */
    Promise.reject = function Promise_reject(error) {
        var promise = new Promise();
        promise._resolved = false;
        promise._error = error;
        return promise;
    };

    // --------------------------------------------------------------------------------
    // -- private implementation
    // --------------------------------------------------------------------------------

    /**
    * Used instead of "instanceof" for performance reasons.
    */
    Promise.prototype._isPromise = true;

    /**
    * Resolve this promise and process deferals
    */
    Promise.prototype._doResolve = function Promise_doResolve(result) {
        if (this._resolved === undefined) {
            this._resolved = true;
            this._result = result;
            this._settleDefered();
        }
    };

    /**
    * Reject this promise and process deferals
    */
    Promise.prototype._doReject = function Promise_doReject(error) {
        if (this._resolved === undefined) {
            this._resolved = false;
            this._error = error;
            this._settleDefered();
        }
    };

    /**
    * If this one is resolved, settle given promise or defer it's settlement
    */
    Promise.prototype._when = function Promise_when(promise) {
        if (this._resolved !== undefined) {
            // we are resolved, settle the given promise
            promise._settle(this);
        } else {
            // defer the settlement
            this._deferred = this._deferred || [];
            this._deferred.push(promise);
        }
    };

    /**
    * Settle promised whos settlement was defered
    */
    Promise.prototype._settleDefered = function Promise_settleDefered() {
        // assert(this._resolved !== undefined)
        var deferred = this._deferred,
            deferredLength,
            i;
        if (deferred) {
            this._deferred = undefined;
            deferredLength = deferred.length;
            for(i = 0; i < deferredLength; i++) {
                deferred[i]._settle(this);
            }
        }
    };   

    /**
    * Settle this promise (called by the one before, when it's resolved)
    */
    Promise.prototype._settle = function Promise_settle(settledBy) {
        // assert(settledBy._resolved !== undefined)
        var resolved = settledBy._resolved,
            result = settledBy._result,
            error = settledBy._error,
            onResolve,
            onReject,
            newResult;

        if (result && result._isPromise) {
            // previous promise resolved to a promise, forward this to that promise
            result._when(this);
        } else {
            // settle this promise given result or error
            // cache and kill the onResolve and onReject we got from .then(onResolve, onReject)
            onResolve = this._onResolve;
            onReject = this._onReject;
            this._onResolve = undefined;
            this._onReject = undefined;
            if (resolved) {
                // resolve
                if (onResolve) {
                    try {
                        newResult = onResolve.call(this, result);
                        this._doResolve(newResult);
                    } catch(e) {
                        this._doReject(e);
                    }
                } else {
                    this._doResolve(result);
                }
            } else {
                // reject
                if (onReject) {
                    try {
                        newResult = onReject.call(this, error);
                        this._doResolve(newResult);
                    } catch(e) {
                        this._doReject(e);
                    }
                } else {
                    this._doReject(error);
                }

            }
        }
    };

})(this);