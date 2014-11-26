/* global define:false */

define([ 'jquery', 'string-extensions' ],
    function ($) {
        'use strict';

        return {
            isTouchDeviceUserAgentString: function (userAgentString) {
                if (userAgentString) {
                    return !!(userAgentString.contains('iPad') ||
                    userAgentString.contains('iPhone') ||
                    userAgentString.contains('Android') ||
                    userAgentString.contains('CriOs'));
                }
                return false;
            },

            isTouchDevice: function () {
                return this.isTouchDeviceUserAgentString(navigator.userAgent);
            },

            wait: function (ms) {
                var deferred = $.Deferred();
                setTimeout(deferred.resolve, ms);
                return deferred.promise();
            }
        };
    }
);
