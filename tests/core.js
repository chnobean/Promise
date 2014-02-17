(function (global, undefined) {
    "use strict";

    var Promise = global.chnobean.Promise;

    describe("Core", function () {

        describe("Synchronious", function () {

            it("(resolve Promise).then.catch", function () {
                var result,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        resolve('r');
                    })
                    .then(function (r) {
                        result = r;
                    })
                    .catch(function (e) {
                        error = e;
                    });
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(error).toBeUndefined();
                });

            });

            it("(resolve Promise).then.then.catch", function () {
                var result,
                    result2,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        resolve('r');
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
                    });
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(result2).toBe('r2');
                    expect(error).toBeUndefined();
                });

            });

            it("(resolve Promise).then.catch.then", function () {
                var result,
                    result2,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        resolve('r');
                    })
                    .then(function (r) {
                        result = r;
                        return 'r2';
                    })
                    .catch(function (e) {
                        error = e;
                    })
                    .then(function(r) {
                        result2 = r;
                    });
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(result2).toBe('r2');
                    expect(error).toBeUndefined();
                });

            });        

            it("(reject Promise).then.catch", function () {
                var result,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        reject('e');
                    })
                    .then(function (r) {
                        result = r;
                    })
                    .catch(function (e) {
                        error = e;
                    });
                });

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(error).toBe('e');
                });

            });

            it("(reject Promise).then.then.catch", function () {
                var result,
                    result2,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        reject('e');
                    })
                    .then(function (r) {
                        result = true;
                    })
                    .then(function (r) {
                        result2 = true;
                    })
                    .catch(function (e) {
                        error = e;
                    });
                });

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(result2).toBeUndefined();
                    expect(error).toBe('e');
                });

            }); 


            it("(reject Promise).then.then.catch.catch", function () {
                var result,
                    result2,
                    error,
                    error2;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        reject('e');
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
                    });
                });

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(result2).toBeUndefined();
                    expect(error).toBe('e');
                    expect(error2).toBeUndefined();
                });

            });      

            it("(reject Promise).then.then.catch(re-throw).then.catch", function () {
                var result,
                    result2,
                    result3,
                    error,
                    error2;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        reject('e');
                    })
                    .then(function (r) {
                        result = true;
                    })
                    .then(function (r) {
                        result2 = true;
                    })
                    .catch(function (e) {
                        error = e;
                        throw 'e2'
                    })
                    .then(function (r) {
                        result3 = true;
                    })
                    .catch(function (e) {
                        error2 = e;
                    });
                });

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(result2).toBeUndefined();
                    expect(result3).toBeUndefined();
                    expect(error).toBe('e');
                    expect(error2).toBe('e2');
                });

            });   

        });

        describe("Asynchronious", function () {
 
            it("(resolve Promise).then.catch", function () {
                var result,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve('r');
                        }, 10);
                    })
                    .then(function (r) {
                        result = r;
                    })
                    .catch(function (e) {
                        error = e;
                    });
                });

                waitsFor(function () {
                    return result || error;
                });

                runs(function () {
                    expect(result).toBe('r');
                    expect(error).toBeUndefined();
                });

            });

            it("(reject Promise).then.catch", function () {
                var result,
                    error;

                runs(function () {
                    new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            reject('e');
                        }, 10);
                    })
                    .then(function (r) {
                        result = r;
                    })
                    .catch(function (e) {
                        error = e;
                    });
                });

                waitsFor(function () {
                    return result || error;
                });

                runs(function () {
                    expect(result).toBeUndefined();
                    expect(error).toBe('e');
                });

            });

        });

    });

})(this);