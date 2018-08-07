sap.ui.define([
	"ztelia/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ztelia.controller.Scenario", {

		onInit: function() {
			var that = this;
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oResourceBundle = this.getResourceBundle();

		},

		onSelect: function(oEvt) {
				var sScenario = oEvt.getSource().getBindingContext().getProperty('Scenario_key');
				this.getRouter().navTo("items", {
					SC: encodeURIComponent(sScenario)
				}, true);
			}


	});

});