// TODO: Consider renaming this to 'rq-essentials.js' and move it to a repository on its own

///////////////////////////////////////////////////////////
// RQ: Better living through asynchronicity
// - https://github.com/douglascrockford/RQ
// - http://vimeo.com/74294252
///////////////////////////////////////////////////////////

var RQ = require("./vendor/rq").RQ,

// TODO: Move to 'rq-essentials-request.js'
    request = require("request"),

// Shortcuts
    _isArray = Array.isArray,
    _parse = JSON.parse,
    _stringify = JSON.stringify,


///////////////////////////////////////////////////////////////////////////////
// Basic functions
///////////////////////////////////////////////////////////////////////////////

    /**
     * The identity function:
     * f(x) = x
     *
     * Convenient for triggering execution of RQ.js sequential requestors.
     *
     * @param {*} value the argument
     * @return {*} the given argument
     */
    _identity = exports.identity = exports.execute = function (value) {
        "use strict";
        return value;
    },


    /**
     * A clone function
     * Use of Object.freeze() in RQ dictates argument cloning ...
     */
    _clone = exports.clone = function (arg) {
        "use strict";
        if (!arg) {
            return arg;
        }
        if (_isArray(arg)) {
            return arg.slice();
        }
        return _parse(_stringify(arg));
    },


///////////////////////////////////////////////////////////////////////////////
// Requestors
//
// Functions that executes requests, synchronously or asynchronously
// Asynchronicity is handled by request continuations; "requestions"
//
// Standard 'canned' requestors below
///////////////////////////////////////////////////////////////////////////////

    /**
     * A requestor version of "the null function".
     *
     * f(fContinuation, x) = fContinuation(undefined)
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     */
    _nullRequestor = exports.undefined = function (requestion, args) {
        "use strict";
        return requestion(undefined, undefined);
    },


    /**
     * A requestor version of "the empty function".
     *
     * f(fContinuation, x) = fContinuation(null)
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     */
    _emptyRequestor = exports.null = function (requestion, args) {
        "use strict";
        return requestion(null, undefined);
    },


    /**
     * A tautology requestor.
     *
     * f(fContinuation, x) = fContinuation(true)
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     */
    _tautologyRequestor = exports.true = function (requestion, args) {
        "use strict";
        return requestion(true, undefined);
    },


    /**
     * A contradiction requestor.
     *
     * f(fContinuation, x) = fContinuation(false)
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     */
    _contradictionRequestor = exports.false = function (requestion, args) {
        "use strict";
        return requestion(false, undefined);
    },


    /**
     * The NOP/NOOP requestor.
     *
     * f(fContinuation, x) = fContinuation(x)
     *
     * Just pass things along ...
     */
    _noopRequestor = exports.noopRequestor = function (requestion, args) {
        "use strict";
        return requestion(args, undefined);
    },


    /**
     * f(g, fContinuation, x) = fContinuation(g(x))
     *
     * This is the curry-friendly version of the regular function-wrapper requestory below ("then").
     * Especially handy when you have to curry the requestion, e.g. when terminating nested requestor pipelines.
     */
    _terminatorRequestor = exports.then = exports.terminator = function (g, requestion, args) {
        "use strict";
        return requestion(g(args));
    },


    /**
     * f(g, y, fContinuation, x) = fContinuation(g(y))
     *
     * This function hi-jacks the argument-passing by substituting the continuation arguments with its own
     */
        // TODO: Find out the relationship with requestory functions below ...
    _interceptorRequestor = exports.interceptor = function (g, y, requestion, args) {
        "use strict";

        // Argument 'y' may come from other requestors, so clone arguments due to Object.freeze() in RQ
        //return requestion(g(_clone(y)));

        return requestion(g(y));
    },


    /**
     * Simple requestor wrapper for HTTP GET using the "request" library.
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     *
     * @see https://github.com/mikeal/request
     * @see https://www.npmjs.org/package/request
     */
// TODO: Move to 'rq-essentials-request.js'
    _httpGetRequestor = exports.httpGet = function (uri, requestion, args) {
        "use strict";
        return request(uri, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                return requestion(body);

            } else {
                if (!err) {
                    err = "Unexpected HTTP status code: " + response.statusCode + " (only status code 200 is supported)";
                }
                return requestion(undefined, err);
            }
        });
    },


///////////////////////////////////////////////////////////
// Requestories
//
// Requestor factories
// - Takes arguments and returns a requestor function
///////////////////////////////////////////////////////////

    /**
     * f(x) = F(fContinuation(x))
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     */
    _identityRequestory = exports.identity = exports.return = function (value) {
        "use strict";
        return function requestor(requestion, args) {
            return requestion(value, undefined);
        };
    },


    /**
     * f(g) = F(fContinuation(g(x)))
     *
     * A typical sequence requestor ...
     */
    _failFastFunctionWrapperRequestory = exports.requestor = exports.then = function (g) {
        "use strict";
        return function requestor(requestion, args) {
            return requestion(g(args), undefined);
        };
    },


    /**
     * f(g) = F(fContinuation(g(x)))
     *
     * A typical sequence requestor ...
     */
    _lenientFunctionWrapperRequestory = exports.lenientRequestor = function (g) {
        "use strict";
        return function requestor(requestion, args) {
            var result;
            try {
                result = g(args);
                return requestion(result, undefined);
            } catch (e) {
                console.warn(e.message);
                return requestion(result, e);
            }
        };
    },


    /**
     * Simple requestor factory for HTTP GET using the "request" library.
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     *
     * @see https://github.com/mikeal/request
     * @see https://www.npmjs.org/package/request
     */
// TODO: Move to 'rq-essentials-request.js'
    _getRequestory = exports.get = function (uri) {
        "use strict";
        return function requestor(requestion, args) {
            return _httpGetRequestor(uri, requestion);
        };
    },


///////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////

    /**
     * Typical execution of Mocha-based specification/test requestors.
     *
     * Something like:
     * it("should execute an asynchronous test using RQ", function (done) {
     *     var inputArgs = ["a", "b"],
     *         verify = function (args) {
     *             expect(args.myProperty).to.equal(2);
     *         };
     *
     *     require("rq-essentials").executeAndVerify(requestorToTest, inputArgs, verify, done);
     * });
     */
    _executeAndVerify = exports.executeAndVerify = function (requestorToTest, initialArguments, verifyFunction, doneFunction) {
        "use strict";
        RQ.sequence([
            requestorToTest,
            _failFastFunctionWrapperRequestory(verifyFunction),
            _failFastFunctionWrapperRequestory(doneFunction)
        ])(_identity, initialArguments);
    };