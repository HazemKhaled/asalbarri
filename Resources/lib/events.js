var loading = null;
Ti.App.addEventListener('showLoading', function(e) {

    if (loading === null) {
        loading = require('lib/loading');
    }
    loading.show();

    Ti.App.addEventListener('hideLoading', function(e) {
        loading.hide();
    });
});

Ti.App.addEventListener('openLoginWindow', function() {
    Ti.App.catalogTab.setActive(true);

    var LoginModule = require('/ui/common/auth/loginWin');

    loginWin = new LoginModule();
    Ti.App.catalogTab.open(loginWin);

    Ti.App.addEventListener('closeLoginWindow', function(e) {

        Ti.App.catalogTab.close(loginWin);
    });
});

Ti.App.addEventListener('openRegisterWindow', function(e) {
    var RegisterWinModule = require('/ui/common/auth/registerWin'), registerWin;

    Ti.App.catalogTab.setActive(true);

    registerWin = new RegisterWinModule();

    Ti.App.catalogTab.open(registerWin);

    Ti.App.addEventListener('closeRegisterWindow', function(e) {

        Ti.App.catalogTab.close(registerWin);
    });
});

Ti.App.addEventListener('openForgetpasswordWindow', function(e) {

    var ForgetpasswordWinModule = require('/ui/common/auth/forgetpasswordWin'), forgetpasswordWin;

    forgetpasswordWin = new ForgetpasswordWinModule();

    Ti.App.catalogTab.open(forgetpasswordWin);

    Ti.App.addEventListener('closeForgetpasswordWindow', function(e) {

        Ti.App.catalogTab.close(forgetpasswordWin);
    });
});

Ti.App.addEventListener('openAboutWindow', function() {
    var AboutWinModule = require('/ui/common/aboutWin'), aboutWin;

    aboutWin = new AboutWinModule();

    aboutWin.open();
});

Ti.App.addEventListener('openCurrencyWindow', function() {
    var CurrencyWinModule = require('/ui/common/currencyWin'), currencyWin;

    currencyWin = new CurrencyWinModule();

    currencyWin.open();
});

Ti.App.addEventListener('openChargeWalletWindow', function() {
    var ChargeWalletWinModule = require('/ui/common/chargeWalletWin'), chargeWalletWin;

    chargeWalletWin = new ChargeWalletWinModule();

    chargeWalletWin.open();
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

    var ProductWinModule = require('/ui/common/productWin'), productWin;

    productWin = new ProductWinModule(e.data);
    Ti.App.catalogTab.open(productWin);

    Ti.App.addEventListener('closeProductWindow', function(e) {

        Ti.App.catalogTab.close(productWin);
    });
});

Ti.App.addEventListener('openOrderProductsWindow', function(e) {

    var OrderProductsWinModule = require('/ui/common/orderProductsWin');

    Ti.App.orderTab.open(new OrderProductsWinModule(e.data));
});

Ti.App.addEventListener('cartAdd', function(e) {

    var cart = Ti.App.Properties.getObject('cart', {});

    if (e.quantity === 0) {
        delete cart[e.productID];
    } else {

        cart[e.productID] = {
            id : e.productID,
            title : e.productTitle,
            quantity : e.quantity
        };
    }
    Ti.App.Properties.setObject('cart', cart);

    Ti.App.cartTab.setBadge(Ti.App.cartQuantityCounter(cart).quantity);

    Ti.API.log(cart);

    Ti.App.cartTab.setActive(true);
});

Ti.App.addEventListener('cartEmpty', function(e) {
    Ti.App.Properties.setObject('cart', {});
});

Ti.App.cartQuantityByProductID = function(productID) {

    var cart = Ti.App.Properties.getObject('cart', {});

    return cart[productID] === undefined ? 0 : cart[productID].quantity;
};

Ti.App.cartQuantityCounter = function(cart) {

    if (cart === undefined) {
        cart = Ti.App.Properties.getObject('cart', {});
    }

    var data = {
        quantity : 0,
        count : 0
    }, q;

    for (q in cart) {
        if (cart.hasOwnProperty(q)) {
            data.quantity += cart[q].quantity;
            data.count += 1;
        }
    }

    return data;
};

Ti.App.autoTextAlign = function(e) {
    if (e.value.length === 0) {
        e.source.setTextAlign(Ti.UI.TEXT_ALIGNMENT_RIGHT);
    } else {
        e.source.setTextAlign(Ti.UI.TEXT_ALIGNMENT_LEFT);
    }
};
