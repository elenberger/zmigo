sap.ui.define([
	"ztelia/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"

], function(BaseController, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("ztelia.controller.Object", {

		_oBinding: {},

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			var that = this;
			this.getRouter().getRoute("object").attachPatternMatched(this._onPatternMached, this);
			//this.getRouter().getTargets().getTarget("create").attachDisplay(null, this._onDisplay, this);
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oResourceBundle = this.getResourceBundle();
			this._oViewModel = new JSONModel({
				enableCreate: false,
				delay: 0,
				busy: false,
				mode: "create",
				viewTitle: ""
			});
			this.setModel(this._oViewModel, "viewModel");

			// Register the view with the message manager
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var oMessagesModel = sap.ui.getCore().getMessageManager().getMessageModel();
			// this._oBinding = new sap.ui.model.Binding(oMessagesModel, "/", oMessagesModel.getContext("/"));
			// this._oBinding.attachChange(function(oEvent) {
			// 	var aMessages = oEvent.getSource().getModel().getData();
			// 	for (var i = 0; i < aMessages.length; i++) {
			// 		if (aMessages[i].type === "Error" && !aMessages[i].technical) {
			// 			that._oViewModel.setProperty("/enableCreate", false);
			// 		}
			// 	}
			// });
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler (attached declaratively) for the view save button. Saves the changes added by the user. 
		 * @function
		 * @public
		 */

		_checkIfBatchRequestSucceeded: function(oEvent) {
			var oParams = oEvent.getParameters();
			var aRequests = oEvent.getParameters().requests;
			var oRequest;
			if (oParams.success) {
				if (aRequests) {
					for (var i = 0; i < aRequests.length; i++) {
						oRequest = oEvent.getParameters().requests[i];
						if (!oRequest.success) {
							return false;
						}
					}
				}
				return true;
			} else {
				return false;
			}
		},

		/**
		 * Event handler (attached declaratively) for the view cancel button. Asks the user confirmation to discard the changes. 
		 * @function
		 * @public
		 */
		// onCancel: function() {
		// 	// check if the model has been changed
		// 	if (this.getModel().hasPendingChanges()) {
		// 		// get user confirmation first
		// 		this._showConfirmQuitChanges(); // some other thing here....
		// 	} else {
		// 		this.getModel("appView").setProperty("/addEnabled", true);
		// 		// cancel without confirmation
		// 		this._navBack();
		// 	}
		// },

		/* =========================================================== */
		/* Internal functions
		/* =========================================================== */
		/**
		 * Navigates back in the browser history, if the entry was created by this app.
		 * If not, it navigates to the Details page
		 * @private
		 */
		_navBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			this.getView().unbindObject();
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				this.getRouter().getTargets().display("object");
			}
		},

		/**
		 * Opens a dialog letting the user either confirm or cancel the quit and discard of changes.
		 * @private
		 */
		_showConfirmQuitChanges: function() {
			var oComponent = this.getOwnerComponent(),
				oModel = this.getModel();
			var that = this;
			MessageBox.confirm(
				this._oResourceBundle.getText("confirmCancelMessage"), {
					styleClass: oComponent.getContentDensityClass(),
					onClose: function(oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							that.getModel("appView").setProperty("/addEnabled", true);
							oModel.resetChanges();
							that._navBack();
						}
					}
				}
			);
		},

		/**
		 * Prepares the view for editing the selected object
		 * @param {sap.ui.base.Event} oEvent the  display event
		 * @private
		 */
		// _onEdit: function(oEvent) {
		// 	var oData = oEvent.getParameter("data"),
		// 		oView = this.getView();
		// 	this._oViewModel.setProperty("/mode", "edit");
		// 	this._oViewModel.setProperty("/enableCreate", true);
		// 	this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("editViewTitle"));

		// 	oView.bindElement({
		// 		path: oData.objectPath
		// 	});
		// },

		/**
		 * Prepares the view for creating new object
		 * @param {sap.ui.base.Event} oEvent the  display event
		 * @private
		 */

		_onDisplay: function(oParameter) {

			this._oViewModel.setProperty("/viewTitle", this._oResourceBundle.getText("createViewTitle"));
			this._oViewModel.setProperty("/mode", "create");

			var sObjectPath = this._oODataModel.createKey("/SerialNumberSet", oParameter);

			var oViewModel = this._oViewModel;

			this.getView().byId("Source").bindElement({
				path: sObjectPath,
				events: {
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {

						oViewModel.setProperty("/busy", false);
					}
				}
			});

			// var oContext = this._oODataModel.createEntry("SerialNumberSet", {
			// 	success: this._fnEntityCreated.bind(this),
			// 	error: this._fnEntityCreationFailed.bind(this)
			// });
			//var oContext = this._oODataModel.createEntry("SerialNumberSet"
			//	this.getView().setBindingContext(oContext);
		},

		onCartItemAdd: function(oEvt) {

			this._oODataModel.resetChanges();

			var sDockey = this.getModel("local").getProperty("/Scenario/Db_key");
			var sScenario = this.getModel("local").getProperty("/Scenario/Scenario_key");
			
			if (!sDockey) return;

			var oParameter = this.getView().byId("Source").getBindingContext().getObject();

			var sPath = this.getModel().createKey("ZI_MDOC", {
				db_key: sDockey
			}) + "/to_Items";
			var oNewRowContext = this._oODataModel.createEntry(sPath, {
				properties: {
					matnr: oParameter.Matnr,
					equinr: oParameter.Equnr,
					werks: oParameter.Werks,
					lgort: oParameter.Lgort,
					charg: oParameter.Charg
				},
				success: function(oData) {
					this.getRouter().navTo("process", {SC: oData.scenario, db_key: oData.db_key});
				}.bind(this)
			});
			this._onSave();

		},
		/**
		 * Checks if the save button can be enabled
		 * @private
		 */

		_validateSaveEnablement: function() {
			var aInputControls = this._getFormFields(this.byId("newEntitySimpleForm"));
			var oControl;
			for (var m = 0; m < aInputControls.length; m++) {
				oControl = aInputControls[m].control;
				if (aInputControls[m].required) {
					var sValue = oControl.getValue();
					if (!sValue) {
						this._oViewModel.setProperty("/enableCreate", false);
						return;
					}
				}
			}
			this._checkForErrorMessages();
		},

		/**
		 * Checks if there is any wrong inputs that can not be saved.
		 * @private
		 */
		_onSave: function() {
			var that = this,
				oModel = this.getModel();

			// abort if the  model has not been changed
			if (!oModel.hasPendingChanges()) {
				MessageBox.information(
					this._oResourceBundle.getText("noChangesMessage"), {
						id: "noChangesInfoMessageBox",
						styleClass: that.getOwnerComponent().getContentDensityClass()
					}
				);
				return;
			}
			this.getModel("appView").setProperty("/busy", true);

			// attach to the request completed event of the batch
			oModel.attachEventOnce("batchRequestCompleted", function(oEvent) {
				if (that._checkIfBatchRequestSucceeded(oEvent)) {
					that._fnUpdateSuccess(oEvent);
				} else {
					that._fnEntityCreationFailed();
					MessageBox.error(that._oResourceBundle.getText("updateError"));
				}
			});

			oModel.submitChanges();
		},
		_checkForErrorMessages: function() {
			var aMessages = this._oBinding.oModel.oData;
			if (aMessages.length > 0) {
				var bEnableCreate = true;
				for (var i = 0; i < aMessages.length; i++) {
					if (aMessages[i].type === "Error" && !aMessages[i].technical) {
						bEnableCreate = false;
						break;
					}
				}
				this._oViewModel.setProperty("/enableCreate", bEnableCreate);
			} else {
				this._oViewModel.setProperty("/enableCreate", true);
			}
		},

		/**
		 * Handles the success of updating an object
		 * @private
		 */
		_fnUpdateSuccess: function(oData) {
			this.getModel("appView").setProperty("/busy", false);
			this.getView().unbindObject();
			//this.onCartOverview();
		},

		/**
		 * Handles the success of creating an object
		 *@param {object} oData the response of the save action
		 * @private
		 */
		_fnEntityCreated: function(oData) {
			var sObjectPath = this.getModel().createKey("SerialNumberSet", oData);
			this.getModel("appView").setProperty("/itemToSelect", "/" + sObjectPath); //save last created
			this.getModel("appView").setProperty("/busy", false);
			this.getRouter().getTargets().display("object");
		},

		/**
		 * Handles the failure of creating/updating an object
		 * @private
		 */
		_fnEntityCreationFailed: function() {
			this.getModel("appView").setProperty("/busy", false);
		},

		/**
		 * Handles the onDisplay event which is triggered when this view is displayed 
		 * @param {sap.ui.base.Event} oEvent the on display event
		 * @private
		 */
		_onPatternMached: function(oEvent) {

			var oParameter = oEvent.getParameter("arguments");
			for (var value in oParameter) {
				oParameter[value] = decodeURIComponent(oParameter[value]);
			}

			this.getScenario(oParameter.SC, function() {
				this._onDisplay(oParameter);
			}.bind(this));

			//var oData = oEvent.getParameter("arguments");

			// if (oData && oData.mode === "update") {
			// 	//this._onEdit(oEvent);
			// 	this._onCreate(oEvent);
			// } else {
			// 	this._onCreate(oEvent);
			// }
		},

		onCartOverview: function() {
			this.getRouter().navTo("items", {
				SC: encodeURIComponent(this.getModel("local").getProperty("/Scenario/Scenario_key"))
			}, true);
		}

	});

});