Ti.App.addEventListener('showLoading', function(e) {

    var loading = require('lib/loading');

    loading.show();

    Ti.App.addEventListener('hideLoading', function(e) {
        loading.hide();
    });
});

Ti.App.addEventListener('openLoginWindow', function() {

    if (Ti.Platform.getOsname() !== 'android') {
        Ti.App.catalogTab.setActive(true);
    }

    var LoginModule = require('/ui/common/auth/loginWin'), loginWin;

    loginWin = new LoginModule();
    Ti.App.catalogTab.open(loginWin);

    Ti.App.addEventListener('closeLoginWindow', function(e) {

        Ti.App.catalogTab.close(loginWin);
    });
});

Ti.App.addEventListener('openRegisterWindow', function(e) {

    if (Ti.Platform.getOsname() !== 'android') {
        Ti.App.catalogTab.setActive(true);
    }

    var RegisterWinModule = require('/ui/common/auth/registerWin'), registerWin;

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
    var CurrencyWinModule = require('/ui/common/currencyWin');

    new CurrencyWinModule().open();
});

Ti.App.addEventListener('openChargeWalletWindow', function() {
    var ChargeWalletWinModule = require('/ui/common/chargeWalletWin');

    new ChargeWalletWinModule().open();
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

    var OrderProductsWinModule = require('/ui/common/orderProductsWin'), orderProductsWin;

    orderProductsWin = new OrderProductsWinModule(e.data);
    Ti.App.orderTab.open(orderProductsWin);

    Ti.App.addEventListener('closeOrderProductsWindow', function(e) {

        Ti.App.catalogTab.close(orderProductsWin);
    });
});

Ti.App.addEventListener('cartAdd', function(e) {

    var cart = Ti.App.Properties.getObject('cart', {});

    if (e.quantity === 0) {
        delete cart[e.productID];
    } else {

        cart[e.productID] = {
            id : e.productID,
            title : e.productTitle,
            quantity : e.quantity,
            price : e.price,
            price_shown_coupon : e.price_shown_coupon
        };
    }
    Ti.App.Properties.setObject('cart', cart);

    if (Ti.Platform.getOsname() !== 'android') {
        Ti.App.cartTab.setBadge(Ti.App.cartQuantityCounter(cart).quantity);
    }

    Ti.API.log(cart);

    if (Ti.Platform.getOsname() !== 'android') {
        Ti.App.cartTab.setActive(true);
    }
});

Ti.App.addEventListener('cartEmpty', function(e) {
    Ti.App.Properties.setObject('cart', {});

    if (Ti.Platform.getOsname() !== 'android') {
        Ti.App.cartTab.setBadge(0);
    }
});

Ti.App.addEventListener('openShippingWindow', function() {

    var ShippingWinModule = require('/ui/common/shippingWin'), shippingWin;

    shippingWin = new ShippingWinModule();
    Ti.App.cartTab.open(shippingWin);

    Ti.App.addEventListener('closeShippingWindow', function(e) {

        Ti.App.cartTab.close(shippingWin);
    });

});

Ti.App.addEventListener('openfollowshippingWinndow', function(e) {

    var followshippingWinModule = require('/ui/common/followshippingWin'), followshippingWin;

    followshippingWin = new followshippingWinModule(e.url);
    //Ti.App.myOrders.open(followshippingWin);
    followshippingWin.open();
});

