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

    describe("Core", function () {

        function createTests(execute) {

            it("(resolve Promise).then(onResolve, onReject)", function () {
                var result,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            resolve('r');
                        });
                    })
                    .then(
                        function (r) {
                            result = r;
                        }, 
                        function (e) {
                            error = e;
                        }
                    );
                });

                waitsFor(function(){
                    return result || error;
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(error).toBeUndefined();
                });

            });


            it("(resolve Promise).then.catch.then", function () {
                var result,
                    error,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            resolve('r');
                        });
                    })
                    .then(function (r) {
                        result = r;
                    })
                    .catch(function (e) {
                        error = e;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(error).toBeUndefined();
                    expect(done).toBe(true);
                });

            });

            it("(resolve Promise).then.then.catch.then", function () {
                var result,
                    result2,
                    error,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            resolve('r');
                        });
                    })
                    .then(function (r) {
                        result = r;
                        return 'r2';
                    })
                    .then(function (r) {
                        result2 = r;
                    })
                    .catch(function (e) {
                        error = e;
                    })
                    .then(function(r){
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(result2).toBe('r2');
                    expect(error).toBeUndefined();
                    expect(done).toBe(true);
                });

            });

            it("(reject Promise).then(onResolve, onReject)", function () {
                var result,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            reject('e');
                        });
                    })
                    .then(
                        function (r) {
                            result = r;
                        }, 
                        function (e) {
                            error = e;
                        }
                    );
                });

                waitsFor(function(){
                    return result || error;
                });

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(error).toBe('e');
                });

            });

            it("(reject Promise).then.catch.then", function () {
                var result,
                    error,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            reject('e');
                        });
                    })
                    .then(function (r) {
                        result = r;
                    })
                    .catch(function (e) {
                        error = e;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });                

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(error).toBe('e');
                    expect(done).toBe(true);
                });

            });

            it("(reject Promise).then.then.catch.then", function () {
                var result,
                    result2,
                    error,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            reject('e');
                        });
                    })
                    .then(function (r) {
                        result = true;
                    })
                    .then(function (r) {
                        result2 = true;
                    })
                    .catch(function (e) {
                        error = e;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });   

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(result2).toBeUndefined();
                    expect(error).toBe('e');
                    expect(done).toBe(true);
                });

            }); 


            it("(reject Promise).then.then.catch.catch.then", function () {
                var result,
                    result2,
                    error,
                    error2,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            reject('e');
                        });
                    })
                    .then(function (r) {
                        result = true;
                    })
                    .then(function (r) {
                        result2 = true;
                    })
                    .catch(function (e) {
                        error = e;
                    })
                    .catch(function (e) {
                        error2 = true;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });   

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(result2).toBeUndefined();
                    expect(error).toBe('e');
                    expect(error2).toBeUndefined();
                    expect(done).toBe(true);
                });

            });      

            it("(reject Promise).then.then.catch(re-throw).then.catch.then", function () {
                var result,
                    result2,
                    result3,
                    error,
                    error2,
                    done;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        execute(function(){
                            reject('e');
                        });
                    })
                    .then(function (r) {
                        result = true;
                    })
                    .then(function (r) {
                        result2 = true;
                    })
                    .catch(function (e) {
                        error = e;
                        throw 'e2';
                    })
                    .then(function (r) {
                        result3 = true;
                    })
                    .catch(function (e) {
                        error2 = e;
                    })
                    .then(function() {
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });  

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(result2).toBeUndefined();
                    expect(result3).toBeUndefined();
                    expect(error).toBe('e');
                    expect(error2).toBe('e2');
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

        describe('Promise .resolve() and .reject()', function() {

           it("Promise.resolve().then.catch.then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.resolve('r1')
                    .then(function (r) {
                        result1 = r;
                        return 'r2';
                    })
                    .catch(function (e) {
                        error1 = e;
                    })
                    .then(function(r){
                        result2 = r;
                    })
                    .catch(function (e) {
                        error2 = e;
                    })
                    .then(function(r){
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

           it("Promise.reject().then.catch.then.catch.then", function () {
                var result1,
                    result2,
                    error1,
                    error2,
                    done;

                runs(function () {
                    Promise.reject('e1')
                    .then(function (r) {
                        result1 = r;
                        return 'r2';
                    })
                    .catch(function (e) {
                        error1 = e;
                    })
                    .then(function(r){
                        result2 = r;
                    })
                    .catch(function (e) {
                        error2 = e;
                    })
                    .then(function(r){
                        done = true;
                    });
                });

                waitsFor(function(){
                    return done;
                });

                runs(function () {
                    expect(result1).toBeUndefined();
                    expect(error1).toBe('e1');
                    expect(result2).toBeUndefined();
                    expect(error2).toBeUndefined();
                    expect(done).toBe(true);
                });

            });

        });

    });

})(this);