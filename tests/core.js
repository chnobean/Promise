(function (global, undefined) {
    "use strict";

    var Promise = global.chnobean.Promise;

    describe("Core", function(){

        it("(synch resolve Promise).then.catch", function(){
            var result,
                error;

            runs(function(){
                new Promise(function(resolve, reject){
                    resolve('r');
                })
                .then(function(r){
                    result = r;
                })
                .catch(function(e){
                    error = e;
                });
            });

            runs(function(){
                expect(result).toBe('r');
                expect(error).toBeUndefined();
            });

        });

        it("(synch reject Promise).then.catch", function(){
            var result,
                error;

            runs(function(){
                new Promise(function(resolve, reject){
                    reject('e');
                })
                .then(function(r){
                    result = r;
                })
                .catch(function(e){
                    error = e;
                });
            });

            runs(function(){
                expect(result).toBeUndefined();
                expect(error).toBe('e');
            });

        });

    });

})(this);