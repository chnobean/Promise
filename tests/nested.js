(function (global, undefined) {
    "use strict";

    var Promise = global.chnobean.Promise;

    describe("Nested", function () {

        function createTests(execute) {

            it("(resolve Promise).then(return resolve Promise).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            resolve('r1');
                        });
                    })
                    .then(function (r) {
                        result1 = r;
                        return new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r2');
                            });
                        });
                    })
                    .then(function(r) {
                        result2 = r;
                    })
                    .catch(function (e) {
                        error1 = e;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toBe('r1');
                    expect(error1).toBeUndefined();
                    expect(result2).toBe('r2');
                    expect(error2).toBeUndefined();
                    expect(done).toBe(true);
                });

            });


        };

        describe('Synchronius', function () {
            createTests(function (f) {
                f();
            });
        });

        describe('Asynchronius', function () {
            createTests(function (f) {
                setInterval(f, 10);
            });
        });

    });

})(this);