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

    describe("Promise.all", function () {

        function createTests(execute) {

            it("Promise.all([resolve]).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        })
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(){
                        error1 = true;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toEqual(['r1']);
                    expect(error1).toBeUndefined();
                    expect(done).toBe(true);
                });

            });


            it("Promise.all([resolve, resolve, resolve]).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r2');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r3');
                            });
                        }),
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(){
                        error1 = true;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toEqual(['r1', 'r2', 'r3']);
                    expect(error1).toBeUndefined();
                    expect(done).toBe(true);
                });

            });


            it("Promise.all([reject, resolve, resolve]).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                reject('e');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r2');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r3');
                            });
                        }),
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(r){
                        error1 = r;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toBeUndefined();
                    expect(error1).toBe('e');
                    expect(done).toBe(true);
                });

            });


            it("Promise.all([resolve, reject, resolve]).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                reject('e');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r3');
                            });
                        }),
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(r){
                        error1 = r;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toBeUndefined();
                    expect(error1).toBe('e');
                    expect(done).toBe(true);
                });

            });

            it("Promise.all([resolve, resolve, reject]).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r2');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                reject('e');
                            });
                        }),
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(r){
                        error1 = r;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toBeUndefined();
                    expect(error1).toBe('e');
                    expect(done).toBe(true);
                });

           });

            it("Promise.all([resolve, reject, reject]).then.catch.then", function () {
                var result1,
                    result2,
                    error1 = 0,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                reject('e');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                reject('e');
                            });
                        }),
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(r){
                        error1++;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toBeUndefined();
                    expect(error1).toBe(1);
                    expect(done).toBe(true);
                });

           });

       
           it("Promise.all([resolve, resolve, noop]).then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.all([
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r1');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            execute(function(){
                                resolve('r2');
                            });
                        }),
                        new Promise(function (resolve, reject) {
                        }),
                    ])
                    .then(function(r) {
                        result1 = r;
                    })
                    .catch(function(r){
                        error1 = r;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waits(50);

                runs(function () {
                    expect(result1).toBeUndefined();
                    expect(error1).toBeUndefined();
                    expect(done).toBeUndefined();
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