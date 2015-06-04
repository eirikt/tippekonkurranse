/* global require:false, exports:false, console:false */

var __ = require('underscore'),
    utils = require('./utils'),
    curry = utils.curry,
    clone = utils.clone,

///////////////////////////////////////////////////////////////////////////////
// Basic functions
///////////////////////////////////////////////////////////////////////////////

    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * The identity function:
     * <pre>
     *     f(x) = x
     * </pre>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     * @param {*} x the object that will be returned
     */
    identity = exports.identity =
        function (x) {
            'use strict';
            return x;
        },


///////////////////////////////////////////////////////////////////////////////
// Requestor factories
// - Takes arguments and returns a requestor function.
// ("Requestor factories" were previously called "requestories".)
//
// "Data generator requestors",
// always ignores incoming arguments, and passes along their own original arguments.
//
// "Data generator requestors" ignores incoming arguments, and produces outgoing arguments by other means.
// E.g. like here, with a explicitly provided value/function.
//
// A "data generator" requestor => No forwarding of incoming arguments/data.
// A typical parallel requestor, or as a starting requestor in a sequence.
///////////////////////////////////////////////////////////////////////////////

    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * <pre>
     *     f(x) = F(callback(x))
     * </pre>
     * or
     * <pre>
     *     f(x) = F(callback(x()))
     * </pre>
     * if the provided argument is a function.
     * </p>
     * <p>
     * <em>Aliases</em>
     * </p>
     * <p>
     * <ul>
     *     <li><code>return</code></li>
     *     <li><code>value</code></li>
     * </ul>
     * </p>
     * <p>
     * <em>Usage examples</em>
     * </p>
     * <p>
     * Pi as argument to <code>myNextRequestor</code>:
     * <pre>
     *     var RQ = ('async-rq'),
     *         rq = ('rq-essentials');
     *
     *     RQ.sequence([
     *         rq.value(Math.PI),
     *         myNextRequestor,
     *         ...
     *     ]);
     * </pre>
     * </p>
     * <p>
     * Random numbers as arguments to <code>myNextRequestor</code>:
     * <pre>
     *     var RQ = ('async-rq'),
     *         rq = ('rq-essentials');
     *
     *     RQ.sequence([
     *         RQ.parallel([
     *             rq.value(Math.random),
     *             rq.value(Math.random),
     *             rq.value(Math.random),
     *             rq.value(Math.random)
     *         ]),
     *         myNextRequestor,
     *         ...
     *     ]);
     * </pre>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     * @param {*} x a value or function, being or producing the argument that will be returned
     */
    identityFactory = exports.return = exports.value =
        function (x) {
            'use strict';
            return function requestor(callback, args) {
                var retVal = __.isFunction(x) ? x.call(this) : x;
                return callback(retVal, undefined);
            };
        },


///////////////////////////////////////////////////////////////////////////////
// Requestor factories
// - Takes arguments and returns a requestor function.
// ("Requestor factories" were previously called "requestories".)
//
// "Data manipulator requestors",
// takes incoming arguments, utilizes them somehow, maybe manipulates them - before passing them along.
///////////////////////////////////////////////////////////////////////////////

    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * The primary requestor factory:
     * <pre>
     *     f(g) = F(callback(g(x)))
     * </pre>
     * </p>
     * <p>
     * <em>Aliases</em>
     * </p>
     * <p>
     * <ul>
     *     <li><code>requestorize</code></li>
     *     <li><code>then</code></li>
     *     <li><code>do</code></li>
     * </ul>
     * </p>
     * <p>
     * <strong>
     * This requestor factory does not protect/seal/clone incoming arguments in any way.
     * That is the callback function's responsibility!
     * </strong>
     * </p>
     * <p>
     * <em>Usage examples</em>
     * </p>
     * <p>
     * Transforming a by-value number argument to its rounded version:
     * <pre>
     *     var RQ = ('async-rq'),
     *         rq = ('rq-essentials');
     *
     *     RQ.sequence([
     *         ...
     *         rq.then(Math.round),
     *         ...
     *     ]);
     * </pre>
     * </p>
     * <p>
     * Transforming an by-reference object argument:
     * <pre>
     *     var RQ = ('async-rq'),
     *         rq = ('rq-essentials'),
     *
     *         obj = {
     *             val: 13.49
     *         },
     *         mutatingAdder = function (obj) { // NB! Mutates incoming arguments
     *             obj.val += 1;
     *             return obj;
     *         },
     *         pureAdder = function (obj) {
     *             var newObj = clone(obj);
     *             newObj.val += 1;
     *             return newObj;
     *         };
     *
     *     RQ.sequence([
     *         rq.value(obj),
     *         rq.then(pureAdder),
     *         ...
     *     ]);
     * </pre>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     * @param {*} g a function which is applied to the arguments
     */
    requestorFactory = exports.requestorize = exports.then = exports.do =
        function (g) {
            'use strict';
            return function requestor(callback, args) {
                return callback(g(args), undefined);

                //var transformedVal1, transformedVal2;
                //try {
                //    transformedVal1 = g.call(this, clone(args));
                //    //transformedVal2 = g(args);

                //} catch (e) {
                //    var ex = e;
                //    console.error(e.message);
                // }
                //return callback(transformedVal1, undefined);

                //return callback(g(clone(args)), undefined);

            };
        },


    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * The more lenient requestor factory.
     * The execution of the requestor is wrapped in a try-catch block.
     * If an exception is thrown, its error message is written to <code>console.error</code>,
     * and the requestor fails, halting further execution of the requestor chain.
     * </p>
     * <p>
     * <em>Aliases</em>
     * </p>
     * <p>
     * <ul>
     *     <li><code>lenientRequestorize</code></li>
     *     <li><code>lrequestorize</code></li>
     *     <li><code>lthen</code></li>
     *     <li><code>ldo</code></li>
     * </ul>
     * </p>
     * <p>
     * This factory creates "<em>data manipulator requestors</em>".
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     * @param {*} g a function which is applied to the arguments
     */
    lenientRequestorFactory = exports.lenientRequestorize = exports.lrequestorize = exports.lthen = exports.ldo =
        function (g) {
            'use strict';
            return function requestor(callback, args) {
                var result;
                try {
                    result = g(args);
                    return callback(result, undefined);

                } catch (e) {
                    console.error(e.message);
                    return callback(undefined, e);
                }
            };
        },


    /**
     * ...
     */
    propertyPickerFactory = exports.pick =
        function (propertyName) {
            'use strict';
            return function requestor(callback, args) {
                var propertyValue = args[propertyName],
                    retVal = __.isFunction(propertyValue) ? propertyValue.call(this) : propertyValue;
                return callback(retVal, undefined);
            };
        },


