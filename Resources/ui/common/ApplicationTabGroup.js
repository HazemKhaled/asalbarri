function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();

	//create app tabs
	var categoryWin = require('ui/common/categoryWin');

	Ti.App.catalogTab = Ti.UI.createTab({
		title : 'المنتجات',
		icon : '/images/KS_nav_ui.png',
		window : new categoryWin(0)
	});

	var loginWindow = require('ui/common/auth/loginWin');
	Ti.App.cartTab = Ti.UI.createTab({
		title : 'سلة التسوق',
		icon : '/images/KS_nav_views.png',
		window : new loginWindow()
	});

	var walletWin = require('ui/common/walletWin');
	Ti.App.walletTab = Ti.UI.createTab({
		title : 'المحفظة',
		icon : '/images/KS_nav_views.png',
		window : new walletWin()
	});

	Ti.App.orderTab = Ti.UI.createTab({
		title : 'الطلبات',
		icon : '/images/KS_nav_views.png',
		window : new loginWindow()
	});

	self.addTab(Ti.App.orderTab);
	self.addTab(Ti.App.walletTab);
	self.addTab(Ti.App.cartTab);
	self.addTab(Ti.App.catalogTab);

	self.setActiveTab(3);

	return self;
};

module.exports = ApplicationTabGroup;
