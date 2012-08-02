function shippingWin() {

    var self, tableView, xhr, countriesPicker, nextBtn;

    self = Ti.UI.createWindow({
        title : 'اختر الدولة',
        backgroundImage : '/images/bg.jpg',
        barImage : '/images/Navigation_Bar.jpg',
        barColor : '#d3d3d3'
    });

    nextBtn = Ti.UI.createButton({
        title : '< التالي'
    });

    nextBtn.addEventListener('click', function() {

        var walletFlag = false;

        // if total = 0
        if (Ti.App.cartQuantityCounter().totalNet <= 0) {
            Ti.App.fireEvent('orderRequest', {
                paymentMethod : 'wallet',
                countryID : countriesPicker.getSelectedRow(0).myId
            });
            return;
        }

        //Ti.App.Properties.setInt('country', countriesPicker.getSelectedRow(0).myId);

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

                        Ti.App.fireEvent('orderRequest', {
                            paymentMethod : 'tocheckout',
                            countryID : countriesPicker.getSelectedRow(0).myId
                        });
                        break;
                    case 1:

                        // is it enoph cash into wallet?
                        if (results.balance < Ti.App.cartQuantityCounter().totalNet) {

                            // if wallet not enph and he want to recharge his cridit
                            if (walletFlag === true) {
                                if (Ti.Platform.getOsname() !== 'android') {
                                    Ti.App.walletTab.setActive(true);
                                } else {
                                    Ti.UI.createAlertDialog({
                                        title : 'اضغط على المحفظة من الاعلى',
                                        message : 'عد للخلف ثم اضغط على المحفظة من الاعلى.',
                                        cancel : 0,
                                        buttonNames : ['موافق']
                                    }).show();
                                }

                                return;
                            }

                            // next time open wallet directly
                            walletFlag = true;

                            // change alert msgs
                            paymentAlert.buttonNames = ['الدفع بالفيزا عبر 2CO', 'شحن المحفظة', 'عودة لسلة التسوق'];
                            paymentAlert.setTitle('الرصيد لا يكفي !');
                            paymentAlert.setMessage('رصيد المحفظة لا يكفي، يمكنك شحن المحفظة او اختيار وسيلة دفع اخرى.');

                            paymentAlert.show();
                            break;
                        }

                        Ti.App.fireEvent('orderRequest', {
                            paymentMethod : 'wallet',
                            countryID : countriesPicker.getSelectedRow(0).myId
                        });

                        break;
                    case 2:

                        self.close();
                        break;
                }

            });
        });
    });

    if (Ti.Platform.getOsname() === 'android') {

        nextBtn.height = '33dp';
        nextBtn.width = '90%';
        nextBtn.bottom = '4dp';
        nextBtn.backgroundImage = '/images/button_ok.png';
        nextBtn.color = '#ffffff';

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
