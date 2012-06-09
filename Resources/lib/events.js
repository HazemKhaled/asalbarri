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
	Ti.App.catalogTab.open(loginWin);

	Ti.App.addEventListener('closeLoginWindow', function(e) {
		
		Ti.App.catalogTab.close(loginWin);
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

	var AboutWin = new AboutWin();
	
	AboutWin.open();
	
	Ti.App.addEventListener('closeAboutWindow', function(e) {

		AboutWin.close();
	});
});


Ti.App.addEventListener('goToLogin', function(e) {

		Ti.App.catalogTab.active = true;
		Ti.App.fireEvent('openLoginWindow');
		
});

Ti.App.addEventListener('openCategoryWindow', function(e) {
	var CategoryWin = require('ui/common/categoryWin');

	Ti.App.catalogTab.open(new CategoryWin(e.parent));
});

Ti.App.addEventListener('openProductListWindow', function(e) {
	var ProductsListWin = require('ui/common/productsListWin');

	Ti.App.catalogTab.open(new ProductsListWin(e.data));
});

Ti.App.addEventListener('openProductWindow', function(e) {

	var ProductWin = require('/ui/common/productWin');

	Ti.App.catalogTab.open(new ProductWin(e.data));
});
