function chargeWalletWin() {
	var self = Ti.UI.createWindow({
		title : 'شحن المحفظة',
		modal : true,
		backgroundColor : 'white'
	});

	var closeBtn = Ti.UI.createButton({
		title : 'اغلاق'
	});

	closeBtn.addEventListener('click', function() {
		self.close();
	});

	self.setLeftNavButton(closeBtn);

	function sendcard() {

		if (cardTxt.value.length <= 0) {
			return false;
		}

		var xhr = Ti.Network.createHTTPClient();

		xhr.open('GET', Ti.App.APIURL + 'api/chargeWallet/' + Ti.App.Properties.getInt('userID') + '/' + Ti.App.Properties.getInt('currency') + '/' + cardTxt.value);

		xhr.onerror = function() {

			label.text = 'لا يوجد نتائج هنا في الوقت الحالي !!';
		}

		xhr.onload = function() {

			var row = JSON.parse(this.responseText);
			if (row.done == false) {

				var dialouge = Ti.UI.createAlertDialog({
					title : 'خطأ',
					message : 'خطأ في الرقم المدخل .. يرجي التأكد من إدخال رقم الكارت بشكل صحيح ...',
					cancel : 0,
					buttonNames : ['اغلاق'],
				})
				dialouge.show();
			} else {

				Ti.App.balanceLbl.text = row.balance + ' ' + Ti.App.Properties.getString('currencyName');
				var dialouge = Ti.UI.createAlertDialog({
					title : 'تم شحن المحفظة',
					message : 'رصيدك الآن : ' + row.balance + ' ' + Ti.App.Properties.getString('currencyName'),
					cancel : 0,
					buttonNames : ['موافق'],
				})
				dialouge.addEventListener('click', function(ev) {
					switch(ev.index) {
						case 0:
							self.close();
							break;
					}
				})
				dialouge.show();
			}
		};

		xhr.send();
	}

	var submit = Ti.UI.createButton({
		title : 'شحن المحفظة',
		top : '60dp',
	});

	submit.addEventListener('click', function() {
		sendcard();
	});

	self.add(submit);
	if (Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
		self.setRightNavButton(submit);
	} else {
		scrollview.add(submit);
	}

	cardTxt = Ti.UI.createTextField({
		hintText : 'رقم الكارت',
		textAlign : 'right',
		height : '40dp',
		width : '90%',
		left : '5%',
		top : '10dp',
		returnKeyType : Ti.UI.RETURNKEY_SEND,
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	cardTxt.addEventListener('return', function() {
		submit.fireEvent('click');
	});
	self.add(cardTxt);

	return self;
};

module.exports = chargeWalletWin;
