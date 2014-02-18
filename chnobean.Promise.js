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
                resolver(
                    Promise_fulfill.bind(undefined, this), 
                    Promise_reject.bind(undefined, this)
                );
            } catch(e) {
                Promise_reject(this, e);
            }
        }
    }

    /**
    * @param {function=} onFulfilled is executed when this promise is fulfilled
    * @param {function=} onRejected is executed when this promise is rejected
    */
    Promise.prototype.then = function Promise_then(onFulfilled, onRejected) {
        var promise = new Promise();
        promise._onFulfilled = onFulfilled;
        promise._onRejected = onRejected; 
        Promise_when(this, promise);
        return promise;
    };

    /**
    * @param {function} onRejected
    *
    * Sugar for promise.then(undefined, onRejected)
    */
    Promise.prototype.catch = function Promise_catch(onRejected) {
        return this.then(undefined, onRejected);
    };

    /**
    * @param {*=} result
    *
    * Creates a promise resolved for result.
    */
    Promise.resolve = function Promise_resolve(result) {
        var promise = new Promise();
        promise._fulfilled = true;
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
        promise._fulfilled = false;
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
    * Fulfills the promise and resolve deferals
    */
    function Promise_fulfill(promise, result) {
        if (promise._fulfilled === undefined) {
            promise._fulfilled = true;
            promise._result = result;
            Promise_resolveDeferred(promise);
        }
    };

    /**
    * Reject the promise and resolve deferals
    */
    function Promise_reject(promise, error) {
        if (promise._fulfilled === undefined) {
            promise._fulfilled = false;
            promise._error = error;
            Promise_resolveDeferred(promise);
        }
    };

    /**
    * Once promise is resolved, resolve nextPromise
    */
    function Promise_when(promise, nextPromise) {
        if (promise._fulfilled !== undefined) {
            // we are resolved, resolve the given promise
            Promise_resolve(nextPromise, promise);
        } else {
            // defer the resolution
            promise._deferred = promise._deferred || [];
            promise._deferred.push(nextPromise);
        }
    };

    /**
    * Resolves deffered promises
    */
    function Promise_resolveDeferred(promise) {
        // assert(promise._fulfilled !== undefined)
        var deferred = promise._deferred,
            deferredLength,
            i;
        if (deferred) {
            promise._deferred = undefined;
            deferredLength = deferred.length;
            for(i = 0; i < deferredLength; i++) {
                Promise_resolve(deferred[i], promise);
            }
        }
    };   

    /**
    * Resolves promise (called by the one before, when it's resolved)
    */
    function Promise_resolve(promise, resolvedBy) {
        // assert(resolvedBy._fulfilled !== undefined)
        var resolved = resolvedBy._fulfilled,
            result = resolvedBy._result,
            error = resolvedBy._error,
            onFulfilled,
            onRejected,
            newResult;

        if (result && result._isPromise) {
            // previous promise resolved to a promise, forward the promose
            Promise_when(result, promise);
        } else {
            // resolve promise given result or error
            // cache and kill the onFulfilled and onRejected we got from .then(onFulfilled, onRejected)
            onFulfilled = promise._onFulfilled;
            onRejected = promise._onRejected;
            promise._onFulfilled = undefined;
            promise._onRejected = undefined;
            if (resolved) {
                // resolve
                if (onFulfilled) {
                    try {
                        newResult = onFulfilled.call(promise, result);
                        Promise_fulfill(promise, newResult);
                    } catch(e) {
                        Promise_reject(promise, e);
                    }
                } else {
                    Promise_fulfill(promise, result);
                }
            } else {
                // reject
                if (onRejected) {
                    try {
                        newResult = onRejected.call(promise, error);
                        Promise_fulfill(promise, newResult);
                    } catch(e) {
                        Promise_reject(promise, e);
                    }
                } else {
                    Promise_reject(promise, error);
                }

            }
        }
    };

})(this);