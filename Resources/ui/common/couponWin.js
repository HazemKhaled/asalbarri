function couponWin() {

    var self, closeBtn, couponTxt, submitBtn, submitEvent;

    self = Ti.UI.createWindow({
        title : 'ادخل كوبون',
        modal : true,
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    closeBtn = Ti.UI.createButton({
        title : 'اغلاق   ',
        height : '31dp',
        width : '67dp',
        color : '#000000',
        font : {
            fontFamily : 'Arial',
            fontSize : '14dp',
            fontWeight : 'bold'
        },
        backgroundImage : 'images/common/button_back.png'
    });

    closeBtn.addEventListener('close', function() {
        self.close();
    });

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

            var row;

            Ti.App.fireEvent('hideLoading');

            row = JSON.parse(this.responseText);

            if (row.length === 0) {

                Ti.UI.createAlertDialog({
                    title : 'خطأ',
                    message : 'رقم البطاقة خطأ او انه انتهت صلاحيته.',
                    buttonNames : ['موافق']
                }).show();

                return false;
            }
            alert(row[0].discount);
            Ti.App.Properties.setInt('coupon', row[0].discount);

            self.close();
        });

        xhr.send();
    };

    couponTxt = Ti.UI.createTextField({
        hintText : 'كود بطاقة الخصم',
        textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
        height : '33dp',
        width : '60%',
        top : '80dp',
        autocapitalization : false,
        returnKeyType : Ti.UI.RETURNKEY_DONE,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundImage : 'images/common/bg_total_price.png'
    });

    couponTxt.focus();
    couponTxt.addEventListener('return', submitEvent);

    self.add(couponTxt);

    if (Ti.Platform.getOsname() !== 'android') {
        self.setLeftNavButton(closeBtn);
    }

    submitBtn = Ti.UI.createButton({
        title : 'ارسال',
        height : '31dp',
        width : '67dp',
        color : '#000000',
        font : {
            fontFamily : 'Arial',
            fontSize : '14dp',
            fontWeight : 'bold'
        }
    });

    submitBtn.addEventListener('click', submitEvent);

    if (Ti.Platform.getOsname() !== 'android') {
        self.setRightNavButton(submitBtn);
    } else {
        self.add(submitBtn);
    }

    return self;
}

module.exports = couponWin;