///////////////////////////////////////////////////////////////////////////////
// Requestor factories
// - Takes arguments and returns a requestor function.
// ("Requestor factories" were previously called "requestories".)
//
// "Data ignoring requestors",
// ignores incoming arguments, does other stuff, causes various side-effects.
///////////////////////////////////////////////////////////////////////////////


    /**
     * <p>
     * Execution of arbitrary function:
     * <pre>
     *     f(g) = g(); F(callback(x))
     * </pre>
     * </p>
     * <p>
     * The given function will be executed isolated from the requestor argument passing.
     * </p>
     */
    arbitraryFunctionExecutorFactory = exports.execute = exports.terminate =
        function (g) {
            'use strict';
            return function requestor(callback, args) {
                g.call(this, null);
                return callback(args, undefined);
            };
        },


    /**
     * <p>
     * Simple interceptor for execution of arbitrary function and argument:
     * <pre>
     *     f(g, y) = g(y); F(callback(x))
     * </pre>
     * </p>
     * <p>
     * The given function will be executed isolated from the requestor argument passing.
     * </p>
     */
    arbitraryFunctionAndArgumentExecutorFactory = exports.execArgs = exports.terminateArgs =
        function (g, y) {
            'use strict';
            return function requestor(callback, args) {
                g.call(this, y);
                return callback(args, undefined);
            };
        },


/**
 * <p>
 * <pre>
 *     f(g, y) = g(y); F(callback(x))
 * </pre>
 * </p>
 */
// Same as arbitraryFunctionExecutorFactory above ...
//terminatorRequestorFactory = exports.terminate =
//    function (callbackToInvoke, argsToBeInvokedWith) {
//        'use strict';
//        return function (callback, args) {
//            callbackToInvoke(argsToBeInvokedWith, undefined);
//            return callback(args, undefined);
//        };
//    },
//


///////////////////////////////////////////////////////////////////////////////
// Requestor factories
// - Takes arguments and returns a requestor function.
// ("Requestor factories" were previously called "requestories".)
//
// Other requestors,
// conditional execution, cancellers, and such.
///////////////////////////////////////////////////////////////////////////////

    /**
     * Nice for stubbing requestor factories in tests.
     */
    noopFactory = exports.noopFactory =
        function () {
            'use strict';
            return function requestor(callback, args) {
                return callback(args, undefined);
            };
        },


    /**
     * ...
     */
    instrumentedConditionalFactory = exports.instrumentedCondition = exports.instrumentedIf =
        function (options, condition) {
            'use strict';
            return function requestor(callback, args) {
                var executedCondition = __.isFunction(condition) ? condition.call(this, args) : condition;
                if (executedCondition) {
                    if (options && options.success) {
                        console.log(options.name + ': ' + options.success);
                    }
                    return callback(args, undefined);
                }
                else {
                    if (options && options.failure) {
                        console.warn(options.name + ': ' + options.failure);
                    }
                    return callback(undefined, 'Condition not met');
                }
            };
        },


    conditionalFactory = exports.condition = exports.continueIf = exports.if =
        curry(instrumentedConditionalFactory, null),


    cancelFactory = exports.cancel =
        function (callbackToCancel, logMessage) {
            'use strict';
            return function requestor(callback, args) {
                callback(args, undefined);
                if (logMessage) {
                    console.error(logMessage);
                    return callbackToCancel(undefined, logMessage);
                } else {
                    return callbackToCancel(undefined, 'Callback cancelled');
                }
            };
        },


    errorFactory = exports.error =
        function (errorMessage) {
            'use strict';
            return function requestor(callback, args) {
                throw new Error(errorMessage);
            };
        },


