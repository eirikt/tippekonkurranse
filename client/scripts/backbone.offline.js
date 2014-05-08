/* global define:false */
define(["underscore", "jquery", "backbone", "moment"],
    function (_, $, Backbone, Moment) {
        "use strict";

        /**
         * TODO: Document ...
         *
         * @param appNameDataElementName
         * @param appUriDataElementName
         * @param appUriTitleDataElementName
         * @param culture
         * @param elementSelector
         */
        var offlineListener = function (appNameDataElementName, appUriDataElementName, appUriTitleDataElementName, culture, elementSelector) {
            var self = this;

            Backbone.Events.on("onserverconnection", function (uri) {
                $(elementSelector).addClass("hidden").empty();
            });

            Backbone.Events.on("onnoserverconnection", function (uri) {
                $.each($(elementSelector), function (index, el) {
                    var appName = el.dataset[appNameDataElementName],
                        appUri = el.dataset[appUriDataElementName],
                        appUriName = el.dataset[appUriTitleDataElementName],
                        momentJsCulture = culture || "en",
                        msg = null;

                    if (culture === "nb") {
                        //if (uri === "/api/scores/current") {
                        msg = "[" +
                            "NB! Ingen kontakt med server, bruker " + appUriName + " " +
                            "<em>" +
                            self.getLocalStorageResourceAge(appName, appUri, momentJsCulture) +
                            "</em>" +
                            " så lenge ..." +
                            "]";
                        $(el).removeClass("hidden").empty().append(msg);

                        //} else if (uri === "/api/results/current") {
                        //    //msg = "TODO: ...";
                        //    //$(el).removeClass("hidden").empty().append(msg);
                        //    console.warn("Element '" + elementSelector + "' with 'data-uri' parameter='" + uri + "' is missing");

                        //} else {
                        //    console.warn("No element '" + elementSelector + "' with 'data-uri' parameter='" + uri + "'");
                        //}
                    } else {
                        console.warn("Culture '" + momentJsCulture + "' not yet implemented");
                    }
                    //$(el).removeClass("hidden").empty().append(msg);
                });
            });
        };

        return {

            /**
             * Drop-in replacement for Backbone fetch function,
             * using localStorage as intermediary storage for retrieved resources,
             * making the model or collection resilient against server connectivity dropouts ...
             *
             * TODO: Document options properties ...
             * @param [options] {Object}
             * @param FetchableConstructorType Either og Backbone.Collection or Backbone.Model
             * @param appName The application name, just for localStorage keys
             * @param resourceUri The resource URI, just for localStorage keys
             */
            localStorageFetch: function (options) {
                var self = this,
                    opts = $.extend({
                        FetchableConstructorType: Backbone.Model,
                        appName: null,
                        resourceUri: null//,
                        //// TODO: Rename to triggerChangeOnParse
                        //triggerChange: false
                    }, options),
                    currentScoreResourceKey = opts.appName + opts.resourceUri,
                    resourceTimestampCacheKey = opts.appName + opts.resourceUri + ":timestamp",
                    isBackboneModel = opts.FetchableConstructorType === Backbone.Model,
                    isBackboneCollection = opts.FetchableConstructorType === Backbone.Collection,
                    xhr = null;

                if (isBackboneModel) {
                    xhr = opts.FetchableConstructorType.prototype.fetch.apply(self);
                } else if (isBackboneCollection) {
                    xhr = opts.FetchableConstructorType.prototype.fetch.apply(self, { reset: true });
                } else {
                    throw new Error("Constructor function " + opts.FetchableConstructorType + " is not supported");
                }

                xhr.done(function (data) {
                    if (window.localStorage) {
                        window.localStorage.setItem(currentScoreResourceKey, JSON.stringify(data));
                        window.localStorage.setItem(resourceTimestampCacheKey, Date.now());
                        console.log("Resource '" + opts.resourceUri + "' stored in localStorage (client-side persistent cache) ...");
                    }
                    Backbone.Events.trigger("onserverconnection"/*, opts.resourceUri*/);
                });
                xhr.fail(function () {
                    if (window.localStorage) {
                        Moment.lang("en"); // Reset Moment.js culture (just to be sure, log messages in english ...)
                        var cacheAge = new Date(JSON.parse(window.localStorage.getItem(resourceTimestampCacheKey))),
                            prettyCacheAge = new Moment(cacheAge).fromNow(),
                            cachedItem = window.localStorage.getItem(currentScoreResourceKey);

                        if (cachedItem) {
                            //self.parse(JSON.parse(cachedItem), { error: true });
                            /*if (!*/
                            self.set(self.parse(JSON.parse(cachedItem), options));
                            /*) {

                             }
                             */
                            //self.parse(JSON.parse(cachedItem));
                            console.warn("Resource '" + opts.resourceUri + "' not available - using cached version (from " + prettyCacheAge + ") ...");
                        } else {
                            console.warn("Resource '" + opts.resourceUri + "' not available - not even in cache ...");
                            //opts.triggerChange = true;
                        }

                        //if (opts.triggerChange) {
                        //    if (isBackboneModel) {
                        //        self.trigger("change");
                        //    } else if (isBackboneCollection) {
                        //        self.trigger("reset");
                        //    }
                        //}
                    }
                    Backbone.Events.trigger("onnoserverconnection"/*, opts.resourceUri*/);
                });
            },

            /**
             * TODO: Document ...
             *
             * @param appName
             * @param resourceUri
             * @returns {Number|null}
             */
            getLocalStorageResourceTimestamp: function (appName, resourceUri) {
                var timestampCacheKey = appName + resourceUri + ":timestamp",
                    timestamp = null;
                if (window.localStorage) {
                    timestamp = window.localStorage.getItem(timestampCacheKey);
                }
                return window.parseInt(timestamp, 10);
            },

            /**
             * TODO: Document ...
             *
             * @param appName
             * @param resourceUri
             * @param {String} [culture] Moment.js culture
             * @see http://momentjs.com/docs/#/i18n/
             * @returns {String|null}
             */
            getLocalStorageResourceAge: function (appName, resourceUri, culture) {
                var timestamp = this.getLocalStorageResourceTimestamp(appName, resourceUri),
                    prettyTimestamp = null;
                if (timestamp) {
                    if (culture) {
                        Moment.lang(culture);
                    } else {
                        Moment.lang("en"); // Reset Moment.js culture to default (just to be sure)
                    }
                    prettyTimestamp = new Moment(timestamp).fromNow();
                }
                return prettyTimestamp;
            },

            /**
             * TODO: Document ...
             */
            listenToConnectivityDropouts: _.partial(offlineListener, "appname", "uri", "urititle", "nb")
        };
    }
);
