/* global define:false */
define(["underscore", "jquery", "backbone", "moment", "toastr"],
    function (_, $, Backbone, Moment, toastr) {
        "use strict";

        /**
         * Mechanism for notifying users of server connection dropouts via UI.
         * <h3>Usage example</h3>
         * Establish/configure the server connection listener, e.g.
         * <pre>
         * listenToServerConnectionDropouts: _.partial(_serverConnectionListener, "appname", "uri", "urititle", "nb")
         * </pre>
         * NB! This is the default configuration, already included.
         *
         * Now, this will make it possible to add HTML elements inside your app which will show up whenever server connection drops out, e.g.:
         * <pre>
         * <span id="offlineNotification" class="hidden" data-appname="<%= appName %>" data-uri="<%= uri %>" data-urititle="Using data from" />
         * </pre>
         *
         * Remember to inject the element into the listener, e.g. by AMD:
         * <pre>
         * define(['backbone.fetch-local-copy'], function (BackboneFetchLocalCopy) {
         *   BackboneFetchLocalCopy.listenToServerConnectionDropouts([
         *     '#offlineNotification'
         *   ]);
         * })
         * </pre>
         *
         *
         * Also, remember to configure toastr, e.g.:
         * <pre>
         * // Toastr.js config (=> http://codeseven.github.io/toastr/demo.html)
         * toastr.options = {
         *   "positionClass": 'toast-top-full-width',
         *   "timeOut": 6000
         * }
         * </pre>
         *
         * @private
         */
        var _serverConnectionListener = function (appNameDataElementName, appUriDataElementName, appUriTitleDataElementName, culture, elementSelector) {
            var self = this,
                elementSelectors = _.isArray(elementSelector) ? elementSelector : [elementSelector],
                momentJsCulture = culture || "en";

            Backbone.Events.on("onserverconnection", function (originUri) {
                toastr.clear();
            });

            Backbone.Events.on("onnoserverconnection", function (originUri) {
                console.warn("Missing server connection event ('onnoserverconnection') received from URI '" + originUri + "'");

                // toastr demo: Display a warning toast, with no title
                if (culture === "nb") {
                    toastr.error('Oops, ingen kontakt med server for øyeblikket - det ordner seg sikkert snart ...');
                } else {
                    console.warn("Culture '" + momentJsCulture + "' not yet implemented");
                }
            });

            _.each(elementSelectors, function (elementSelector) {
                Backbone.Events.on("onserverconnection", function (originUri) {
                    $(elementSelector).addClass("hidden").empty();
                });

                Backbone.Events.on("onnoserverconnection", function (originUri) {
                    _.each($(elementSelector), function (el) {
                        var appName = el.dataset[appNameDataElementName],
                            appUri = el.dataset[appUriDataElementName],
                            appUriName = el.dataset[appUriTitleDataElementName],
                            ageString = self.getResourceAge(appName, appUri, momentJsCulture),
                            msg = null;

                        if (culture === "nb") {
                            if (ageString) {
                                msg = "(" +
                                    "NB! " + appUriName + " " +
                                    "<em>" +
                                    self.getResourceAge(appName, appUri, momentJsCulture) +
                                    "</em>" +
                                    ")";
                            } else {
                                msg = "<em>(NB! Ingen kontakt med server, og ingen mellomlagrede data tilgjengelig heller ...</em>)";
                            }

                            $(el).removeClass("hidden").empty().append(msg);

                        } else {
                            console.warn("Culture '" + momentJsCulture + "' not yet implemented");
                        }
                    });
                });
            });
        };

        /**
         * <p>
         * Mix-in for using localStorage as intermediary storage for retrieved resources,
         * making the model or collection resilient against server connectivity dropouts
         * as you then will be using the latest version the browsers have at hand ...
         * </p>
         * <p>
         * Works for both Backbone models and Backbone collections.
         * </p>
         * <p>
         * NB! Read-only, no mechanisms for pushing altered state back to the server.
         * </p>
         */
        return {

            /** @returns {Number|null} the UNIX-timestamp associated with the given resource (belonging to the given app name) */
            getResourceTimestamp: function (appName, resourceUri) {
                if (!window.localStorage) {
                    return null;
                }
                var timestampCacheKey = appName + resourceUri + ":timestamp",
                    timestamp = window.localStorage.getItem(timestampCacheKey);
                if (timestamp) {
                    return window.parseInt(timestamp, 10);
                } else {
                    return null;
                }
            },

            /**
             * Gets the pretty timestamp string describing the age of the given resource (belonging to the given app name).
             *
             * @param {String} appName The app name
             * @param {String} resourceUri The resource URI
             * @param {String} [culture] The culture in Moment.js format, the default is 'en' (english)
             * @see http://momentjs.com/docs/#/i18n/
             * @returns {String|null} The pretty timestamp string, otherwise <code>null</code> if the resource not exists in local storage
             */
            getResourceAge: function (appName, resourceUri, culture) {
                var timestamp = this.getResourceTimestamp(appName, resourceUri),
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
             * Drop-in replacement for Backbone fetch function,
             * using localStorage as intermediary storage for retrieved resources,
             * making the model or collection resilient against server connectivity dropouts
             * as you then will be using the latest version the browsers have at hand ...
             */
            fetch: function () {
                var self = this,
                    url = _.result(self, "url"),
                    name, currentScoreResourceKey, resourceTimestampCacheKey,
                    isBackboneModel = this instanceof Backbone.Model,
                    isBackboneCollection = this instanceof Backbone.Collection,
                    xhr = null;

                if (!self.name) {
                    throw new TypeError("Backbone object with 'backbone.fetch-local-copy' mixed in must have a 'name' function");
                }
                name = _.result(self, "name");
                currentScoreResourceKey = self.name() + url;
                resourceTimestampCacheKey = self.name() + url + ":timestamp";

                if (isBackboneModel) {
                    xhr = Backbone.Model.prototype.fetch.call(this);
                } else if (isBackboneCollection) {
                    xhr = Backbone.Collection.prototype.fetch.call(this, { reset: true });
                } else {
                    throw new Error("Only Backbone.Model and Backbone.Collection constructor functions are supported");
                }

                xhr.done(function (data) {
                    if (window.localStorage) {
                        window.localStorage.setItem(currentScoreResourceKey, JSON.stringify(data));
                        window.localStorage.setItem(resourceTimestampCacheKey, Date.now());
                        console.log("Resource '" + url + "' stored in localStorage (client-side persistent cache) ...");
                    }
                    Backbone.Events.trigger("onserverconnection", url);
                });
                xhr.fail(function () {
                    if (window.localStorage) {
                        Moment.lang("en"); // Reset Moment.js culture (just to be sure, log messages in english ...)
                        var cacheAge = new Date(JSON.parse(window.localStorage.getItem(resourceTimestampCacheKey))),
                            prettyCacheAge = new Moment(cacheAge).fromNow(),
                            cachedItem = window.localStorage.getItem(currentScoreResourceKey);

                        if (cachedItem) {
                            // Then complete the Backbone fetch success routine
                            if (isBackboneModel) {
                                self.set(self.parse(JSON.parse(cachedItem)));
                            } else if (isBackboneCollection) {
                                self.reset(self.parse(JSON.parse(cachedItem)));
                            } else {
                                throw new Error("Only Backbone.Model and Backbone.Collection constructor functions are supported");
                            }
                            console.warn("Resource '" + url + "' not available - using cached version (from " + prettyCacheAge + ") ...");

                        } else {
                            console.warn("Resource '" + url + "' not available - not even in cache ...");
                        }
                    }
                    Backbone.Events.trigger("onnoserverconnection", url);
                });
            },

            /** Default configuration of the server connection listener. */
            listenToServerConnectionDropouts: _.partial(_serverConnectionListener, "appname", "uri", "urititle", "nb")
        };
    }
);
