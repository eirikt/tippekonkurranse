/* global define:false, $:false */

///////////////////////////////////////////////////////////////////////////////
// Global helper functions
///////////////////////////////////////////////////////////////////////////////

define(["jquery"],
    function ($) {
        "use strict";

        return {
            wait: function (ms) {
                var deferred = $.Deferred();
                setTimeout(deferred.resolve, ms);
                return deferred.promise();
            },

            // TODO: reduce cyclic complexity (from 6 to 5)
            isTouchDeviceUserAgentString: function (userAgentString) {
                if (userAgentString) {
                    if (userAgentString.indexOf("iPad") > -1) {
                        return true;

                    } else if (userAgentString.indexOf("iPhone") > -1) {
                        return true;

                    } else if (userAgentString.indexOf("Android") > -1) {
                        return true;

                    } else if (userAgentString.indexOf("CriOs") > -1) {
                        return true;

                    } else {
                        return false;
                    }
                }
                return false;
            },

            isTouchDevice: function () {
                return this.isTouchDeviceUserAgentString(navigator.userAgent);
            }
        };
    }
);
