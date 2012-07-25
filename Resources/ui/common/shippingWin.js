function shippingWin() {

    var self, tableView, xhr, countriesPicker, nextBtn;

    self = Ti.UI.createWindow({
        title : 'اختر الدولة',
        backgroundImage : 'images/common/bg.jpg',
        barImage : 'images/common/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    nextBtn = Ti.UI.createButton({
        title : '< التالي'
    });

    nextBtn.addEventListener('click', function() {
        Ti.App.Properties.setInt('country', countriesPicker.getSelectedRow(0).myId);

        Ti.App.getHttpRequest('api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency'), function(results) {

            var paymentAlert = Ti.UI.createAlertDialog({
                title : 'اختر وسيلة الدفع',
                message : 'اي هذه الوسائل تريد ان تدفع من خلالها؟',
                cancel : 2,
                buttonNames : ['الدفع بالفيزا عبر 2CO', 'المحفظة ' + results.balance + ' ' + Ti.App.Properties.getString('currencyName'), 'عودة لسلة التسوق']
            });

            paymentAlert.show();

            paymentAlert.addEventListener('click', function(e) {

                switch (e.index) {
                    case 0:

                        Ti.App.fireEvent('open2COWindow');
                        break;
                    case 1:

                        alert(results.balance);
                        paymentAlert.show();
                        break;
                    case 2:

                        self.close();
                        break;
                }

            });
        });
    });

    if (Ti.Platform.getOsname() === 'android') {
        self.add(nextBtn);
    } else {
        self.setRightNavButton(nextBtn);
    }

    Ti.App.getHttpRequest('api/getCountries', function(rows) {
        var index, pickerRows;

        countriesPicker = Ti.UI.createPicker({
            selectionIndicator : true
        });

        for (index in rows) {
            countriesPicker.add(Ti.UI.createPickerRow({
                title : rows[index].title,
                myId : rows[index].id
            }));
        }
        self.add(countriesPicker);
    }, function() {
        self.close();
    });

    return self;
}

module.exports = shippingWin;
