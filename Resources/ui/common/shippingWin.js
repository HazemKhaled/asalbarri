function shippingWin() {

	var self, tableView, xhr, nextBtn;

	self = Ti.UI.createWindow({
		title : 'اتفاقية الاستخدام',
		backgroundImage : '/images/bg.jpg',
		barImage : '/images/Navigation_Bar.jpg',
		barColor : 'gray'
	});

	nextBtn = Ti.UI.createButton({
		title : '< موافق'
	});

	nextBtn.addEventListener('click', function() {

		var walletFlag = false;

		// if total = 0
		if (Ti.App.cartQuantityCounter().totalNet <= 0) {
			Ti.App.fireEvent('orderRequest', {
				paymentMethod : 'wallet',
				//countryID : countriesPicker.getSelectedRow(0).myId
			});
			return;
		}

		Ti.App.getHttpRequest('api/walletBalance/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency', 1), function(results) {

			var paymentAlert = Ti.UI.createAlertDialog({
				title : 'اختر وسيلة الدفع',
				message : 'اي هذه الوسائل تريد ان تدفع من خلالها؟',
				cancel : 2,
				buttonNames : ['الدفع بالفيزا عبر 2CO', 'المحفظة ' + results.balance + ' ' + Ti.App.Properties.getString('currencyName', 'دولار أمريكي'), 'عودة لسلة التسوق']
			});

			paymentAlert.show();

			paymentAlert.addEventListener('click', function(e) {

				switch (e.index) {
					case 0:

						Ti.App.fireEvent('orderRequest', {
							paymentMethod : 'tocheckout',
							//countryID : countriesPicker.getSelectedRow(0).myId
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
							//countryID : countriesPicker.getSelectedRow(0).myId
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

		nextBtn.height = 33;
		nextBtn.width = '90%';
		nextBtn.bottom = 4;
		nextBtn.backgroundImage = '/images/button_ok.png';
		nextBtn.color = '#ffffff';

		self.add(nextBtn);
	} else {
		self.setRightNavButton(nextBtn);
	}

	Ti.App.getHttpRequest('api/agreement', function(html) {
		self.add(Ti.UI.createWebView({
			html : '<html><body style="direction: rtl; background: url(/images/bg.jpg) fixed; color: #fff">' + html + '</body></html>'
		}));
	}, function() {
		self.close();
	});

	return self;
}

module.exports = shippingWin;
