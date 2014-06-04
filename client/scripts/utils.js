/* global define:false */
/* jshint -W121 */

define(['jquery', 'string-extensions'],
    function ($, StringExtensions) {
        'use strict';

        return {

            // TODO: reduce cyclic complexity (from 6 to 5)
            isTouchDeviceUserAgentString: function (userAgentString) {
                if (userAgentString) {
                    if (userAgentString.contains('iPad')) {
                        return true;

                    } else if (userAgentString.contains('iPhone')) {
                        return true;

                    } else if (userAgentString.contains('Android')) {
                        return true;

                    } else if (userAgentString.contains('CriOs')) {
                        return true;

                    } else {
                        return false;
                    }
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
