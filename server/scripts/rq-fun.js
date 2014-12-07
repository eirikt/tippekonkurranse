// TODO: Consider renaming this to 'rq-essentials.js' and move it to a repository on its own

///////////////////////////////////////////////////////////
// RQ: Better living through asynchronicity
// - https://github.com/douglascrockford/RQ
// - http://vimeo.com/74294252
///////////////////////////////////////////////////////////

// TODO: RQ.ja must be put in npm global repoMove to 'rq-essentials-request.js'
var RQ = require("./vendor/rq").RQ,

// TODO: Move to 'rq-essentials-request.js'
    request = require("request"),
    iconv = require("iconv-lite"),

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
     * Deep cloning.
     * Sometimes necessary to clone arguments due to Object.freeze() in RQ.
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
     * The requestor version of "the null function".
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
     * The requestor version of "the empty function".
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
     * The tautology requestor.
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
     * The contradiction requestor.
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
     * The UNIX timestamp requestor.
     * Returning <code>Date.now()</code>, the number of milliseconds elapsed since 1 January 1970 00:00:00 UTC.
     *
     * f(fContinuation, x) = fContinuation(Date.now())
     *
     * A "data generator" requestor => No forwarding of existing data.
     * A typical parallel requestor, or as a starting requestor in a sequence ...
     */
    _timestampRequestor = exports.timestamp = exports.now = function (requestion, args) {
        "use strict";
        return requestion(Date.now(), undefined);
    },


    /**
     * The NOP/NOOP requestor.
     *
     * f(fContinuation, x) = fContinuation(x)
     *
     * Just pass things along without doing anything ...
     */
    _noopRequestor = exports.noop = function (requestion, args) {
        "use strict";
        return requestion(args, undefined);
    },


///////////////////////////////////////////////////////////////////////////////
// More requestors, curry-friendly
//
// Functions that executes requests, synchronously or asynchronously
// Asynchronicity is handled by request continuations; "requestions"
///////////////////////////////////////////////////////////////////////////////

    /**
     * f(g, fContinuation, x) = fContinuation(g(x))
     *
     * This is the curry-friendly version of the regular function-wrapper requestory below (with the alias 'then').
     * Especially handy when you have to curry the requestion, e.g. when terminating nested requestor pipelines.
     */
    _terminatorRequestor = exports.terminator = function (g, requestion, args) {
        "use strict";
        return requestion(g(args));
    },


    /**
     * f(g, y, fContinuation, x) = fContinuation(g(y))
     *
     * This function hi-jacks the argument-passing by substituting the continuation arguments with its own.
     */
    _interceptorRequestor = exports.interceptor = function (g, y, requestion, args) {
        "use strict";

        // Argument 'y' may come from other requestors => cloning arguments due to Object.freeze() in RQ
        //return requestion(g(_clone(y)));

        return requestion(g(y));
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
    _failFastFunctionWrapperRequestory = exports.requestor = exports.then = exports.do = function (g) {
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
    _getRequestory = exports.get = function (encoding, uri) {
        "use strict";
        return function requestor(requestion, args) {
            return request(uri, function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    var decodedBody = iconv.decode(new Buffer(body), encoding);
                    return requestion(decodedBody);

                } else {
                    if (!err) {
                        err = "Unexpected HTTP status code: " + response.statusCode + " (only status code 200 is supported)";
                    }
                    return requestion(undefined, err);
                }
            });
        };
    },
// TODO: Consider also having a non-currying version ...
//_getRequestory = exports.get = function (uri, encoding) {


///////////////////////////////////////////////////////////
// Utilities
///////////////////////////////////////////////////////////

    /**
     * Typical execution of Mocha-based specification/test of requestors.
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
