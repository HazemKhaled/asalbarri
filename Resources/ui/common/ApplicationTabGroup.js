function ApplicationTabGroup(Window) {

	var CategoryWinModule, CartWinModule, WalletWinModule, MyOrdersWinModule, NewsWinModule, FaqWinModule;

	//create module instance
	Ti.App.myTabGroup = Ti.UI.createTabGroup({
		exitOnClose : true,
		backgroundImage : '/images/bg.jpg'
	});

	MyOrdersWinModule = require('ui/common/myOrdersWin');
	Ti.App.orderTab = Ti.UI.createTab({
		title : 'الطلبات',
		icon : '/images/icon_3.png',
		window : new MyOrdersWinModule()
	});

	WalletWinModule = require('ui/common/walletWin');
	Ti.App.walletTab = Ti.UI.createTab({
		title : 'المحفظة',
		icon : '/images/icon_4.png',
		window : new WalletWinModule()
	});

	CartWinModule = require('ui/common/cartWin');
	Ti.App.cartTab = Ti.UI.createTab({
		title : 'سلة التسوق',
		icon : '/images/icon_5.png',
		badge : Ti.App.cartQuantityCounter().totalNet.toFixed(2),
		window : new CartWinModule()
	});

	CategoryWinModule = require('ui/common/categoryWin');
	Ti.App.catalogTab = Ti.UI.createTab({
		title : 'المنتجات',
		icon : '/images/icon_6.png',
		window : new CategoryWinModule(0)
	});

	var OffersListWinModule = require('ui/common/offersListWin');
	Ti.App.offersTab = Ti.UI.createTab({
		title : 'عروض',
		icon : '/images/icon_6.png',
		window : new OffersListWinModule()
	});

	Ti.App.myTabGroup.addTab(Ti.App.orderTab);
	Ti.App.myTabGroup.addTab(Ti.App.walletTab);
	Ti.App.myTabGroup.addTab(Ti.App.cartTab);
	Ti.App.myTabGroup.addTab(Ti.App.catalogTab);
	Ti.App.myTabGroup.addTab(Ti.App.offersTab);

	Ti.App.myTabGroup.setActiveTab(Ti.App.offersTab);

	Ti.App.myTabGroup.addEventListener('open', function() {
		if (!Ti.App.Properties.hasProperty('currencyName')) {
			Ti.App.fireEvent('openCurrencyWindow');
		}
	});

	return Ti.App.myTabGroup;
}

module.exports = ApplicationTabGroup;
