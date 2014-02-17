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

            it("(resolve Promise).then(return resolve Promise to another Resolveing promise).then.catch.then", function () {
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
                                resolve(new Promise(function (resolve, reject) {
                                    execute(function(){
                                        resolve('r2');
                                    });
                                }));
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

            it("Promise.resolve(return resolve Promise).then.catch.then", function () {
                var result1,
                    error1,
                    done;

                runs(function () {
                    Promise.resolve(
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        })
                    )
                    .then(function (r) {
                        result1 = r;
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
                setTimeout(f, 10);
            });
        });

    });

})(this);