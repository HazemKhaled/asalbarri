function towcoWin(orderID, totalPrice) {

    var self, closeBtn, webView, interval;

    self = Ti.UI.createWindow({
        title : 'الدفع الالكتروني',
        modal : true,
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        closeBtn = Ti.UI.createButton({
            title : 'اغلاق   ',
            height : 31,
            width : 67,
            color : '#000000',
            font : {
                fontFamily : 'Arial',
                fontSize : 14,
                fontWeight : 'bold'
            },
            backgroundImage : '/images/button_back.png'
        });

        closeBtn.addEventListener('click', function() {
            clearInterval(interval);
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    webView = Ti.UI.createWebView({
        url : Ti.App.APIURL + 'api/tocheckout/' + orderID// + '/' + parseInt(totalPrice)
    });

    self.add(webView);
    //alert(webView.getUrl());
    function closeLoop() {
        if (webView.getUrl().indexOf('order_approve') !== -1) {

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
            clearInterval(interval);
            self.close();
        } else {
            Ti.API.info(webView.getUrl().indexOf('order_approve'));
        }
    }

    interval = setInterval(closeLoop, 1000);

    return self;
}

module.exports = towcoWin;
