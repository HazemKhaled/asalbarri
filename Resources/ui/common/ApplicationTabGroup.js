function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();

	//create app tabs
	var Window = require('ui/handheld/ApplicationWindow');
	var categoryWin = require('ui/common/categoryWin');

	Ti.App.catalogTab = Ti.UI.createTab({
		title : 'المنتجات',
		icon : '/images/KS_nav_ui.png',
		window : new categoryWin(0)
	});

	Ti.App.cartTab = Ti.UI.createTab({
		title : 'سلة التسوق',
		icon : '/images/KS_nav_views.png',
		window : new Window()
	});

	Ti.App.walletTab = Ti.UI.createTab({
		title : 'المحفظة',
		icon : '/images/KS_nav_views.png',
		window : new Window()
	});

	var loginWindow = require('ui/common/auth/loginWin');
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
