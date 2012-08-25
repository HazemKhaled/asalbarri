function couponWin() {

    var self, closeBtn, couponTxt, submitBtn, submitEvent;

    self = Ti.UI.createWindow({
        title : 'ادخل كوبون',
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
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    submitEvent = function() {

        if (couponTxt.getValue().length <= 0) {

            Ti.UI.createAlertDialog({
                title : 'عفواً',
                message : 'ادخل رقم بطاقة التخفيض.',
                buttonNames : ['موافق']
            }).show();

            return false;
        }

        Ti.App.fireEvent('showLoading');

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/getCouponByCode/' + couponTxt.getValue());

        xhr.setOnerror(function() {

            Ti.App.fireEvent('hideLoading');

            Ti.UI.createAlertDialog({
                title : 'خطأ في الاتصال',
                message : 'حاول مرة اخرى',
                buttonNames : ['موافق']
            }).show();
        });

        xhr.setOnload(function() {

            Ti.App.fireEvent('hideLoading');

            try {
                var row = JSON.parse(this.responseText);
            } catch (e) {

                Ti.UI.createAlertDialog({
                    title : 'خطأ',
                    message : 'خطآ في الآتصال، تاكد من اتصال الانترنت الخاص بك.',
                    cancel : 0,
                    buttonNames : ['اغلاق']
                }).show();
                return false;
            }

            if (row.length === 0) {

                Ti.UI.createAlertDialog({
                    title : 'خطأ',
                    message : 'رقم البطاقة خطأ او انه انتهت صلاحيته.',
                    buttonNames : ['موافق']
                }).show();

                return false;
            }
            //alert(row[0].discount);
            Ti.App.Properties.setInt('coupon', row[0].discount);
            Ti.App.Properties.setString('couponCode', couponTxt.getValue());

            self.close();
        });

        xhr.send();
    };

    couponTxt = Ti.UI.createTextField({
        hintText : 'كود بطاقة الخصم',
        textAlign : Ti.App.autoAlignHintext(),
        height : 33,
        width : '90%',
        top : 80,
        //autocapitalization : false,
        returnKeyType : Ti.UI.RETURNKEY_DONE,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundImage : '/images/bg_total_price.png',
        font : {
            fontSize : '13dp'
        }
    });

    self.addEventListener('open', function() {
        couponTxt.focus();
    });
    couponTxt.addEventListener('return', submitEvent);

    self.add(couponTxt);

    submitBtn = Ti.UI.createButton({
        title : 'ارسال'
    });

    submitBtn.addEventListener('click', submitEvent);

    if (Ti.Platform.getOsname() !== 'android') {
        self.setRightNavButton(submitBtn);
    } else {
        submitBtn.top = 120;
        submitBtn.height = 33;
        submitBtn.width = '90%';
        submitBtn.color = '#ffffff';
        submitBtn.backgroundImage = '/images/button_ok.png';

        self.add(submitBtn);
    }

    return self;
}

module.exports = couponWin;