Ti.App.addEventListener('orderRequest', function(e) {

    var auth, orderData, cartProducts, xhr;

    auth = require('/lib/auth');

    orderData = {
        products : [],
        userID : auth.isLogedIn(),
        countryID : e.countryID,
        couponCode : Ti.App.Properties.getString('couponCode', null),
        paymentMethod : e.paymentMethod
    };

    cartProducts = Ti.App.Properties.getObject('cart', {});

    for (i in cartProducts) {
        if (cartProducts.hasOwnProperty(i)) {

            orderData.products.push({
                id : cartProducts[i].id,
                q : cartProducts[i].quantity
            });
        }
    }
    orderData.products = JSON.stringify(orderData.products);
    //alert(orderData);

    Ti.App.fireEvent('showLoading');

    xhr = Ti.Network.createHTTPClient({
        timeout : 45000
    });

    xhr.open('POST', Ti.App.APIURL + 'api/AddOrder');
    xhr.setOnerror(function() {
        Ti.App.fireEvent('hideLoading');

        Ti.UI.createAlertDialog({
            title : 'خطأ',
            message : 'خطا في الاتصال، تاكد من اتصال الانترنت لديك وحاول مرة اخرى',
            buttonNames : ['موافق']
        }).show();
    });

    xhr.setOnload(function() {
        var results, TowcoWinModule;
        try {
            results = JSON.parse(this.responseText);
        } catch (error) {
            Ti.App.fireEvent('hideLoading');

            Ti.UI.createAlertDialog({
                title : 'خطأ',
                message : 'خطا في الاتصال، تاكد من اتصال الانترنت لديك وحاول مرة اخرى',
                buttonNames : ['موافق']
            }).show();
        }

        //alert(results);
        Ti.App.fireEvent('hideLoading');

        if (e.paymentMethod === 'tocheckout') {

            TowcoWinModule = require('/ui/common/2coWin');
            new TowcoWinModule(results.orderID, results.totalPrice).open();

        } else {

            if (Ti.Platform.getOsname() !== 'android') {
                Ti.App.orderTab.setActive(true);
            } else {
                Ti.UI.createAlertDialog({
                    title : 'مبروك',
                    message : 'تم ارسال طلبك بنجاح، يمكنك متابعة الطلب بالظغط على "الطلبات" في الاعلى.',
                    cancel : 0,
                    buttonNames : ['موافق']
                }).show();
            }
            Ti.App.fireEvent('closeShippingWindow');
            Ti.App.fireEvent('cartEmpty');
            Ti.App.fireEvent('showMyordersAfterLogin');
            Ti.App.Properties.removeProperty('coupon');
            Ti.App.Properties.removeProperty('couponCode');
            Ti.App.getHttpRequest('api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency', 1), function(results) {

                Ti.App.balanceLbl.text = results.balance;
            });
        }
    });

    xhr.send(orderData);

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
        quantity : null,
        count : 0,
        total : 0,
        coupon : Ti.App.Properties.getInt('coupon', 0),
        totalNet : 0
    }, q;

    for (q in cart) {
        if (cart.hasOwnProperty(q)) {
            data.quantity += cart[q].quantity;
            data.count += 1;
            data.total += parseFloat(cart[q].price) * parseInt(cart[q].quantity, 10);
        }
    }

    data.totalNet = data.total - data.coupon;

    return data;
};

Ti.App.autoTextAlign = function(e) {

    if (e.value.length === 0) {
        e.source.setTextAlign(Ti.App.autoAlignHintext());
    } else {
        e.source.setTextAlign(Ti.UI.TEXT_ALIGNMENT_LEFT);
    }
};

Ti.App.autoAlignHintext = function() {
    if (Ti.Platform.getOsname() !== 'android') {
        return Ti.UI.TEXT_ALIGNMENT_RIGHT;
    }

    if (Ti.Platform.Android.API_LEVEL >= 14) {
        return Ti.UI.TEXT_ALIGNMENT_RIGHT;
    }

    return Ti.UI.TEXT_ALIGNMENT_LEFT;
};

Ti.App.getHttpRequest = function(action, loadCallBack, errorCallBack) {
    //http://www.asalbarri.com/asalbarri/asal/api/walletBalance/1/1

    Ti.App.fireEvent('showLoading');

    var xhr = Ti.Network.createHTTPClient({
        timeout : 45000
    });

    xhr.open('GET', Ti.App.APIURL + action);
    xhr.setOnerror(function() {
        Ti.App.fireEvent('hideLoading');

        Ti.UI.createAlertDialog({
            title : 'خطأ',
            message : 'خطا في الاتصال، تاكد من اتصال الانترنت لديك وحاول مرة اخرى',
            buttonNames : ['موافق']
        }).show();

        if ( typeof errorCallBack === 'function') {
            errorCallBack();
        }
    });

    xhr.setOnload(function() {
        var results = JSON.parse(this.responseText);

        if ( typeof loadCallBack === 'function') {
            loadCallBack(results);
        }

        Ti.App.fireEvent('hideLoading');
    });

    xhr.send();
};
