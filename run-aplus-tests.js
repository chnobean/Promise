var Promise = require('./chnobean.Promise');

var promisesAplusTests = require('promises-aplus-tests');


var adapter = {
    resolved: function(value) {
        return Promise.resolve(value);
    },

    rejected: function(reason) {
        return Promise.reject(reason);
    },

    deferred: function() {
        var promise_reject;
        var promise_resolve;
        var promise = new Promise(function (resolve, reject) {
            promise_reject = reject;
            promise_resolve = resolve;
        });
        return {
            promise: promise,
            resolve: promise_resolve,
            reject: promise_reject
        };
    }

};

promisesAplusTests(adapter, { reporter: "spec" }, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});