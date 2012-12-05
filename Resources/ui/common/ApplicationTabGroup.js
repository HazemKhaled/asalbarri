function ApplicationTabGroup(Window) {

    var self, CategoryWinModule, CartWinModule, WalletWinModule, MyOrdersWinModule, NewsWinModule, FaqWinModule, newsTab, faqTab;

    //create module instance
    self = Ti.UI.createTabGroup({
        exitOnClose : true,
        backgroundImage : '/images/bg.jpg'
    });

    FaqWinModule = require('ui/common/faqWin');
    faqTab = Ti.UI.createTab({
        title : 'س و ج',
        icon : '/images/icon_8.png',
        window : new FaqWinModule()
    });

    NewsWinModule = require('ui/common/newsWin');
    newsTab = Ti.UI.createTab({
        title : 'اخبارنا',
        icon : '/images/icon_8.png',
        window : new NewsWinModule()
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
        badge : Ti.App.cartQuantityCounter().quantity,
        window : new CartWinModule()
    });

    CategoryWinModule = require('ui/common/categoryWin');
    Ti.App.catalogTab = Ti.UI.createTab({
        title : 'المنتجات',
        icon : '/images/icon_6.png',
        window : new CategoryWinModule(0)
    });

    self.addTab(faqTab);
    self.addTab(newsTab);
    self.addTab(Ti.App.orderTab);
    self.addTab(Ti.App.walletTab);
    self.addTab(Ti.App.cartTab);
    self.addTab(Ti.App.catalogTab);

    self.setActiveTab(Ti.App.catalogTab);

    return self;
}

module.exports = ApplicationTabGroup;