///////////////////////////////////////////////////////////////////////////////
// Requestors
//
// Functions that executes requests, synchronously or asynchronously
// Asynchronicity is handled by callbacks.
// ("callbacks" were previously called "request continuations"/"requestions".)
//
// Standard 'canned' requestors below
///////////////////////////////////////////////////////////////////////////////

    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * The requestor version of "the null function":
     * <pre>
     *     f(callback, x) = callback(undefined)
     * </pre>
     * </p>
     * <p>
     * <em>Aliases</em>
     * </p>
     * <p>
     * <ul>
     *     <li><code>undefined</code></li>
     * </ul>
     * </p>
     * <p>
     * <em>Usage examples</em>
     * </p>
     * <p>
     * <code>undefined</code> as argument to <code>myNextRequestor</code>:
     * <pre>
     *     var RQ = ('async-rq'),
     *         rq = ('rq-essentials');
     *
     *     RQ.sequence([
     *         rq.undefined,
     *         myNextRequestor,
     *         ...
     *     ]);
     * </pre>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     */
    nullRequestor = exports.nullRequestor = exports.undefined =
        identityFactory(undefined),


    /**
     * The requestor version of "the empty function":
     * <pre>
     *     f(callback, x) = callback(null)
     * </pre>
     */
    emptyRequestor = exports.emptyRequestor = exports.empty = exports.null =
        identityFactory(null),


    /**
     * The tautology requestor:
     * <pre>
     *     f(callback, x) = callback(true)
     * </pre>
     */
    tautologyRequestor = exports.tautologyRequestor = exports.true =
        identityFactory(true),


    /**
     * The contradiction requestor:
     * <pre>
     *     f(callback, x) = callback(false)
     * </pre>
     */
    contradictionRequestor = exports.contradictionRequestor = exports.false =
        identityFactory(false),


    /**
     * The UNIX timestamp requestor:
     * <pre>
     *     f(callback, x) = callback(Date.now())
     * </pre>
     * Returning <code>Date.now()</code>, the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
     */
    timestampRequestor = exports.timestampRequestor = exports.timestamp = exports.now =
        identityFactory(Date.now()),


    /**
     * The "new Date()" requestor:
     * <pre>
     *     f(callback, x) = callback(new Date())
     * </pre>
     */
    dateRequestor = exports.dateRequestor = exports.date =
        identityFactory(new Date()),


    /** @function */
    notImplemented = exports.notImplemented =
        errorFactory('Not yet implemented'),


    /**
     * The NOP/NOOP requestor:
     * <pre>
     *     f(callback, x) = callback(x)
     * </pre>
     *
     * Just pass things along without doing anything ...
     */
    noopRequestor = exports.noopRequestor = exports.noop =
        function (callback, args) {
            'use strict';
            return callback(args, undefined);
        },


///////////////////////////////////////////////////////////////////////////////
// More requestor factories
// The requestors must be configured by currying.
//
// Functions that executes requests, synchronously or asynchronously
// Asynchronicity is handled by callbacks.
// ("callbacks" were previously called "request continuations"/"requestions".)
///////////////////////////////////////////////////////////////////////////////

    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * This is the curry-friendly version of the primary requestor factory above (the one with the alias 'then').
     * Especially handy when you have to curry the callback, e.g. when terminating nested requestor chains.
     * <pre>
     *     f(g, callback, x) = callback(g(x))
     * </pre>
     * </p>
     * <p>
     * <strong>
     * <em>NB! alpha version</em>&nbsp;&ndash;&nbsp;This function has not been settled, neither the name nor the meaning/semantics of it ...
     * </strong>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     */
        // TODO: Do not feel I am quite on top of this one ... What does this function really mean?
    terminatorRequestor = exports.terminatorRequestor = exports.terminator =
        function (g, callback, args) {
            'use strict';
            return callback(g(args), undefined);
        },


    /**
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     * <p>
     * This function hi-jacks the argument-passing by substituting the callback arguments with its own.
     * <pre>
     *     f(g, y, callback, x) = callback(g(y))
     * </pre>
     * </p>
     * <p>
     * <strong>
     * <em>NB! alpha version</em>&nbsp;&ndash;&nbsp;This function has not been settled, neither the name nor the meaning/semantics of it ...
     * </strong>
     * </p>
     * <hr style="border:0;height:1px;background:#333;background-image:-webkit-linear-gradient(left, #ccc, #333, #ccc);background-image:-moz-linear-gradient(left, #ccc, #333, #ccc);background-image:-ms-linear-gradient(left, #ccc, #333, #ccc);"/>
     *
     * @function
     */
        // TODO: Do not feel I am quite on top of this one ... What does this function really mean?
    interceptorRequestor = exports.interceptorRequestor = exports.interceptor =
        function (g, y, callback, args) {
            'use strict';

            // Argument 'y' may come from other requestors => cloning arguments due to Object.freeze() in RQ
            //return callback(g(_clone(y)));

            return callback(g(y), undefined);
        };
