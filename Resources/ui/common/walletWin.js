function walletWin() {

    var self, loadinLabel, chargeBtn, balanceLbl, balancCurr, img, loginBtn, msgLabel, auth = require('/lib/auth'), balanceTitle;

    self = Ti.UI.createWindow({
        title : 'المحفظة',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : 'gray'
    });

    Ti.App.addEventListener('showWalletAfterLogin', function() {

        loadinLabel = Ti.UI.createLabel({
            text : 'جاري التحميل ....',
            //left : 0,
            //right : 10,
            //top : 10,
            color : '#000000',
            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER
        });
        self.add(loadinLabel);

        function getBalance() {

            var xhr = Ti.Network.createHTTPClient();

            xhr.open('GET', Ti.App.APIURL + 'api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency', 1));

            xhr.onerror = function() {

                loadinLabel.setText('لا يوجد نتائج هنا في الوقت الحالي !!');
            };

            xhr.onload = function() {
                try {
                    var row = JSON.parse(this.responseText);
                } catch(e) {
                    Ti.UI.createAlertDialog({
                        message : 'خطآ في الآتصال، تاكد من اتصال الانترنت الخاص بك.',
                        cancel : 0,
                        buttonNames : ['موافق']
                    }).show();

                    return false;
                }
                balanceLbl.setText(row.balance);
                loadinLabel.setVisible(false);
                balanceTitle.setVisible(true);
                balanceLbl.setVisible(true);
                balancCurr.setVisible(true);
            };

            xhr.send();
        }

        chargeBtn = Ti.UI.createButton({
            title : 'شحن المحفظة',
            top : 200,
            height : 33,
            width : '90%',
            color : '#ffffff',
            backgroundImage : '/images/button_ok.png'
        });

        chargeBtn.addEventListener('click', function() {
            Ti.App.fireEvent('openChargeWalletWindow');
        });

        self.add(chargeBtn);

        img = Ti.UI.createImageView({
            image : '/images/wallet_balance.png',
            width : 169,
            height : 148,
            top : '40px'
        });
        self.add(img);

        balanceTitle = Ti.UI.createLabel({
            text : 'الرصيد',
            //left : 0,
            //right : 150,
            top : 60,
            color : '#000000',
            visible : false,
            textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
            font : {
                fontFamily : 'Arial',
                fontSize : 16,
                fontWeight : 'bold'
            }
        });
        self.add(balanceTitle);

        balanceLbl = Ti.UI.createLabel({
            text : '',
            //left : 0,
            //right : 155,
            top : 85,
            visible : false,
            textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
            color : 'red',
            font : {
                fontFamily : 'Arial',
                fontSize : 20,
                fontWeight : 'bold'
            }
        });
        Ti.App.balanceLbl = balanceLbl;
        self.add(Ti.App.balanceLbl);

        balancCurr = Ti.UI.createLabel({
            text : Ti.App.Properties.getString('currencyName', 'دولار أمريكي'),
            //left : 0,
            //right : 127,
            top : 110,
            color : '#000000',
            visible : false,
            textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
            font : {
                fontFamily : 'Arial',
                fontSize : 15,
                fontWeight : 'bold'
            }
        });
        self.add(balancCurr);

        getBalance();

        self.remove(loginBtn);
        self.remove(msgLabel);
    });

    Ti.App.addEventListener('showWalletBeforLogin', function() {

        msgLabel = Ti.UI.createLabel({
            text : 'يرجى تسجيل الدخول',
            width : '100%',
            top : 40,
            color : '#ffffff',
            textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
            font : {
                fontFamily : 'Arial',
                fontSize : 17,
                fontWeight : 'bold'
            }
        });
        self.add(msgLabel);

        loginBtn = auth.loginBtn(Ti.UI.createButton({
            title : 'تسجيل دخول',
            top : 100,
            height : 33,
            width : '90%',
            backgroundImage : '/images/button_ok.png',
            color : '#ffffff'
        }));
        self.add(loginBtn);

        if (balancCurr) {
            self.remove(balancCurr);
            self.remove(Ti.App.balanceLbl);
            self.remove(balanceTitle);
            self.remove(img);
            self.remove(loadinLabel);
            self.remove(chargeBtn);
        }
    });

    if (!auth.isLogedIn()) {

        Ti.App.fireEvent('showWalletBeforLogin');
    } else {

        Ti.App.fireEvent('showWalletAfterLogin');
    }

    return self;
}

module.exports = walletWin;
