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
                setInterval(f, 10);
            });
        });

    });

})(this);