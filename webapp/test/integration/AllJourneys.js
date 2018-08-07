jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 SerialNumberSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"ztelia/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"ztelia/test/integration/pages/App",
	"ztelia/test/integration/pages/Browser",
	"ztelia/test/integration/pages/Master",
	"ztelia/test/integration/pages/Detail",
	"ztelia/test/integration/pages/Create",
	"ztelia/test/integration/pages/NotFound"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ztelia.view."
	});

	sap.ui.require([
		"ztelia/test/integration/MasterJourney",
		"ztelia/test/integration/NavigationJourney",
		"ztelia/test/integration/NotFoundJourney",
		"ztelia/test/integration/BusyJourney",
		"ztelia/test/integration/FLPIntegrationJourney"
	], function() {
		QUnit.start();
	});
});