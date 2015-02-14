/*!
 * ASP.NET SignalR JavaScript Library v2.2.0
 * http://signalr.net/
 *
 * Copyright Microsoft Open Technologies, Inc. All rights reserved.
 * Licensed under the Apache 2.0
 * https://github.com/SignalR/SignalR/blob/master/LICENSE.md
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['manyLensHub'] = this.createHubProxy('manyLensHub'); 
        proxies['manyLensHub'].client = { };
        proxies['manyLensHub'].server = {
            doLongRunningThing: function () {
            /// <summary>Calls the DoLongRunningThing method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["DoLongRunningThing"], $.makeArray(arguments)));
             },

            loadData: function () {
            /// <summary>Calls the LoadData method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["LoadData"], $.makeArray(arguments)));
             },

            moveTweets: function (visMapID, fromUnitsID, toUnitsID) {
            /// <summary>Calls the MoveTweets method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"visMapID\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"fromUnitsID\" type=\"Object\">Server side type is System.Int32[]</param>
            /// <param name=\"toUnitsID\" type=\"Object\">Server side type is System.Int32[]</param>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["MoveTweets"], $.makeArray(arguments)));
             },

            pullInterval: function (interalID) {
            /// <summary>Calls the PullInterval method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"interalID\" type=\"String\">Server side type is System.String</param>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["PullInterval"], $.makeArray(arguments)));
             },

            pullPoint: function (start) {
            /// <summary>Calls the PullPoint method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"start\" type=\"String\">Server side type is System.String</param>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["PullPoint"], $.makeArray(arguments)));
             },

            reOrganize: function (visMapID, selectedUnits) {
            /// <summary>Calls the ReOrganize method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"visMapID\" type=\"String\">Server side type is System.String</param>
            /// <param name=\"selectedUnits\" type=\"Object\">Server side type is System.Int32[]</param>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["ReOrganize"], $.makeArray(arguments)));
             },

            testPullInterval: function (interalID) {
            /// <summary>Calls the testPullInterval method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
            /// <param name=\"interalID\" type=\"String\">Server side type is System.String</param>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["testPullInterval"], $.makeArray(arguments)));
             },

            testPullPoint: function () {
            /// <summary>Calls the testPullPoint method on the server-side ManyLensHub hub.&#10;Returns a jQuery.Deferred() promise.</summary>
                return proxies['manyLensHub'].invoke.apply(proxies['manyLensHub'], $.merge(["testPullPoint"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));