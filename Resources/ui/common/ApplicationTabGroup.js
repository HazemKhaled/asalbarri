function ApplicationTabGroup(Window) {

    var self, CategoryWinModule, CartWinModule, WalletWinModule, MyOrdersWinModule, NewsWinModule, FaqWinModule;

    //create module instance
    self = Ti.UI.createTabGroup({
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

    self.addTab(Ti.App.orderTab);
    self.addTab(Ti.App.walletTab);
    self.addTab(Ti.App.cartTab);
    self.addTab(Ti.App.catalogTab);

    self.setActiveTab(Ti.App.catalogTab);

    self.addEventListener('open', function() {

        if (!Ti.App.Properties.hasProperty('currencyName')) {
            Ti.App.fireEvent('openCurrencyWindow');
        } else {
            var OffersListWinModule = require('ui/common/offersListWin');
            new OffersListWinModule().open();
        }
    });

    return self;
}

module.exports = ApplicationTabGroup;
