function walletWin() {

    var self, loadinLabel, chargeBtn;

    self = Ti.UI.createWindow({
        title : 'المحفظة',
        fullscreen : false,
        backgroundColor : 'white'
    });

    self.addEventListener('focus', function() {

        var auth = require('/lib/auth');
        Ti.App.fireEvent('closeLoginWindow');
        if (!auth.isLogedIn()) {

            Ti.App.fireEvent('openLoginWindow');
            return false;
        }
    });

    loadinLabel = Ti.UI.createLabel({
        text : 'جاري التحميل ....',
        height : 'auto',
        left : 0,
        right : '10dp',
        top : '10dp',
        color : '#000000',
        textAlign : 'right'
    });
    self.add(loadinLabel);

    function getBalance() {

        var xhr = Ti.Network.createHTTPClient();

        xhr.open('GET', Ti.App.APIURL + 'api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency'));

        xhr.onerror = function() {

            loadinLabel.setText('لا يوجد نتائج هنا في الوقت الحالي !!');
        };

        xhr.onload = function() {

            var row = JSON.parse(this.responseText);
            balanceLbl.text = row.balance + ' ' + Ti.App.Properties.getString('currencyName');
            loadinLabel.setVisible(false);
            balanceTitle.setVisible(true);
            balanceLbl.setVisible(true);
        };

        xhr.send();
    }

    chargeBtn = Ti.UI.createButton({
        title : 'شحن المحفظة',
        top : '60dp'
    });

    chargeBtn.addEventListener('click', function() {
        Ti.App.fireEvent('openChargeWalletWindow');
    });

    self.add(chargeBtn);

    balanceTitle = Ti.UI.createLabel({
        text : 'الرصيد الحالي : ',
        height : 'auto',
        left : 0,
        right : '10dp',
        top : '10dp',
        color : '#000000',
        visible : false,
        textAlign : 'right'
    });
    self.add(balanceTitle);

    balanceLbl = Ti.UI.createLabel({
        text : '',
        height : 'auto',
        left : 0,
        right : '120dp',
        top : '10dp',
        color : '#000000',
        visible : false,
        textAlign : 'right'
    });
    Ti.App.balanceLbl = balanceLbl;
    self.add(Ti.App.balanceLbl);

    getBalance();

    return self;
}

module.exports = walletWin;
