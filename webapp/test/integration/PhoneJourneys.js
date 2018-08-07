jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"ztelia/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"ztelia/test/integration/pages/App",
	"ztelia/test/integration/pages/Browser",
	"ztelia/test/integration/pages/Master",
	"ztelia/test/integration/pages/Detail",
	"ztelia/test/integration/pages/NotFound"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ztelia.view."
	});

	sap.ui.require([
		"ztelia/test/integration/NavigationJourneyPhone",
		"ztelia/test/integration/NotFoundJourneyPhone",
		"ztelia/test/integration/BusyJourneyPhone"
	], function() {
		QUnit.start();
	});
});