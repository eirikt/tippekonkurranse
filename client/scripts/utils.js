/* global define:false, $:false */

///////////////////////////////////////////////////////////////////////////////
// Global helper functions
///////////////////////////////////////////////////////////////////////////////

define([
        "jquery"
    ],
    function ($) {
        "use strict";

        return {
            wait: function (ms) {
                var deferred = $.Deferred();
                setTimeout(deferred.resolve, ms);
                return deferred.promise();
            },

            isTouchDeviceUserAgentString: function (userAgentString) {
                if (userAgentString) {
                    if (userAgentString.indexOf("iPad") > -1) {
                        return true;

                    } else if (userAgentString.indexOf("iPhone") > -1) {
                        return true;

                    } else if (userAgentString.indexOf("Android") > -1) {
                        return true;

                    } else {
                        return false;
                    }
                }
                return true;
            },

            isTouchDevice: function () {
                var userAgent = navigator.userAgent;
                return this.isTouchDeviceUserAgentString(userAgent);
            }
        };
    }
);
