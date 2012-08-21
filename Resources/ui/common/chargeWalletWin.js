function chargeWalletWin() {

    var self, closeBtn, submitBtn, cardTxt;

    self = Ti.UI.createWindow({
        title : 'شحن المحفظة',
        modal : true,
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    if (Ti.Platform.getOsname() !== 'android') {
        closeBtn = Ti.UI.createButton({
            title : 'اغلاق'
        });

        closeBtn.addEventListener('click', function() {
            self.close();
        });

        self.setLeftNavButton(closeBtn);
    }

    function sendcard() {

        if (cardTxt.value.length <= 0) {
            return false;
        }

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/chargeWallet/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency') + '/' + cardTxt.value);

        xhr.onerror = function() {

            label.text = 'لا يوجد نتائج هنا في الوقت الحالي !!';
        };

        xhr.onload = function() {

            var row, dialouge;

            try {
                row = JSON.parse(this.responseText);
            } catch (e) {

                Ti.UI.createAlertDialog({
                    title : 'خطأ',
                    message : 'خطآ في الآتصال، تاكد من اتصال الانترنت الخاص بك.',
                    cancel : 0,
                    buttonNames : ['اغلاق']
                }).show();
                return false;
            }

            if (row.done === false) {

                Ti.UI.createAlertDialog({
                    title : 'خطأ',
                    message : 'خطأ في الرقم المدخل .. يرجي التأكد من إدخال رقم الكارت بشكل صحيح ...',
                    cancel : 0,
                    buttonNames : ['اغلاق']
                }).show();
            } else {

                Ti.App.balanceLbl.text = row.balance;
                dialouge = Ti.UI.createAlertDialog({
                    title : 'تم شحن المحفظة',
                    message : 'رصيدك الآن : ' + row.balance + ' ' + Ti.App.Properties.getString('currencyName'),
                    cancel : 0,
                    buttonNames : ['موافق']
                });
                dialouge.addEventListener('click', function(ev) {
                    if (ev.index === 0) {
                        self.close();
                    }
                });
                dialouge.show();
            }
        };

        xhr.send();
    }

    submitBtn = Ti.UI.createButton({
        title : 'شحن المحفظة'
    });

    submitBtn.addEventListener('click', function() {
        sendcard();
    });

    if (Ti.Platform.getOsname() === 'android') {
        submitBtn.top = 60;
        submitBtn.height = 33;
        submitBtn.width = '90%';
        submitBtn.color = '#ffffff';
        submitBtn.backgroundImage = '/images/button_ok.png';

        self.add(submitBtn);
    } else {
        self.setRightNavButton(submitBtn);
    }

    cardTxt = Ti.UI.createTextField({
        hintText : 'رقم الكارت',
        textAlign : Ti.App.autoAlignHintext(),
        height : 40,
        width : '90%',
        top : 10,
        returnKeyType : Ti.UI.RETURNKEY_SEND,
        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        backgroundImage : '/images/bg_total_price.png',
        font : {
            fontSize : '13dp'
        }
    });

    self.addEventListener('open', function() {
        cardTxt.focus();
    });
    cardTxt.addEventListener('return', function() {
        submitBtn.fireEvent('click');
    });
    self.add(cardTxt);

    return self;
}

module.exports = chargeWalletWin;
