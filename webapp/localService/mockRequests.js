sap.ui.define(['jquery.sap.global'],
    function(jQuery) {
        "use strict";
        var mockRequests = {
            /**
             * This mock determines whether the '+' add button should be shown
             */
            mockShowAddButton: function() {
                return {
                    method: "GET",
                    path: new RegExp("ShowAddButton?(.*)"), 
                    response: function(oXhr, sUrlParams) {
                        jQuery.sap.log.debug("Incoming request for ShowAddButton");
                        oXhr.respondJSON(200, {}, JSON.stringify({
                            d: {
                                ShowAddButton: true
                            }
                        }));
                    }
                };
            },
            /**
             * get requests
             * @return {array} Array of mock request
             */
            getRequests: function() {
                return [mockRequests.mockShowAddButton()];
            }
        };
        return mockRequests;
    },
    true);