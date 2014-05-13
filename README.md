chnobean.Promise
=======

## A Promises/A+ implementation.

 - Coded with performance in mind.
 - Tweakable by constants for even better performance.
 - ~1.5k minified. Tested with closure complier set to SIMPLE_OPTIMIZATIONS

## Tweaks

### CONVERT_THENABLES = false;

This will disable the automatic detection of non-chnobean.Promise thenables, but will gain you a nice perf boost by not using an extra try / catch.

### ALWAYS_RESOLVE_SYNCHRONIOUSLY = true;

Spec quote: "onFulfilled or onRejected must not be called until the execution context stack contains only platform code."

If you don't need to rely on this behavior, chnobean.Promise can avoid using setTimeout, which will give another nice perf boost.

Anoter use for this is debugging, where you can have a full call stack that includes all resolve() or reject() calls.