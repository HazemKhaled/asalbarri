var loading = null;
Ti.App.addEventListener('showLoading', function(e) {

	if (!loading) {
		var loading = require('lib/loading');
	}
	loading.show();

	Ti.App.addEventListener('hideLoading', function(e) {
		loading.hide();
	});
});

Ti.App.addEventListener('openLoginWindow', function() {

	var LoginWin = require('/ui/common/auth/loginWin');

	var loginWin = new LoginWin();
	Ti.App.orderTab.open(loginWin);

	Ti.App.addEventListener('closeLoginWindow', function(e) {

		Ti.App.orderTab.close(loginWin);
	});
});

Ti.App.addEventListener('openRegisterWindow', function(e) {
	var RegisterWin = require('/ui/common/auth/registerWin');

	var registerWin = new RegisterWin();

	Ti.App.orderTab.open(registerWin);

	Ti.App.addEventListener('closeRegisterWindow', function(e) {

		Ti.App.orderTab.close(registerWin);
	});
});

Ti.App.addEventListener('openForgetpasswordWindow', function(e) {

	var ForgetpasswordWin = require('/ui/common/auth/forgetpasswordWin');

	var forgetpasswordWin = new ForgetpasswordWin();

	Ti.App.orderTab.open(forgetpasswordWin);

	Ti.App.addEventListener('closeForgetpasswordWindow', function(e) {

		Ti.App.orderTab.close(forgetpasswordWin);
	});
});

Ti.App.addEventListener('openAboutWindow', function() {
	var AboutWin = require('/ui/common/aboutWin');

	new AboutWin().open();
});
