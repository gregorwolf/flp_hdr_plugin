sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast"
], function (Component, Button, Bar, MessageToast) {

	return Component.extend("com.sap.rig.demo.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!

			//Get Date
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth();
			var yyyy = today.getFullYear();
			var text1 = dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();

			//Get Username
			var uname = sap.ushell.Container.getUser().getFullName();
			var hostname = window.location.hostname;
			// flpnwc-y61gue3yph = Dev
			// flpnwc-w30fet5zj0 QA
			// webidetesting... Web IDE
			var greeting = "";
			if (hostname.match(/webidetesting/gm) !== null) {
				greeting = "Web IDE Test Runtime";
			} else if (hostname.match(/flpnwc-y61gue3yph/gm) !== null) {
				greeting = "Development System";
			} else if (hostname.match(/flpnwc-w30fet5zj0/gm) !== null) {
				greeting = "QA System";
			}
			var text2 = greeting;
			// var text2 = "Welcome, " + uname + " to " + hostname;
			rendererPromise.then(function (oRenderer) {
				oRenderer.setHeaderTitle(text2);
			});
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});